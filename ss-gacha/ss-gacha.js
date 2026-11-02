// ss-gacha.js - 小説お題ガチャのロジック
// CATEGORIES（data.js）の各種類からキーワードを1つずつ選んで表示します。

// 空欄・重複を除いた、種類ごとのキーワード
const POOLS = CATEGORIES.map(c => ({
    name: c.name,
    keywords: [...new Set(c.keywords.map(k => k.trim()).filter(k => k))],
}));
const EMPTY_TEXT = '（未登録）';
const SPIN_MS = 500;     // 1つ目が止まるまでの時間
const STOP_GAP_MS = 180; // 2つ目以降が止まる間隔
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let current = []; // いま表示しているお題（POOLS と同じ順）

document.addEventListener('DOMContentLoaded', () => {
    const total = POOLS.reduce((sum, p) => sum + p.keywords.length, 0);
    document.getElementById('gacha-title').textContent = GACHA_CONFIG.title;
    document.getElementById('gacha-description').textContent = GACHA_CONFIG.description;
    document.getElementById('keyword-count').textContent = `収録数 ${total}語`;

    renderSlots();

    document.getElementById('draw-btn').addEventListener('click', draw);
    document.getElementById('copy-btn').addEventListener('click', copyKeywords);
});

// 種類ごとの空のスロット（？）を並べる
function renderSlots() {
    const list = document.getElementById('keywords');
    list.innerHTML = '';
    POOLS.forEach(pool => {
        const li = document.createElement('li');
        li.className = 'keyword';
        const label = document.createElement('span');
        label.className = 'keyword-label';
        label.textContent = pool.name;
        const text = document.createElement('span');
        text.className = 'keyword-text';
        text.textContent = '？';
        li.append(label, text);
        list.appendChild(li);
    });
}

function randomFrom(keywords) {
    if (keywords.length === 0) return EMPTY_TEXT;
    return keywords[Math.floor(Math.random() * keywords.length)];
}

function draw() {
    const slots = document.querySelectorAll('.keyword');
    current = POOLS.map(p => randomFrom(p.keywords));

    if (reduceMotion) {
        slots.forEach((slot, i) => settle(slot, current[i]));
        finish();
        return;
    }

    document.getElementById('draw-btn').disabled = true;
    slots.forEach((slot, i) => {
        slot.classList.remove('settled');
        slot.classList.add('spinning');
        const text = slot.querySelector('.keyword-text');
        const timer = setInterval(() => {
            text.textContent = randomFrom(POOLS[i].keywords);
        }, 60);
        setTimeout(() => {
            clearInterval(timer);
            settle(slot, current[i]);
            if (i === POOLS.length - 1) finish();
        }, SPIN_MS + i * STOP_GAP_MS);
    });
}

function settle(slot, keyword) {
    slot.classList.remove('spinning', 'settled');
    slot.querySelector('.keyword-text').textContent = keyword;
    void slot.offsetWidth; // アニメーションを毎回やり直すため
    slot.classList.add('settled');
}

function finish() {
    const btn = document.getElementById('draw-btn');
    btn.disabled = false;
    btn.textContent = 'もう一回引く';

    document.getElementById('share-area').hidden = false;
    document.getElementById('copy-btn').textContent = 'お題をコピー';
    document.getElementById('post-link').href =
        'https://x.com/intent/post?text=' + encodeURIComponent(shareText());
}

// コピー・ポスト用の文章
function shareText() {
    const lines = [`【${GACHA_CONFIG.title}】`, ...current.map((k, i) => `${POOLS[i].name}：${k}`)];
    if (GACHA_CONFIG.shareFooter) lines.push('', GACHA_CONFIG.shareFooter);
    return lines.join('\n');
}

async function copyKeywords() {
    const btn = document.getElementById('copy-btn');
    try {
        await navigator.clipboard.writeText(shareText());
        btn.textContent = 'コピーしました';
    } catch {
        btn.textContent = 'コピーできませんでした';
    }
}
