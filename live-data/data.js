// data.js - Roseliaライブデータベースの中身（公演データ・曲一覧）
// LIVES に公演を書き足すだけで、各タブの一覧と曲別データ（披露回数）が増えます。

// サイト全体の設定
const LIVE_CONFIG = {
    title: 'Roseliaライブデータベース',
    description: 'Roseliaのライブの開催日・会場・セットリスト・幕間映像をまとめたデータベースです。曲ごとの披露回数も調べられます。',
};

// 公演一覧（1公演＝1ブロック。DAY1・DAY2 や各地公演はそれぞれ別のブロックにします）
//
// category   : 'solo'（単独ライブ） / 'inhouse'（自社内コラボ） / 'fes'（外部フェス）
// date       : 開催日。'2025-01-01' でも '2025/1/1' でもOK（Excelの日付をそのまま貼れます）
// name       : ライブ名
// venue      : 会場
// setlist    : セットリスト。` `（バッククォート）の間に 1行1曲 で書きます。
//              Excelで曲名の列をコピーして、そのまま貼り付けられます。
//              「--- アンコール ---」のように - か = を2つ以上で始めた行は区切りになり、曲数に数えません。
//              ※曲名は下の SONGS / COVER_SONGS と同じ表記にしてください（違うと別の曲として数えられます）。
// interludes : 幕間映像の内容。setlist と同じく 1行に1つ（なくてもOK）
// note       : メモ（なくてもOK）
//
const LIVES = [
    {
        category: 'solo',
        date: '2017-06-30',
        name: 'Rosenlied',
        venue: 'duo MUSIC EXCHANGE',
        setlist: `
            BLACK SHOUT
            魂のルフラン
            Hacking to the Gate
            ETERNAL BLAZE
            陽だまりロードナイト
            Re:birth day
            LOUDER
            魂のルフラン
            BLACK SHOUT
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2017-07-29',
        name: 'Rosenlied追加公演',
        venue: '有明コロシアム',
        setlist: `
            LOUDER
            BLACK SHOUT
            魂のルフラン
            Hacking to the Gate
            熱色スターマイン
            ETERNAL BLAZE
            陽だまりロードナイト
            Re:birth day
            BLACK SHOUT
            LOUDER
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2017-10-08',
        name: 'Zeit',
        venue: '幕張メッセ イベントホール',
        setlist: `
            BLACK SHOUT
            LOUDER
            魂のルフラン
            Hacking to the Gate
            Determination Symphony
            Re:birth day
            ETERNAL BLAZE
            陽だまりロードナイト
            -HEROIC ADVENT-
            熱色スターマイン
            Re:birth day
            BLACK SHOUT
        `,
        interludes: `
            合宿
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2018-05-13',
        name: 'Ewigkeit',
        venue: '幕張メッセ 国際展示場 1～3ホール',
        setlist: `
            ONENESS
            Determination Symphony
            魂のルフラン
            Hacking to the Gate
            ETERNAL BLAZE
            深愛
            LOUDER
            熱色スターマイン
            軌跡
            Re:birth day
            -HEROIC ADVENT-
            Neo-Aspect
            BLACK SHOUT
            陽だまりロードナイト
        `,
        interludes: `
            格付け
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2018-09-17',
        name: 'Roselia Fan Meeting 昼',
        venue: 'カルッツかわさき ホール',
        setlist: `
            熱色スターマイン
            LOUDER
            BLACK SHOUT
            R
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2018-09-17',
        name: 'Roselia Fan Meeting 夜',
        venue: 'カルッツかわさき ホール',
        setlist: `
            Neo-Aspect
            BLACK SHOUT
            LOUDER
            R
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2018-11-07',
        name: 'Vier',
        venue: '品川プリンスホテル ステラボール',
        setlist: `
            BLACK SHOUT
            R
            熱色スターマイン
            Neo-Aspect
            LOUDER
            ONENESS
            Re:birth day
            LOUDER
            魂のルフラン
            BLACK SHOUT
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2019-02-21',
        name: 'Hitze',
        venue: '日本武道館',
        setlist: `
            BRAVE JEWEL
            R
            魂のルフラン
            残酷な天使のテーゼ
            ONENESS
            Sanctuary
            陽だまりロードナイト
            Determination Symphony
            軌跡
            BLACK SHOUT
            LOUDER
            Safe and Sound
            Re:birth day
            熱色スターマイン
            Neo-Aspect
        `,
        interludes: `
            PV・撮影現場
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2019-08-03',
        name: 'Flamme',
        venue: '富士急ハイランド コニファーフォレスト',
        setlist: `
            ONENESS
            R
            BRAVE JEWEL
            LOUDER
            ETERNAL BLAZE
            残酷な天使のテーゼ
            This game
            FIRE BIRD
            Safe and Sound
            Neo-Aspect
            Ringing Bloom
            陽だまりロードナイト
            BLACK SHOUT
            熱色スターマイン
        `,
        interludes: `
            富士急ハイランド
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2019-08-04',
        name: 'Wasser',
        venue: '富士急ハイランド コニファーフォレスト',
        setlist: `
            Determination Symphony
            R
            BRAVE JEWEL
            Sanctuary
            残酷な天使のテーゼ
            ETERNAL BLAZE
            This game
            Ringing Bloom
            Re:birth day
            FIRE BIRD
            BLACK SHOUT
            Neo-Aspect
            LOUDER
            熱色スターマイン
        `,
        interludes: `
            富士急ハイランド
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2020-02-01',
        name: 'Rausch',
        venue: '武蔵野の森総合スポーツプラザ',
        setlist: `
            BLACK SHOUT
            R
            Neo-Aspect
            Ringing Bloom
            Re:birth day
            BRAVE JEWEL
            Determination Symphony
            ONENESS
            Legendary
            Shangri-La
            PASSIONATE ANTHEM
            熱色スターマイン
            FIRE BIRD
            約束
            LOUDER
        `,
        interludes: `
            クッキーづくり
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2020-08-21',
        name: 'Einheit',
        venue: '富士急ハイランド コニファーフォレスト',
        setlist: `
            Avant-garde HISTORY
            BLACK SHOUT
            Ringing Bloom
            BRAVE JEWEL
            Safe and Sound
            約束
            Break your desire
            Neo-Aspect
            PASSIONATE ANTHEM
            ONENESS
            Sanctuary
            R
            FIRE BIRD
            Song I am.
            熱色スターマイン
        `,
        interludes: `
            5人で一緒
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2021-12-11',
        name: 'Edelstein Day1',
        venue: '名古屋国際会議場 センチュリーホール',
        setlist: `
            BLACK SHOUT
            Determination Symphony
            陽だまりロードナイト
            Ringing Bloom
            熱色スターマイン
            FIRE BIRD
            Opera of the wasteland
            軌跡
            R
            ZEAL of proud
            Re:birth day
            PASSIONATE ANTHEM
            "UNIONS" Road
            Sprechchor
            BRAVE JEWEL
        `,
        interludes: `
            練習風景
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2021-12-12',
        name: 'Edelstein Day2',
        venue: '名古屋国際会議場 センチュリーホール',
        setlist: `
            BRAVE JEWEL
            Determination Symphony
            陽だまりロードナイト
            Ringing Bloom
            Re:birth day
            FIRE BIRD
            "UNIONS" Road
            Neo-Aspect
            ZEAL of proud
            熱色スターマイン
            PASSIONATE ANTHEM
            Sprechchor
            Opera of the wasteland
            BLACK SHOUT
            Song I am.
        `,
        interludes: `
            練習風景
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2022-05-21',
        name: 'Episode of Roselia Day1: Weißklee',
        venue: '富士急ハイランド コニファーフォレスト',
        setlist: `
            雨上がりの夢
            Proud of oneself
            BLACK SHOUT
            Re:birth day
            約束
            "UNIONS" Road
            LOUDER
            Neo-Aspect
            Song I am.
            FIRE BIRD
            overtuRe
            ZEAL of proud
            ONENESS
            ROZEN HORIZON
        `,
        interludes: `
            これまでこれから
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2022-05-22',
        name: 'Episode of Roselia Day2: Rose',
        venue: '富士急ハイランド コニファーフォレスト',
        setlist: `
            Sing Alive
            BLACK SHOUT
            FIRE BIRD
            R
            Sprechchor
            約束
            閃光
            Neo-Aspect
            熱色スターマイン
            "UNIONS" Road
            Singing "OURS"
            ROZEN HORIZON
            Song I am.
            LOUDER
        `,
        interludes: `
            これまでこれから
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2022-09-22',
        name: 'Sonnenschein',
        venue: '有明アリーナ',
        setlist: `
            THE HISTORIC...
            BRAVE JEWEL
            Opera of the wasteland
            PASSIONATE ANTHEM
            Ringing Bloom
            "UNIONS" Road
            Determination Symphony
            Swear ～Night & Day～
            Sprechchor
            陽だまりロードナイト
            R
            overtuRe
            FIRE BIRD
            ROZEN HORIZON
            -HEROIC ADVENT-
        `,
        interludes: `
            Roeslier
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2023-09-16',
        name: 'Farbe Day1',
        venue: '有明アリーナ',
        setlist: `
            BLACK SHOUT
            R
            THRONE OF ROSE
            ROZEN HORIZON
            "UNIONS" Road
            FIRE BIRD
            Neo-Aspect
            Opera of the wasteland
            Determination Symphony
            Ringing Bloom
            陽だまりロードナイト
            Song I am.
            Re:birth day
            一逢のFull Glory
            -HEROIC ADVENT-
            ZEAL of proud
        `,
        interludes: `
            夏休み
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2023-09-17',
        name: 'Farbe Day2',
        venue: '有明アリーナ',
        setlist: `
            BLACK SHOUT
            ROZEN HORIZON
            ONENESS
            R
            ZEAL of proud
            FIRE BIRD
            一逢のFull Glory
            Opera of the wasteland
            Determination Symphony
            Ringing Bloom
            陽だまりロードナイト
            Song I am.
            Sprechchor
            THRONE OF ROSE
            -HEROIC ADVENT-
            "UNIONS" Road
        `,
        interludes: `
            夏休み
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2024-02-17',
        name: 'Rosenchor大阪特別公演 Day1',
        venue: '大阪城ホール',
        setlist: `
            ROZEN HORIZON
            BLACK SHOUT
            Song I am.
            覚悟のLiberation
            熱色スターマイン
            Blessing Chord
            Sing Alive
            ZEAL of proud
            Safe and Sound
            Sprechchor
            Dear Gleam
            一逢のFull Glory
            FIRE BIRD
            VIOLET LINE
        `,
        interludes: `
            陣取り合戦
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2024-02-18',
        name: 'Rosenchor大阪特別公演 Day2',
        venue: '大阪城ホール',
        setlist: `
            ROZEN HORIZON
            BLACK SHOUT
            PASSIONATE ANTHEM
            覚悟のLiberation
            熱色スターマイン
            Break your desire
            Sing Alive
            ZEAL of proud
            Safe and Sound
            約束
            Dear Gleam
            一逢のFull Glory
            FIRE BIRD
            VIOLET LINE
        `,
        interludes: `
            陣取り合戦
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2024-05-04',
        name: 'Rosenchor札幌Day1',
        venue: 'カナモトホール',
        setlist: `
            ROZEN HORIZON
            BLACK SHOUT
            熱色スターマイン
            覚悟のLiberation
            Sing Alive
            "UNIONS" Road
            THE HISTORIC...
            R
            軌跡
            約束
            Dear Gleam
            一逢のFull Glory
            FIRE BIRD
            VIOLET LINE
        `,
        interludes: `
            陣取り合戦
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2024-05-05',
        name: 'Rosenchor札幌Day2',
        venue: 'カナモトホール',
        setlist: `
            ROZEN HORIZON
            BLACK SHOUT
            熱色スターマイン
            覚悟のLiberation
            ZEAL of proud
            "UNIONS" Road
            THE HISTORIC...
            R
            軌跡
            Sprechchor
            Dear Gleam
            一逢のFull Glory
            FIRE BIRD
            VIOLET LINE
        `,
        interludes: `
            陣取り合戦
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2024-05-18',
        name: 'Rosenchor愛知公演',
        venue: '愛知県芸術劇場 大ホール',
        setlist: `
            ROZEN HORIZON
            BLACK SHOUT
            熱色スターマイン
            覚悟のLiberation
            Sing Alive
            "UNIONS" Road
            THE HISTORIC...
            R
            軌跡
            Sprechchor
            Dear Gleam
            一逢のFull Glory
            FIRE BIRD
            VIOLET LINE
        `,
        interludes: `
            陣取り合戦
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2024-05-26',
        name: 'Rosenchor福岡公演',
        venue: '福岡サンパレス',
        setlist: `
            ROZEN HORIZON
            BLACK SHOUT
            熱色スターマイン
            覚悟のLiberation
            PASSIONATE ANTHEM
            "UNIONS" Road
            THE HISTORIC...
            R
            軌跡
            約束
            Dear Gleam
            一逢のFull Glory
            FIRE BIRD
            VIOLET LINE
        `,
        interludes: `
            陣取り合戦
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2024-06-29',
        name: 'Rosenchor東京公演Day1',
        venue: '東京ガーデンシアター',
        setlist: `
            ROZEN HORIZON
            ONENESS
            Sing Alive
            覚悟のLiberation
            ZEAL of proud
            "UNIONS" Road
            THE HISTORIC...
            R
            軌跡
            約束
            Dear Gleam
            一逢のFull Glory
            FIRE BIRD
            VIOLET LINE
        `,
        interludes: `
            陣取り合戦
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2024-06-30',
        name: 'Rosenchor東京公演Day2',
        venue: '東京ガーデンシアター',
        setlist: `
            ROZEN HORIZON
            ONENESS
            PASSIONATE ANTHEM
            覚悟のLiberation
            "UNIONS" Road
            THE HISTORIC...
            R
            軌跡
            Sprechchor
            Dear Gleam
            一逢のFull Glory
            Floral Haven
            FIRE BIRD
            VIOLET LINE
        `,
        interludes: `
            陣取り合戦
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2024-08-03',
        name: 'Rosenchor上海追加公演',
        venue: '静安体育中心',
        setlist: `
            ROZEN HORIZON
            BLACK SHOUT
            熱色スターマイン
            覚悟のLiberation
            PASSIONATE ANTHEM
            "UNIONS" Road
            THE HISTORIC...
            R
            軌跡
            Sprechchor
            Dear Gleam
            一逢のFull Glory
            FIRE BIRD
            VIOLET LINE
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2024-12-14',
        name: 'Stille Nacht, Rosen Nacht',
        venue: '武蔵野の森総合スポーツプラザ',
        setlist: `
            Sage der Rosen
            Song I am.
            THE HISTORIC...
            Determination Symphony
            FIRE BIRD
            約束
            礎の花冠
            Neo-Aspect
            Re:birth day
            Floral Haven
            PASSIONATE ANTHEM
            R
            -HEROIC ADVENT-
            Our Carol
        `,
        interludes: `
            クリスマス
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2025-02-15',
        name: 'Stille Nacht, Rosen Nacht 上海追加公演',
        venue: '浦発銀行東方体育中心',
        setlist: `
            Sage der Rosen
            Song I am.
            THE HISTORIC...
            Determination Symphony
            FIRE BIRD
            約束
            礎の花冠
            Neo-Aspect
            Re:birth day
            熱色スターマイン
            PASSIONATE ANTHEM
            Our Carol
            ONENESS
            BLACK SHOUT
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2025-06-15',
        name: 'Sei stark',
        venue: '有明アリーナ',
        setlist: `
            overtuRe
            Break your desire
            BLACK SHOUT
            Swear ～Night & Day～
            ROZEN HORIZON
            Requiem for Fate
            Keep Heart
            BRAVE JEWEL
            Safe and Sound
            ZEAL of proud
            一逢のFull Glory
            Dazzle the Destiny
            "UNIONS" Road
            FIRE BIRD
        `,
        interludes: `
            運命の館
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2025-09-12',
        name: 'Stolz',
        venue: 'duo MUSIC EXCHANGE',
        setlist: `
            BLACK SHOUT
            Requiem for Fate
            BRAVE JEWEL
            R
            Neo-Aspect
            Ringing Bloom
            FIRE BIRD
            Re:birth day
            Dazzle the Destiny
            BLACK SHOUT
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2025-11-22',
        name: 'Neuweltfahrt大阪',
        venue: 'おおきにアリーナ舞洲',
        setlist: `
            FRONTIER FANTASIA
            Song I am.
            Determination Symphony
            紫炎
            R
            熱色スターマイン
            Ringing Bloom
            陽だまりロードナイト
            軌跡
            BLACK SHOUT
            Steadfast Spirits
            Neo-Aspect
            FIRE BIRD
            PASSIONATE ANTHEM
        `,
        interludes: `
            絆
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2025-12-05',
        name: 'Neuweltfahrtシンガポール',
        venue: 'THE STAR THEATRE',
        setlist: `
            FRONTIER FANTASIA
            Song I am.
            Determination Symphony
            紫炎
            R
            約束
            Ringing Bloom
            陽だまりロードナイト
            軌跡
            BRAVE JEWEL
            Steadfast Spirits
            Neo-Aspect
            FIRE BIRD
            PASSIONATE ANTHEM
        `,
        interludes: `
            総集編
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2025-12-24',
        name: 'Neuweltfahrtソウル',
        venue: 'KOREA UNIVERSITY TIGER DOME',
        setlist: `
            FRONTIER FANTASIA
            Song I am.
            Determination Symphony
            紫炎
            R
            熱色スターマイン
            Ringing Bloom
            陽だまりロードナイト
            軌跡
            BLACK SHOUT
            Steadfast Spirits
            Neo-Aspect
            FIRE BIRD
            PASSIONATE ANTHEM
        `,
        interludes: `
            総集編
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2025-12-26',
        name: 'Neuweltfahrt台北',
        venue: 'Zepp New Taipei',
        setlist: `
            FRONTIER FANTASIA
            Song I am.
            Determination Symphony
            紫炎
            R
            約束
            Ringing Bloom
            陽だまりロードナイト
            軌跡
            BRAVE JEWEL
            Steadfast Spirits
            Neo-Aspect
            FIRE BIRD
            PASSIONATE ANTHEM
        `,
        interludes: `
            総集編
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2026-01-16',
        name: 'Neuweltfahrt大阪特別DAY1',
        venue: 'Zepp Osaka Bayside',
        setlist: `
            FRONTIER FANTASIA
            Song I am.
            Determination Symphony
            紫炎
            R
            熱色スターマイン
            Ringing Bloom
            陽だまりロードナイト
            軌跡
            BRAVE JEWEL
            Steadfast Spirits
            Neo-Aspect
            FIRE BIRD
            PASSIONATE ANTHEM
        `,
        interludes: `
            総集編
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2026-01-17',
        name: 'Neuweltfahrt大阪特別DAY2',
        venue: 'Zepp Osaka Bayside',
        setlist: `
            FRONTIER FANTASIA
            Song I am.
            Determination Symphony
            紫炎
            R
            約束
            Ringing Bloom
            陽だまりロードナイト
            軌跡
            BLACK SHOUT
            Steadfast Spirits
            Neo-Aspect
            FIRE BIRD
            PASSIONATE ANTHEM
        `,
        interludes: `
            総集編
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2026-02-14',
        name: 'Neuweltfahrt東京DAY1',
        venue: '東京ガーデンシアター',
        setlist: `
            FRONTIER FANTASIA
            Song I am.
            Determination Symphony
            紫炎
            R
            約束
            Ringing Bloom
            陽だまりロードナイト
            軌跡
            ZEAL of proud
            Steadfast Spirits
            Neo-Aspect
            FIRE BIRD
            PASSIONATE ANTHEM
        `,
        interludes: `
            宝の島
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2026-02-15',
        name: 'Neuweltfahrt東京DAY2',
        venue: '東京ガーデンシアター',
        setlist: `
            FRONTIER FANTASIA
            BLACK SHOUT
            Determination Symphony
            紫炎
            R
            ZEAL of proud
            Ringing Bloom
            陽だまりロードナイト
            軌跡
            Song I am.
            Steadfast Spirits
            Neo-Aspect
            FIRE BIRD
            PASSIONATE ANTHEM
        `,
        interludes: `
            宝の島
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2026-08-29',
        name: 'Lehre der Rose DAY1',
        venue: '有明アリーナ',
        setlist: `
            Neo-Aspect
            BRAVE JEWEL
            Sanctuary
            Ringing Bloom
            礎の花冠
            Sprechchor
            Sing Alive
            ZEAL of proud
            PASSIONATE ANTHEM
            Avant-garde HISTORY
            一逢のFull Glory
            ROZEN HORIZON
            R
            FIRE BIRD
        `,
        interludes: `
            就職活動
        `,
        note: '',
    },
    {
        category: 'solo',
        date: '2026-08-30',
        name: 'Lehre der Rose DAY2',
        venue: '有明アリーナ',
        setlist: `
            Neo-Aspect
            BRAVE JEWEL
            Sanctuary
            陽だまりロードナイト
            礎の花冠
            Sprechchor
            Song I am.
            Blessing Chord
            PASSIONATE ANTHEM
            Avant-garde HISTORY
            VIOLET LINE
            ROZEN HORIZON
            BLACK SHOUT
            FIRE BIRD
        `,
        interludes: `
            就職活動
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2017-08-25',
        name: 'Animelo Summer Live 2017 -THE CARD-',
        venue: 'さいたまスーパーアリーナ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2018-07-25',
        name: 'FNSうたの夏まつり2018',
        venue: 'フジテレビ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2019-07-21',
        name: 'BILIBILI MACRO LINK-STAR PHASE 2019',
        venue: '上海Mercedes-Benz Arena',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2019-08-30',
        name: 'Animelo Summer Live 2019 -STORY-',
        venue: 'さいたまスーパーアリーナ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2019-10-27',
        name: 'ANIMAX MUSIX 2019 KOBE',
        venue: 'ワールド記念ホール',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2020-02-11',
        name: 'RADIO EXPO ～TBSラジオ万博2020～',
        venue: 'パシフィコ横浜 展示ホール',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2021-02-14',
        name: 'オダイバ!!超次元音楽祭-ヨコハマからハッピーバレンタイン-',
        venue: 'ぴあアリーナMM',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2021-03-25',
        name: '2021VS1995-2000アニソンバトルBEST20',
        venue: 'テレビ朝日',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2021-11-20',
        name: 'ANIMAX MUSIX 2021',
        venue: '横浜アリーナ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2022-12-30',
        name: 'COUNTDOWN JAPAN 22/23',
        venue: 'COSMO STAGE at 幕張メッセ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2023-05-04',
        name: 'JAPAN JAM 2023',
        venue: 'SUNSET STAGE at 千葉市蘇我スポーツ公園',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2023-08-25',
        name: 'Animelo Summer Live 2023 -AXEL-',
        venue: 'さいたまスーパーアリーナ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2023-12-29',
        name: 'COUNTDOWN JAPAN 23/24',
        venue: 'COSMO STAGE at 幕張メッセ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2024-07-14',
        name: 'LuckyFes 2024',
        venue: 'RAINBOW STAGE at 国営ひたち海浜公園',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2025-08-29',
        name: 'Animelo Summer Live 2025 "ThanXX!"',
        venue: 'さいたまスーパーアリーナ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'fes',
        date: '2026-07-02',
        name: 'J-POP SOUND CAPSULE',
        venue: 'Crypto.com Arena',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2017-02-05',
        name: "BanG Dream!3rd☆LIVE Sparklin'Party 2017!",
        venue: 'TOKYO DOME CITY HALL',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2017-04-30',
        name: 'ミルキィホームズ&ブシロード10周年ライブ&スクフェス4周年記念ライブ',
        venue: '横浜アリーナ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2018-01-13',
        name: 'ガルパライブ&ガルパーティ!in東京',
        venue: '東京ビッグサイト',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2018-01-14',
        name: 'ガルパライブ&ガルパーティ!in東京',
        venue: '東京ビッグサイト',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2018-02-11',
        name: 'がんばろう!九州 BanG Dream!×ミルキィホームズ×けものフレンズ HTB真冬の対バン祭り!!',
        venue: 'ハウステンボス ロッテルダム特設会場',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2019-05-18',
        name: 'NO GIRL NO CRY',
        venue: 'メットライフドーム',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2019-11-30',
        name: 'Rausch und/and Craziness',
        venue: '幕張メッセ 国際展示場 4～6ホール',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2019-12-01',
        name: 'Rausch und/and Craziness',
        venue: '幕張メッセ 国際展示場 4～6ホール',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2020-12-12',
        name: 'Rausch und/and Craziness -interlude-',
        venue: 'オンラインライブ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2021-02-22',
        name: 'Rausch und/and Craziness Ⅱ',
        venue: '横浜アリーナ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2021-08-21',
        name: 'The Beginning DAY1',
        venue: '富士急ハイランド コニファーフォレスト',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2021-08-22',
        name: 'The Beginning DAY2',
        venue: '富士急ハイランド コニファーフォレスト',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2022-11-12',
        name: 'BanG Dream! Special☆LIVE Girls Band Party! 2020→2022',
        venue: 'ベルーナドーム',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2022-11-13',
        name: 'BUSHIROAD 15thANNIVERSARY LIVE',
        venue: 'ベルーナドーム',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2023-02-05',
        name: '星空の夜想曲',
        venue: '有明アリーナ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2023-05-28',
        name: 'RAISE A SUILEN LIVE 2023「EXCLAMATION HIGHLAND」OA',
        venue: '富士急ハイランド コニファーフォレスト',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2024-12-15',
        name: 'Ave Mujica 4th LIVE「Adventus」OA',
        venue: '武蔵野の森総合スポーツプラザ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2026-02-28',
        name: 'BanG Dream! 10th Anniversary LIVE「In the name of BanG Dream!」',
        venue: 'Kアリーナ横浜',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2026-04-12',
        name: 'DREAMS GO ON in TAIPEI',
        venue: '台北・大佳河濱公園',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
    {
        category: 'inhouse',
        date: '2026-05-03',
        name: 'DREAMS GO ON',
        venue: '有明アリーナ',
        setlist: `
        `,
        interludes: `
        `,
        note: '',
    },
//     {
//         category: '',
//         date: '',
//         name: '',
//         venue: '',
//         setlist: `
//
//         `,
//         interludes: `
//
//         `,
//         note: '',
//     },
//     {
//         category: '',
//         date: '',
//         name: '',
//         venue: '',
//         setlist: `
//
//         `,
//         interludes: `
//
//         `,
//         note: '',
//     },
];

// 曲一覧（曲別データに並ぶ曲。披露0回の曲もここにあれば表示されます）
// オリジナル曲は SONGS、カバー曲は COVER_SONGS に書きます。曲別データでは別々のリストで表示されます。
// どちらにもない曲名がセットリストにあると「一覧にない曲」に出るので、表記ゆれの確認に使えます。
//
// title : 曲名
// last  : 最後に披露されたライブ名（例：'Rosenlied DAY1'）。
//         空欄なら、LIVES のデータからいちばん新しい公演を自動で表示します。
//
// ※SONGS は musicsort/data.js と同じ曲一覧です。新曲は両方に書き足してください。
const SONGS = [
    { title: 'BLACK SHOUT', last: '' },
    { title: 'LOUDER', last: '' },
    { title: 'Re:birth day', last: '' },
    { title: '陽だまりロードナイト', last: '' },
    { title: '熱色スターマイン', last: '' },
    { title: '-HEROIC ADVENT-', last: '' },
    { title: 'ONENESS', last: '' },
    { title: 'Determination Symphony', last: '' },
    { title: 'Opera of the wasteland', last: '' },
    { title: '軌跡', last: '' },
    { title: 'Neo-Aspect', last: '' },
    { title: 'Legendary', last: '' },
    { title: 'R', last: '' },
    { title: 'BRAVE JEWEL', last: '' },
    { title: 'Sanctuary', last: '' },
    { title: 'Safe and Sound', last: '' },
    { title: 'PASSIONATE ANTHEM', last: '' },
    { title: 'FIRE BIRD', last: '' },
    { title: 'Ringing Bloom', last: '' },
    { title: '約束', last: '' },
    { title: '"UNIONS" Road', last: '' },
    { title: 'Avant-garde HISTORY', last: '' },
    { title: 'Break your desire', last: '' },
    { title: 'Song I am.', last: '' },
    { title: 'ZEAL of proud', last: '' },
    { title: 'Blessing Chord', last: '' },
    { title: 'Proud of oneself', last: '' },
    { title: 'overtuRe', last: '' },
    { title: 'Sing Alive', last: '' },
    { title: 'Singing "OURS"', last: '' },
    { title: '雨上がりの夢', last: '' },
    { title: 'Keep Heart', last: '' },
    { title: 'Original Call', last: '' },
    { title: 'Sprechchor', last: '' },
    { title: '閃光', last: '' },
    { title: 'THE HISTORIC...', last: '' },
    { title: 'ROZEN HORIZON', last: '' },
    { title: 'Swear ～Night & Day～', last: '' },
    { title: 'Our Carol', last: '' },
    { title: 'THRONE OF ROSE', last: '' },
    { title: 'Dear Gleam', last: '' },
    { title: '一逢のFull Glory', last: '' },
    { title: 'VIOLET LINE', last: '' },
    { title: 'Call the shots', last: '' },
    { title: 'Sunlit Musical', last: '' },
    { title: 'Sage der Rosen', last: '' },
    { title: '覚悟のLiberation', last: '' },
    { title: 'Always recall.', last: '' },
    { title: 'Floral Haven', last: '' },
    { title: '礎の花冠', last: '' },
    { title: 'FRONTIER FANTASIA', last: '' },
    { title: 'Dazzle the Destiny', last: '' },
    { title: 'Grateful Melting', last: '' },
    { title: 'Requiem for Fate', last: '' },
    { title: 'Second to None', last: '' },
    { title: 'Steadfast Spirits', last: '' },
    { title: '紫炎', last: '' },
    { title: 'Fear Nothing', last: '' },
    { title: 'Talk to My Tone', last: '' },
    { title: 'XV', last: '' },
    { title: 'この蒼き闇と光', last: '' },
    { title: 'who we aRe', last: '' },
    { title: 'Resound the Way', last: '' },
    // { title: '', last: '' },
    // { title: '', last: '' },
    // { title: '', last: '' },
];

// カバー曲一覧（書き方は SONGS と同じ）
const COVER_SONGS = [
    { title: '魂のルフラン', last: '' },
    { title: '残酷な天使のテーゼ', last: '' },
    { title: 'ETERNAL BLAZE', last: '' },
    { title: 'シャルル', last: '' },
    { title: 'Shangri-La', last: '' },
    { title: 'This game', last: '' },
    { title: 'Hacking to the Gate', last: '' },
    { title: '深愛', last: '' },
    // { title: '', last: '' },
    // { title: '', last: '' },
    // { title: '', last: '' },
];
