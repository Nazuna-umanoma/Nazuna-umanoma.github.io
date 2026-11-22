(() => {
  "use strict";

  const TARGET_TOTAL = 100;

  // DOM要素
  const poolBadge = document.getElementById("pool-badge");
  const viewStart = document.getElementById("view-start");
  const viewQuiz = document.getElementById("view-quiz");
  const viewResult = document.getElementById("view-result");

  const userNameInput = document.getElementById("user-name");
  const btnStart = document.getElementById("btn-start");

  const progressCount = document.getElementById("progress-count");
  const questionTag = document.getElementById("question-tag");
  const progressBar = document.getElementById("progress-bar");
  const questionText = document.getElementById("question-text");
  const setNote = document.getElementById("set-note");
  const answerInput = document.getElementById("answer-input");
  const formError = document.getElementById("form-error");
  const charCount = document.getElementById("char-count");
  const btnNext = document.getElementById("btn-next");
  const btnSkip = document.getElementById("btn-skip");
  const skipInfo = document.getElementById("skip-info");

  const btnResetConfirm = document.getElementById("btn-reset-confirm");
  const resetConfirmBox = document.getElementById("reset-confirm-box");
  const btnResetCancel = document.getElementById("btn-reset-cancel");
  const btnResetExec = document.getElementById("btn-reset-exec");

  const resultNameInput = document.getElementById("result-name-input");
  const btnRegenerate = document.getElementById("btn-regenerate");
  const btnDownload = document.getElementById("btn-download");
  const btnCopyText = document.getElementById("btn-copy-text");
  const copyToast = document.getElementById("copy-toast");
  const resultImage = document.getElementById("result-image");
  const btnRestart = document.getElementById("btn-restart");

  // セッション状態
  let state = {
    userName: "",
    answered: [],      // { id, text, answer, kind }
    pendingQueue: [],  // これから出題される質問の配列
    unusedPool: [],    // まだ使われていないランダムプールのユニット配列
    skippedCount: 0,
    lastDataUrl: ""
  };

  // 配列シャッフル（Fisher-Yates）
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // プール内の総質問数をカウント
  function countPoolQuestions(pool) {
    return pool.reduce((sum, item) => {
      if (item.type === "set" && Array.isArray(item.questions)) {
        return sum + item.questions.length;
      }
      return sum + 1;
    }, 0);
  }

  // プールユニットを質問オブジェクトの配列に展開
  function expandUnit(unit) {
    if (unit.type === "set" && Array.isArray(unit.questions)) {
      const total = unit.questions.length;
      return unit.questions.map((qText, idx) => ({
        id: `${unit.id}-${idx + 1}`,
        text: qText,
        kind: "set",
        setId: unit.id,
        setIndex: idx + 1,
        setTotal: total
      }));
    }
    return [{
      id: unit.id,
      text: unit.text,
      kind: "random",
      setId: null
    }];
  }

  // unusedPool から maxNeeded 問以下に収まるユニットを1つ取り出す
  function popFittingUnit(maxNeeded) {
    for (let i = 0; i < state.unusedPool.length; i++) {
      const unit = state.unusedPool[i];
      const len = unit.type === "set" ? unit.questions.length : 1;
      if (len <= maxNeeded) {
        state.unusedPool.splice(i, 1);
        return expandUnit(unit);
      }
    }
    return null;
  }

  // 質問キューを初期構築する
  function initSession() {
    const firstList = QUESTION100_DATA.fixedFirst.map((q, idx) => ({
      id: q.id,
      text: q.text,
      kind: "fixed-first",
      fixedOrder: idx + 1,
      setId: null
    }));

    const lastItem = {
      id: QUESTION100_DATA.fixedLast.id,
      text: QUESTION100_DATA.fixedLast.text,
      kind: "fixed-last",
      setId: null
    };

    state.unusedPool = shuffle(QUESTION100_DATA.pool);
    state.answered = [];
    state.skippedCount = 0;

    const middleQueue = [];
    const middleTarget = TARGET_TOTAL - firstList.length - 1; // 94問

    while (middleQueue.length < middleTarget) {
      const remaining = middleTarget - middleQueue.length;
      const picked = popFittingUnit(remaining);
      if (!picked) break;
      middleQueue.push(...picked);
    }

    state.pendingQueue = [...firstList, ...middleQueue, lastItem];
  }

  // 画面切り替え
  function showView(targetView) {
    viewStart.hidden = targetView !== "start";
    viewQuiz.hidden = targetView !== "quiz";
    viewResult.hidden = targetView !== "result";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 残り予備質問数を計算
  function getRemainingReserveCount() {
    return countPoolQuestions(state.unusedPool);
  }

  // 現在の質問を描画
  function renderCurrentQuestion() {
    const current = state.pendingQueue[0];
    if (!current) {
      finishQuiz();
      return;
    }

    const currentNumber = state.answered.length + 1;
    progressCount.textContent = `${currentNumber} / ${TARGET_TOTAL}`;
    progressBar.style.width = `${(currentNumber / TARGET_TOTAL) * 100}%`;

    // タグ表示
    if (current.kind === "fixed-first") {
      questionTag.textContent = "最初の固定質問";
    } else if (current.kind === "fixed-last") {
      questionTag.textContent = "最後の質問";
    } else if (current.kind === "set") {
      questionTag.textContent = `セット質問 ${current.setIndex}/${current.setTotal}`;
    } else {
      questionTag.textContent = "ランダム質問";
    }

    // セット質問の補足表示
    if (current.kind === "set") {
      if (current.setIndex === 1) {
        setNote.textContent = "※ この質問には続けて関連質問が出題されます（スキップ時はまとめてスキップされます）。";
      } else {
        setNote.textContent = "※ 前の質問とセットの関連質問です。";
      }
      setNote.hidden = false;
    } else {
      setNote.hidden = true;
    }

    questionText.textContent = `Q${currentNumber}. ${current.text}`;
    answerInput.value = "";
    charCount.textContent = "0 / 200";
    formError.hidden = true;
    resetConfirmBox.hidden = true;

    // スキップ可否の判定
    const reserveCount = getRemainingReserveCount();
    // 現在の質問（セットなら後続も含む）を取り除いたとき、何問補充が必要か計算
    let removeCount = 1;
    if (current.setId) {
      while (
        removeCount < state.pendingQueue.length &&
        state.pendingQueue[removeCount].setId === current.setId
      ) {
        removeCount++;
      }
    }

    const canSkip = canRefill(removeCount);
    btnSkip.disabled = !canSkip;
    skipInfo.textContent = canSkip
      ? `スキップ済み：${state.skippedCount}問（予備質問 残り約${reserveCount}問）`
      : "予備の質問を使い切ったため、これ以上スキップできません。";

    btnNext.textContent = currentNumber === TARGET_TOTAL ? "回答を完了して画像を作る" : "次へ進む";
    answerInput.focus();
  }

  // 指定数だけ unusedPool から補充可能かシミュレーション判定
  function canRefill(needed) {
    if (needed <= 0) return true;
    const tempLengths = state.unusedPool.map((u) => (u.type === "set" ? u.questions.length : 1));
    let rem = needed;
    for (let i = 0; i < tempLengths.length && rem > 0; i++) {
      if (tempLengths[i] <= rem) {
        rem -= tempLengths[i];
      }
    }
    return rem === 0;
  }

  // 次へ進む（回答を確定）
  function handleNext() {
    const val = answerInput.value.trim();
    if (!val) {
      formError.textContent = "回答を入力するか、答えない場合はスキップを押してください。";
      formError.hidden = false;
      answerInput.focus();
      return;
    }

    const current = state.pendingQueue.shift();
    state.answered.push({
      id: current.id,
      text: current.text,
      answer: val,
      kind: current.kind
    });

    if (state.answered.length >= TARGET_TOTAL || state.pendingQueue.length === 0) {
      finishQuiz();
    } else {
      renderCurrentQuestion();
    }
  }

  // スキップして別の質問を補充
  function handleSkip() {
    const current = state.pendingQueue[0];
    if (!current) return;

    // セット質問の場合は同じ setId を持つ後続質問もまとめて取り除く
    let removeCount = 1;
    if (current.setId) {
      while (
        removeCount < state.pendingQueue.length &&
        state.pendingQueue[removeCount].setId === current.setId
      ) {
        removeCount++;
      }
    }

    if (!canRefill(removeCount)) {
      formError.textContent = "予備の質問が足りないため、この質問はスキップできません。";
      formError.hidden = false;
      return;
    }

    // キューから削除
    state.pendingQueue.splice(0, removeCount);
    state.skippedCount += removeCount;

    // 最後の固定質問（fixed-last）の位置を特定し、その直前に新しい質問を挿入する
    let insertPos = state.pendingQueue.findIndex((q) => q.kind === "fixed-last");
    if (insertPos === -1) {
      insertPos = state.pendingQueue.length;
    }

    let remaining = removeCount;
    const addedItems = [];
    while (remaining > 0) {
      const picked = popFittingUnit(remaining);
      if (!picked) break;
      addedItems.push(...picked);
      remaining -= picked.length;
    }

    state.pendingQueue.splice(insertPos, 0, ...addedItems);
    renderCurrentQuestion();
  }

  // 完了処理
  function finishQuiz() {
    resultNameInput.value = state.userName;
    copyToast.hidden = true;
    generateResultImage();
    showView("result");
  }

  // Canvas で100問の回答画像を生成（2カラムレイアウト）
  function generateResultImage() {
    const displayName = state.userName.trim();
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

    const W = 1600;
    const padX = 56;
    const headerH = 190;
    const footerH = 84;
    const colGap = 40;
    const colW = (W - padX * 2 - colGap) / 2;
    const cardPadX = 20;
    const cardPadY = 16;
    const innerW = colW - cardPadX * 2;

    // 計測用の一時Canvasコンテキスト
    const measureCanvas = document.createElement("canvas");
    const mCtx = measureCanvas.getContext("2d");

    const qFont = '700 19px "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif';
    const aFont = '400 18px "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif';
    const qLineH = 28;
    const aLineH = 27;

    function wrapText(ctx, text, maxWidth, font) {
      ctx.font = font;
      const lines = [];
      const paragraphs = String(text).split(/\r?\n/);
      for (const para of paragraphs) {
        if (para === "") {
          lines.push("");
          continue;
        }
        let line = "";
        for (const ch of para) {
          const testLine = line + ch;
          if (ctx.measureText(testLine).width > maxWidth && line !== "") {
            lines.push(line);
            line = ch;
          } else {
            line = testLine;
          }
        }
        if (line) lines.push(line);
      }
      return lines;
    }

    // 100問を左右2列（各50問）に分割し、それぞれの高さを事前計算
    const half = Math.ceil(state.answered.length / 2);
    const leftItems = state.answered.slice(0, half);
    const rightItems = state.answered.slice(half);

    function prepareColumn(items, startIndex) {
      let totalH = 0;
      const prepared = items.map((item, idx) => {
        const num = startIndex + idx + 1;
        const qLines = wrapText(mCtx, `Q${num}. ${item.text}`, innerW, qFont);
        const aLines = wrapText(mCtx, `A. ${item.answer}`, innerW, aFont);
        const boxH = cardPadY * 2 + qLines.length * qLineH + 8 + aLines.length * aLineH;
        const entry = { qLines, aLines, boxH };
        totalH += boxH + 14;
        return entry;
      });
      return { prepared, totalH };
    }

    const leftCol = prepareColumn(leftItems, 0);
    const rightCol = prepareColumn(rightItems, half);
    const bodyH = Math.max(leftCol.totalH, rightCol.totalH);
    const H = headerH + bodyH + footerH;

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // 背景
    ctx.fillStyle = "#f4f7fb";
    ctx.fillRect(0, 0, W, H);

    // ヘッダー帯
    ctx.fillStyle = "#2a5280";
    ctx.fillRect(0, 0, W, headerH - 24);

    // ヘッダー装飾ライン
    ctx.fillStyle = "#6ea8e5";
    ctx.fillRect(0, headerH - 24, W, 6);

    // タイトル・名前・日付
    ctx.fillStyle = "#ffffff";
    ctx.font = '700 44px "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif';
    ctx.fillText("100の質問", padX, 74);

    ctx.font = '500 24px "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif';
    ctx.fillStyle = "#dce8f7";
    const subText = displayName ? `回答者：${displayName}` : "回答結果まとめ";
    ctx.fillText(subText, padX, 122);

    ctx.textAlign = "right";
    ctx.font = '400 20px "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif';
    ctx.fillText(`回答日：${dateStr}`, W - padX, 122);
    ctx.textAlign = "left";

    // 角丸矩形描画ヘルパー
    function fillRoundRect(x, y, w, h, r, fill, stroke) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // カラム描画
    function drawColumn(colData, xStart) {
      let y = headerH;
      for (const item of colData.prepared) {
        fillRoundRect(xStart, y, colW, item.boxH, 12, "#ffffff", "#dbe4f0");

        let textY = y + cardPadY + 19;
        ctx.font = qFont;
        ctx.fillStyle = "#2a5280";
        for (const line of item.qLines) {
          ctx.fillText(line, xStart + cardPadX, textY);
          textY += qLineH;
        }

        textY += 8;
        ctx.font = aFont;
        ctx.fillStyle = "#222933";
        for (const line of item.aLines) {
          ctx.fillText(line, xStart + cardPadX, textY);
          textY += aLineH;
        }

        y += item.boxH + 14;
      }
    }

    drawColumn(leftCol, padX);
    drawColumn(rightCol, padX + colW + colGap);

    // フッター
    ctx.fillStyle = "#6c7a89";
    ctx.font = '400 18px "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("100の質問 / 凪不凪（ナズナ）", W / 2, H - 34);
    ctx.textAlign = "left";

    state.lastDataUrl = canvas.toDataURL("image/png");
    resultImage.src = state.lastDataUrl;
  }

  // 画像ダウンロード
  function downloadResultImage() {
    if (!state.lastDataUrl) return;
    const safeName = state.userName.trim().replace(/[\\/:*?"<>|]/g, "_");
    const filename = safeName ? `question100_${safeName}.png` : "question100_result.png";
    const a = document.createElement("a");
    a.href = state.lastDataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // テキストコピー
  function copyResultText() {
    const header = state.userName.trim()
      ? `【100の質問】回答者：${state.userName.trim()}\n\n`
      : "【100の質問】\n\n";
    const body = state.answered
      .map((item, idx) => `Q${idx + 1}. ${item.text}\nA. ${item.answer}`)
      .join("\n\n");
    const fullText = header + body;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(
        () => showCopyToast("回答テキストをクリップボードにコピーしました。"),
        () => fallbackCopy(fullText)
      );
    } else {
      fallbackCopy(fullText);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showCopyToast("回答テキストをクリップボードにコピーしました。");
    } catch (_e) {
      showCopyToast("コピーに失敗しました。");
    }
    document.body.removeChild(ta);
  }

  function showCopyToast(msg) {
    copyToast.textContent = msg;
    copyToast.hidden = false;
  }

  // イベント登録
  function bindEvents() {
    const totalPoolCount =
      QUESTION100_DATA.fixedFirst.length +
      1 +
      countPoolQuestions(QUESTION100_DATA.pool);
    poolBadge.textContent = `収録質問数 ${totalPoolCount}問`;

    btnStart.addEventListener("click", () => {
      state.userName = userNameInput.value.trim();
      initSession();
      showView("quiz");
      renderCurrentQuestion();
    });

    answerInput.addEventListener("input", () => {
      charCount.textContent = `${answerInput.value.length} / 200`;
      if (!formError.hidden && answerInput.value.trim()) {
        formError.hidden = true;
      }
    });

    // Ctrl+Enter / Cmd+Enter で次へ進めるショートカット
    answerInput.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleNext();
      }
    });

    btnNext.addEventListener("click", handleNext);
    btnSkip.addEventListener("click", handleSkip);

    btnResetConfirm.addEventListener("click", () => {
      resetConfirmBox.hidden = false;
    });

    btnResetCancel.addEventListener("click", () => {
      resetConfirmBox.hidden = true;
    });

    btnResetExec.addEventListener("click", () => {
      showView("start");
    });

    btnRegenerate.addEventListener("click", () => {
      state.userName = resultNameInput.value.trim();
      generateResultImage();
    });

    btnDownload.addEventListener("click", downloadResultImage);
    btnCopyText.addEventListener("click", copyResultText);

    btnRestart.addEventListener("click", () => {
      userNameInput.value = state.userName;
      showView("start");
    });
  }

  bindEvents();
})();
