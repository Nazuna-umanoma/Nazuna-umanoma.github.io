// angya.js - 全国行脚のロジック
// ボタンを押すと SPOTS（data.js）からランダムに1か所選んで表示します。

let lastIndex = -1;
let drawing = false;
const visitLog = []; // 行脚の記録（SPOTS のインデックス、古い順）

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('angya-title').textContent = ANGYA_CONFIG.title;
    document.getElementById('angya-description').textContent = ANGYA_CONFIG.description;
    document.getElementById('spot-count').textContent = `収録数 ${SPOTS.length}か所`;

    document.getElementById('draw-btn').addEventListener('click', draw);
    document.getElementById('clear-history-btn').addEventListener('click', clearHistory);
});

// 直前と同じ場所が続かないようにランダムに選ぶ
function pickIndex() {
    if (SPOTS.length === 1) return 0;
    let i;
    do {
        i = Math.floor(Math.random() * SPOTS.length);
    } while (i === lastIndex);
    return i;
}

// ルーレット風に名前を切り替えてから結果を表示
function draw() {
    if (drawing) return;
    drawing = true;

    const drawBtn = document.getElementById('draw-btn');
    const placeholder = document.getElementById('placeholder');
    const rolling = document.getElementById('rolling');
    const result = document.getElementById('result');

    drawBtn.disabled = true;
    placeholder.hidden = true;
    result.hidden = true;
    rolling.hidden = false;

    let ticks = 0;
    const timer = setInterval(() => {
        const s = SPOTS[Math.floor(Math.random() * SPOTS.length)];
        rolling.textContent = `${s.pref}　${s.name}`;
        ticks++;
        if (ticks >= 12) {
            clearInterval(timer);
            const index = pickIndex();
            visitLog.push(index);
            showSpot(index);
            renderHistory();
            rolling.hidden = true;
            drawBtn.disabled = false;
            drawBtn.textContent = 'もう一度行脚する';
            drawing = false;
        }
    }, 70);
}

function showSpot(index) {
    const spot = SPOTS[index];
    lastIndex = index;

    document.getElementById('spot-region').textContent = spot.region;
    document.getElementById('spot-place').textContent = `${spot.pref} ${spot.city}`;
    document.getElementById('spot-name').textContent = spot.name;
    document.getElementById('spot-description').textContent = spot.description;

    const tagList = document.getElementById('spot-tags');
    tagList.innerHTML = '';
    (spot.tags || []).forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        tagList.appendChild(li);
    });

    // SS は書いてあるときだけ表示（改行は CSS の white-space で反映）
    const ss = (spot.ss || '').trim();
    document.getElementById('spot-ss-box').hidden = ss === '';
    document.getElementById('spot-ss').textContent = ss;

    document.getElementById('placeholder').hidden = true;
    const result = document.getElementById('result');
    result.hidden = false;
    // 表示のたびにフェードインし直す
    result.classList.remove('pop');
    void result.offsetWidth;
    result.classList.add('pop');
}

// 行脚の記録（新しい順に表示、クリックでもう一度表示）
function renderHistory() {
    const section = document.getElementById('history');
    const list = document.getElementById('history-list');
    section.hidden = visitLog.length === 0;
    list.innerHTML = '';

    for (let n = visitLog.length - 1; n >= 0; n--) {
        const spot = SPOTS[visitLog[n]];
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'history-item';
        btn.innerHTML = `<span class="history-no"></span><span class="history-name"></span><span class="history-place"></span>`;
        btn.querySelector('.history-no').textContent = `${n + 1}.`;
        btn.querySelector('.history-name').textContent = spot.name;
        btn.querySelector('.history-place').textContent = spot.pref;
        btn.addEventListener('click', () => {
            if (drawing) return;
            showSpot(visitLog[n]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        li.appendChild(btn);
        list.appendChild(li);
    }

    // 何か所めぐったか（重複を除く）
    const visited = new Set(visitLog).size;
    document.getElementById('history-summary').textContent =
        `${visitLog.length}回行脚／${visited}か所訪問（全${SPOTS.length}か所）`;
}

function clearHistory() {
    visitLog.length = 0;
    renderHistory();
}
