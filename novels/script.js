// 小説投稿サイト用スクリプト

// 日付をフォーマットする関数
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// 単語数をフォーマットする関数
function formatWordCount(count) {
    if (count >= 10000) {
        return (count / 10000).toFixed(1) + '万字';
    } else if (count >= 1000) {
        return Math.floor(count / 1000) + 'K字';
    }
    return count + '字';
}

// ステータスのバッジクラスを取得
function getStatusClass(status) {
    switch (status) {
        case '完結':
            return 'status-complete';
        case '連載中':
            return 'status-serial';
        case '執筆中':
            return 'status-writing';
        default:
            return 'status-complete';
    }
}

// 小説一覧を取得して表示する
async function loadNovels() {
    try {
        const response = await fetch('./novels-list.json');
        const data = await response.json();
        displayNovels(data.novels);
    } catch (error) {
        console.error('小説一覧の読み込みに失敗しました:', error);
        displayError();
    }
}

// 小説カードを生成して表示する
function displayNovels(novels) {
    const novelsList = document.getElementById('novels-list');
    
    if (!novels || novels.length === 0) {
        novelsList.innerHTML = `
            <div class="empty-state">
                <h3>📚 作品準備中</h3>
                <p>新しい作品を投稿予定です。お楽しみに！</p>
            </div>
        `;
        return;
    }

    novelsList.innerHTML = novels.map(novel => `
        <div class="novel-card" onclick="openNovel(${novel.id})">
            <div class="novel-card-header">
                <h3 class="novel-card-title">${escapeHtml(novel.title)}</h3>
                <p class="novel-card-author">by ${escapeHtml(novel.author)}</p>
            </div>
            <div class="novel-card-body">
                <p class="novel-card-description">${escapeHtml(novel.description)}</p>
                <div class="novel-card-meta">
                    <span class="novel-card-genre">${escapeHtml(novel.genre)}</span>
                    <span class="novel-card-status ${getStatusClass(novel.status)}">
                        ${escapeHtml(novel.status)}
                    </span>
                </div>
                <div class="novel-card-tags">
                    ${novel.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
                <div class="novel-card-footer">
                    <span class="word-count">📝 ${formatWordCount(novel.wordCount)}</span>
                    <a href="story.html?id=${novel.id}" class="read-btn">読む →</a>
                </div>
            </div>
        </div>
    `).join('');
}

// 小説を開く関数
function openNovel(novelId) {
    window.location.href = `story.html?id=${novelId}`;
}

// HTML特殊文字をエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// エラー表示
function displayError() {
    const novelsList = document.getElementById('novels-list');
    novelsList.innerHTML = `
        <div class="empty-state">
            <h3>⚠️ 読み込みエラー</h3>
            <p>小説一覧を読み込めませんでした。しばらく後でお試しください。</p>
        </div>
    `;
}

// ページ読み込み時に小説一覧を取得
document.addEventListener('DOMContentLoaded', loadNovels);