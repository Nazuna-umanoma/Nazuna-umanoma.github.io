// 音楽紹介サイト用スクリプト

let allMusics = [];

// 音楽一覧を取得して表示する
async function loadMusics() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Nazuna-umanoma/Nazuna-umanoma.github.io/main/music/music-list.json');
        const data = await response.json();
        allMusics = data.musics;
        displayMusics(allMusics);
    } catch (error) {
        console.error('音楽一覧の読み込みに失敗しました:', error);
        displayError();
    }
}

// 音楽カードを生成して表示する
function displayMusics(musics) {
    const musicsList = document.getElementById('music-list');
    
    if (!musics || musics.length === 0) {
        musicsList.innerHTML = `
            <div class="empty-state">
                <h3>🎵 曲準備中</h3>
                <p>新しい音楽を投稿予定です。お楽しみに！</p>
            </div>
        `;
        return;
    }

    musicsList.innerHTML = musics.map(music => {
        let linksHtml = '';
        if (music.links) {
            linksHtml = '<div class="music-card-links">';
            if (music.links.youtube) {
                linksHtml += `<a href="${escapeHtml(music.links.youtube)}" target="_blank" class="music-link" title="YouTubeで聴く"><span class="music-link-icon">▶️</span> YouTube</a>`;
            }
            if (music.links.spotify) {
                linksHtml += `<a href="${escapeHtml(music.links.spotify)}" target="_blank" class="music-link" title="Spotifyで聴く"><span class="music-link-icon">🎧</span> Spotify</a>`;
            }
            if (music.links.apple) {
                linksHtml += `<a href="${escapeHtml(music.links.apple)}" target="_blank" class="music-link" title="Apple Musicで聴く"><span class="music-link-icon">🎵</span> Apple</a>`;
            }
            if (music.links.bandcamp) {
                linksHtml += `<a href="${escapeHtml(music.links.bandcamp)}" target="_blank" class="music-link" title="Bandcampで聴く"><span class="music-link-icon">🎹</span> Bandcamp</a>`;
            }
            if (music.links.soundcloud) {
                linksHtml += `<a href="${escapeHtml(music.links.soundcloud)}" target="_blank" class="music-link" title="SoundCloudで聴く"><span class="music-link-icon">☁️</span> SoundCloud</a>`;
            }
            linksHtml += '</div>';
        }

        return `
            <div class="music-card">
                <div class="music-card-header">
                    <h3 class="music-card-title">${escapeHtml(music.title)}</h3>
                    <p class="music-card-artist">by ${escapeHtml(music.artist)}</p>
                </div>
                <div class="music-card-body">
                    <p class="music-card-description">${escapeHtml(music.description)}</p>
                    ${music.tags ? `
                        <div class="music-card-tags">
                            ${music.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${linksHtml}
                </div>
            </div>
        `;
    }).join('');
}

// HTML特殊文字をエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// エラー表示
function displayError() {
    const musicsList = document.getElementById('music-list');
    musicsList.innerHTML = `
        <div class="empty-state">
            <h3>⚠️ 読み込みエラー</h3>
            <p>音楽一覧を読み込めませんでした。しばらく後でお試しください。</p>
        </div>
    `;
}

// ページ読み込み時に音楽一覧を取得
document.addEventListener('DOMContentLoaded', loadMusics);
