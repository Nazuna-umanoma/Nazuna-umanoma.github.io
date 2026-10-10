// live-data.js - Roseliaライブデータベースのロジック
// LIVES と SONGS（data.js）から、タブごとの公演一覧と曲別の披露回数を作ります。

const TABS = [
    { id: 'solo', label: '単独ライブ' },
    { id: 'inhouse', label: '自社内' },
    { id: 'fes', label: '外部' },
    { id: 'songs', label: '曲別データ' },
];
const CATEGORY_LABELS = { solo: '単独', inhouse: '自社内', fes: '外部' };
const CATEGORY_IDS = Object.keys(CATEGORY_LABELS);
const WEEKDAYS = '日月火水木金土';
// 「--- アンコール ---」「== MC ==」のような区切り行
const SEPARATOR = /^[-=]{2,}\s*(.*?)\s*[-=]*$/;

let lives = [];     // 整えた公演データ
let songStats = []; // 曲ごとの集計
let songIndex = new Map(); // 曲名 → 集計（セトリでカバー曲を見分けるのに使う）
let currentTab = null;

// タブごとの検索・並び順（openId は次に描画するとき開いておく公演）
const liveState = {};
CATEGORY_IDS.forEach(id => { liveState[id] = { query: '', newest: true, openId: null }; });
const songState = { query: '', category: 'all', sort: 'count', open: null };

document.addEventListener('DOMContentLoaded', () => {
    lives = prepareLives();
    songStats = prepareSongStats();

    document.getElementById('live-title').textContent = LIVE_CONFIG.title;
    document.getElementById('live-description').textContent = LIVE_CONFIG.description;
    document.getElementById('live-count').textContent =
        `登録公演 ${lives.length} ／ オリジナル ${SONGS.length}曲 ／ カバー ${COVER_SONGS.length}曲`;

    renderTabs();
    CATEGORY_IDS.forEach(setupLivePanel);
    setupSongPanel();

    // 曲名 → 曲別データ、公演名 → その公演（どのタブからでも飛べるように document で受ける）
    document.addEventListener('click', e => {
        const song = e.target.closest('.song-link');
        if (song) {
            openSong(song.dataset.song);
            return;
        }
        const live = e.target.closest('.live-link');
        if (live) {
            e.preventDefault();
            openLive(Number(live.dataset.live));
        }
    });

    window.addEventListener('hashchange', () => showTab(tabFromHash()));
    showTab(tabFromHash());
});

// ---------- データの整形 ----------

// 1行1件のテキスト（配列でもOK）を行の配列にする
function toLines(value) {
    const list = Array.isArray(value) ? value : String(value || '').split(/\r?\n/);
    return list.map(s => String(s).trim()).filter(Boolean);
}

// '2025-01-01' / '2025/1/1' を読み取る
function parseDate(value) {
    const m = String(value || '').trim().match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (!m) return null;
    const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
    const w = new Date(y, mo - 1, d).getDay();
    const pad = n => String(n).padStart(2, '0');
    return {
        key: y * 10000 + mo * 100 + d,
        text: `${y}.${pad(mo)}.${pad(d)}（${WEEKDAYS[w]}）`,
    };
}

function prepareLives() {
    const result = [];
    LIVES.forEach((raw, i) => {
        if (!CATEGORY_LABELS[raw.category]) {
            console.warn(`LIVES の ${i + 1} 件目: category が 'solo' / 'inhouse' / 'fes' のどれでもありません`, raw);
            return;
        }
        const items = [];
        let no = 0;
        toLines(raw.setlist).forEach(line => {
            const m = line.match(SEPARATOR);
            if (m) items.push({ type: 'section', label: m[1] });
            else items.push({ type: 'song', title: line, no: ++no });
        });

        const date = parseDate(raw.date);
        const live = {
            id: i,
            category: raw.category,
            name: (raw.name || '').trim() || '（ライブ名未入力）',
            venue: (raw.venue || '').trim(),
            note: (raw.note || '').trim(),
            dateKey: date ? date.key : 0,
            dateText: date ? date.text : String(raw.date || '日付未入力'),
            items,
            interludes: toLines(raw.interludes),
        };
        const songs = items.filter(it => it.type === 'song').map(it => it.title);
        // 開いた中身（セトリ・幕間・メモ）と、それ以外の見出し部分を分けて持つ
        live.bodyText = normalize([...songs, ...live.interludes, live.note].join('\n'));
        live.headText = normalize([live.name, live.venue, raw.date, live.dateText].join('\n'));
        result.push(live);
    });
    return result;
}

// kind: 'original'（SONGS） / 'cover'（COVER_SONGS） / 'unknown'（どちらにもない曲名）
function prepareSongStats() {
    const map = new Map();
    const register = (list, kind) => list.forEach((s, i) => {
        const title = String(typeof s === 'string' ? s : s.title || '').trim();
        if (!title || map.has(title)) return;
        map.set(title, { title, kind, order: i, last: String(s.last || '').trim(), perfs: [] });
    });
    register(SONGS, 'original');
    register(COVER_SONGS, 'cover');

    lives.forEach(live => {
        live.items.forEach(item => {
            if (item.type !== 'song') return;
            if (!map.has(item.title)) {
                map.set(item.title, { title: item.title, kind: 'unknown', order: Infinity, last: '', perfs: [] });
            }
            map.get(item.title).perfs.push({ live, no: item.no });
        });
    });
    songIndex = map;
    const stats = [...map.values()];
    stats.forEach(st => st.perfs.sort((a, b) => a.live.dateKey - b.live.dateKey || a.live.id - b.live.id));
    return stats;
}

// 最終披露ライブ：data.js の last を優先し、空欄なら LIVES のいちばん新しい公演
function lastLiveName(st) {
    if (st.last) return st.last;
    return st.perfs.length ? st.perfs[st.perfs.length - 1].live.name : '';
}

// 検索用：全角半角・大文字小文字をそろえる
function normalize(s) {
    return String(s || '').normalize('NFKC').toLowerCase();
}

function queryTerms(query) {
    return normalize(query).split(/\s+/).filter(Boolean);
}

function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// ---------- タブ ----------

function tabFromHash() {
    const id = location.hash.slice(1);
    return TABS.some(t => t.id === id) ? id : TABS[0].id;
}

function renderTabs() {
    const nav = document.getElementById('tabs');
    TABS.forEach(tab => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `tab tab-${tab.id}`;
        btn.setAttribute('role', 'tab');
        btn.dataset.tab = tab.id;
        const count = tab.id === 'songs'
            ? songStats.length
            : lives.filter(l => l.category === tab.id).length;
        btn.innerHTML = `<span></span><small>${count}</small>`;
        btn.querySelector('span').textContent = tab.label;
        btn.addEventListener('click', () => { location.hash = tab.id; });
        nav.appendChild(btn);
    });
}

function showTab(id) {
    currentTab = id;
    document.querySelectorAll('.tab').forEach(btn => {
        btn.setAttribute('aria-selected', btn.dataset.tab === id ? 'true' : 'false');
    });
    document.querySelectorAll('.panel').forEach(panel => {
        panel.hidden = panel.id !== `panel-${id}`;
    });
}

// ---------- 公演一覧（単独・自社内・外部） ----------

function setupLivePanel(category) {
    const panel = document.getElementById(`panel-${category}`);
    panel.innerHTML = `
        <div class="card toolbar">
            <input type="search" class="search" placeholder="ライブ名・会場・曲名・年などで絞り込み">
            <div class="toolbar-row">
                <span class="result-count"></span>
                <button type="button" class="btn-small sort-btn"></button>
            </div>
        </div>
        <ul class="live-list"></ul>`;
    const state = liveState[category];
    panel.querySelector('.search').addEventListener('input', e => {
        state.query = e.target.value;
        renderLiveList(category);
    });
    panel.querySelector('.sort-btn').addEventListener('click', () => {
        state.newest = !state.newest;
        renderLiveList(category);
    });
    renderLiveList(category);
}

function renderLiveList(category) {
    const panel = document.getElementById(`panel-${category}`);
    const state = liveState[category];
    const terms = queryTerms(state.query);

    const all = lives.filter(l => l.category === category);
    const list = all
        .filter(l => terms.every(t => l.headText.includes(t) || l.bodyText.includes(t)))
        .sort((a, b) => (a.dateKey - b.dateKey || a.id - b.id) * (state.newest ? -1 : 1));

    panel.querySelector('.result-count').textContent = terms.length
        ? `${list.length} / ${all.length} 公演`
        : `${all.length} 公演`;
    panel.querySelector('.sort-btn').textContent = state.newest ? '新しい順 ▼' : '古い順 ▲';

    const ul = panel.querySelector('.live-list');
    if (!list.length) {
        ul.innerHTML = `<li class="empty">${all.length
            ? '該当する公演がありません。'
            : 'まだ公演が登録されていません。'}</li>`;
        return;
    }
    ul.innerHTML = list.map(l => liveItemHTML(l, terms)).join('');
    state.openId = null;
}

function liveItemHTML(live, terms) {
    // 検索語がセトリや幕間に当たった公演は開いた状態にする
    const open = live.id === liveState[live.category].openId
        || terms.some(t => live.bodyText.includes(t));
    const hit = text => terms.some(t => normalize(text).includes(t));

    const setlist = live.items.length
        ? `<ol class="setlist">${live.items.map(it => it.type === 'section'
            ? `<li class="setlist-section"><span>${esc(it.label)}</span></li>`
            : `<li class="setlist-song${hit(it.title) ? ' hit' : ''}">
                   <span class="setlist-no">${it.no}</span>
                   <button type="button" class="song-link" data-song="${esc(it.title)}">${esc(it.title)}</button>
                   ${songIndex.get(it.title)?.kind === 'cover' ? '<span class="tag-cover">カバー</span>' : ''}
               </li>`).join('')}</ol>`
        : '<p class="muted">（未入力）</p>';

    const interludes = live.interludes.length
        ? `<h3>幕間映像</h3>
           <ul class="interludes">${live.interludes.map(t =>
               `<li${hit(t) ? ' class="hit"' : ''}>${esc(t)}</li>`).join('')}</ul>`
        : '';

    return `
        <li class="live cat-${live.category}" id="live-${live.id}">
            <details${open ? ' open' : ''}>
                <summary>
                    <span class="live-date">${esc(live.dateText)}</span>
                    <span class="live-name">${esc(live.name)}</span>
                    ${live.venue ? `<span class="live-venue">${esc(live.venue)}</span>` : ''}
                </summary>
                <div class="live-body">
                    <h3>セットリスト</h3>
                    ${setlist}
                    ${interludes}
                    ${live.note ? `<h3>メモ</h3><p class="live-note">${esc(live.note)}</p>` : ''}
                </div>
            </details>
        </li>`;
}

// 曲別データの「披露した公演」から、その公演を開く
function openLive(id) {
    const live = lives.find(l => l.id === id);
    if (!live) return;
    const state = liveState[live.category];
    state.query = '';
    state.openId = id;
    document.querySelector(`#panel-${live.category} .search`).value = '';
    renderLiveList(live.category);
    location.hash = live.category;
    showTab(live.category);
    document.getElementById(`live-${id}`).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- 曲別データ ----------

function setupSongPanel() {
    const chips = document.getElementById('song-category');
    [['all', 'すべて'], ...CATEGORY_IDS.map(id => [id, CATEGORY_LABELS[id]])].forEach(([value, label]) => {
        const chip = document.createElement('label');
        chip.className = `chip chip-${value}`;
        chip.innerHTML = `<input type="radio" name="song-category"><span></span>`;
        const input = chip.querySelector('input');
        input.value = value;
        input.checked = value === songState.category;
        input.addEventListener('change', () => {
            songState.category = value;
            renderSongList();
        });
        chip.querySelector('span').textContent = label;
        chips.appendChild(chip);
    });

    document.getElementById('song-search').addEventListener('input', e => {
        songState.query = e.target.value;
        renderSongList();
    });
    document.getElementById('song-sort').addEventListener('change', e => {
        songState.sort = e.target.value;
        renderSongList();
    });
    renderSongList();
}

function perfsIn(st, category) {
    return category === 'all' ? st.perfs : st.perfs.filter(p => p.live.category === category);
}

function renderSongList() {
    const terms = queryTerms(songState.query);
    const cat = songState.category;

    const rows = songStats
        .filter(st => terms.every(t => normalize(st.title).includes(t)))
        .map(st => ({ st, perfs: perfsIn(st, cat) }));

    const byOrder = (a, b) => a.st.order - b.st.order || a.st.title.localeCompare(b.st.title, 'ja');
    const sorters = {
        count: (a, b) => b.perfs.length - a.perfs.length || byOrder(a, b),
        order: byOrder,
        name: (a, b) => a.st.title.localeCompare(b.st.title, 'ja'),
    };
    rows.sort(sorters[songState.sort]);

    const played = rows.filter(r => r.perfs.length).length;
    document.getElementById('song-result-count').textContent = `${rows.length}曲（うち披露あり ${played}曲）`;

    const groups = SONG_GROUPS
        .map(g => ({ ...g, rows: rows.filter(r => r.st.kind === g.kind) }))
        .filter(g => g.rows.length || g.kind !== 'unknown');
    document.getElementById('song-stats').innerHTML = groups.map(songGroupHTML).join('');
    songState.open = null;
}

const SONG_GROUPS = [
    { kind: 'original', label: 'オリジナル曲' },
    { kind: 'cover', label: 'カバー曲' },
    { kind: 'unknown', label: '一覧にない曲', hint: 'SONGS / COVER_SONGS にない曲名です。表記ゆれがないか確認してください。' },
];

function songGroupHTML(group) {
    const played = group.rows.filter(r => r.perfs.length).length;
    const max = Math.max(1, ...group.rows.map(r => r.perfs.length));
    return `
        <section class="song-group song-group-${group.kind}">
            <h3 class="song-group-title">${group.label}<small>${group.rows.length}曲（披露あり ${played}曲）</small></h3>
            ${group.hint ? `<p class="song-group-hint">${group.hint}</p>` : ''}
            <ul class="song-stats">${group.rows.length
                ? group.rows.map(r => songRowHTML(r.st, r.perfs, max)).join('')
                : '<li class="empty">該当する曲がありません。</li>'}</ul>
        </section>`;
}

function songRowHTML(st, perfs, max) {
    const open = st.title === songState.open;
    const breakdown = CATEGORY_IDS
        .map(id => `${CATEGORY_LABELS[id]} ${perfsIn(st, id).length}`)
        .join(' ／ ');
    const last = lastLiveName(st);

    const body = perfs.length
        ? `<p class="song-summary">初披露：${esc(perfs[0].live.dateText)} ${esc(perfs[0].live.name)}</p>
           <ol class="perf-list">${perfs.map(p => `
               <li>
                   <span class="perf-date">${esc(p.live.dateText)}</span>
                   <span class="cat-badge cat-${p.live.category}">${CATEGORY_LABELS[p.live.category]}</span>
                   <a href="#${p.live.category}" class="live-link" data-live="${p.live.id}">${esc(p.live.name)}</a>
                   <span class="perf-no">${p.no}曲目</span>
               </li>`).join('')}</ol>`
        : '<p class="muted">この条件では披露記録がありません。</p>';

    return `
        <li class="song-row${perfs.length ? '' : ' zero'}" data-title="${esc(st.title)}">
            <details${open ? ' open' : ''}>
                <summary>
                    <span class="song-bar" style="width:${perfs.length / max * 100}%"></span>
                    <span class="song-title">${esc(st.title)}${last ? `<span class="song-last">最終披露：${esc(last)}</span>` : ''}</span>
                    <span class="song-count"><strong>${perfs.length}</strong>回</span>
                </summary>
                <div class="song-body">
                    <p class="song-breakdown">${breakdown}</p>
                    ${body}
                </div>
            </details>
        </li>`;
}

// セットリストの曲名から、その曲の曲別データを開く
function openSong(title) {
    songState.query = title;
    songState.category = 'all';
    songState.open = title;
    document.getElementById('song-search').value = title;
    document.querySelectorAll('#song-category input').forEach(input => {
        input.checked = input.value === 'all';
    });
    renderSongList();
    location.hash = 'songs';
    showTab('songs');
    const row = [...document.querySelectorAll('.song-row')].find(el => el.dataset.title === title);
    if (row) row.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
