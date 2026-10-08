// shindan.js - 診断ロジック（各ページ共通）
// <body data-page="top|quiz|result"> を見て、ページごとの処理を実行します。

document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'top') initTop();
    if (page === 'quiz') initQuiz();
    if (page === 'result') initResult();
});

// ---------- トップページ ----------
function initTop() {
    document.getElementById('shindan-title').textContent = SHINDAN_CONFIG.title;
    document.getElementById('shindan-description').textContent = SHINDAN_CONFIG.description;
    document.getElementById('question-count').textContent = `全${QUESTIONS.length}問`;
}

// ---------- 質問ページ ----------
function initQuiz() {
    let current = 0;

    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const questionText = document.getElementById('question-text');
    const backBtn = document.getElementById('back-btn');

    function render() {
        progressText.textContent = `Q${current + 1} / ${QUESTIONS.length}`;
        progressBar.style.width = `${(current / QUESTIONS.length) * 100}%`;
        questionText.textContent = QUESTIONS[current];
        backBtn.hidden = current === 0;
    }

    // YES / NO どちらを押しても次へ進むだけ（回答は結果に影響しない）
    function answer() {
        current++;
        if (current < QUESTIONS.length) {
            render();
        } else {
            showAnalyzing();
        }
    }

    document.getElementById('yes-btn').addEventListener('click', answer);
    document.getElementById('no-btn').addEventListener('click', answer);
    backBtn.addEventListener('click', () => {
        if (current > 0) {
            current--;
            render();
        }
    });

    render();
}

// それっぽい「解析中」演出を挟んでから結果ページへ
function showAnalyzing() {
    document.getElementById('quiz-area').hidden = true;
    document.getElementById('analyzing').hidden = false;

    const messages = ['回答を解析しています…', 'CP相性データベースと照合中…', '運命を計算しています…'];
    const msgEl = document.getElementById('analyzing-text');
    let i = 0;
    msgEl.textContent = messages[0];
    const timer = setInterval(() => {
        i++;
        if (i < messages.length) {
            msgEl.textContent = messages[i];
        } else {
            clearInterval(timer);
            location.href = 'result.html';
        }
    }, 900);
}

// ---------- 結果ページ ----------
function initResult() {
    document.title = `${RESULT.name} | ${SHINDAN_CONFIG.title}`;

    // 2人のアイコン
    const pairBox = document.getElementById('result-pair');
    RESULT.pair.forEach((chara, i) => {
        if (i > 0) {
            const cross = document.createElement('span');
            cross.className = 'pair-cross';
            cross.textContent = '×';
            pairBox.appendChild(cross);
        }
        const icon = document.createElement('div');
        icon.className = 'pair-icon';
        icon.style.setProperty('--chara-color', chara.color);
        if (chara.image) {
            const img = document.createElement('img');
            img.src = `images/${chara.image}`;
            img.alt = chara.name;
            icon.appendChild(img);
        } else {
            icon.textContent = chara.initial;
        }
        pairBox.appendChild(icon);
    });

    document.getElementById('result-catch').textContent = RESULT.catchphrase;
    document.getElementById('result-name').textContent = RESULT.name;
    document.getElementById('result-members').textContent =
        `${RESULT.pair.map(c => c.name).join(' × ')}（${RESULT.work}）`;
    document.getElementById('result-description').textContent = RESULT.description;

    const traitList = document.getElementById('result-traits');
    RESULT.traits.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        traitList.appendChild(li);
    });

    // Xでシェア（URLは診断トップを共有）
    const topUrl = new URL('index.html', location.href).href;
    const shareText = `私の推しCPは「${RESULT.name}」でした！\n#${SHINDAN_CONFIG.hashtag}\n`;
    document.getElementById('share-btn').href =
        `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(topUrl)}`;
}
