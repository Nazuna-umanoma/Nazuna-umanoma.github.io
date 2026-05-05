# プロフィール＆ブログサイト

ブログ機能付きのプロフィールページテンプレートです。あなたの情報を追加してカスタマイズできます。

## 📁 ファイル構成

```
github.io/
├── index.html          # メインのプロフィールページ
├── style.css           # メインスタイルシート
├── blog-post.css       # ブログ記事のスタイルシート
├── script.js           # JavaScriptの機能
├── posts/
│   ├── post-1.html     # ブログ記事1
│   ├── post-2.html     # ブログ記事2
│   └── post-3.html     # ブログ記事3
└── README.md           # このファイル
```

## 🚀 クイックスタート

### 1. 基本情報の編集

`index.html` を開いて、以下の部分を編集してください：

```html
<!-- プロフィール画像 -->
<img src="[プロフィール画像のURL]" alt="プロフィール写真">

<!-- 名前 -->
<h1>[あなたの名前]</h1>

<!-- 職業/専門分野 -->
<p class="profile-title">[職業/専門分野]</p>

<!-- 自己紹介文 -->
<p class="profile-bio">
    [ここに自己紹介文を書いてください。...]
</p>

<!-- SNS/連絡先 -->
<a href="https://twitter.com/[ユーザー名]" target="_blank">Twitter</a>
<a href="https://github.com/[ユーザー名]" target="_blank">GitHub</a>
<a href="mailto:[メールアドレス]">Email</a>
```

### 2. スキルセクションの編集

`index.html` のスキルセクションで、あなたのスキルをリストアップします：

```html
<div class="skill-card">
    <h3>プログラミング言語</h3>
    <ul>
        <li>Python</li>
        <li>JavaScript</li>
        <li>HTML/CSS</li>
    </ul>
</div>
```

### 3. ブログ記事の追加

1. `posts/post-1.html` をコピーして新しいファイルを作成（例：`post-4.html`）
2. 記事のタイトル、内容、メタデータを編集
3. `index.html` のブログセクションに新しいカードを追加：

```html
<article class="blog-card">
    <div class="blog-date">2026-05-06</div>
    <h3><a href="posts/post-4.html">新しい記事のタイトル</a></h3>
    <p class="blog-excerpt">記事の概要をここに書きます。</p>
    <div class="blog-tags">
        <span class="tag">タグ1</span>
        <span class="tag">タグ2</span>
    </div>
</article>
```

## 🎨 カラーカスタマイズ

`style.css` の先頭にあるCSS変数を変更してカラースキームを調整できます：

```css
:root {
    --primary-color: #667eea;      /* メイン色 */
    --secondary-color: #764ba2;    /* サブ色 */
    --text-color: #333;            /* テキスト色 */
    --light-bg: #f7fafc;           /* ライト背景色 */
    --border-color: #e2e8f0;       /* ボーダー色 */
}
```

## 📱 レスポンシブ対応

このテンプレートはスマートフォン、タブレット、デスクトップなど、
すべてのデバイスで正しく表示されるようにレスポンシブデザインに対応しています。

## 🔗 セクション

- **プロフィール**: あなたの紹介と基本情報
- **スキル**: あなたのスキルと能力
- **ブログ**: 最新のブログ記事
- **連絡先**: お問い合わせ情報

## ✨ 機能

- ✅ スムーズスクロール
- ✅ レスポンシブデザイン
- ✅ プロフィール写真（円形）
- ✅ ブログ記事管理
- ✅ タグ機能
- ✅ ソーシャルリンク

## 📝 ブログ記事の書き方

`posts/post-1.html` をテンプレートとして使用して、新しい記事を作成できます。

記事には以下の要素が含まれます：
- タイトル
- 投稿日
- 著者名
- タグ
- 本文（複数のセクション、リスト、画像など対応）

## 🌐 GitHub Pages での公開

1. このリポジトリが `username.github.io` という名前であることを確認
2. GitHub Pages の設定を確認（Settings → Pages）
3. リポジトリにファイルをプッシュ
4. しばらくすると `https://username.github.io` でサイトが公開されます

## 📝 ライセンス

このテンプレートは自由に使用・改変・配布できます。

## 💡 Tips

- プロフィール画像は自分の写真や顔出しできない場合はアバターを使用してもOKです
- ブログ記事は定期的に追加することで、SEOにも良い影響があります
- ソーシャルリンクは自分が使っているプラットフォームのみに絞ると見栄えが良いです

---

何か問題が発生した場合や、さらなるカスタマイズが必要な場合は、
気軽にお知らせください！