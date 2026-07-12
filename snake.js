/* ═══════════════════════════════════════
   snake.js — Retro Snake Game
   ═══════════════════════════════════════ */

'use strict';

(function() {
  const CELL = 20;
  let canvas, ctx;
  let snake, dir, nextDir, food, score, running, loopId;

  const COLORS = {
    bg:     '#0d0e17',
    grid:   '#12131f',
    snake:  '#9ece6a',
    snakeH: '#c3e88d',
    eye:    '#0d0e17',
    food:   '#f7768e',
    text:   '#c0caf5',
  };

  function init() {
    canvas = document.getElementById('snakeCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    const area = document.getElementById('snakeArea');
    // Make canvas fill area
    const size = area ? Math.min(area.clientWidth || 340, 340) : 340;
    canvas.width = size; canvas.height = size;
  }

  function cols() { return Math.floor(canvas.width  / CELL); }
  function rows() { return Math.floor(canvas.height / CELL); }

  window.startSnake = function() {
    init();
    const W = cols(), H = rows();
    snake = [{ x: Math.floor(W/2), y: Math.floor(H/2) }];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    running = true;
    document.getElementById('snakeScore').textContent = 'Score: 0';
    // Hide overlay
    const overlay = document.getElementById('snakeOverlay');
    if (overlay) overlay.style.display = 'none';
    placeFood();
    if (loopId) clearInterval(loopId);
    loopId = setInterval(tick, 130);
  };

  window.pauseSnake = function() {
    running = false;
    if (loopId) clearInterval(loopId);
  };

  window.snakeDir = function(dx, dy) {
    // Prevent reversing
    if (dx !== 0 && dir.x !== 0) return;
    if (dy !== 0 && dir.y !== 0) return;
    nextDir = { x: dx, y: dy };
  };

  function placeFood() {
    const W = cols(), H = rows();
    let pos;
    do {
      pos = { x: Math.floor(Math.random()*W), y: Math.floor(Math.random()*H) };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    food = pos;
  }

  function tick() {
    if (!running) return;
    dir = { ...nextDir };
    const W = cols(), H = rows();
    const head = { x: (snake[0].x + dir.x + W) % W, y: (snake[0].y + dir.y + H) % H };

    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      gameOver(); return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      document.getElementById('snakeScore').textContent = `Score: ${score}`;
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function gameOver() {
    running = false;
    clearInterval(loopId);
    drawGameOver();
    setTimeout(() => {
      const overlay = document.getElementById('snakeOverlay');
      if (overlay) {
        overlay.style.display = 'flex';
        const btn = overlay.querySelector('.retro-btn');
        if (btn) btn.textContent = `[ PLAY AGAIN — Score: ${score} ]`;
      }
    }, 600);
  }

  function draw() {
    if (!ctx) return;
    const W = cols(), H = rows();
    // Background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x++) {
      ctx.beginPath(); ctx.moveTo(x*CELL, 0); ctx.lineTo(x*CELL, H*CELL); ctx.stroke();
    }
    for (let y = 0; y <= H; y++) {
      ctx.beginPath(); ctx.moveTo(0, y*CELL); ctx.lineTo(W*CELL, y*CELL); ctx.stroke();
    }

    // Food (pulsing effect via drawing a circle)
    const fx = food.x * CELL + CELL/2;
    const fy = food.y * CELL + CELL/2;
    ctx.fillStyle = COLORS.food;
    ctx.beginPath();
    ctx.arc(fx, fy, CELL/2 - 2, 0, Math.PI*2);
    ctx.fill();
    // glow
    ctx.shadowColor = COLORS.food;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(fx, fy, CELL/2 - 3, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake body
    snake.forEach((seg, i) => {
      const sx = seg.x * CELL + 1;
      const sy = seg.y * CELL + 1;
      const sw = CELL - 2;
      const rr = 4;
      ctx.fillStyle = i === 0 ? COLORS.snakeH : COLORS.snake;
      // Rounded rect
      ctx.beginPath();
      ctx.moveTo(sx + rr, sy);
      ctx.lineTo(sx + sw - rr, sy);
      ctx.quadraticCurveTo(sx + sw, sy, sx + sw, sy + rr);
      ctx.lineTo(sx + sw, sy + sw - rr);
      ctx.quadraticCurveTo(sx + sw, sy + sw, sx + sw - rr, sy + sw);
      ctx.lineTo(sx + rr, sy + sw);
      ctx.quadraticCurveTo(sx, sy + sw, sx, sy + sw - rr);
      ctx.lineTo(sx, sy + rr);
      ctx.quadraticCurveTo(sx, sy, sx + rr, sy);
      ctx.closePath();
      ctx.fill();

      // Eyes on head
      if (i === 0) {
        ctx.fillStyle = COLORS.eye;
        const eyeOffset = 4;
        let ex1, ey1, ex2, ey2;
        if (dir.x === 1)  { ex1 = sx+sw-4; ey1 = sy+eyeOffset;   ex2 = sx+sw-4; ey2 = sy+sw-eyeOffset-2; }
        else if (dir.x===-1){ ex1 = sx+3;   ey1 = sy+eyeOffset;   ex2 = sx+3;    ey2 = sy+sw-eyeOffset-2; }
        else if (dir.y === 1){ ex1 = sx+eyeOffset; ey1 = sy+sw-4; ex2 = sx+sw-eyeOffset-2; ey2 = sy+sw-4; }
        else                 { ex1 = sx+eyeOffset; ey1 = sy+3;    ex2 = sx+sw-eyeOffset-2; ey2 = sy+3; }
        ctx.beginPath(); ctx.arc(ex1, ey1, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex2, ey2, 2, 0, Math.PI*2); ctx.fill();
      }
    });

    // Score on canvas
    ctx.fillStyle = 'rgba(192,202,245,0.25)';
    ctx.font = '11px Roboto Mono, monospace';
    ctx.fillText(`♦ ${score}`, 6, 16);
  }

  function drawGameOver() {
    if (!ctx) return;
    draw();
    ctx.fillStyle = 'rgba(13,14,23,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f7768e';
    ctx.font = 'bold 20px VT323, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 10);
    ctx.fillStyle = '#c0caf5';
    ctx.font = '14px VT323, monospace';
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 14);
    ctx.textAlign = 'left';
  }

  // Keyboard controls — only when snake window focused
  document.addEventListener('keydown', (e) => {
    const snakeWin = document.getElementById('win-snake');
    if (!snakeWin || snakeWin.style.display === 'none') return;
    if (!running) return;
    switch(e.key) {
      case 'ArrowUp':    case 'w': case 'W': snakeDir(0, -1);  e.preventDefault(); break;
      case 'ArrowDown':  case 's': case 'S': snakeDir(0,  1);  e.preventDefault(); break;
      case 'ArrowLeft':  case 'a': case 'A': snakeDir(-1, 0);  e.preventDefault(); break;
      case 'ArrowRight': case 'd': case 'D': snakeDir(1,  0);  e.preventDefault(); break;
      case 'Escape': pauseSnake(); break;
    }
  });

})();
