const apps = {
  notes: { name: "Notes", icon: "note", color: "#facc15", width: 820, height: 560 },
  drawing: { name: "Drawing Pad", icon: "brush", color: "#fb7185", width: 820, height: 580 },
  clock: { name: "Clock", icon: "clock", color: "#22d3ee", width: 500, height: 380 },
  calendar: { name: "Calendar", icon: "calendar", color: "#38bdf8", width: 660, height: 520 },
  weather: { name: "Weather", icon: "weather", color: "#60a5fa", width: 500, height: 380 },
  settings: { name: "Settings", icon: "settings", color: "#a78bfa", width: 900, height: 640 },
  terminal: { name: "Terminal", icon: "terminal", color: "#4ade80", width: 760, height: 540 },
  files: { name: "File Explorer", icon: "folder", color: "#fbbf24", width: 860, height: 600 },
  browser: { name: "Browser", icon: "browser", color: "#38bdf8", width: 960, height: 660 }
};

const desktopIcons = document.getElementById("desktop-icons");
const windowLayer = document.getElementById("window-layer");
const dock = document.getElementById("dock");
const runningApps = document.getElementById("running-apps");
const startMenu = document.getElementById("start-menu");
const startApps = document.getElementById("start-apps");
const quickSettings = document.getElementById("quick-settings");
const island = document.getElementById("dynamic-island");
const wallpaperLayer = document.getElementById("wallpaper-layer");
const wallpaperVideo = document.getElementById("wallpaper-video");

let zIndex = 10;
let openWindows = {};
let minimizedWindows = {};
let maximizedWindows = {};
let previousWindowState = {};

const defaultSettings = {
  theme: "dark",
  accent: "#ff18d8",
  blur: 24,
  radius: 15,
  brightness: 100,
  volume: 70,
  wifi: true,
  bluetooth: true,
  wallpaper: "default",
  liveWallpaper: false,
  customWallpaper: "",
  customWallpaperType: "",
  clockFormat: "24",
  clockSize: 108,
  clockColor: "#ff18d8",
  clockDateColor: "#ff68ee",
  clockGlow: 32
};

let settings = JSON.parse(localStorage.getItem("glitch-settings") || JSON.stringify(defaultSettings));

function saveSettings() {
  localStorage.setItem("glitch-settings", JSON.stringify(settings));
}

function appIcon(type) {
  const icons = {
    note: `<svg viewBox="0 0 64 64"><rect x="13" y="8" width="38" height="48" rx="8"/><path d="M23 23h18M23 33h18M23 43h11"/></svg>`,
    brush: `<svg viewBox="0 0 64 64"><path d="M43 8l13 13-27 27-13-13z"/><path d="M18 38c-9 3-8 13-8 13s10 1 13-8"/></svg>`,
    clock: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="23"/><path d="M32 17v16l11 7"/></svg>`,
    calendar: `<svg viewBox="0 0 64 64"><rect x="10" y="13" width="44" height="42" rx="8"/><path d="M10 24h44M22 8v9M42 8v9"/></svg>`,
    weather: `<svg viewBox="0 0 64 64"><path d="M22 45h25a12 12 0 0 0 0-24 18 18 0 0 0-35 6A10 10 0 0 0 22 45z"/></svg>`,
    settings: `<svg viewBox="0 0 64 64"><path d="M32 22a10 10 0 1 1 0 20 10 10 0 0 1 0-20z"/><path d="M32 7l5 8 9-1 3 9 8 5-5 8 1 9-9 3-5 8-8-5-9 1-3-9-8-5 5-8-1-9 9-3z"/></svg>`,
    terminal: `<svg viewBox="0 0 64 64"><rect x="8" y="13" width="48" height="38" rx="8"/><path d="M18 25l8 7-8 7M31 40h14"/></svg>`,
    folder: `<svg viewBox="0 0 64 64"><path d="M7 18a6 6 0 0 1 6-6h15l6 7h21a5 5 0 0 1 5 5v25a7 7 0 0 1-7 7H13a7 7 0 0 1-7-7z"/></svg>`,
    browser: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24"/><path d="M8 32h48M32 8c8 8 8 40 0 48M32 8c-8 8-8 40 0 48"/></svg>`
  };

  return icons[type] || icons.browser;
}

function iconMarkup(app, className = "app-icon") {
  return `<div class="${className}" style="--icon-color:${app.color}">${appIcon(app.icon)}</div>`;
}

function boot() {
  applySettings();
  applyWallpaper();
  renderDesktopIcons();
  renderDock();
  renderStartMenu();
  bindSystem();
  bindDockMagnification();
  updateClock();
  setInterval(updateClock, 1000);
  makeMovable(document.getElementById("desktop-clock"), "glitch-clock-position");
  notify("GLITCH OS ready");
}

function renderDesktopIcons() {
  desktopIcons.innerHTML = "";
  const positions = JSON.parse(localStorage.getItem("glitch-icon-positions") || "{}");

  Object.entries(apps).forEach(([id, app], index) => {
    const icon = document.createElement("div");
    icon.className = "desktop-icon";
    icon.style.left = (positions[id]?.left ?? 0) + "px";
    icon.style.top = (positions[id]?.top ?? index * 96) + "px";
    icon.innerHTML = `${iconMarkup(app)}<div class="desktop-icon-label">${app.name}</div>`;
    icon.addEventListener("dblclick", () => openApp(id));
    makeIconDraggable(icon, id);
    desktopIcons.appendChild(icon);
  });
}

function renderDock() {
  dock.innerHTML = "";

  Object.entries(apps).forEach(([id, app]) => {
    const button = document.createElement("button");
    button.className = "dock-item";
    button.id = `dock-${id}`;
    button.title = app.name;
    button.innerHTML = iconMarkup(app);
    button.addEventListener("click", () => openApp(id));
    dock.appendChild(button);
  });
}

function renderStartMenu(filter = "") {
  startApps.innerHTML = "";

  Object.entries(apps)
    .filter(([, app]) => app.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(([id, app]) => {
      const button = document.createElement("button");
      button.className = "start-app-button";
      button.innerHTML = `${iconMarkup(app)}<span>${app.name}</span>`;
      button.addEventListener("click", () => {
        openApp(id);
        startMenu.classList.add("hidden");
      });
      startApps.appendChild(button);
    });
}

function openApp(id) {
  const app = apps[id];
  if (!app) return;

  if (openWindows[id]) {
    const existing = document.getElementById(`window-${id}`);
    if (existing && minimizedWindows[id]) {
      existing.style.display = "flex";
      minimizedWindows[id] = false;
    }
    focusWindow(id);
    return;
  }

  const win = document.createElement("section");
  win.className = "os-window focused";
  win.id = `window-${id}`;
  win.style.width = app.width + "px";
  win.style.height = app.height + "px";
  win.style.left = Math.max(24, (innerWidth - app.width) / 2 + Math.random() * 34) + "px";
  win.style.top = Math.max(50, (innerHeight - app.height) / 2 + Math.random() * 24) + "px";
  win.style.zIndex = ++zIndex;

  win.innerHTML = `
    <div class="window-titlebar">
      <div class="window-title">${iconMarkup(app, "app-icon mini-icon")}<span>${app.name}</span></div>
      <div class="window-controls">
        <button class="window-control minimize">─</button>
        <button class="window-control maximize">□</button>
        <button class="window-control close">×</button>
      </div>
    </div>
    <div class="window-body">${buildApp(id)}</div>
    <div class="resize-handle"></div>
  `;

  windowLayer.appendChild(win);
  openWindows[id] = true;
  minimizedWindows[id] = false;

  bindWindow(win, id);
  bindApp(id);
  focusWindow(id);
  updateRunningApps();
  notify(`${app.name} opened`);
}

function buildApp(id) {
  if (id === "settings") return buildSettingsApp();
  if (id === "terminal") return buildTerminalApp();
  if (id === "files") return buildFilesApp();
  if (id === "browser") return buildBrowserApp();

  return `
    <div class="app-card">
      <h2>${apps[id].name}</h2>
      <p>This app shell is ready. We will polish this app file next.</p>
    </div>
  `;
}

function bindApp(id) {
  if (id === "settings") bindSettingsApp();
  if (id === "terminal") bindTerminalApp();
  if (id === "files") bindFilesApp();
  if (id === "browser") bindBrowserApp();
}

function bindWindow(win, id) {
  win.querySelector(".close").addEventListener("click", () => closeApp(id));
  win.querySelector(".minimize").addEventListener("click", () => minimizeApp(id));
  win.querySelector(".maximize").addEventListener("click", () => maximizeApp(id));
  win.querySelector(".window-titlebar").addEventListener("mousedown", event => dragWindow(event, id));
  win.querySelector(".resize-handle").addEventListener("mousedown", event => resizeWindow(event, id));
  win.addEventListener("mousedown", () => focusWindow(id));
}

function focusWindow(id) {
  document.querySelectorAll(".os-window").forEach(win => win.classList.remove("focused"));
  const win = document.getElementById(`window-${id}`);
  if (!win) return;
  win.classList.add("focused");
  win.style.zIndex = ++zIndex;
}

function closeApp(id) {
  const win = document.getElementById(`window-${id}`);
  if (!win) return;

  win.classList.add("closing");

  setTimeout(() => {
    win.remove();
    delete openWindows[id];
    delete minimizedWindows[id];
    delete maximizedWindows[id];
    delete previousWindowState[id];
    updateRunningApps();
  }, 160);
}

function minimizeApp(id) {
  const win = document.getElementById(`window-${id}`);
  if (!win) return;
  win.style.display = "none";
  minimizedWindows[id] = true;
}

function maximizeApp(id) {
  const win = document.getElementById(`window-${id}`);
  if (!win) return;

  if (maximizedWindows[id]) {
    const old = previousWindowState[id];
    win.style.left = old.left;
    win.style.top = old.top;
    win.style.width = old.width;
    win.style.height = old.height;
    maximizedWindows[id] = false;
    return;
  }

  previousWindowState[id] = {
    left: win.style.left,
    top: win.style.top,
    width: win.style.width,
    height: win.style.height
  };

  win.style.left = "8px";
  win.style.top = "8px";
  win.style.width = "calc(100vw - 16px)";
  win.style.height = "calc(100vh - 72px)";
  maximizedWindows[id] = true;
}

function dragWindow(event, id) {
  if (event.target.tagName === "BUTTON") return;

  const win = document.getElementById(`window-${id}`);
  const startX = event.clientX;
  const startY = event.clientY;
  const startLeft = win.offsetLeft;
  const startTop = win.offsetTop;

  function move(e) {
    win.style.left = Math.max(0, Math.min(startLeft + e.clientX - startX, innerWidth - 140)) + "px";
    win.style.top = Math.max(0, Math.min(startTop + e.clientY - startY, innerHeight - 90)) + "px";
  }

  function end(e) {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", end);

    if (e.clientX < 24) snapWindow(id, "left");
    if (e.clientX > innerWidth - 24) snapWindow(id, "right");
    if (e.clientY < 16) maximizeApp(id);
  }

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", end);
}

function snapWindow(id, side) {
  const win = document.getElementById(`window-${id}`);
  if (!win) return;

  win.style.top = "8px";
  win.style.height = "calc(100vh - 72px)";
  win.style.width = "calc(50vw - 12px)";
  win.style.left = side === "left" ? "8px" : "calc(50vw + 4px)";
}

function resizeWindow(event, id) {
  event.stopPropagation();

  const win = document.getElementById(`window-${id}`);
  const startX = event.clientX;
  const startY = event.clientY;
  const startWidth = win.offsetWidth;
  const startHeight = win.offsetHeight;

  function move(e) {
    win.style.width = Math.max(340, startWidth + e.clientX - startX) + "px";
    win.style.height = Math.max(240, startHeight + e.clientY - startY) + "px";
  }

  function end() {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", end);
  }

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", end);
}

function updateRunningApps() {
  runningApps.innerHTML = "";

  Object.keys(openWindows).forEach(id => {
    const app = apps[id];
    const button = document.createElement("button");
    button.className = "running-app-button";
    button.innerHTML = `${iconMarkup(app)}<span>${app.name}</span>`;
    button.addEventListener("click", () => openApp(id));
    runningApps.appendChild(button);
  });

  document.querySelectorAll(".dock-item").forEach(item => item.classList.remove("running"));
  Object.keys(openWindows).forEach(id => {
    const item = document.getElementById(`dock-${id}`);
    if (item) item.classList.add("running");
  });
}

function makeIconDraggable(icon, id) {
  icon.addEventListener("mousedown", event => {
    if (event.detail > 1) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = icon.offsetLeft;
    const startTop = icon.offsetTop;

    function move(e) {
      icon.style.left = startLeft + e.clientX - startX + "px";
      icon.style.top = startTop + e.clientY - startY + "px";
    }

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);

      const positions = JSON.parse(localStorage.getItem("glitch-icon-positions") || "{}");
      positions[id] = { left: icon.offsetLeft, top: icon.offsetTop };
      localStorage.setItem("glitch-icon-positions", JSON.stringify(positions));
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  });
}

function makeMovable(element, storageKey) {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");

  if (saved) {
    element.style.left = saved.left + "px";
    element.style.top = saved.top + "px";
    element.style.right = "auto";
  }

  element.addEventListener("mousedown", event => {
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = element.offsetLeft;
    const startTop = element.offsetTop;

    function move(e) {
      element.style.left = startLeft + e.clientX - startX + "px";
      element.style.top = startTop + e.clientY - startY + "px";
      element.style.right = "auto";
    }

    function end() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
      localStorage.setItem(storageKey, JSON.stringify({ left: element.offsetLeft, top: element.offsetTop }));
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  });
}

function bindDockMagnification() {
  dock.addEventListener("mousemove", event => {
    [...dock.querySelectorAll(".dock-item")].forEach(item => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(event.clientX - center);
      const strength = Math.max(0, 1 - distance / 135);
      const scale = 1 + strength * 0.58;
      const lift = strength * 20;
      item.style.transform = `translateY(${-lift}px) scale(${scale})`;
    });
  });

  dock.addEventListener("mouseleave", () => {
    dock.querySelectorAll(".dock-item").forEach(item => {
      item.style.transform = "";
    });
  });
}

function bindSystem() {
  document.getElementById("start-button").addEventListener("click", () => {
    startMenu.classList.toggle("hidden");
    quickSettings.classList.add("hidden");
  });

  document.getElementById("start-close").addEventListener("click", () => {
    startMenu.classList.add("hidden");
  });

  document.getElementById("system-tray").addEventListener("click", () => {
    quickSettings.classList.toggle("hidden");
    startMenu.classList.add("hidden");
  });

  document.getElementById("start-search-input").addEventListener("input", event => {
    renderStartMenu(event.target.value);
  });

  document.getElementById("taskbar-search").addEventListener("input", event => {
    renderStartMenu(event.target.value);
    if (event.target.value.trim()) startMenu.classList.remove("hidden");
  });

  document.getElementById("taskbar-search").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      const value = event.target.value.trim().toLowerCase();
      const match = Object.entries(apps).find(([, app]) => app.name.toLowerCase().includes(value));
      if (match) openApp(match[0]);
      event.target.value = "";
      startMenu.classList.add("hidden");
    }
  });

  document.getElementById("wifi-toggle").addEventListener("click", () => {
    settings.wifi = !settings.wifi;
    saveSettings();
    applySettings();
  });

  document.getElementById("bluetooth-toggle").addEventListener("click", () => {
    settings.bluetooth = !settings.bluetooth;
    saveSettings();
    applySettings();
  });

  document.getElementById("theme-toggle").addEventListener("click", () => {
    settings.theme = settings.theme === "light" ? "dark" : "light";
    saveSettings();
    applySettings();
  });

  document.getElementById("live-wallpaper-toggle").addEventListener("click", () => {
    settings.liveWallpaper = !settings.liveWallpaper;
    saveSettings();
    applyWallpaper();
  });

  document.getElementById("volume-slider").addEventListener("input", event => {
    settings.volume = Number(event.target.value);
    saveSettings();
    applySettings();
  });

  document.getElementById("brightness-slider").addEventListener("input", event => {
    settings.brightness = Number(event.target.value);
    saveSettings();
    applySettings();
  });

  document.querySelectorAll("[data-power]").forEach(button => {
    button.addEventListener("click", () => fakePower(button.dataset.power));
  });
}

function applySettings() {
  document.body.classList.remove("light-theme", "neon-theme", "solar-theme");

  if (settings.theme === "light") document.body.classList.add("light-theme");
  if (settings.theme === "neon") document.body.classList.add("neon-theme");
  if (settings.theme === "solar") document.body.classList.add("solar-theme");

  document.documentElement.style.setProperty("--accent", settings.accent);
  document.documentElement.style.setProperty("--blur", settings.blur + "px");
  document.documentElement.style.setProperty("--window-radius", settings.radius + "px");

  document.getElementById("volume-slider").value = settings.volume;
  document.getElementById("brightness-slider").value = settings.brightness;
  document.getElementById("tray-volume").textContent = "Vol " + settings.volume;
  document.getElementById("tray-wifi").textContent = settings.wifi ? "Wi-Fi" : "No Wi-Fi";

  wallpaperLayer.style.filter = `brightness(${settings.brightness / 100})`;

  applyClockStyle();
}

function applyClockStyle() {
  const time = document.getElementById("clock-time");
  const date = document.getElementById("clock-date");

  time.style.fontSize = settings.clockSize + "px";
  time.style.color = settings.clockColor;
  time.style.textShadow = `0 0 8px rgba(255,24,216,.42), 0 0 ${settings.clockGlow}px rgba(255,24,216,.24), 0 10px 38px rgba(0,0,0,.68)`;
  date.style.color = settings.clockDateColor;
}

function applyWallpaper() {
  wallpaperVideo.pause();
  wallpaperVideo.removeAttribute("src");
  wallpaperVideo.style.display = "none";

  if (settings.liveWallpaper) {
    wallpaperVideo.src = "https://cdn.coverr.co/videos/coverr-city-lights-1565/1080p.mp4";
    wallpaperVideo.style.display = "block";
    wallpaperVideo.play();
    wallpaperLayer.style.background = "#050712";
    return;
  }

  if (settings.customWallpaper) {
    if (settings.customWallpaperType === "image") {
      wallpaperLayer.style.background = `url("${settings.customWallpaper}") center / cover`;
      return;
    }

    if (settings.customWallpaperType === "video") {
      wallpaperVideo.src = settings.customWallpaper;
      wallpaperVideo.style.display = "block";
      wallpaperVideo.play();
      wallpaperLayer.style.background = "#050712";
      return;
    }
  }

  if (settings.wallpaper === "aurora") {
    wallpaperLayer.style.background = "radial-gradient(circle at 20% 20%, rgba(139,92,246,.45), transparent 30%), radial-gradient(circle at 80% 30%, rgba(14,165,233,.35), transparent 35%), #020617";
  } else if (settings.wallpaper === "sunset") {
    wallpaperLayer.style.background = "linear-gradient(135deg, #25133f, #7c2d12, #f97316)";
  } else if (settings.wallpaper === "forest") {
    wallpaperLayer.style.background = "linear-gradient(135deg, #052e16, #14532d, #0f172a)";
  } else {
    wallpaperLayer.style.background = "radial-gradient(circle at 14% 18%, rgba(255, 24, 216, 0.35), transparent 30%), radial-gradient(circle at 82% 20%, rgba(0, 217, 255, 0.22), transparent 34%), linear-gradient(135deg, #060817, #101827 50%, #030712)";
  }
}

function updateClock() {
  const now = new Date();
  const hour12 = settings.clockFormat === "12";

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12
  });

  const date = now.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).replace(",", "").toUpperCase() + ".";

  document.getElementById("clock-time").textContent = time;
  document.getElementById("clock-date").textContent = date;
  document.getElementById("tray-time").textContent = time;
}

function notify(message) {
  clearTimeout(notify.timer);
  island.textContent = message;
  island.classList.add("expanded");
  notify.timer = setTimeout(() => island.classList.remove("expanded"), 950);
}

function fakePower(mode) {
  const screen = document.createElement("div");
  screen.style.position = "fixed";
  screen.style.inset = "0";
  screen.style.zIndex = "300";
  screen.style.display = "grid";
  screen.style.placeItems = "center";
  screen.style.background = "#020617";
  screen.style.color = "white";
  screen.style.fontSize = "32px";
  screen.textContent = `${mode}...`;
  document.body.appendChild(screen);

  setTimeout(() => {
    screen.textContent = "GLITCH OS";
    setTimeout(() => screen.remove(), 700);
  }, 900);
}

function buildBrowserApp() {
  return `
    <div class="browser-shell">
      <div class="browser-bar">
        <button id="browser-back" class="app-button">‹</button>
        <input id="browser-address" class="browser-input" value="https://example.com" placeholder="Enter URL or search">
        <button id="browser-go" class="app-button">Go</button>
        <button id="browser-open-tab" class="app-button">Open Tab</button>
      </div>
      <div class="browser-note">Some websites block embedded browser view. Use Open Tab if a page refuses to load.</div>
      <iframe id="browser-frame" class="browser-frame" src="https://example.com"></iframe>
    </div>
  `;
}

function bindBrowserApp() {
  const address = document.getElementById("browser-address");
  const frame = document.getElementById("browser-frame");
  const history = ["https://example.com"];

  function normalize(value) {
    const raw = value.trim();
    if (!raw) return "https://example.com";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    if (raw.includes(".") && !raw.includes(" ")) return `https://${raw}`;
    return `https://www.google.com/search?q=${encodeURIComponent(raw)}`;
  }

  function go() {
    const url = normalize(address.value);
    frame.src = url;
    address.value = url;
    history.push(url);
  }

  document.getElementById("browser-go").addEventListener("click", go);

  document.getElementById("browser-open-tab").addEventListener("click", () => {
    window.open(normalize(address.value), "_blank");
  });

  document.getElementById("browser-back").addEventListener("click", () => {
    if (history.length <= 1) return;
    history.pop();
    const previous = history[history.length - 1];
    frame.src = previous;
    address.value = previous;
  });

  address.addEventListener("keydown", event => {
    if (event.key === "Enter") go();
  });
}

boot();