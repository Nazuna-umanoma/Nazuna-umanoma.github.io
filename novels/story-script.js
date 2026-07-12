// 小説詳細ページ用スクリプト

let currentNovel = null;
let currentChapterIndex = 0;
let novelList = [];

// URLから小説IDを取得
function getNovelIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// 日付をフォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// 単語数をフォーマット
function formatWordCount(count) {
    if (count >= 10000) {
        return (count / 10000).toFixed(1) + '万字';
    } else if (count >= 1000) {
        return Math.floor(count / 1000) + 'K字';
    }
    return count + '字';
}

// HTML特殊文字をエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 小説データを取得
async function loadNovelData() {
    try {
        const response = await fetch('./novels-list.json');
        const data = await response.json();
        novelList = data.novels;

        const novelId = getNovelIdFromURL();
        currentNovel = novelList.find(n => n.id === novelId);

        if (!currentNovel) {
            showError('指定された小説が見つかりません。');
            return;
        }

        displayStoryHeader();
        displayTableOfContents();
        loadChapter(0);
    } catch (error) {
        console.error('小説データの読み込みに失敗:', error);
        showError('小説データの読み込みに失敗しました。');
    }
}

// ストーリーヘッダーを表示
function displayStoryHeader() {
    document.getElementById('story-title').textContent = currentNovel.title;
    document.getElementById('story-author').textContent = currentNovel.author;
    document.getElementById('story-genre').textContent = currentNovel.genre;
    document.getElementById('story-wordcount').textContent = formatWordCount(currentNovel.wordCount);
    document.getElementById('story-date').textContent = formatDate(currentNovel.publishedDate);
    document.getElementById('story-header').style.display = 'block';
}

// 目次を表示
function displayTableOfContents() {
    const tocList = document.getElementById('toc-list');
    tocList.innerHTML = currentNovel.chapters.map((chapter, index) => `
        <li><a href="#" onclick="loadChapter(${index}); return false;">${escapeHtml(chapter.title)}</a></li>
    `).join('');
    document.getElementById('story-toc').style.display = 'block';
}

// チャプターを読み込む
async function loadChapter(chapterIndex) {
    if (chapterIndex < 0 || chapterIndex >= currentNovel.chapters.length) {
        return;
    }

    currentChapterIndex = chapterIndex;
    const chapter = currentNovel.chapters[chapterIndex];

    try {
        // チャプターファイルを取得
        const response = await fetch(`./chapters/${chapter.fileName}`);
        if (!response.ok) {
            throw new Error('チャプターファイルが見つかりません');
        }
        const chapterContent = await response.text();

        // チャプターを表示
        document.getElementById('chapter-title').textContent = chapter.title;
        document.getElementById('chapter-body').innerHTML = escapeHtml(chapterContent);
        document.getElementById('chapter-content').style.display = 'block';

        // ナビゲーションボタンを更新
        updateChapterNavigation();
        document.getElementById('chapter-nav').style.display = 'flex';

        // ページの上部にスクロール
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('チャプターの読み込みに失敗:', error);
        showError('チャプターの読み込みに失敗しました。');
    }
}

// チャプターナビゲーションを更新
function updateChapterNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentChapterIndex === 0;
    nextBtn.disabled = currentChapterIndex === currentNovel.chapters.length - 1;
}

// 前章へ
function goToPrevChapter() {
    if (currentChapterIndex > 0) {
        loadChapter(currentChapterIndex - 1);
    }
}

// 次章へ
function goToNextChapter() {
    if (currentChapterIndex < currentNovel.chapters.length - 1) {
        loadChapter(currentChapterIndex + 1);
    }
}

// エラーメッセージを表示
function showError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = `<div class="error-message">${escapeHtml(message)}</div>`;
}

// ページ読み込み時に小説データを読み込む
document.addEventListener('DOMContentLoaded', loadNovelData);