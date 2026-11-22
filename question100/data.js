/**
 * 100の質問 質問データ
 * --------------------------------------------------
 * 新しく質問を追加・編集したい場合は、このファイルのみを編集してください。
 *
 * - fixedFirst : 最初に必ず出題される5問（順番固定）
 * - fixedLast  : 最後に必ず出題される1問
 * - pool       : ランダム枠用の質問プール（合計100問以上推奨）
 *   - type: "single" -> 単独質問（text を指定）
 *   - type: "set"    -> セット質問（questions 配列に連続で出題したい質問を指定）
 */
const QUESTION100_DATA = {
  fixedFirst: [
    { id: "first-1", text: "出身地は？（ざっくりでも嘘でもOK）" },
    { id: "first-2", text: "この100の質問を始めたきっかけは？" },
    { id: "first-3", text: "最近のマイブームは？" },
    { id: "first-4", text: "今食べたいものは？" },
    { id: "first-5", text: "名前(ハンドルネーム)の由来は？" }
  ],

  fixedLast: {
    id: "last-1",
    text: "100問お疲れさまでした！今の感想や、見てくれた人へひとこと！"
  },

  pool: [
    // ===== セット質問（15組 = 30問） =====
    {
      id: "set-01",
      type: "set",
      questions: [
        "一番好きなアーティスト・クリエイターは誰ですか？",
        "そのアーティスト・クリエイターが好きな理由は？"
      ]
    },
    {
      id: "set-02",
      type: "set",
      questions: [
        "人生で一番心に残っている本を1つ挙げるなら？",
        "その作品のおすすめポイントは？"
      ]
    },
    {
      id: "set-03",
      type: "set",
      questions: [
        "今一番行ってみたい場所（国内・海外問わず）はどこ？",
        "そこに行ったらまず何をしたい？"
      ]
    },
    {
      id: "set-04",
      type: "set",
      questions: [
        "人生で一番印象に残っているライブ・イベントは？",
        "そのときの思い出は？。"
      ]
    },
    {
      id: "set-05",
      type: "set",
      questions: [
        "一番好きな観光地は？",
        "それにまつわるこだわりはある？"
      ]
    },
    {
      id: "set-06",
      type: "set",
      questions: [
        "今年一番買って良かったものは？",
        "どんなところが気に入ってる？"
      ]
    },
    {
      id: "set-07",
      type: "set",
      questions: [
        "これまでで一番熱中した趣味やゲームは何ですか？",
        "その趣味で一番楽しかった思い出は？"
      ]
    },
    {
      id: "set-08",
      type: "set",
      questions: [
        "推しているキャラクター・人物がいたら教えてください。",
        "その推しを好きになったきっかけは何ですか？"
      ]
    },
    {
      id: "set-09",
      type: "set",
      questions: [
        "もし1つだけ魔法や特殊能力が使えるなら、どんな力が欲しい？",
        "その能力を手に入れたら最初に何に使いますか？"
      ]
    },
    {
      id: "set-10",
      type: "set",
      questions: [
        "今までで一番緊張した出来事は何ですか？",
        "そのときどうやって乗り越えましたか？"
      ]
    },
    {
      id: "set-11",
      type: "set",
      questions: [
        "自分の手元にひとつしか音楽アルバムを残せないとしたら、何を選ぶ？",
        "その中のおすすめの一曲は？"
      ]
    },
    {
      id: "set-12",
      type: "set",
      questions: [
        "よく聴くプレイリストや作業用BGMのジャンルは？",
        "特におすすめの1曲があれば教えてください。"
      ]
    },
    {
      id: "set-13",
      type: "set",
      questions: [
        "好きな飲食チェーン店は？",
        "そこのおすすめメニューは？"
      ]
    },
    {
      id: "set-14",
      type: "set",
      questions: [
        "行くなら過去？それとも未来？",
        "どの時代へ行って何をしたい？"
      ]
    },
    {
      id: "set-15",
      type: "set",
      questions: [
        "今年中に達成したい小さな目標を1つ教えてください。",
        "そのためにまず何から始めますか？"
      ]
    },
        {
      id: "set-16",
      type: "set",
      questions: [
        "好きな漫画を1つ挙げるなら？",
        "その作品のおすすめポイントは？"
      ]
    },
        {
      id: "set-17",
      type: "set",
      questions: [
        "心に残った映画を1つ挙げるなら？",
        "その作品のおすすめポイントは？"
      ]
    },
    //     {
    //   id: "set-",
    //   type: "set",
    //   questions: [
    //     "",
    //     ""
    //   ]
    // },

    // ===== 単独質問（95問） =====
    { id: "q-001", type: "single", text: "朝型ですか？夜型ですか？" },
    { id: "q-002", type: "single", text: "インドア派？アウトドア派？" },
    { id: "q-003", type: "single", text: "犬派？猫派？それとも別の動物派？" },
    { id: "q-004", type: "single", text: "コーヒー派？紅茶派？緑茶派？" },
    { id: "q-005", type: "single", text: "朝はごはん派？パン派？" },
    { id: "q-006", type: "single", text: "きのこの山とたけのこの里、どっち派？" },
    { id: "q-007", type: "single", text: "好きな色は何色ですか？" },
    { id: "q-008", type: "single", text: "苦手な食べ物や飲み物はありますか？" },
    { id: "q-009", type: "single", text: "毎日欠かさずやっているルーティンは？" },
    { id: "q-010", type: "single", text: "スマホのホーム画面、こだわりのポイントは？" },
    { id: "q-011", type: "single", text: "平均の睡眠時間は何時間くらい？" },
    { id: "q-012", type: "single", text: "今の自分が「これだけは譲れない」と思っていることは？" },
    { id: "q-013", type: "single", text: "雨の日、好きですか？嫌いですか？" },
    { id: "q-014", type: "single", text: "夏と冬、どちらかと言えばどちらが好き？" },
    { id: "q-015", type: "single", text: "海と山、行くならどっち？" },
    { id: "q-016", type: "single", text: "コンビニでついつい買ってしまうものは？" },
    { id: "q-017", type: "single", text: "自炊はよくする方ですか？得意料理は？" },
    { id: "q-018", type: "single", text: "ラーメンは何味（醤油・味噌・塩・豚骨など）が好き？" },
    { id: "q-019", type: "single", text: "お寿司で最初に頼むネタは？" },
    { id: "q-020", type: "single", text: "甘党？辛党？" },
    { id: "q-021", type: "single", text: "アイスクリームのフレーバー、何が好き？" },
    { id: "q-022", type: "single", text: "好きなおにぎりの具は？" },
    { id: "q-023", type: "single", text: "お風呂はシャワー派？湯船に浸かる派？" },
    { id: "q-024", type: "single", text: "自分の性格で「長所だな」と思うところは？" },
    { id: "q-025", type: "single", text: "自分の性格で「短所だな」と思うところは？" },
    { id: "q-026", type: "single", text: "周りの人からよく言われる印象は？" },
    { id: "q-027", type: "single", text: "初対面の人と話すのは得意？苦手？" },
    { id: "q-028", type: "single", text: "計画を立てて行動するタイプ？行き当たりばったりタイプ？" },
    { id: "q-029", type: "single", text: "買い物は即決派？じっくり悩む派？" },
    { id: "q-030", type: "single", text: "LINEやSNSの返信は早い方？ゆっくりな方？" },
    { id: "q-031", type: "single", text: "ストレスが溜まったときの解消法は？" },
    { id: "q-032", type: "single", text: "落ち込んだとき、どうやって立ち直りますか？" },
    { id: "q-033", type: "single", text: "最近大笑いした出来事は何ですか？" },
    { id: "q-034", type: "single", text: "最近ちょっとだけ感動したことは？" },
    { id: "q-035", type: "single", text: "小さな幸せを感じる瞬間はどんなとき？" },
    { id: "q-036", type: "single", text: "もし100万円が急に手に入ったら何に使う？" },
    { id: "q-037", type: "single", text: "もし1週間お休みがもらえたらどう過ごす？" },
    { id: "q-038", type: "single", text: "タイムマシンがあったら過去と未来どっちに行きたい？" },
    { id: "q-039", type: "single", text: "無人島に1つだけ持っていけるとしたら何を持っていく？" },
    { id: "q-040", type: "single", text: "生まれ変わるとしたら何になりたい？" },
    { id: "q-041", type: "single", text: "今年中に達成したい小さな目標を1つ教えてください。" },
    { id: "q-042", type: "single", text: "カラオケにはよく行く？" },
    { id: "q-043", type: "single", text: "学生時代に好きだった教科・嫌いだった教科は？" },
    { id: "q-044", type: "single", text: "部活や習い事は何をしていましたか？" },
    { id: "q-045", type: "single", text: "今までに一番頑張ったと思うことは何ですか？" },
    { id: "q-046", type: "single", text: "今、新しく始めてみたいことや学んでみたいことは？" },
    { id: "q-047", type: "single", text: "特技やちょっとした自慢があれば教えてください。" },
    { id: "q-048", type: "single", text: "逆に、どうしても苦手なことや克服したいことは？" },
    { id: "q-049", type: "single", text: "一番落ち着く場所はどこですか？" },
    { id: "q-050", type: "single", text: "部屋のインテリアやデスク周りでこだわっている点は？" },
    { id: "q-051", type: "single", text: "ついつい集めてしまうコレクションはありますか？" },
    { id: "q-052", type: "single", text: "いつも持ち歩いているバッグの中身を3つ挙げると？" },
    { id: "q-053", type: "single", text: "ファッションでよく選ぶ色やスタイルは？" },
    { id: "q-054", type: "single", text: "スニーカー派？革靴・ブーツ・パンプス派？" },
    { id: "q-055", type: "single", text: "メガネやアクセサリーはよく身につけますか？" },
    { id: "q-056", type: "single", text: "好きな香り（香水・柔軟剤・アロマなど）はありますか？" },
    { id: "q-057", type: "single", text: "旅行は「観光詰め込み派」？「のんびり滞在派」？" },
    { id: "q-058", type: "single", text: "移動時間（電車や飛行機）はどう過ごすことが多い？" },
    { id: "q-059", type: "single", text: "夜景と朝焼け、見るならどっちが好き？" },
    { id: "q-060", type: "single", text: "映画館では前の方の席？真ん中？後ろの方？" },
    { id: "q-061", type: "single", text: "映画は字幕派？吹き替え派？" },
    { id: "q-062", type: "single", text: "読書は紙の本派？電子書籍派？" },
    { id: "q-063", type: "single", text: "YouTubeや配信でよく見るジャンルは何ですか？" },
    { id: "q-064", type: "single", text: "SNSは見る専門？発信するのも好き？" },
    { id: "q-065", type: "single", text: "写真を撮るのは好きですか？よく撮る被写体は？" },
    { id: "q-066", type: "single", text: "文章を書くのと、絵を描くの、どっちが好き？" },
    { id: "q-067", type: "single", text: "夜、寝る前に考えがちなことは何ですか？" },
    { id: "q-068", type: "single", text: "「これがあるとテンションが上がる！」というものは？" },
    { id: "q-069", type: "single", text: "自分へのご褒美によく選ぶものは何ですか？" },
    { id: "q-070", type: "single", text: "「大人になったな」と感じた瞬間はありますか？" },
    { id: "q-071", type: "single", text: "今でもちょっと子どもっぽいなと思う自分の部分は？" },
    { id: "q-072", type: "single", text: "占いやおみくじは気にする方ですか？" },
    { id: "q-073", type: "single", text: "UFOや幽霊、超常現象は信じますか？" },
    { id: "q-074", type: "single", text: "好きな動物・生き物は何ですか？" },
    { id: "q-075", type: "single", text: "好きなお花や植物はありますか？" },
    { id: "q-076", type: "single", text: "一番好きな時間帯（早朝、昼、夕方、深夜など）は？" },
    { id: "q-077", type: "single", text: "一番好きな曜日とその理由は？" },
    { id: "q-078", type: "single", text: "今、一番会いたい人は誰ですか？" },
    { id: "q-079", type: "single", text: "尊敬している人や憧れの人はいますか？" },
    { id: "q-080", type: "single", text: "今年中に達成したい小さな目標を1つ教えてください。" },
    { id: "q-081", type: "single", text: "遊園地はよく行く？好きな場所やアトラクションは？" },
    { id: "q-082", type: "single", text: "ちょっとした「自分のマイルール」を1つ教えてください。" },
    { id: "q-083", type: "single", text: "最近覚えた豆知識や、へぇ〜と思ったことは？" },
    { id: "q-084", type: "single", text: "もし1日だけ誰かと入れ替われるなら誰になってみたい？" },
    { id: "q-085", type: "single", text: "10年後の自分はどうなっていると思いますか？" },
    { id: "q-086", type: "single", text: "死ぬまでに一度はやってみたいことは何ですか？" },
    { id: "q-087", type: "single", text: "最近見た夢で覚えているものはありますか？" },
    { id: "q-088", type: "single", text: "スマホのカメラロールで一番古い写真はどんな写真？" },
    { id: "q-089", type: "single", text: "つい口癖になってしまう言葉はありますか？" },
    { id: "q-090", type: "single", text: "好きな絵文字・顔文字を1つ挙げるとしたら？" },
    { id: "q-091", type: "single", text: "好きなイベントや季節の行事は？" },
    { id: "q-092", type: "single", text: "好きな言葉や座右の銘は？" },
    { id: "q-093", type: "single", text: "朝起きて最初にすることは何ですか？" },
    { id: "q-094", type: "single", text: "今、目の前にあるものを1つ教えてください。" },
    { id: "q-095", type: "single", text: "今日の調子を100点満点で表すと何点？" }
    // { id: "q-096", type: "single", text: "" },
    // { id: "q-097", type: "single", text: "" },
    // { id: "q-098", type: "single", text: "" },
    // { id: "q-099", type: "single", text: "" },
    // { id: "q-100", type: "single", text: "" },
    // { id: "q-101", type: "single", text: "" },

  ]
};
