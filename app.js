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

const BOOT_DURATION_MS = 6800; // ~7 seconds

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

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════

window.addEventListener('load', () => {
  // Restore saved theme — called AFTER the dropdown has been built
  // (the dropdown creation code above this runs at parse time, so by
  //  window.load the #themeIcon and #themeLabel elements already exist)
  const saved = localStorage.getItem('pn-theme') || 'dark';
  applyTheme(saved);
  // Run boot
  runBootSequence();
  // Mobile back buttons
  setupMobileBackButtons();
});
