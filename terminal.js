/* ═══════════════════════════════════════
   terminal.js — Interactive Terminal.app
   ═══════════════════════════════════════ */
'use strict';

(function () {

  var PROMPT = '<span class="t-prompt">prince@pn-os:~$</span> ';

  function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ── Command definitions ── */
  var COMMANDS = {

    help: function() { return [
      '<span class="t-dim">┌────────────────────────────────────────────────┐</span>',
      '<span class="t-dim">│</span>           <span class="t-yellow">PN OS  —  Available Commands</span>           <span class="t-dim">│</span>',
      '<span class="t-dim">└────────────────────────────────────────────────┘</span>',
      '  <span class="t-green">whoami</span>           Who is Prince Negi?',
      '  <span class="t-green">skills</span>           Print skills table',
      '  <span class="t-green">ls projects</span>      List all projects',
      '  <span class="t-green">cat resume.txt</span>   Display resume summary',
      '  <span class="t-green">open about</span>       Open About window',
      '  <span class="t-green">open projects</span>    Open Projects window',
      '  <span class="t-green">open skills</span>      Open Skills window',
      '  <span class="t-green">open social</span>      Open Social Links window',
      '  <span class="t-green">clear</span>            Clear terminal',
      '  <span class="t-green">sudo hire prince</span> <span class="t-pink">Try it... 👀</span>',
      '  <span class="t-green">exit</span>             Close terminal',
    ].join('\n'); },

    whoami: function() { return [
      '<span class="t-blue">Prince Negi</span>',
      '<span class="t-dim">────────────────────────────────────────</span>',
      'Role     : CS Student · AI/ML Engineer · Software Developer',
      'Location : India 🇮🇳',
      'Focus    : <span class="t-yellow">AI · Machine Learning · System Design</span>',
      'Status   : Final year CSE · Open to opportunities',
      'GitHub   : <span class="t-blue">github.com/PriNce0P-Negi</span>',
      'LinkedIn : <span class="t-blue">linkedin.com/in/prince-negi-94289a314</span>',
    ].join('\n'); },

    skills: function() { return [
      '<span class="t-yellow">┌──────────────────┬────────────────────────────────────┐</span>',
      '<span class="t-yellow">│  Category        │  Skills                            │</span>',
      '<span class="t-yellow">├──────────────────┼────────────────────────────────────┤</span>',
      '<span class="t-yellow">│</span> Languages        <span class="t-yellow">│</span> <span class="t-green">Python, C, C++, JavaScript, SQL</span>    <span class="t-yellow">│</span>',
      '<span class="t-yellow">│</span> AI / ML          <span class="t-yellow">│</span> <span class="t-green">LangChain, LangGraph, RAG, NLP</span>     <span class="t-yellow">│</span>',
      '<span class="t-yellow">│</span> Backend          <span class="t-yellow">│</span> <span class="t-green">FastAPI, Node.js, REST APIs</span>        <span class="t-yellow">│</span>',
      '<span class="t-yellow">│</span> Frontend         <span class="t-yellow">│</span> <span class="t-green">React, Next.js, HTML, CSS</span>         <span class="t-yellow">│</span>',
      '<span class="t-yellow">│</span> Databases        <span class="t-yellow">│</span> <span class="t-green">PostgreSQL, MongoDB, Qdrant</span>       <span class="t-yellow">│</span>',
      '<span class="t-yellow">│</span> Tools            <span class="t-yellow">│</span> <span class="t-green">Docker, Git, Linux, Neo4j</span>         <span class="t-yellow">│</span>',
      '<span class="t-yellow">└──────────────────┴────────────────────────────────────┘</span>',
    ].join('\n'); },

    'ls projects': function() { return [
      '<span class="t-dim">total 2 projects</span>',
      '',
      '<span class="t-blue">IndustrialBrain AI</span>',
      '  <span class="t-dim">AI-powered industrial knowledge platform — ET AI Hackathon 2026</span>',
      '  Tags: Python · FastAPI · Next.js · LangGraph · Gemini · Neo4j',
      '  <span class="t-green">github.com/PriNce0P-Negi/IndustrialBrain_AI</span>',
      '',
      '<span class="t-blue">Student Notes AI Assistant</span>',
      '  <span class="t-dim">Chat with your study material using RAG + OCR</span>',
      '  Tags: Python · FastAPI · React · LangChain · Docker · Qdrant',
      '  <span class="t-green">github.com/PriNce0P-Negi/student-notes-ai-assistant</span>',
    ].join('\n'); },

    'cat resume.txt': function() { return [
      '<span class="t-yellow">╔══════════════════════════════════════════════════╗</span>',
      '<span class="t-yellow">║</span>             <span class="t-blue">PRINCE NEGI  —  RÉSUMÉ</span>             <span class="t-yellow">║</span>',
      '<span class="t-yellow">╚══════════════════════════════════════════════════╝</span>',
      '',
      '<span class="t-green">EDUCATION</span>',
      '  B.Tech Computer Science Engineering  (2023–2027)',
      '',
      '<span class="t-green">PROJECTS</span>',
      '  • IndustrialBrain AI   — ET AI Hackathon 2026',
      '  • Student Notes AI     — RAG + OCR notes assistant',
      '',
      '<span class="t-green">SKILLS</span>',
      '  Python · FastAPI · React · LangChain · LangGraph',
      '  RAG · Docker · Qdrant · Neo4j · Gemini API',
      '',
      '<span class="t-green">CONTACT</span>',
      '  📧 princenegi11179@gmail.com',
      '  🔗 github.com/PriNce0P-Negi',
      '  🔗 linkedin.com/in/prince-negi-94289a314',
      '',
      '<span class="t-dim">Tip: Download the actual PDF from Social Links → Resume.pdf</span>',
      '<span class="t-dim">     or hit ⚡ Recruiter View in the top menu bar.</span>',
    ].join('\n'); },

    'open about':    function() { if(typeof openWindow==='function') openWindow('win-about');    return '<span class="t-green">Opening About...</span>'; },
    'open projects': function() { if(typeof openWindow==='function') openWindow('win-projects'); return '<span class="t-green">Opening Projects...</span>'; },
    'open skills':   function() { if(typeof openWindow==='function') openWindow('win-skills');   return '<span class="t-green">Opening Skills...</span>'; },
    'open social':   function() { if(typeof openWindow==='function') openWindow('win-social');   return '<span class="t-green">Opening Social Links...</span>'; },

    clear: function() { return '__CLEAR__'; },

    'sudo hire prince': function() {
      triggerConfetti();
      return [
        '<span class="t-yellow">🎉 Hire request submitted!</span>',
        '<span class="t-dim">────────────────────────────────────────────</span>',
        '<span class="t-green">sudo: hiring Prince Negi...</span>',
        '<span class="t-green">  ✓ Checking skill set............... [OK]</span>',
        '<span class="t-green">  ✓ Verifying projects............... [OK]</span>',
        '<span class="t-green">  ✓ Validating enthusiasm............ [OK]</span>',
        '<span class="t-green">  ✓ Confirming availability.......... [OK]</span>',
        '<span class="t-yellow">  → Request approved! 🎊</span>',
        '',
        '<span class="t-dim">Next step → </span><span class="t-blue">princenegi11179@gmail.com</span>',
      ].join('\n');
    },

    exit: function() {
      setTimeout(function() { if(typeof closeWindow==='function') closeWindow('win-terminal'); }, 350);
      return '<span class="t-dim">Goodbye 👋</span>';
    },
  };

  /* ── Canvas Confetti ── */
  function triggerConfetti() {
    var canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.style.display = 'block';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');
    var colors = ['#7aa2f7','#9ece6a','#e0af68','#f7768e','#bb9af7','#2ac3de','#ff9e64'];
    var particles = [];
    for (var i = 0; i < 180; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 7 + 3,
        dx: (Math.random() - 0.5) * 1.5,
        dy: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltSpeed: Math.random() * 0.07 + 0.03,
        angle: 0,
      });
    }
    var frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function(p) {
        p.angle += p.tiltSpeed;
        p.x += p.dx;
        p.y += p.dy;
        p.tilt = Math.sin(p.angle) * 12;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt, p.y);
        ctx.lineTo(p.x + p.tilt + p.r * 0.4, p.y + p.r);
        ctx.stroke();
      });
      frame++;
      if (frame < 300) requestAnimationFrame(draw);
      else { ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.display = 'none'; }
    }
    requestAnimationFrame(draw);
  }

  /* ── Terminal DOM logic ── */
  function initTerminal() {
    var termWin = document.getElementById('win-terminal');
    var output  = document.getElementById('term-output');
    var input   = document.getElementById('term-input');
    if (!output || !input) return;

    var history = [];
    var histIdx = -1;

    function printLine(html) {
      var div = document.createElement('div');
      div.className = 'term-out-line';
      div.innerHTML = html;
      output.appendChild(div);
      output.scrollTop = output.scrollHeight;
    }

    function runCommand(raw) {
      var cmd = raw.trim().toLowerCase();
      /* Echo the command */
      printLine(PROMPT + escapeHtml(raw));
      if (!cmd) return;
      history.unshift(raw);
      histIdx = -1;

      var handler = COMMANDS[cmd];
      if (handler) {
        var result = handler();
        if (result === '__CLEAR__') {
          output.innerHTML = '';
        } else if (result) {
          result.split('\n').forEach(function(line) { printLine(line || '&nbsp;'); });
        }
      } else {
        printLine('<span class="t-pink">command not found: ' + escapeHtml(cmd) + '</span>  <span class="t-dim">(type <span class="t-green">help</span>)</span>');
      }
      printLine('');
    }

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var val = input.value;
        input.value = '';
        runCommand(val);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histIdx > 0) { histIdx--; input.value = history[histIdx]; }
        else { histIdx = -1; input.value = ''; }
      }
    });

    if (termWin) {
      termWin.addEventListener('click', function() { input.focus(); });
    }

    /* Welcome banner */
    printLine('<span class="t-yellow">PN OS Terminal</span>  <span class="t-dim">v1.0</span>');
    printLine('<span class="t-dim">Type </span><span class="t-green">help</span><span class="t-dim"> for commands. Try </span><span class="t-pink">sudo hire prince</span><span class="t-dim"> 😉</span>');
    printLine('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTerminal);
  } else {
    initTerminal();
  }

})();
