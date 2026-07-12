小説投稿／編集テンプレートと使い方

概要
- このフォルダにあるテンプレートは「プログラムを書き換えずに」ではなく、手動でファイルを追加・編集して投稿するための雛形です。
- 追加する作業は主に 2 つ：
  1) 章ファイル（novels/chapters/）の作成（本文）
  2) 小説メタデータ（novels/novels-list.json）への作品オブジェクトの追加／編集

追加手順（ステップ）
1) 新しい作品の id を決める
   - 現行の novels/novels-list.json を開き、"novels" 配列内の最大 id を確認し、+1 が新しい id になります（例：最大が 2 なら新作は 3）。

2) 章ファイルを作る
   - テンプレートをコピー： novels/templates/chapter-template.txt をコピーし、内容を編集して保存します。
   - ファイル名のルール例： story-00X-chY.txt（X = 作品番号、Y = 章番号）
   - 保存場所： novels/chapters/<fileName>
   - 注意：本文はプレーンテキストです。HTML タグは表示時にエスケープされます（装飾したい場合は別途スクリプト変更が必要）。

3) novels-list.json に作品エントリを追加
   - テンプレート： novels/templates/novel-entry-template.json を参考に、必要項目（id, title, author, description, genre, tags, wordCount, publishedDate, updatedDate, status, chapters）を埋めてください。
   - chapters[].fileName が 2) で作ったファイル名と一致していることを確認してください。
   - 既存の "novels" 配列の末尾（または適切な位置）にカンマで区切って追加します。
   - JSON 構文エラーを避けるため、編集後は JSON 検証（オンラインの JSON バリデータ等）でチェックすることを推奨します。

4) commit と push
- GitHub Web UI で行う方法（簡単）
  - リポジトリ → 該当フォルダ（novels/chapters または novels/）に移動 → "Add file" → "Create new file" で新しいファイルを作成し、内容を貼り付けてコミットします。
  - novels-list.json の編集はファイルを開いて "Edit" → 変更 → 下部でコミットメッセージを入力して Commit します。

- ローカル Git を使う方法
  - ファイルを追加/編集したら：
    git add novels/chapters/<fileName> novels/novels-list.json
    git commit -m "Add novel: <作品タイトル>"
    git push origin main

5) 反映確認
- 数十秒〜数分で GitHub Pages に反映されます。
- 作品一覧: https://nazuna-umanoma.github.io/novels/
- 作品ページ: https://nazuna-umanoma.github.io/novels/story.html?id=<id>

注意点
- fileName のミス（スペル／大文字小文字）に注意してください。
- wordCount は表示用です。厳密な自動計算はしていないので、必要なら事前に文字数を数えて更新してください（エディタや wc コマンド等で）。
- publishedDate と updatedDate は ISO 形式（YYYY-MM-DD）で入力してください。
- JSON の配列内でのカンマ抜けや余剰カンマに注意。構文エラーがあると一覧が表示されなくなります。

サンプル（最小動作例）
1) 章ファイル
  保存先: novels/chapters/story-003-ch1.txt
  中身:
    第一章　プロローグ

    （本文）

2) novels-list.json に追加するオブジェクト（サンプル）
  {
    "id": 3,
    "title": "サンプル作品",
    "author": "凪不凪",
    "description": "表示確認用のサンプル作品です。",
    "genre": "短編",
    "tags": ["テスト"],
    "wordCount": 500,
    "publishedDate": "2026-07-12",
    "updatedDate": "2026-07-12",
    "status": "完結",
    "chapters": [
      { "id": 1, "title": "第一章", "fileName": "story-003-ch1.txt" }
    ]
  }

トラブルシューティング
- 表示されない場合:
  - novels-list.json の JSON 構文エラーを疑ってください（最も多い原因）。
  - ブラウザのキャッシュをクリアして再読み込み（Ctrl/Cmd+Shift+R）。
  - ファイル名のパスが正しいか確認（novels/chapters/ に置かれているか）。

さらに手伝えること
- あなたの代わりにテンプレートを使って新作を追加してコミットすることができます。投稿本文をここに送ってください。
- あるいは、novels-list.json を作品ごとにファイル分割する自動スクリプトを作ることも可能です（将来的に管理が楽になります）。

---
テンプレートを追加しました。次は「実際にテンプレートを使って新作を追加してほしい」か「手順のどの部分を詳しく説明してほしいか」を教えてください。
