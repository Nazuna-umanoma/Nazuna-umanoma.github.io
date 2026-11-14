# 凪不凪（ナズナ）のサイト

筆名「凪不凪（ナズナ）」のプロフィールと作品を置いている個人サイトです。
GitHub Pages で `main` ブランチがそのまま公開されます（https://nazuna-umanoma.github.io/）。

ビルド作業はありません。HTML・CSS・素の JavaScript だけでできているので、
ファイルを書き換えて push すれば、そのままサイトに反映されます。

## 📁 ファイル構成

```
github.io/
├── index.html            トップ（プロフィール）
├── style.css             トップのスタイル
├── script.js             トップの処理（最終更新日の表示、「何が好きー？」ボタン）
├── nazuna.webp           プロフィール画像（全ページのヘッダーでも使用）
├── 404.html              存在しない URL を開いたときのページ
├── common/               全ページ・複数ページで共通のファイル
│   ├── common.css        作品ページ共通のスタイル（ヘッダー・カード・ボタン・フッター・ダークモード）
│   ├── site.js           全ページ共通の処理（著作権表示の年を今年にする）
│   └── songs.js          Roselia のオリジナル曲一覧（曲選出とライブデータベースで共通）
├── shindan/              推しCP診断（index.html → quiz.html → result.html）
├── musicsort/            Roselia曲選出
├── live-data/            Roseliaライブデータベース
├── ss-gacha/             小説お題ガチャ
├── angya/                全国行脚（トップからのリンクはまだ閉じている）
├── gallery/              写真ギャラリー（PhotoSwipe を vendor/ に同梱）
├── scripts/
│   ├── prepare_photos.py 写真ギャラリー用の画像の前処理
│   └── check_data.mjs    データの書き間違いの検査
└── .github/workflows/check-data.yml   push のたびにデータ検査を実行
```

各作品のフォルダには、だいたい次の4つがあります。**中身を更新するときに触るのは `data.js` だけ**です。

| ファイル | 役割 |
| --- | --- |
| `index.html` | ページの骨組み |
| `data.js` | 中身（質問・曲・公演・キーワードなど）。ファイル内の日本語コメントに書き方があります |
| `○○.js` | 動き（ふだんは触らない） |
| `○○.css` | そのページだけの見た目・差し色（共通部分は `common/common.css`） |

## ✏️ 各作品の更新方法

どのファイルも、すでにある行をコピーして書き換えるのがいちばん確実です。
`//` で始まる行はコメント（無視される行）で、書き足し用の空の雛形もコメントで用意してあります。
雛形を使うときは、行頭の `// ` を消してから中身を書きます。

### 新曲が出たとき（Roselia曲選出・ライブデータベース共通）

`common/songs.js` の `SONGS` の末尾に1行書き足すだけで、両方のページに反映されます。

```js
    { title: '新しい曲名', last: '' },
```

- `title` は正式表記にします（曲選出の画像にもこの表記で入り、ライブのセットリストもこの表記に合わせます）
- `last`（最後に披露したライブ名）は空欄で構いません。空欄ならライブデータベースが自動で表示します

### Roseliaライブデータベース（`live-data/data.js`）

- 公演は `LIVES` に1公演＝1ブロックで書き足します（DAY1・DAY2 や各地公演は別のブロック）
  - `category`：`'solo'`（単独）／`'inhouse'`（自社内コラボ）／`'fes'`（外部フェス）のどれか
  - `date`：`'2025-01-01'` か `'2025/1/1'`
  - `setlist`：`` ` `` と `` ` `` の間に1行1曲。曲名は `common/songs.js` の `SONGS` か、同じファイルの `COVER_SONGS` と同じ表記にします
  - `--- アンコール ---` のように `-` か `=` を2つ以上で始めた行は区切りになり、曲数に数えません
- カバー曲は `COVER_SONGS` に書き足します（書き方は `SONGS` と同じ）
- 一覧にない曲名がセットリストにあると、ページの「曲別データ」の「一覧にない曲」に出ます。下の「データ検査」でも見つけられます

### Roselia曲選出（`musicsort/data.js`）

- 選べる曲は `common/songs.js` です（上の「新曲が出たとき」）
- 「選んだ基準」の選択肢は `CRITERIA` に1行ずつ書きます
- タイトルや画像の下に入る文字は `MUSICSORT_CONFIG` で変えられます

### 推しCP診断（`shindan/data.js`）

- 質問は `QUESTIONS` に1行ずつ書きます（どう答えても結果は同じ。最後の質問だけは YES を選ぶまで繰り返します）
- 結果は `RESULT`、タイトルと説明は `SHINDAN_CONFIG` です

### 小説お題ガチャ（`ss-gacha/data.js`）

- `CATEGORIES` の各種類の `keywords` に1行ずつ書き足します（各種類から1つずつ出ます）
- コピーしたときの末尾の文字は `GACHA_CONFIG.shareFooter` です

### 全国行脚（`angya/data.js`）

- 観光地を `SPOTS` に1ブロックずつ書き足します（`name`・`pref`・`city`・`region`・`description`・`tags`・`ss`）
- `ss`（短編小説）は `` ` `` で囲み、そのまま改行すればページでも改行されます
- まだ未完成のため、トップページの「作品集」からのリンクは `index.html` 内でコメントにして閉じてあります。
  公開するときは、その行の `<!--` と `-->` を外します

### トップページ（`index.html`）

プロフィールの文章は `index.html` を直接書き換えます。見た目は `style.css` にまとまっています。

## 🔍 データ検査

書き間違い（セットリストの曲名の表記ゆれ、日付の誤りなど）を見つけるスクリプトです。
[Node.js](https://nodejs.org/) が入っていれば、追加のインストールなしで動きます。

```
node scripts/check_data.mjs
```

検査すること：

- ライブのセットリストに、曲一覧（`SONGS`・`COVER_SONGS`）にない曲名がないか（表記ゆれなら正しい曲名も表示）
- 曲一覧に、同じ曲名の重複や、全角半角・大文字小文字だけが違う曲名がないか
- 公演の `date` が実在する日付か、`category` が `solo`／`inhouse`／`fes` のどれかか
- `gallery/photos.json` の写真と `gallery/photos/`・`gallery/thumbs/` の画像ファイルが対応しているか（ファイルの有無・大きさ・WebP・載せ忘れ）

問題がなければ「問題は見つかりませんでした。」と表示されます。
GitHub に push すると、GitHub Actions でも自動で実行され、結果はリポジトリの「Actions」タブで見られます
（✕ になってもサイトの公開は止まりませんが、ログに出た問題を直してください）。

## 🔄 キャッシュ対策（`?v=N` の番号）

ブラウザは CSS や JS を覚えておく（キャッシュする）ため、ファイルを書き換えても古いまま表示されることがあります。
そこで HTML では、読み込むファイル名の後ろに `?v=番号` を付けています。

```html
<link rel="stylesheet" href="musicsort.css?v=7">
<script src="data.js?v=7"></script>
```

**ルール：CSS・JS（`data.js` を含む）を書き換えたら、そのファイルを読み込んでいる HTML の番号を1つ上げる。**

- 1回の push の中で何度書き換えても、番号を上げるのは1回で構いません
- 同じファイルを複数の HTML が読み込んでいるときは、全部の番号を上げます
  （例：`shindan.css` は `shindan/` の3つの HTML、`common/common.css` は作品5ページと `404.html`、`common/songs.js` は `musicsort/` と `live-data/`）
- どこで読み込んでいるかは、ファイル名で全体検索すると見つかります
- `gallery/photos.json` は毎回最新を読み込むので、番号は不要です

## 🖥️ 手元での確認

リポジトリのいちばん上のフォルダで次を実行し、ブラウザで http://localhost:8000/ を開きます。

```
python -m http.server 8000
```

（HTML ファイルを直接ダブルクリックで開くと、写真ギャラリーなど一部が動きません）

## 🎨 見た目のルール

- 色は各 CSS の先頭の `:root { --○○: 色; }`（CSS 変数）にまとまっています。ページごとの差し色もここで決めています
- ダークモードは OS の設定に従います（切り替えボタンはありません）。暗いときの色は各 CSS の末尾の
  `@media (prefers-color-scheme: dark)` の中にあります。写真ギャラリーは元から暗いデザインなので対象外です
- OS の「動きを減らす」設定が有効な閲覧者には、アニメーションやルーレットの演出を止めています

## 📝 同梱しているライブラリ

- `gallery/vendor/photoswipe-5.4.4/` の PhotoSwipe は MIT ライセンスです（同じフォルダの `LICENSE`）

## 📷 写真ギャラリー（/gallery/）

自分で撮った写真を `gallery/` で展示しています。元画像は位置情報（GPS）などを含むため、
**必ず前処理スクリプトを通した画像だけを公開します**。

### 必要なもの（初回のみ）

- Python 3 と Pillow（`python -m pip install Pillow`）
- exiftool（Windows: `winget install OliverBetz.ExifTool` ／ macOS: `brew install exiftool`）
- HEIC を使う場合のみ pillow-heif（`python -m pip install pillow-heif`）

足りないものがあれば、スクリプトがインストール方法を表示して止まります。

### 写真を追加する手順

1. **元画像を置く**：`gallery/originals/` に JPEG / PNG / HEIC を入れる
   （このフォルダは `.gitignore` 済みで、コミットされません）
2. **スクリプトを実行する**：
   ```
   python scripts/prepare_photos.py
   ```
   - 拡大用（長辺2048px）を `gallery/photos/`、サムネイル（長辺600px）を `gallery/thumbs/` に JPEG と WebP で書き出します
   - GPS・シリアル番号などを削除し、出力画像に GPS が残っていないことを検証します（残っていればエラーで止まります）
   - 新しい写真の雛形が `gallery/photos.json` に追記されます
   - Git Bash で日本語が文字化けする場合は `PYTHONUTF8=1 python scripts/prepare_photos.py` で実行してください
3. **データを編集する**：`gallery/photos.json` の `title`（題名）、
   `location`（任意・市区町村まで）、`event`（任意・イベント名など）を記入する。
   `note` は自分用のメモ欄で、ページには表示されません（ただし photos.json 自体は公開されるので、人に見られて困ることは書かない）。
   題名は画像の代替テキスト（alt）にも使われます。`date` は撮影日が自動で入ります。
   一覧には写真だけが並び、題名と撮影状況（`event`・`location`・`date`）は拡大表示したときに表示されます。
   `width` などのサイズ欄はスクリプトが管理するので触らないでください。
   並び順は `photos.json` の順番です。
4. **確認してコミットする**：
   ```
   python -m http.server 8000
   ```
   で http://localhost:8000/gallery/ を開いて表示を確認し、
   `gallery/photos/`・`gallery/thumbs/`・`gallery/photos.json` をコミットする

写真を外すときは、`photos.json` の項目と `photos/`・`thumbs/` の同名ファイル（.jpg と .webp）を削除します。
