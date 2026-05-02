let topZIndex = 200;
const openWindowIds   = {};
const savedWindowSizes = {};
const minimizedWindows = {};

const appRegistry = {
  explorer: { title: 'File Explorer', width: 480, height: 360 },
  notepad:  { title: 'Notepad',       width: 460, height: 380 },
  calc:     { title: 'Calculator',    width: 300, height: 440 },
  settings: { title: 'Settings',      width: 420, height: 420 },
  about:    { title: 'About WebOS',   width: 340, height: 310 },
};

const appContentBuilders = {};

function registerApp(id, buildContentFn) {
  appContentBuilders[id] = buildContentFn;
}

function openApp(id) {
  triggerDockBounce(id);

  if (openWindowIds[id]) {
    const existing = document.getElementById('win-' + id);
    if (existing && minimizedWindows[id]) {
      restoreWindow(id);
    } else {
      focusWindow(id);
    }
    return;
  }

  const config  = appRegistry[id];
  const windowEl = document.createElement('div');
  windowEl.className = 'win focused';
  windowEl.id        = 'win-' + id;

  const centerX = Math.max(60, (window.innerWidth  - config.width)  / 2 + (Math.random() * 80 - 40));
  const centerY = Math.max(40, (window.innerHeight - config.height) / 2 + (Math.random() * 60 - 30));

  windowEl.style.cssText =
    `left:${centerX}px; top:${centerY}px; width:${config.width}px; height:${config.height}px;`;

  windowEl.innerHTML = `
    <div class="win-titlebar" onmousedown="startDrag(event, '${id}')">
      <div class="win-controls">
        <div class="win-btn btn-close" onclick="closeApp('${id}')"></div>
        <div class="win-btn btn-min"   onclick="minimizeApp('${id}')"></div>
        <div class="win-btn btn-max"   onclick="maximizeApp('${id}')"></div>
      </div>
      <div class="win-title">${config.title}</div>
      <div style="width:45px"></div>
    </div>
    <div class="win-body" id="winbody-${id}"></div>
    <div class="win-resize-handle" onmousedown="startResize(event, '${id}')"></div>
  `;

  windowEl.addEventListener('mousedown', () => focusWindow(id));
  document.getElementById('desktop').appendChild(windowEl);

  openWindowIds[id]   = true;
  minimizedWindows[id] = false;

  setDockDot(id, true);

  if (appContentBuilders[id]) {
    document.getElementById('winbody-' + id).innerHTML = appContentBuilders[id]();
  }

  document.dispatchEvent(new CustomEvent('appOpened', { detail: { id } }));
  updateMenubarAppName(id);
}

function focusWindow(id) {
  document.querySelectorAll('.win').forEach(w => w.classList.remove('focused'));
  const windowEl = document.getElementById('win-' + id);
  if (windowEl) {
    windowEl.classList.add('focused');
    windowEl.style.zIndex = ++topZIndex;
  }
  updateMenubarAppName(id);
}

function closeApp(id) {
  const windowEl = document.getElementById('win-' + id);
  if (!windowEl) return;

  windowEl.classList.add('closing');
  windowEl.addEventListener('animationend', () => {
    windowEl.remove();
  }, { once: true });

  delete openWindowIds[id];
  delete savedWindowSizes[id];
  delete minimizedWindows[id];
  setDockDot(id, false);
  updateMenubarAppName('Finder');
}

function minimizeApp(id) {
  const windowEl = document.getElementById('win-' + id);
  if (!windowEl || minimizedWindows[id]) return;

  minimizedWindows[id] = true;
  windowEl.classList.add('minimizing');
  windowEl.addEventListener('animationend', () => {
    windowEl.style.display = 'none';
    windowEl.classList.remove('minimizing');
  }, { once: true });
}

function restoreWindow(id) {
  const windowEl = document.getElementById('win-' + id);
  if (!windowEl) return;

  minimizedWindows[id] = false;
  windowEl.style.display = 'flex';
  windowEl.classList.add('restoring');
  windowEl.addEventListener('animationend', () => {
    windowEl.classList.remove('restoring');
  }, { once: true });
  focusWindow(id);
}

function toggleApp(id) {
  const windowEl = document.getElementById('win-' + id);
  if (!windowEl) { openApp(id); return; }
  if (minimizedWindows[id]) { restoreWindow(id); }
  else { minimizeApp(id); }
}

function maximizeApp(id) {
  const windowEl = document.getElementById('win-' + id);
  if (!windowEl) return;

  if (savedWindowSizes[id]) {
    windowEl.style.cssText = savedWindowSizes[id];
    delete savedWindowSizes[id];
  } else {
    savedWindowSizes[id] = windowEl.style.cssText;
    windowEl.style.cssText =
      `left:0; top:28px; width:100%; height:calc(100vh - 28px);
       border-radius:0; z-index:${++topZIndex};`;
    windowEl.classList.add('focused');
  }
}

function startDrag(event, id) {
  if (event.target.classList.contains('win-btn')) return;
  const windowEl = document.getElementById('win-' + id);
  focusWindow(id);

  const offsetX = event.clientX - windowEl.offsetLeft;
  const offsetY = event.clientY - windowEl.offsetTop;

  function onMouseMove(e) {
    windowEl.style.left = Math.max(0, e.clientX - offsetX) + 'px';
    windowEl.style.top  = Math.max(28, Math.min(e.clientY - offsetY, window.innerHeight - 80)) + 'px';
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup',   onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup',   onMouseUp);
}

function startResize(event, id) {
  event.stopPropagation();
  const windowEl = document.getElementById('win-' + id);

  const startX = event.clientX;
  const startY = event.clientY;
  const startW = windowEl.offsetWidth;
  const startH = windowEl.offsetHeight;

  function onMouseMove(e) {
    windowEl.style.width  = Math.max(280, startW + e.clientX - startX) + 'px';
    windowEl.style.height = Math.max(200, startH + e.clientY - startY) + 'px';
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup',   onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup',   onMouseUp);
}

function updateMenubarAppName(id) {
  const nameMap = {
    explorer: 'Files', notepad: 'Notepad', calc: 'Calculator',
    settings: 'System Preferences', about: 'About', Finder: 'Finder'
  };
  const el = document.getElementById('menubar-appname');
  if (el) el.textContent = nameMap[id] || 'Finder';
}

function setDockDot(id, visible) {
  const dot = document.getElementById('dot-' + id);
  if (dot) dot.classList.toggle('visible', visible);
}