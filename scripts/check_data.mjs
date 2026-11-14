// check_data.mjs - サイトのデータの書き間違いを見つける検査スクリプト（Node.js だけで動きます。追加のインストール不要）
//
// 使い方（リポジトリのいちばん上のフォルダで）:
//     node scripts/check_data.mjs
// 問題がなければ「問題は見つかりませんでした」と表示して終わります。
// 問題があれば内容を表示して、終了コード 1 で終わります（GitHub Actions では ✕ になります）。
//
// 検査すること
//   1. ライブデータベースのセットリストに、曲一覧（common/songs.js の SONGS・live-data/data.js の COVER_SONGS）にない曲名がないか
//   2. 曲一覧に、同じ曲名の重複や表記ゆれ（全角半角・大文字小文字の違い）がないか
//   3. 公演の date が正しい日付か（'2025-01-01' か '2025/1/1' の形）
//   4. 公演の category が 'solo' / 'inhouse' / 'fes' のどれかか
//   5. gallery/photos.json の写真と、gallery/photos/・gallery/thumbs/ の画像ファイルが対応しているか

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const error = (msg) => errors.push(msg);
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

// data.js などを読み込んで、const で宣言された値を取り出す（ブラウザで読み込むのと同じ順に実行する）
function loadScripts(files, names) {
    const source = files.map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n;\n');
    return vm.runInNewContext(`${source}\n;({ ${names.join(', ')} })`, {}, { filename: files.join(' + ') });
}

// live-data.js と同じ規則：空行を除き、前後の空白を取る
function toLines(value) {
    const list = Array.isArray(value) ? value : String(value || '').split(/\r?\n/);
    return list.map((s) => String(s).trim()).filter(Boolean);
}
// live-data.js と同じ規則：「--- アンコール ---」のような区切り行は曲に数えない
const SEPARATOR = /^[-=]{2,}\s*(.*?)\s*[-=]*$/;

// 表記ゆれを見つけるための比較用の形（全角半角・大文字小文字・空白の違いをそろえる）
const fold = (s) => String(s).normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();

// ---------- ライブデータベース・曲一覧 ----------
function checkSongsAndLives() {
    let data;
    try {
        data = loadScripts(['common/songs.js', 'live-data/data.js'], ['SONGS', 'COVER_SONGS', 'LIVES']);
    } catch (e) {
        error(`common/songs.js / live-data/data.js を読み込めません（書き方の誤り）: ${e.message}`);
        return;
    }
    const { SONGS, COVER_SONGS, LIVES } = data;

    // 曲一覧：重複・表記ゆれ
    const titles = new Map(); // 曲名 → どの一覧か
    const folded = new Map(); // 比較用の形 → 曲名
    const register = (list, label) => {
        list.forEach((song, i) => {
            const title = String(song && song.title || '').trim();
            if (!title) {
                error(`${label} の ${i + 1} 件目: title が空です`);
                return;
            }
            if (titles.has(title)) {
                error(`曲名の重複: '${title}'（${titles.get(title)} と ${label}）`);
                return;
            }
            const key = fold(title);
            if (folded.has(key)) {
                error(`曲名の表記ゆれ: '${folded.get(key)}' と '${title}'（全角半角・大文字小文字だけが違います）`);
            }
            titles.set(title, label);
            folded.set(key, title);
        });
    };
    register(SONGS, 'SONGS（common/songs.js）');
    register(COVER_SONGS, 'COVER_SONGS（live-data/data.js）');

    // 公演
    const CATEGORIES = ['solo', 'inhouse', 'fes'];
    const unknown = new Map(); // 一覧にない曲名 → 出てくる公演
    LIVES.forEach((live, i) => {
        const where = `LIVES の ${i + 1} 件目（${live.name || 'ライブ名未入力'}）`;
        if (!CATEGORIES.includes(live.category)) {
            error(`${where}: category '${live.category}' は 'solo' / 'inhouse' / 'fes' のどれでもありません`);
        }
        if (!isValidDate(live.date)) {
            error(`${where}: date '${live.date}' が正しい日付ではありません（例：'2025-01-01' か '2025/1/1'）`);
        }
        if (!String(live.name || '').trim()) error(`${where}: name が空です`);

        toLines(live.setlist).forEach((line) => {
            if (SEPARATOR.test(line) || titles.has(line)) return;
            if (!unknown.has(line)) unknown.set(line, []);
            unknown.get(line).push(live.name || `${i + 1} 件目`);
        });
    });
    unknown.forEach((lives, title) => {
        const near = folded.get(fold(title));
        const hint = near ? ` → 一覧の '${near}' の表記ゆれでは？` : '';
        error(`セットリストの曲名 '${title}' が曲一覧にありません${hint}（${lives.slice(0, 3).join('、')}${lives.length > 3 ? ` ほか${lives.length - 3}公演` : ''}）`);
    });

    return { songs: SONGS.length, covers: COVER_SONGS.length, lives: LIVES.length };
}

// '2025-01-01' / '2025/1/1' / '2025.1.1' を受け付け、実在する日付か確かめる
function isValidDate(value) {
    const m = String(value || '').trim().match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (!m) return false;
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const date = new Date(Date.UTC(y, mo - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
}

// ---------- 写真ギャラリー ----------

// JPEG の幅と高さ（SOF マーカー）を読む
function jpegSize(file) {
    const buf = fs.readFileSync(file);
    if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
    let i = 2;
    while (i + 9 < buf.length) {
        if (buf[i] !== 0xff) { i++; continue; }
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
            return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        }
        i += 2 + len;
    }
    return null;
}

function checkGallery() {
    const dir = path.join(ROOT, 'gallery');
    const jsonPath = path.join(dir, 'photos.json');
    let photos;
    try {
        photos = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).photos;
    } catch (e) {
        error(`gallery/photos.json を読み込めません（JSON の書き方の誤り）: ${e.message}`);
        return;
    }
    if (!Array.isArray(photos)) {
        error('gallery/photos.json に "photos" の配列がありません');
        return;
    }

    const expected = new Set(); // photos.json から決まる、あるべき画像ファイル
    const seen = new Set();
    photos.forEach((p, i) => {
        const where = `photos.json の ${i + 1} 件目（${p.file || 'file 未入力'}）`;
        if (!p.file || !/\.jpe?g$/i.test(p.file)) {
            error(`${where}: file が JPEG のファイル名ではありません`);
            return;
        }
        if (seen.has(p.file)) error(`${where}: 同じ file が2回以上あります`);
        seen.add(p.file);
        if (p.date && !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) error(`${where}: date '${p.date}' は 'YYYY-MM-DD' の形にしてください`);
        else if (p.date && !isValidDate(p.date)) error(`${where}: date '${p.date}' は実在しない日付です`);

        const sizes = { photos: [p.width, p.height], thumbs: [p.thumbWidth, p.thumbHeight] };
        for (const [sub, [w, h]] of Object.entries(sizes)) {
            const jpg = path.join(dir, sub, p.file);
            expected.add(rel(jpg));
            if (!fs.existsSync(jpg)) {
                error(`${where}: ${rel(jpg)} がありません`);
            } else {
                const size = jpegSize(jpg);
                if (!size) error(`${where}: ${rel(jpg)} の大きさを読み取れません`);
                else if (size.width !== w || size.height !== h) {
                    error(`${where}: ${rel(jpg)} の大きさ ${size.width}x${size.height} が photos.json の ${w}x${h} と違います（scripts/prepare_photos.py で作り直してください）`);
                }
            }
            if (p.webp) {
                const webp = path.join(dir, sub, p.file.replace(/\.jpe?g$/i, '.webp'));
                expected.add(rel(webp));
                if (!fs.existsSync(webp)) error(`${where}: "webp": true なのに ${rel(webp)} がありません`);
            }
        }
    });

    // photos.json に載っていない画像（消し忘れ・載せ忘れ）
    for (const sub of ['photos', 'thumbs']) {
        const d = path.join(dir, sub);
        if (!fs.existsSync(d)) continue;
        for (const name of fs.readdirSync(d)) {
            if (!/\.(jpe?g|webp|png)$/i.test(name)) continue;
            const r = rel(path.join(d, name));
            if (!expected.has(r)) error(`${r} は photos.json に載っていません（不要なら削除、必要なら photos.json に追加）`);
        }
    }
    return { photos: photos.length };
}

// ---------- 実行 ----------
const lives = checkSongsAndLives();
const gallery = checkGallery();

if (lives) console.log(`ライブデータベース: 公演 ${lives.lives} 件 ／ オリジナル曲 ${lives.songs} 曲 ／ カバー曲 ${lives.covers} 曲`);
if (gallery) console.log(`写真ギャラリー: ${gallery.photos} 点`);
if (errors.length) {
    console.log(`\n${errors.length} 件の問題が見つかりました:`);
    errors.forEach((e) => console.log(`  ✕ ${e}`));
    process.exitCode = 1;
} else {
    console.log('問題は見つかりませんでした。');
}
