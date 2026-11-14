// script.js

// Smooth scrolling functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navigation active state updates
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${entry.target.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

sections.forEach(section => {
    observer.observe(section);
});

// 最終更新日：GitHub API から index.html の最新コミット日時を取得して表示する
// ・間違った日付は出さない：エラー・上限超過（配列以外の応答）・通信失敗のときは行ごと非表示のまま
// ・取得できた日時は sessionStorage に保存し、同じタブで開き直したときは API を呼ばない
(() => {
    const el = document.getElementById('last-updated');
    if (!el) return;
    const API_URL = 'https://api.github.com/repos/Nazuna-umanoma/Nazuna-umanoma.github.io/commits?path=index.html&per_page=1';
    const CACHE_KEY = 'nazuna:last-updated';

    function show(isoDate) {
        const date = new Date(isoDate);
        if (Number.isNaN(date.getTime())) return false;
        const text = date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
        el.textContent = `最終更新日: ${text}`;
        el.hidden = false;
        return true;
    }

    let cached = null;
    try { cached = sessionStorage.getItem(CACHE_KEY); } catch (e) { /* 保存できない環境では毎回取得 */ }
    if (cached && show(cached)) return;

    fetch(API_URL)
        .then(response => (response.ok ? response.json() : null))
        .then(data => {
            const isoDate = Array.isArray(data) && data[0] && data[0].commit
                && data[0].commit.committer && data[0].commit.committer.date;
            if (!isoDate || !show(isoDate)) return;
            try { sessionStorage.setItem(CACHE_KEY, isoDate); } catch (e) { /* 無視 */ }
        })
        .catch(() => { /* 通信失敗：行は非表示のまま */ });
})();

// Interactive features: Example button for demonstration
const button = document.createElement('button');
button.innerText = '何が好きー？';
button.onclick = () => alert('リサゆきが好き。お前もリサゆき推しにならないか？');
document.body.appendChild(button);
