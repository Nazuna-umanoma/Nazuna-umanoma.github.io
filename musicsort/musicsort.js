// musicsort.js - Roselia曲選出のロジック
// SONGS（data.js）から12曲を選んで曲目リストに並べ、canvas で画像にします。

const MAX_PICKS = 12; // 選ぶ曲数（変えるときは data.js の imageTitle も合わせる）
const picks = [];     // 選んだ曲（SONGS のインデックス、曲順）
let criterion = 0;    // 選んだ基準（CRITERIA のインデックス）

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('musicsort-title').textContent = MUSICSORT_CONFIG.title;
    document.getElementById('musicsort-description').textContent = MUSICSORT_CONFIG.description;
    document.getElementById('song-count').textContent = `収録数 ${SONGS.length}曲`;
    document.getElementById('name-input').placeholder = `空欄なら「${MUSICSORT_CONFIG.defaultName}」`;

    renderCriteria();

    document.getElementById('search').addEventListener('input', renderSongList);
    document.getElementById('name-input').addEventListener('input', () => {
        hideResult();
        renderHeading();
    });
    document.getElementById('reset-btn').addEventListener('click', reset);
    document.getElementById('random-btn').addEventListener('click', fillRandom);
    document.getElementById('generate-btn').addEventListener('click', generateImage);

    render();
});

function render() {
    renderHeading();
    renderTracklist();
    renderSongList();

    document.getElementById('pick-status').textContent = `${picks.length} / ${MAX_PICKS} 曲`;
    document.getElementById('generate-btn').disabled = picks.length < MAX_PICKS;
    document.getElementById('random-btn').disabled = picks.length >= MAX_PICKS;
}

// 見出し「（名前）の　（基準）　Roselia曲12選」の部品
function headingParts() {
    const name = document.getElementById('name-input').value.trim() || MUSICSORT_CONFIG.defaultName;
    return {
        who: `${name}の`,
        criterion: CRITERIA[criterion],
        title: MUSICSORT_CONFIG.imageTitle,
    };
}

function renderHeading() {
    const h = headingParts();
    const el = document.getElementById('tracklist-heading');
    el.innerHTML = `<span class="heading-who"></span><span class="heading-criterion"></span><span class="heading-title"></span>`;
    el.querySelector('.heading-who').textContent = h.who;
    el.querySelector('.heading-criterion').textContent = h.criterion;
    el.querySelector('.heading-title').textContent = h.title;
}

// 基準の選択肢
function renderCriteria() {
    const box = document.getElementById('criteria');
    CRITERIA.forEach((label, i) => {
        const chip = document.createElement('label');
        chip.className = 'chip';
        chip.innerHTML = `<input type="radio" name="criterion"><span></span>`;
        const input = chip.querySelector('input');
        input.value = i;
        input.checked = i === criterion;
        input.addEventListener('change', () => {
            criterion = i;
            hideResult();
            renderHeading();
        });
        chip.querySelector('span').textContent = label;
        box.appendChild(chip);
    });
}

// 曲を選ぶ／外す
function togglePick(index) {
    const pos = picks.indexOf(index);
    if (pos >= 0) {
        picks.splice(pos, 1);
    } else if (picks.length < MAX_PICKS) {
        picks.push(index);
    } else {
        return; // 選び済み
    }
    hideResult();
    render();
}

// 曲順を入れ替える（dir: -1 で上へ、1 で下へ）
function moveTrack(pos, dir) {
    const to = pos + dir;
    if (to < 0 || to >= picks.length) return;
    [picks[pos], picks[to]] = [picks[to], picks[pos]];
    hideResult();
    render();
}

const trackNo = n => String(n).padStart(2, '0');

// 曲目リスト
function renderTracklist() {
    const list = document.getElementById('tracklist');
    list.innerHTML = '';

    for (let i = 0; i < MAX_PICKS; i++) {
        const li = document.createElement('li');
        li.className = 'track';
        li.innerHTML = `<span class="track-no"></span><span class="track-title"></span>`;
        li.querySelector('.track-no').textContent = trackNo(i + 1);

        if (i < picks.length) {
            li.classList.add('filled');
            li.querySelector('.track-title').textContent = SONGS[picks[i]].title;

            const actions = document.createElement('span');
            actions.className = 'track-actions';
            [
                ['▲', '上へ', () => moveTrack(i, -1), i === 0, ''],
                ['▼', '下へ', () => moveTrack(i, 1), i === picks.length - 1, ''],
                ['×', '外す', () => togglePick(picks[i]), false, 'remove'],
            ].forEach(([text, label, onClick, disabled, extraClass]) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `track-btn ${extraClass}`.trim();
                btn.textContent = text;
                btn.title = label;
                btn.setAttribute('aria-label', label);
                btn.disabled = disabled;
                btn.addEventListener('click', onClick);
                actions.appendChild(btn);
            });
            li.appendChild(actions);
        } else {
            li.querySelector('.track-title').textContent = '―';
        }
        list.appendChild(li);
    }
}

// 曲リスト（検索欄の文字で絞り込み）
function renderSongList() {
    const list = document.getElementById('song-list');
    const query = document.getElementById('search').value.trim().toLowerCase();
    const full = picks.length >= MAX_PICKS;
    list.innerHTML = '';

    SONGS.forEach((song, index) => {
        if (query && !song.title.toLowerCase().includes(query)) return;

        const pos = picks.indexOf(index);
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'song-btn';
        btn.innerHTML = `<span class="song-no"></span><span class="song-title"></span>`;
        btn.querySelector('.song-title').textContent = song.title;
        if (pos >= 0) {
            btn.classList.add('selected');
            btn.querySelector('.song-no').textContent = pos + 1;
        } else if (full) {
            btn.disabled = true;
        }
        btn.addEventListener('click', () => togglePick(index));
        li.appendChild(btn);
        list.appendChild(li);
    });

    if (!list.children.length) {
        const li = document.createElement('li');
        li.className = 'song-empty';
        li.textContent = '該当する曲がありません';
        list.appendChild(li);
    }
}

// 残りの枠をランダムに埋める
function fillRandom() {
    const rest = SONGS.map((_, i) => i).filter(i => !picks.includes(i));
    while (picks.length < MAX_PICKS && rest.length) {
        const r = Math.floor(Math.random() * rest.length);
        picks.push(rest.splice(r, 1)[0]);
    }
    hideResult();
    render();
}

function reset() {
    picks.length = 0;
    hideResult();
    render();
}

function hideResult() {
    document.getElementById('result').hidden = true;
}

// ---- 画像出力 ----------------------------------------------------------

// 画像のレイアウト（px）
const IMG = {
    width: 1080,
    pad: 90,       // 左右の余白
    listTop: 236,  // 曲目リストの開始位置
    rowHeight: 82, // 1曲ぶんの高さ
    footer: 90,    // 下の文字部分の高さ
    noWidth: 96,   // 曲番号の幅
    font: "'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif",
    // 黒地なので、文字には明るい色を使い、roselia は線だけに使う（ページの CSS と同じ色）
    color: {
        bg: '#111111',
        rowAlt: '#181818', // 1曲おきの背景
        line: '#2e2e2e',
        roselia: '#3344AA', // 曲目リスト上の線
        criterion: '#A9B8FF', // 基準の文字
        trackNo: '#D4AF37',   // 曲番号
        footer: '#BBBBBB',    // 下の文字
        text: '#ffffff',
        // 上の帯（メンバーカラー）
        stripe: ['#871088', '#00AABB', '#DD2200', '#DC0087', '#BBBBBB'],
    },
};

function generateImage() {
    if (picks.length < MAX_PICKS) return;

    const listHeight = IMG.rowHeight * MAX_PICKS;
    const height = IMG.listTop + listHeight + IMG.footer;

    const canvas = document.createElement('canvas');
    canvas.width = IMG.width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 背景
    ctx.fillStyle = IMG.color.bg;
    ctx.fillRect(0, 0, IMG.width, height);
    const stripeW = IMG.width / IMG.color.stripe.length;
    IMG.color.stripe.forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.fillRect(Math.round(i * stripeW), 0, Math.ceil(stripeW), 8);
    });

    drawHeading(ctx);

    // 曲目リスト
    const right = IMG.width - IMG.pad;
    ctx.fillStyle = IMG.color.roselia;
    ctx.fillRect(IMG.pad, IMG.listTop - 4, right - IMG.pad, 4);

    picks.forEach((index, i) => {
        const top = IMG.listTop + i * IMG.rowHeight;
        const mid = top + IMG.rowHeight / 2;

        if (i % 2 === 1) {
            ctx.fillStyle = IMG.color.rowAlt;
            ctx.fillRect(IMG.pad, top, right - IMG.pad, IMG.rowHeight);
        }
        ctx.fillStyle = IMG.color.line;
        ctx.fillRect(IMG.pad, top + IMG.rowHeight - 1, right - IMG.pad, 1);

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = IMG.color.trackNo;
        ctx.font = `bold 34px ${IMG.font}`;
        ctx.fillText(trackNo(i + 1), IMG.pad + 16, mid + 1);

        // 曲名（長いときは1行に収まるまで小さくする）
        const x = IMG.pad + IMG.noWidth;
        const maxWidth = right - 16 - x;
        const title = SONGS[index].title;
        let size = 40;
        do {
            ctx.font = `bold ${size}px ${IMG.font}`;
            if (ctx.measureText(title).width <= maxWidth) break;
            size -= 2;
        } while (size > 22);
        ctx.fillStyle = IMG.color.text;
        ctx.fillText(title, x, mid + 1, maxWidth);
    });

    // フッター
    if (MUSICSORT_CONFIG.imageFooter) {
        ctx.fillStyle = IMG.color.footer;
        ctx.font = `24px ${IMG.font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(MUSICSORT_CONFIG.imageFooter, IMG.width / 2, IMG.listTop + listHeight + IMG.footer / 2);
    }

    const url = canvas.toDataURL('image/png');
    document.getElementById('result-img').src = url;
    document.getElementById('download-link').href = url;
    const result = document.getElementById('result');
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth' });
}

// 見出し：1行目「（名前）の　（基準）」、2行目「Roselia曲12選」
function drawHeading(ctx) {
    const h = headingParts();
    const maxWidth = IMG.width - IMG.pad * 2;
    const who = `${h.who}　`;

    // 名前が長いときは1行目を小さくして収める
    let size = 38;
    let whoW, crW;
    while (true) {
        ctx.font = `bold ${size}px ${IMG.font}`;
        whoW = ctx.measureText(who).width;
        crW = ctx.measureText(h.criterion).width;
        if (whoW + crW <= maxWidth || size <= 20) break;
        size -= 2;
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const x = (IMG.width - whoW - crW) / 2;
    ctx.fillStyle = IMG.color.text;
    ctx.fillText(who, x, 74);
    ctx.fillStyle = IMG.color.criterion;
    ctx.fillText(h.criterion, x + whoW, 74);

    ctx.textAlign = 'center';
    ctx.fillStyle = IMG.color.text;
    ctx.font = `bold 68px ${IMG.font}`;
    ctx.fillText(h.title, IMG.width / 2, 146);
}
