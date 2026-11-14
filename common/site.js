// site.js - 全ページ共通の小さな処理（各ページの末尾で読み込みます）

// フッターの著作権表示の年（<span class="copyright-year">）を今年にする。
// JavaScript が無効なときは、HTML に書いてある年がそのまま表示されます。
document.querySelectorAll('.copyright-year').forEach(el => {
    el.textContent = new Date().getFullYear();
});
