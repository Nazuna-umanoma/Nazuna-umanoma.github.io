// data.js - Roselia曲選出の中身（曲リスト・画像の設定）
// SONGS に曲を書き足すだけで、選べる曲が増えます。

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

// 曲一覧
// title: 曲名（画像にもこの表記で入ります）
// ※いまは雛形として一部の曲だけ入れています。正式表記を確認しつつ書き足してください。
const SONGS = [
    { title: 'BLACK SHOUT' },
    { title: 'LOUDER' },
    { title: 'Re:birth day' },
    { title: '陽だまりロードナイト' },
    { title: '熱色スターマイン' },
    { title: '-HEROIC ADVENT-' },
    { title: 'ONENESS' },
    { title: 'Determination Symphony' },
    { title: 'Opera of the wasteland' },
    { title: '軌跡' },
    { title: 'Neo-Aspect' },
    { title: 'Legendary' },
    { title: 'R' },
    { title: 'BRAVE JEWEL' },
    { title: 'Sanctuary' },
    { title: 'Safe and Sound' },
    { title: 'PASSIONATE ANTHEM' },
    { title: 'FIRE BIRD' },
    { title: 'Ringing Bloom' },
    { title: '約束' },
    { title: '"UNIONS" Road' },
    { title: 'Avant-garde HISTORY' },
    { title: 'Break your desire' },
    { title: 'Song I am.' },
    { title: 'ZEAL of proud' },
    { title: 'Blessing Chord' },
    { title: 'Proud of oneself' },
    { title: 'overtuRe' },
    { title: 'Sing Alive' },
    { title: 'Singing "OURS"' },
    { title: '雨上がりの夢/湊友希那' },
    { title: 'Keep Heart' },
    { title: 'Original Call' },
    { title: 'Sprechchor' },
    { title: '閃光' },
    { title: 'THE HISTORIC...' },
    { title: 'ROSEN HORIZON' },
    { title: 'Swear ～Night & Day～' },
    { title: 'Our Carol' },
    { title: 'THRONE OF ROSE' },
    { title: 'Dear Gleam' },
    { title: '一逢のFull Glory' },
    { title: 'VIOLET LINE' },
    { title: 'Call the shots' },
    { title: 'Sunlit Musical' },
    { title: 'Sage der Rosen' },
    { title: '覚悟のLiberation' },
    { title: 'Always recall.' },
    { title: 'Floral Haven' },
    { title: '礎の花冠' },
    { title: 'FRONTIER FANTASIA' },
    { title: 'Dazzle the Destiny' },
    { title: 'Grateful Melting' },
    { title: 'Requiem for Fate' },
    { title: 'Second to None' },
    { title: 'Steadfast Spirits' },
    { title: '紫炎' },
    { title: 'Fear Nothing' },
    { title: 'Talk to My Tone' },
    { title: 'XV' },
    { title: 'この蒼き闇と光' },
    { title: 'who we aRe' },
    { title: 'Resound the Way' },
    // { title: '' },
    // { title: '' },
    // { title: '' },
    // { title: '' },
//     { title: '' },
//     { title: '' },
//     { title: '' },
];
