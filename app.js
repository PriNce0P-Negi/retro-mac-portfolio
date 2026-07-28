/* ═══════════════════════════════════════
   app.js — Boot Sequence + Window Manager + Clock
   ═══════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════
//  BOOT SEQUENCE
// ══════════════════════════════════════════

const BOOT_MESSAGES = [
  'Initializing...',
  'Loading core modules...',
  'Mounting file system...',
  'Loading desktop environment...',
  'Preparing workspace...',
  'Configuring window manager...',
  'Starting services...',
  'Launching...',
];

const BOOT_DURATION_MS = 1800; // ~1.8 seconds

function runBootSequence() {
  const fill     = document.getElementById('bootBarFill');
  const msgEl    = document.getElementById('bootMessages');
  const bootScr  = document.getElementById('boot-screen');

  if (!fill || !msgEl || !bootScr) {
    revealDesktop();
    return;
  }

  let startTime  = null;
  let msgIndex   = 0;

  // Cycle messages over boot duration
  const msgInterval = setInterval(() => {
    msgIndex++;
    if (msgIndex < BOOT_MESSAGES.length) {
      msgEl.style.opacity = '0';
      setTimeout(() => {
        msgEl.textContent = BOOT_MESSAGES[msgIndex];
        msgEl.style.opacity = '1';
      }, 200);
    }
  }, BOOT_DURATION_MS / BOOT_MESSAGES.length);

  function frame(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / BOOT_DURATION_MS, 1);

    // Smooth easing (ease-in-out)
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    fill.style.width = (eased * 100).toFixed(2) + '%';

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      clearInterval(msgInterval);
      // Short pause at 100%, then fade out
      setTimeout(() => {
        msgEl.style.opacity = '0';
        msgEl.textContent = 'Welcome.';
        msgEl.style.opacity = '1';
        setTimeout(() => {
          bootScr.classList.add('fade-out');
          setTimeout(() => {
            bootScr.style.display = 'none';
            revealDesktop();
          }, 800);
        }, 500);
      }, 300);
    }
  }

  requestAnimationFrame(frame);
}

// ══════════════════════════════════════════
//  DESKTOP STARTUP ANIMATION
// ══════════════════════════════════════════

function revealDesktop() {
  const desktop    = document.getElementById('desktop');
  const menubar    = document.getElementById('menubar');
  const dock       = document.getElementById('dock');
  const icons      = document.getElementById('desktopIcons');

  // 1. Fade in desktop background
  desktop.classList.add('visible');

  // 2. Menu bar
  setTimeout(() => {
    menubar.classList.add('visible');
  }, 100);

  // 3. Dock slides up
  setTimeout(() => {
    dock.classList.add('visible');
  }, 250);

  // 4. Desktop icons fade in
  setTimeout(() => {
    icons.classList.add('visible');
  }, 400);

  // 5. Open default windows staggered
  setTimeout(() => openWindow('win-about'),        600);
}

// ══════════════════════════════════════════
//  CLOCK
// ══════════════════════════════════════════

function updateClock() {
  const now      = new Date();
  const h        = now.getHours();
  const m        = String(now.getMinutes()).padStart(2, '0');
  const ampm     = h >= 12 ? 'PM' : 'AM';
  const h12      = h % 12 || 12;
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const monNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('menuClock').textContent =
    `${dayNames[now.getDay()]} ${monNames[now.getMonth()]} ${now.getDate()}  ${h12}:${m} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

// ══════════════════════════════════════════
//  WINDOW MANAGER
// ══════════════════════════════════════════

let zTop    = 200;
let dragging = null;
let dragOffX = 0, dragOffY = 0;
const windowMeta = {};

function getWin(id) { return document.getElementById(id); }

function openWindow(id) {
  const win = getWin(id);
  if (!win) return;
  win.classList.remove('win-closing', 'minimized');
  win.style.display = 'flex';
  focusWindow(id);
  // Remove from taskbar
  const tbBtn = document.getElementById('tb-' + id);
  if (tbBtn) tbBtn.remove();
  // Update active app name
  const title = win.querySelector('.win-title');
  if (title) {
    const name = title.textContent.split('—')[0].trim();
    document.getElementById('activeAppName').textContent = name;
  }
  updateDockIndicators();
}

function closeWindow(id) {
  const win = getWin(id);
  if (!win) return;
  win.classList.add('win-closing');
  setTimeout(() => {
    win.style.display = 'none';
    win.classList.remove('win-closing');
    updateDockIndicators();
  }, 180);
  const tbBtn = document.getElementById('tb-' + id);
  if (tbBtn) tbBtn.remove();
  document.getElementById('activeAppName').textContent = 'Finder';
  updateDockIndicators();
}

function minimizeWindow(id) {
  const win = getWin(id);
  if (!win) return;
  win.classList.add('win-closing');
  setTimeout(() => {
    win.style.display = 'none';
    win.classList.remove('win-closing', 'focused');
    if (!document.getElementById('tb-' + id)) {
      const btn = document.createElement('button');
      btn.className = 'taskbar-btn';
      btn.id = 'tb-' + id;
      const title = win.querySelector('.win-title');
      btn.textContent = title ? title.textContent.split('—')[0].trim() : id;
      btn.onclick = () => openWindow(id);
      document.getElementById('taskbar').appendChild(btn);
    }
    updateDockIndicators();
  }, 180);
  updateDockIndicators();
}

function toggleMaximize(id) {
  const win = getWin(id);
  if (!win) return;
  if (!windowMeta[id]) windowMeta[id] = {};
  if (win.classList.contains('maximized')) {
    win.classList.remove('maximized');
    const ps = windowMeta[id].prevStyle;
    if (ps) {
      win.style.left   = ps.left;
      win.style.top    = ps.top;
      win.style.width  = ps.width;
      win.style.height = ps.height || '';
    }
  } else {
    windowMeta[id].prevStyle = {
      left: win.style.left, top: win.style.top,
      width: win.style.width, height: win.style.height
    };
    win.classList.add('maximized');
  }
  focusWindow(id);
}

function focusWindow(id) {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
  const win = getWin(id);
  if (!win) return;
  zTop++;
  win.style.zIndex = zTop;
  win.classList.add('focused');
  // Update menu bar app name
  const title = win.querySelector('.win-title');
  if (title) {
    const name = title.textContent.split('—')[0].trim();
    document.getElementById('activeAppName').textContent = name;
  }
  updateDockIndicators();
}

// Click anywhere on a window to focus it
document.addEventListener('mousedown', (e) => {
  const win = e.target.closest('.window');
  if (win) focusWindow(win.id);
});

window.startDrag = function(e, id) {
  if (window.innerWidth <= 768) return; // Disable drag on mobile devices
  if (e.target.classList.contains('tl')) return;
  const win = getWin(id);
  if (!win || win.classList.contains('maximized')) return;
  focusWindow(id);
  dragging = id;
  const rect = win.getBoundingClientRect();
  dragOffX = e.clientX - rect.left;
  dragOffY = e.clientY - rect.top;
  e.preventDefault();
};

document.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const win = getWin(dragging);
  if (!win) return;
  const desktop = document.getElementById('desktop');
  const dRect   = desktop.getBoundingClientRect();
  let nx = e.clientX - dragOffX - dRect.left;
  let ny = e.clientY - dragOffY - dRect.top;
  ny = Math.max(-2, ny); // Don't go above viewport
  win.style.left = nx + 'px';
  win.style.top  = ny + 'px';
});

document.addEventListener('mouseup', () => { dragging = null; });

// ── Resize handles ──
function attachResizeHandle(win) {
  const rh = document.createElement('div');
  rh.className = 'resize-handle';
  let resizing = false, rStartX, rStartY, rStartW, rStartH;

  rh.addEventListener('mousedown', (e) => {
    resizing = true;
    rStartX = e.clientX; rStartY = e.clientY;
    rStartW = win.offsetWidth; rStartH = win.offsetHeight;
    e.stopPropagation(); e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!resizing) return;
    win.style.width  = Math.max(280, rStartW + (e.clientX - rStartX)) + 'px';
    win.style.height = Math.max(180, rStartH + (e.clientY - rStartY)) + 'px';
  });

  document.addEventListener('mouseup', () => { resizing = false; });
  win.appendChild(rh);
}

document.querySelectorAll('.window').forEach(attachResizeHandle);

// ── Keyboard shortcuts ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const focused = document.querySelector('.window.focused');
    // Don't close game windows on Escape (snake handles it internally)
    if (focused && focused.id !== 'win-snake' && focused.id !== 'win-minesweeper') {
      closeWindow(focused.id);
    }
  }
});

// ══════════════════════════════════════════
//  DOCK WINDOW INDICATORS
// ══════════════════════════════════════════

function updateDockIndicators() {
  document.querySelectorAll('.dock-item').forEach(item => {
    const winId = item.getAttribute('data-window');
    if (!winId) return;
    const win = getWin(winId);
    if (!win) return;

    const isOpen = win.style.display !== 'none' && !win.classList.contains('win-closing') && !win.classList.contains('minimized');
    const isFocused = win.classList.contains('focused') && isOpen;

    if (isOpen) {
      item.classList.add('window-open');
    } else {
      item.classList.remove('window-open');
    }

    if (isFocused) {
      item.classList.add('window-focused');
    } else {
      item.classList.remove('window-focused');
    }
  });
}

// ══════════════════════════════════════════
//  MENU BAR DROPDOWNS
// ══════════════════════════════════════════

function closeAllDropdowns() {
  document.querySelectorAll('.menu-dropdown').forEach(d => d.classList.remove('open'));
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-item-wrap')) closeAllDropdowns();
});

// View menu toggle
const menuViewBtn = document.getElementById('menuView');
if (menuViewBtn) {
  // Wrap in a relative container
  const wrap = document.createElement('span');
  wrap.className = 'menu-item-wrap';
  menuViewBtn.parentNode.insertBefore(wrap, menuViewBtn);
  wrap.appendChild(menuViewBtn);

  // Create dropdown
  const dd = document.createElement('div');
  dd.className = 'menu-dropdown';
  dd.id = 'viewDropdown';
  dd.innerHTML = `
    <div class="menu-dd-section">Theme</div>
    <button class="menu-dd-item" id="themeToggleBtn" onclick="toggleTheme()">
      <span class="menu-dd-icon" id="themeIcon">☀️</span>
      <span id="themeLabel">Light Mode</span>
    </button>
    <div class="menu-dd-sep"></div>
    <div class="menu-dd-section">Windows</div>
    <button class="menu-dd-item" onclick="document.querySelectorAll('.window').forEach(w => closeWindow(w.id))">
      <span class="menu-dd-icon">✕</span> Close All
    </button>
  `;
  wrap.appendChild(dd);

  menuViewBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dd.classList.toggle('open');
  });
}

// ══════════════════════════════════════════
//  THEME SYSTEM
// ══════════════════════════════════════════

function applyTheme(theme) {
  document.body.classList.toggle('light-theme', theme === 'light');
  const icon  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  if (icon)  icon.textContent  = theme === 'light' ? '🌙' : '☀️';
  if (label) label.textContent = theme === 'light' ? 'Dark Mode'  : 'Light Mode';
  localStorage.setItem('pn-theme', theme);
  // Update meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f0f2f8' : '#1a1b26');
}

function toggleTheme() {
  const current = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  applyTheme(current === 'light' ? 'dark' : 'light');
  closeAllDropdowns();
}

// ══════════════════════════════════════════
//  MOBILE BACK BUTTON
// ══════════════════════════════════════════

function setupMobileBackButtons() {
  if (window.innerWidth > 768) return;
  document.querySelectorAll('.window').forEach(win => {
    if (win.querySelector('.mob-back-btn')) return; // already added
    const tb = win.querySelector('.titlebar');
    if (!tb) return;
    const btn = document.createElement('button');
    btn.className = 'mob-back-btn';
    btn.innerHTML = '&#8592; Back';
    btn.onclick = (e) => { e.stopPropagation(); closeWindow(win.id); };
    tb.appendChild(btn);
  });
}

window.addEventListener('load', () => {
  // Restore saved theme — called AFTER the dropdown has been built
  const saved = localStorage.getItem('pn-theme') || 'dark';
  applyTheme(saved);
  // Run boot
  runBootSequence();
  // Mobile back buttons
  setupMobileBackButtons();
  // Init spotlight search
  initSpotlight();
  // Init audio system
  AudioSystem.init();
  // Restore recruiter mode if saved
  if (localStorage.getItem('pn-recruiter') === '1') toggleRecruiterMode();
});

// ══════════════════════════════════════════
//  AUDIO SYSTEM  (Web Audio API — no files)
// ══════════════════════════════════════════

const AudioSystem = (() => {
  let ctx = null;
  let muted = false;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  // Global browser autoplay policy unlocker
  const unlockAudio = () => {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener('click', unlockAudio, { once: false });
  window.addEventListener('keydown', unlockAudio, { once: false });
  window.addEventListener('touchstart', unlockAudio, { once: false });

  function tone(freq, duration, type = 'sine', gain = 0.18, delay = 0) {
    if (muted) return;
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const g   = c.createGain();
      osc.connect(g); g.connect(c.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      g.gain.setValueAtTime(0, c.currentTime + delay);
      g.gain.linearRampToValueAtTime(gain, c.currentTime + delay + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + duration + 0.05);
    } catch(e) {}
  }

  return {
    init() {
      muted = localStorage.getItem('pn-sound') === '0';
      const btn = document.getElementById('soundToggleBtn');
      if (btn) btn.textContent = muted ? '🔇' : '🔊';
    },
    toggle() {
      muted = !muted;
      localStorage.setItem('pn-sound', muted ? '0' : '1');
      const btn = document.getElementById('soundToggleBtn');
      if (btn) btn.textContent = muted ? '🔇' : '🔊';
    },
    playBoot() {
      // macOS-style startup chord: C-E-G arpeggio
      tone(523.25, 1.2, 'sine', 0.22, 0.0);  // C5
      tone(659.25, 1.0, 'sine', 0.18, 0.12); // E5
      tone(783.99, 1.6, 'sine', 0.14, 0.24); // G5
    },
    playClick() { tone(880, 0.06, 'sine', 0.08); },
    playOpen()  { tone(659, 0.12, 'sine', 0.12); tone(880, 0.10, 'sine', 0.09, 0.08); },
    playClose() { tone(440, 0.08, 'sine', 0.10); tone(330, 0.10, 'sine', 0.08, 0.06); },
  };
})();

// Inject sound into window open/close
const _origOpen  = openWindow;
const _origClose = closeWindow;
window.openWindow = function(id) {
  AudioSystem.playOpen();
  _origOpen(id);
};
window.closeWindow = function(id) {
  AudioSystem.playClose();
  _origClose(id);
};

// Play boot chime when revealDesktop executes
const _origRevealDesktop = revealDesktop;
window.revealDesktop = function() {
  _origRevealDesktop();
  AudioSystem.playBoot();
};

// ══════════════════════════════════════════
//  VIDEO WINDOW SYSTEM
// ══════════════════════════════════════════

window.openVideoWindow = function(windowId, youtubeId) {
  const win = document.getElementById(windowId);
  if (!win) return;
  const iframeId = windowId === 'win-video-industrial' ? 'yt-industrial' : 'yt-notes';
  const iframe = document.getElementById(iframeId);
  if (iframe) {
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?rel=0`;
  }
  win.classList.remove('win-closing', 'minimized');
  win.style.display = 'flex';
  focusWindow(windowId);
};

window.closeVideoWindow = function(windowId) {
  const win = document.getElementById(windowId);
  if (!win) return;
  // Stop audio by clearing iframe src
  const iframe = win.querySelector('iframe');
  if (iframe) iframe.src = '';
  AudioSystem.playClose();
  win.classList.add('win-closing');
  setTimeout(() => {
    win.style.display = 'none';
    win.classList.remove('win-closing');
  }, 180);
};

// ══════════════════════════════════════════
//  SPOTLIGHT SEARCH (Ctrl+K / Cmd+K)
// ══════════════════════════════════════════

const SPOTLIGHT_INDEX = [
  { label: 'About — Prince Negi',  icon: '📄', keywords: ['about','prince','who','me'],       action: () => openWindow('win-about') },
  { label: 'Projects',              icon: '🗂️', keywords: ['projects','ai','rag','build'],    action: () => openWindow('win-projects') },
  { label: 'Skills',               icon: '⚙️', keywords: ['skills','python','react','tech'],  action: () => openWindow('win-skills') },
  { label: 'Goals',                icon: '🎯', keywords: ['goals','dream','future','life'],   action: () => openWindow('win-goals') },
  { label: 'Likes & Interests',    icon: '❤️', keywords: ['likes','hobbies','interests'],    action: () => openWindow('win-likes') },
  { label: 'Social Links',         icon: '🔗', keywords: ['social','github','linkedin','contact'], action: () => openWindow('win-social') },
  { label: 'Terminal',             icon: '💻', keywords: ['terminal','shell','cli','sudo'],   action: () => openWindow('win-terminal') },
  { label: 'Snake Game',           icon: '🐍', keywords: ['snake','game','play'],             action: () => openWindow('win-snake') },
  { label: 'Minesweeper',          icon: '💣', keywords: ['mine','minesweeper','bomb','game'],action: () => openWindow('win-minesweeper') },
  { label: '⚡ Recruiter View',     icon: '⚡', keywords: ['recruiter','resume','cv','tldr','hire'], action: () => { closeSpotlight(); toggleRecruiterMode(); return; } },
];

function initSpotlight() {
  const input = document.getElementById('spotlight-input');
  if (!input) return;
  input.addEventListener('input', () => renderSpotlightResults(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSpotlight();
    if (e.key === 'Enter') {
      const first = document.querySelector('.spotlight-result-item');
      if (first) first.click();
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = document.querySelectorAll('.spotlight-result-item');
      if (!items.length) return;
      let idx = Array.from(items).findIndex(i => i.classList.contains('active'));
      items[idx]?.classList.remove('active');
      idx = e.key === 'ArrowDown' ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length;
      items[idx].classList.add('active');
      items[idx].scrollIntoView({ block: 'nearest' });
    }
  });
}

function renderSpotlightResults(query) {
  const container = document.getElementById('spotlight-results');
  if (!container) return;
  const q = query.trim().toLowerCase();
  const matches = q
    ? SPOTLIGHT_INDEX.filter(item => item.keywords.some(k => k.includes(q)) || item.label.toLowerCase().includes(q))
    : SPOTLIGHT_INDEX;
  container.innerHTML = matches.map((item, i) =>
    `<div class="spotlight-result-item${i === 0 ? ' active' : ''}" onclick="runSpotlightAction(${SPOTLIGHT_INDEX.indexOf(item)})">
      <span class="sr-icon">${item.icon}</span>
      <span class="sr-label">${item.label}</span>
    </div>`
  ).join('');
}

window.runSpotlightAction = function(idx) {
  closeSpotlight();
  setTimeout(() => SPOTLIGHT_INDEX[idx]?.action(), 80);
};

window.openSpotlight = function() {
  const modal = document.getElementById('spotlight-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  modal.classList.add('open');
  const input = document.getElementById('spotlight-input');
  if (input) { input.value = ''; input.focus(); }
  renderSpotlightResults('');
};

window.closeSpotlight = function(e) {
  if (e && e.target !== document.getElementById('spotlight-modal')) return;
  const modal = document.getElementById('spotlight-modal');
  if (modal) { modal.style.display = 'none'; modal.classList.remove('open'); }
};

// Keyboard shortcut Ctrl+K / Cmd+K
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const modal = document.getElementById('spotlight-modal');
    if (modal && modal.classList.contains('open')) closeSpotlight();
    else openSpotlight();
  }
  if (e.key === 'Escape') {
    const modal = document.getElementById('spotlight-modal');
    if (modal && modal.classList.contains('open')) {
      modal.style.display = 'none';
      modal.classList.remove('open');
      e.stopPropagation();
    }
  }
});

// ══════════════════════════════════════════
//  RECRUITER MODE
// ══════════════════════════════════════════

window.toggleRecruiterMode = function() {
  const desktop     = document.getElementById('desktop');
  const menubar     = document.getElementById('menubar');
  const recruiterV  = document.getElementById('recruiter-view');
  const btn         = document.getElementById('recruiterModeBtn');
  const spotlight   = document.getElementById('spotlight-modal');
  if (!recruiterV) return;

  const isRecruiter = recruiterV.style.display !== 'none';
  if (isRecruiter) {
    // Switch back to OS
    recruiterV.style.display = 'none';
    if (desktop)  desktop.style.display = '';
    if (menubar)  menubar.style.display = '';
    if (btn) btn.textContent = '⚡ Recruiter View';
    localStorage.setItem('pn-recruiter', '0');
  } else {
    // Switch to recruiter view
    if (spotlight) spotlight.style.display = 'none';
    recruiterV.style.display = 'block';
    if (desktop) desktop.style.display = 'none';
    if (menubar) menubar.style.display = 'none';
    if (btn) btn.textContent = '← Back to OS';
    localStorage.setItem('pn-recruiter', '1');
    recruiterV.scrollTop = 0;
  }
};
