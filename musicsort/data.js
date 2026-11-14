// data.js - Roselia曲選出の中身（曲リスト・画像の設定）
// 曲の一覧（SONGS）は common/songs.js にあり、ライブデータベースと共通です。

// サイト全体の設定
const MUSICSORT_CONFIG = {
    title: 'Roselia曲選出',
    description: 'Roseliaの曲から好きな12曲を選んで画像保存ができます。選んだ基準も表示することができます。',
    // 画像の見出し：「（名前）の　（基準）　（imageTitle）」
    // ※選ぶ曲数は musicsort.js の MAX_PICKS で決まります。変えるときはここも合わせてください。
    imageTitle: 'Roselia曲12選',
    defaultName: 'バンドリーマー', // 名前が空欄のときに使う
    // 画像の下に入る文字（ハッシュタグやURLなど。空欄なら入りません）
    imageFooter: '#Roselia曲選出　nazuna-umanoma.github.io/musicsort/',
};

// 選んだ基準（上から順に選択肢として並びます。いちばん上が最初から選ばれた状態）
const CRITERIA = [
    '直感で選んだ',
    'ライブの思い出',
    'ストーリー重視で選んだ',
    '音楽性重視で選んだ',
    '理想のセットリスト',
    '理想のアルバム',
];

// 曲一覧（SONGS）は common/songs.js にあります（ライブデータベースと共通）。
// 新曲はそちらに書き足すと、このページの選べる曲にも反映されます。
