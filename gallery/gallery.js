// gallery.js - photos.json を読み込んで作品を並べ、PhotoSwipe で拡大表示する

import PhotoSwipeLightbox from 'photoswipe/lightbox';

const gallery = document.getElementById('gallery');
const countEl = document.getElementById('photo-count');
const messageEl = document.getElementById('gallery-message');

// 1x1 の WebP が表示できるかで対応を判定する
const webpSupported = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
});

function showMessage(text) {
    messageEl.textContent = text;
    messageEl.hidden = false;
}

function photoPath(dir, file) {
    return `${dir}/${encodeURIComponent(file)}`;
}

function toWebp(file) {
    return file.replace(/\.jpe?g$/i, '.webp');
}

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
}

// 一覧の1作品を作る（一覧には写真だけを掛け、題名などは拡大表示で見せる）
function createWork(photo) {
    const figure = el('figure', 'work');

    const link = el('a', 'work-link');
    link.href = photoPath('photos', photo.file);
    link.dataset.file = photo.file;
    link.dataset.pswpWidth = photo.width;
    link.dataset.pswpHeight = photo.height;
    if (photo.webp) link.dataset.webp = photoPath('photos', toWebp(photo.file));
    link.classList.add(photo.thumbWidth >= photo.thumbHeight ? 'is-wide' : 'is-tall');

    const picture = document.createElement('picture');
    if (photo.webp) {
        const source = document.createElement('source');
        source.type = 'image/webp';
        source.srcset = photoPath('thumbs', toWebp(photo.file));
        picture.append(source);
    }
    const img = document.createElement('img');
    img.src = photoPath('thumbs', photo.file);
    img.width = photo.thumbWidth;
    img.height = photo.thumbHeight;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = photo.alt || photo.title || '撮影した写真';
    picture.append(img);
    link.append(picture);

    figure.append(link);
    return figure;
}

// 拡大表示のキャプション札（題名と、イベント名・場所・撮影日の撮影状況）
function createCaption(photo) {
    const nodes = [el('p', 'caption-title', photo.title || '無題')];
    const scene = [photo.event, photo.location, photo.date && photo.date.replaceAll('-', '.')]
        .filter(Boolean).join(' ／ ');
    if (scene) nodes.push(el('p', 'caption-meta', scene));
    return nodes;
}

// 作品が画面に入ったら、ゆっくり浮かび上がらせる
function revealOnScroll(works) {
    if (!('IntersectionObserver' in window)) {
        works.forEach((w) => w.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -40px 0px' });
    works.forEach((w) => observer.observe(w));
}

function setupLightbox(photos, useWebp) {
    const lightbox = new PhotoSwipeLightbox({
        gallery: '#gallery',
        children: 'a.work-link',
        pswpModule: () => import('photoswipe'),
        bgOpacity: 1,
        paddingFn: (viewport) => (viewport.x < 600
            ? { top: 16, bottom: 88, left: 0, right: 0 }
            : { top: 48, bottom: 104, left: 72, right: 72 }),
        closeTitle: '閉じる',
        zoomTitle: '拡大・縮小',
        arrowPrevTitle: '前の作品',
        arrowNextTitle: '次の作品',
        errorMsg: '画像を読み込めませんでした',
    });

    if (useWebp) {
        lightbox.addFilter('itemData', (itemData) => {
            const webp = itemData.element && itemData.element.dataset.webp;
            if (webp) itemData.src = webp;
            return itemData;
        });
    }

    // 拡大表示の下にキャプション札を出す（一覧の並びと photos の並びは同じ）
    lightbox.on('uiRegister', () => {
        lightbox.pswp.ui.registerElement({
            name: 'custom-caption',
            order: 9,
            isButton: false,
            appendTo: 'root',
            onInit: (captionEl, pswp) => {
                pswp.on('change', () => {
                    const photo = photos[pswp.currIndex];
                    captionEl.replaceChildren(...(photo ? createCaption(photo) : []));
                });
            },
        });
    });

    // 表示中の作品を URL（#photo=ファイル名）に反映し、リンクで共有できるようにする
    lightbox.on('change', () => {
        const element = lightbox.pswp.currSlide.data.element;
        if (element) history.replaceState(null, '', `#photo=${encodeURIComponent(element.dataset.file)}`);
    });
    lightbox.on('close', () => {
        history.replaceState(null, '', location.pathname + location.search);
    });

    lightbox.init();
    return lightbox;
}

function openFromHash(lightbox) {
    const match = location.hash.match(/^#photo=(.+)$/);
    if (!match) return;
    const file = decodeURIComponent(match[1]);
    const links = [...gallery.querySelectorAll('a.work-link')];
    const index = links.findIndex((a) => a.dataset.file === file);
    if (index >= 0) lightbox.loadAndOpen(index);
}

async function main() {
    let photos;
    try {
        const response = await fetch('photos.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error(response.statusText);
        photos = (await response.json()).photos || [];
    } catch (error) {
        console.error(error);
        showMessage('作品の一覧を読み込めませんでした。時間をおいて再度お試しください。');
        return;
    }

    // スクリプトでサイズが記録されたものだけを展示する
    photos = photos.filter((p) => p.file && p.width && p.height && p.thumbWidth && p.thumbHeight);
    if (photos.length === 0) {
        showMessage('ただいま展示の準備中です。');
        return;
    }

    const works = photos.map(createWork);
    gallery.append(...works);
    countEl.textContent = `展示作品 ${photos.length} 点`;
    revealOnScroll(works);

    const lightbox = setupLightbox(photos, await webpSupported);
    openFromHash(lightbox);
}

main();
