#!/usr/bin/env python3
"""写真ギャラリー用の画像を前処理するスクリプト

gallery/originals/ に置いた元画像（JPEG / PNG / HEIC）から次の画像を書き出します。
  - 拡大表示用：長辺 2048px 以内 → gallery/photos/（JPEG ＋ WebP）
  - 一覧用サムネイル：長辺 600px 以内 → gallery/thumbs/（JPEG ＋ WebP）

メタデータの扱い
  - 拡大表示用：撮影日時・カメラ設定などの EXIF だけを残し、GPS・シリアル番号・
    所有者名・メーカー独自情報・XMP・IPTC は残しません。
  - サムネイル：メタデータを一切残しません（色を正しく出すための ICC プロファイルのみ）。
  - 書き出し後、すべての出力画像に GPS 情報が無いことを検証し、見つかればその画像を
    削除してエラー終了します。

新しい写真は gallery/photos.json に雛形を追記します（タイトルや alt は手で記入）。

使い方:
    python scripts/prepare_photos.py           # 新しい・更新された写真だけ処理する
    python scripts/prepare_photos.py --force   # すべて作り直す
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

LARGE_SIZE = 2048
THUMB_SIZE = 600
LARGE_JPEG_QUALITY = 85
LARGE_WEBP_QUALITY = 80
THUMB_JPEG_QUALITY = 80
THUMB_WEBP_QUALITY = 75

SOURCE_EXTS = {".jpg", ".jpeg", ".png", ".heic", ".heif"}
HEIF_EXTS = {".heic", ".heif"}
OUTPUT_EXTS = {".jpg", ".jpeg", ".png", ".webp"}

# GitHub Pages の制約（1ファイル 50MiB 未満、リポジトリ 1GB 未満）に余裕を持たせた目安
MAX_FILE_BYTES = 50 * 1024 * 1024
WARN_TOTAL_BYTES = 500 * 1024 * 1024

# 拡大表示用の画像へ元画像の EXIF をコピーするとき、除外するタグ
EXCLUDE_TAGS = [
    "gps:all",               # 位置情報
    "MakerNotes:all",        # メーカー独自情報（シリアル番号などを含むことがある）
    "SerialNumber", "BodySerialNumber", "LensSerialNumber", "InternalSerialNumber",
    "OwnerName", "CameraOwnerName",
    "Orientation",           # 画素を回転済みなので不要（残すと二重に回転する）
    "IFD1:all",              # 元画像に埋め込まれた小さなサムネイル
    "ExifImageWidth", "ExifImageHeight",
]

# XMP / IPTC にこれらを含むタグがあれば、地名が残っているとみなす
LOCATION_WORDS = ("location", "city", "province", "state", "country", "sublocation")

INSTALL_HELP = {
    "exiftool": """\
exiftool が見つかりません。次のいずれかでインストールしてください。
  Windows : winget install OliverBetz.ExifTool
            （または https://exiftool.org/ から Windows 版を入手）
  macOS   : brew install exiftool
  Ubuntu  : sudo apt install libimage-exiftool-perl
PATH に無い場所に置いた場合は --exiftool <パス> か、環境変数 EXIFTOOL で指定できます。""",
    "pillow": """\
Python の画像ライブラリ Pillow が見つかりません。次でインストールしてください。
  python -m pip install Pillow""",
    "webp": """\
この Pillow は WebP の書き出しに対応していません。
  python -m pip install --upgrade Pillow
で更新するか、--no-webp を付けて JPEG だけを書き出してください。""",
    "heif": """\
HEIC/HEIF の画像を読むには pillow-heif が必要です。次でインストールしてください。
  python -m pip install pillow-heif""",
}


class PrepareError(Exception):
    pass


def fail(message):
    print(f"\nエラー: {message}", file=sys.stderr)
    sys.exit(1)


# ---------------------------------------------------------------- ツールの確認

def find_exiftool(cli_value):
    for candidate in (cli_value, os.environ.get("EXIFTOOL"), "exiftool"):
        if not candidate:
            continue
        found = shutil.which(candidate)
        if found:
            return found
        if Path(candidate).is_file():
            return str(Path(candidate).resolve())
    return None


def check_tools(args, sources):
    missing = []

    exiftool = find_exiftool(args.exiftool)
    if exiftool is None:
        missing.append("exiftool")

    try:
        from PIL import features  # noqa: F401
    except ImportError:
        missing.append("pillow")
    else:
        if not args.no_webp and not features.check("webp"):
            missing.append("webp")

    if any(p.suffix.lower() in HEIF_EXTS for p in sources):
        try:
            import pillow_heif
        except ImportError:
            missing.append("heif")
        else:
            pillow_heif.register_heif_opener()

    if missing:
        print("必要なツールが不足しているため、処理を中止しました。\n", file=sys.stderr)
        for name in missing:
            print(INSTALL_HELP[name] + "\n", file=sys.stderr)
        sys.exit(1)
    return exiftool


def run_exiftool(exiftool, arguments):
    """exiftool を実行して標準出力を返す。

    日本語のファイル名でも正しく扱えるよう、引数は UTF-8 の引数ファイル経由で渡す。
    """
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".args",
                                     delete=False) as f:
        f.write("\n".join(str(a) for a in arguments) + "\n")
        argfile = f.name
    try:
        result = subprocess.run(
            [exiftool, "-charset", "filename=utf8", "-@", argfile],
            capture_output=True,
        )
    finally:
        os.unlink(argfile)
    stdout = result.stdout.decode("utf-8", errors="replace")
    stderr = result.stderr.decode("utf-8", errors="replace").strip()
    if result.returncode != 0:
        raise PrepareError(f"exiftool の実行に失敗しました。\n{stderr}")
    return stdout


# ---------------------------------------------------------------- git の確認

def check_originals_not_published(originals_dir):
    """元画像フォルダが .gitignore で除外され、コミットもされていないことを確かめる。"""
    git = shutil.which("git")
    if git is None:
        print("注意: git が見つからないため、元画像フォルダが .gitignore 済みか確認できませんでした。")
        return
    cwd = originals_dir.parent
    inside = subprocess.run([git, "-C", str(cwd), "rev-parse", "--is-inside-work-tree"],
                            capture_output=True, text=True)
    if inside.returncode != 0:
        print("注意: git リポジトリの外なので、.gitignore の確認を省略しました。")
        return

    probe = originals_dir / "probe.jpg"
    ignored = subprocess.run([git, "-C", str(cwd), "check-ignore", "-q", str(probe)])
    if ignored.returncode != 0:
        fail(f"{originals_dir} が .gitignore で除外されていません。\n"
             "元画像を公開しないよう、.gitignore に gallery/originals/ を追加してください。")

    tracked = subprocess.run([git, "-C", str(cwd), "ls-files", "--", str(originals_dir)],
                             capture_output=True, text=True)
    if tracked.stdout.strip():
        fail("元画像がすでに git に登録されています。\n"
             f"{tracked.stdout.strip()}\n"
             "git rm --cached でインデックスから外してください（すでに push 済みなら履歴からの削除も必要です）。")


# ---------------------------------------------------------------- 画像の処理

def exif_date(exif):
    """EXIF の撮影日時を YYYY-MM-DD にして返す。無ければ空文字。"""
    value = exif.get_ifd(0x8769).get(0x9003) or exif.get(0x0132)  # DateTimeOriginal / DateTime
    if not isinstance(value, str) or len(value) < 10:
        return ""
    return value[:10].replace(":", "-")


def to_rgb(im):
    from PIL import Image

    if im.mode == "RGB":
        return im
    if im.mode in ("RGBA", "LA", "PA") or (im.mode == "P" and "transparency" in im.info):
        rgba = im.convert("RGBA")
        background = Image.new("RGB", rgba.size, (0, 0, 0))
        background.paste(rgba, mask=rgba.getchannel("A"))
        return background
    return im.convert("RGB")


def load_source(path):
    from PIL import Image, ImageOps

    with Image.open(path) as im:
        im.load()
        taken = exif_date(im.getexif())
        icc = im.info.get("icc_profile") if im.mode != "CMYK" else None
        im = to_rgb(ImageOps.exif_transpose(im))
    # 元画像のメタデータ（EXIF / XMP など）を書き出し先へ持ち越さない
    im.info = {}
    return im, icc, taken


def save_variants(im, icc, out_dir, stem, size, jpeg_quality, webp_quality, make_webp):
    from PIL import Image

    resized = im.copy()
    resized.thumbnail((size, size), Image.Resampling.LANCZOS)
    extra = {"icc_profile": icc} if icc else {}

    outputs = [out_dir / f"{stem}.jpg"]
    resized.save(outputs[0], "JPEG", quality=jpeg_quality, optimize=True,
                 progressive=True, exif=b"", **extra)
    if make_webp:
        outputs.append(out_dir / f"{stem}.webp")
        resized.save(outputs[1], "WEBP", quality=webp_quality, method=6, exif=b"", **extra)
    return outputs


def is_up_to_date(source, outputs):
    if not all(p.exists() for p in outputs):
        return False
    source_mtime = source.stat().st_mtime
    return all(p.stat().st_mtime >= source_mtime for p in outputs)


def process_photos(exiftool, sources, dirs, force, make_webp):
    """元画像を縮小して書き出す。戻り値は (書き出したファイル, ファイル名→撮影日)。"""
    written = []
    dates = {}
    for source in sources:
        stem = source.stem
        exts = [".jpg", ".webp"] if make_webp else [".jpg"]
        large = [dirs["photos"] / f"{stem}{e}" for e in exts]
        thumbs = [dirs["thumbs"] / f"{stem}{e}" for e in exts]
        if not force and is_up_to_date(source, large + thumbs):
            continue

        print(f"  処理中: {source.name}")
        im, icc, taken = load_source(source)
        dates[f"{stem}.jpg"] = taken
        large = save_variants(im, icc, dirs["photos"], stem, LARGE_SIZE,
                              LARGE_JPEG_QUALITY, LARGE_WEBP_QUALITY, make_webp)
        thumbs = save_variants(im, icc, dirs["thumbs"], stem, THUMB_SIZE,
                               THUMB_JPEG_QUALITY, THUMB_WEBP_QUALITY, make_webp)

        # 拡大表示用にだけ、撮影日時・カメラ設定などの EXIF を元画像からコピーする
        run_exiftool(exiftool, ["-q", "-q", "-overwrite_original",
                                "-tagsFromFile", source, "-exif:all",
                                *[f"--{t}" for t in EXCLUDE_TAGS], *large])
        written += large + thumbs

    if written:
        # 念のため、書き出したすべての画像から GPS 情報を削除する
        run_exiftool(exiftool, ["-q", "-q", "-overwrite_original", "-gps:all=", *written])
    return written, dates


# ---------------------------------------------------------------- 検証

def find_location_metadata(exiftool, files):
    """GPS や地名のメタデータが残っている画像を {ファイル: [タグ名...]} で返す。"""
    from PIL import Image

    problems = {}
    if not files:
        return problems

    output = run_exiftool(exiftool, ["-j", "-a", "-G1", "-s", "-q", *files])
    for entry in json.loads(output) if output.strip() else []:
        found = []
        for key in entry:
            group, _, name = key.rpartition(":")
            lowered = name.lower()
            if "gps" in lowered or group.lower() == "gps":
                found.append(key)
            elif group.upper().startswith(("XMP", "IPTC")) and any(w in lowered for w in LOCATION_WORDS):
                found.append(key)
        if found:
            problems[Path(entry["SourceFile"]).resolve()] = found

    # exiftool とは別に、Pillow でも GPS の領域が無いことを確認する
    for path in files:
        with Image.open(path) as im:
            if im.getexif().get_ifd(0x8825):
                problems.setdefault(Path(path).resolve(), []).append("EXIF GPS IFD (Pillow)")
    return problems


def output_files(dirs):
    return sorted(p for d in (dirs["photos"], dirs["thumbs"])
                  for p in d.iterdir() if p.is_file() and p.suffix.lower() in OUTPUT_EXTS)


def check_sizes(gallery_dir, originals_dir):
    total = 0
    for path in gallery_dir.rglob("*"):
        if not path.is_file() or originals_dir in path.parents:
            continue
        size = path.stat().st_size
        total += size
        if size >= MAX_FILE_BYTES:
            fail(f"{path} が 50MiB 以上あります（GitHub に push できません）。")
    print(f"gallery/ の合計サイズ（元画像を除く）: {total / 1024 / 1024:.1f} MB")
    if total > WARN_TOTAL_BYTES:
        print("注意: 500MB を超えました。GitHub Pages のリポジトリ上限（1GB）に近づいています。")


# ---------------------------------------------------------------- photos.json

ENTRY_KEYS = ["file", "title", "date", "location", "alt",
              "width", "height", "thumbWidth", "thumbHeight", "webp"]


def image_size(path):
    from PIL import Image

    with Image.open(path) as im:
        return im.size


def update_manifest(manifest_path, dirs, dates):
    if manifest_path.exists():
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
    else:
        data = {"photos": []}
    entries = data.setdefault("photos", [])
    by_file = {e.get("file"): e for e in entries}

    added = []
    for photo in sorted(dirs["photos"].glob("*.jpg"), key=lambda p: (dates.get(p.name, ""), p.name)):
        entry = by_file.get(photo.name)
        if entry is None:
            entry = {"file": photo.name, "title": "", "date": dates.get(photo.name, ""),
                     "location": "", "alt": ""}
            entries.append(entry)
            by_file[photo.name] = entry
            added.append(photo.name)

        thumb = dirs["thumbs"] / photo.name
        if not thumb.exists():
            continue
        entry["width"], entry["height"] = image_size(photo)
        entry["thumbWidth"], entry["thumbHeight"] = image_size(thumb)
        entry["webp"] = (photo.with_suffix(".webp").exists()
                         and thumb.with_suffix(".webp").exists())

    # 項目の並びをそろえる（未知の項目は後ろに残す）
    data["photos"] = [{**{k: e[k] for k in ENTRY_KEYS if k in e},
                       **{k: v for k, v in e.items() if k not in ENTRY_KEYS}}
                      for e in entries]
    manifest_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n",
                             encoding="utf-8")

    if added:
        print("photos.json に雛形を追加しました（title / alt / location を記入してください）:")
        for name in added:
            print(f"  + {name}")
    for e in data["photos"]:
        if not (dirs["photos"] / e.get("file", "")).exists():
            print(f"注意: photos.json の {e.get('file')!r} に対応する画像が gallery/photos/ にありません。")
        elif not e.get("title") or not e.get("alt"):
            print(f"注意: {e['file']} の title または alt が未入力です。")


# ---------------------------------------------------------------- メイン

def main():
    parser = argparse.ArgumentParser(description="写真ギャラリー用の画像を前処理します。")
    parser.add_argument("--force", action="store_true", help="処理済みの写真もすべて作り直す")
    parser.add_argument("--no-webp", action="store_true", help="WebP を書き出さない")
    parser.add_argument("--exiftool", help="exiftool のパス（PATH に無い場合）")
    parser.add_argument("--gallery-dir", default=str(REPO_ROOT / "gallery"),
                        help="ギャラリーのフォルダ（既定: リポジトリの gallery/）")
    args = parser.parse_args()

    gallery_dir = Path(args.gallery_dir).resolve()
    dirs = {name: gallery_dir / name for name in ("originals", "photos", "thumbs")}
    for d in dirs.values():
        d.mkdir(parents=True, exist_ok=True)

    sources = sorted(p for p in dirs["originals"].iterdir()
                     if p.is_file() and p.suffix.lower() in SOURCE_EXTS)
    stems = {}
    for p in sources:
        if p.stem in stems:
            fail(f"同じ名前の元画像があります: {stems[p.stem].name} と {p.name}")
        stems[p.stem] = p

    exiftool = check_tools(args, sources)
    check_originals_not_published(dirs["originals"])

    print(f"元画像: {len(sources)} 枚（{dirs['originals']}）")
    try:
        written, dates = process_photos(exiftool, sources, dirs, args.force, not args.no_webp)
        print(f"書き出し: {len(written)} ファイル")

        print("GPS 情報が残っていないか検証しています...")
        problems = find_location_metadata(exiftool, output_files(dirs))
    except PrepareError as e:
        fail(str(e))

    if problems:
        print("\n位置情報が残っている画像が見つかったため、削除して中止しました:", file=sys.stderr)
        for path, tags in problems.items():
            print(f"  {path}: {', '.join(sorted(set(tags)))}", file=sys.stderr)
            path.unlink(missing_ok=True)
        fail("GPS 情報の検証に失敗しました。photos.json は更新していません。")
    print("検証 OK: すべての出力画像に GPS 情報はありません。")

    update_manifest(gallery_dir / "photos.json", dirs, dates)
    check_sizes(gallery_dir, dirs["originals"])


if __name__ == "__main__":
    main()
