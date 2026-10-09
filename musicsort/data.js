// data.js - Roselia曲選出の中身（曲リスト・画像の設定）
// SONGS に曲を書き足すだけで、選べる曲が増えます。

// サイト全体の設定
const MUSICSORT_CONFIG = {
    title: 'Roselia曲選出',
    description: 'Roseliaの曲から好きな12曲を選んで、アルバムの曲目リストのような画像を作りましょう。',
    // 画像の見出し：「（名前）の　（基準）　（imageTitle）」
    // ※選ぶ曲数は musicsort.js の MAX_PICKS で決まります。変えるときはここも合わせてください。
    imageTitle: 'Roselia曲12選',
    defaultName: 'あなた', // 名前が空欄のときに使う
    // 画像の下に入る文字（ハッシュタグやURLなど。空欄なら入りません）
    imageFooter: '#Roselia曲選出　nazuna-umanoma.github.io/musicsort/',
};

// 選んだ基準（上から順に選択肢として並びます。いちばん上が最初から選ばれた状態）
const CRITERIA = [
    '直感で選んだ',
    'ライブの思い出曲',
    'ストーリー重視で選んだ',
    '音楽性重視で選んだ',
];

// 曲一覧
// title: 曲名（画像にもこの表記で入ります）
// ※いまは雛形として一部の曲だけ入れています。正式表記を確認しつつ書き足してください。
const SONGS = [
    { title: 'BLACK SHOUT' },
    { title: 'LOUDER' },
    { title: 'Re:birth day' },
    { title: '熱色スターマイン' },
    { title: '陽だまりロードナイト' },
    { title: 'Neo-Aspect' },
    { title: 'R' },
    { title: '軌跡' },
    { title: '約束' },
    { title: 'ONENESS' },
    { title: 'FIRE BIRD' },
    { title: 'Determination Symphony' },
    { title: 'Opera of the wasteland' },
    { title: 'Ringing Bloom' },
    { title: 'PASSIONATE ANTHEM' },
    { title: 'BRAVE JEWEL' },
    { title: 'ZEAL of proud' },
    { title: 'Song I am.' },
//     { title: '' },
//     { title: '' },
//     { title: '' },
];
