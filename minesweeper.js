/* ═══════════════════════════════════════
   minesweeper.js — Retro Minesweeper
   ═══════════════════════════════════════ */

'use strict';

(function() {
  const ROWS = 9, COLS = 9, MINES = 10;
  let board = [], revealed = [], flagged = [], gameOver, gameWon;
  let timerInterval, timeElapsed, firstClick;
  let minesLeft;

  window.initMinesweeper = function() {
    clearInterval(timerInterval);
    timeElapsed = 0;
    firstClick = true;
    gameOver = false;
    gameWon = false;
    minesLeft = MINES;
    board = Array.from({length:ROWS}, () => Array(COLS).fill(0));
    revealed = Array.from({length:ROWS}, () => Array(COLS).fill(false));
    flagged  = Array.from({length:ROWS}, () => Array(COLS).fill(false));

    document.getElementById('mineCounter').textContent = minesLeft;
    document.getElementById('mineTimerVal').textContent = '0';
    const msg = document.getElementById('mineMessage');
    if (msg) { msg.style.display = 'none'; msg.className = 'mine-message'; }
    renderGrid();
  };

  function placeMines(safeR, safeC) {
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (board[r][c] !== -1 && !(Math.abs(r-safeR)<=1 && Math.abs(c-safeC)<=1)) {
        board[r][c] = -1;
        placed++;
      }
    }
    // Calculate numbers
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c] === -1) continue;
        let count = 0;
        forNeighbors(r, c, (nr, nc) => { if (board[nr][nc] === -1) count++; });
        board[r][c] = count;
      }
    }
  }

  function forNeighbors(r, c, fn) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) fn(nr, nc);
      }
    }
  }

  function renderGrid() {
    const grid = document.getElementById('mineGrid');
    if (!grid) return;
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        cell.dataset.r = r;
        cell.dataset.c = c;

        if (revealed[r][c]) {
          cell.classList.add('revealed');
          if (board[r][c] === -1) {
            cell.classList.add('mine');
            cell.textContent = '💣';
          } else if (board[r][c] > 0) {
            cell.textContent = board[r][c];
            cell.dataset.n = board[r][c];
            cell.classList.add('revealed');
          }
        } else if (flagged[r][c]) {
          cell.classList.add('covered', 'flagged');
          cell.textContent = '🚩';
        } else {
          cell.classList.add('covered');
        }

        cell.addEventListener('click', handleClick);
        cell.addEventListener('contextmenu', handleRightClick);
        grid.appendChild(cell);
      }
    }
  }

  function handleClick(e) {
    if (gameOver || gameWon) return;
    const r = parseInt(e.target.dataset.r);
    const c = parseInt(e.target.dataset.c);
    if (revealed[r][c] || flagged[r][c]) return;

    if (firstClick) {
      firstClick = false;
      placeMines(r, c);
      startTimer();
    }

    if (board[r][c] === -1) {
      revealAll();
      revealed[r][c] = true;
      gameOver = true;
      clearInterval(timerInterval);
      renderGrid();
      showMessage('💥 BOOM! Game Over. Click RESET to try again.', 'lose');
      return;
    }

    revealCell(r, c);
    renderGrid();
    checkWin();
  }

  function handleRightClick(e) {
    e.preventDefault();
    if (gameOver || gameWon) return;
    const r = parseInt(e.target.dataset.r);
    const c = parseInt(e.target.dataset.c);
    if (revealed[r][c]) return;
    flagged[r][c] = !flagged[r][c];
    minesLeft += flagged[r][c] ? -1 : 1;
    document.getElementById('mineCounter').textContent = minesLeft;
    renderGrid();
  }

  function revealCell(r, c) {
    if (revealed[r][c] || flagged[r][c]) return;
    revealed[r][c] = true;
    if (board[r][c] === 0) {
      forNeighbors(r, c, (nr, nc) => revealCell(nr, nc));
    }
  }

  function revealAll() {
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (board[r][c] === -1) revealed[r][c] = true;
  }

  function checkWin() {
    let unrevealed = 0;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (!revealed[r][c]) unrevealed++;
    if (unrevealed === MINES) {
      gameWon = true;
      clearInterval(timerInterval);
      showMessage(`🎉 YOU WIN! Cleared in ${timeElapsed}s. Nice work!`, 'win');
    }
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      timeElapsed++;
      const el = document.getElementById('mineTimerVal');
      if (el) el.textContent = timeElapsed;
    }, 1000);
  }

  function showMessage(text, type) {
    const msg = document.getElementById('mineMessage');
    if (!msg) return;
    msg.textContent = text;
    msg.className = `mine-message ${type}`;
    msg.style.display = 'block';
  }

  // Init on load
  window.addEventListener('load', () => {
    initMinesweeper();
  });

})();
