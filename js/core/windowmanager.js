console.log("windowmanager.js loaded");

function openApp(id) {
  const app = appRegistry[id];
  if (!app) return;

  if (osState.openWindows[id]) {
    const existingWindow = document.getElementById(`window-${id}`);

    if (existingWindow && osState.minimizedWindows[id]) {
      existingWindow.style.display = "flex";
      osState.minimizedWindows[id] = false;
    }

    focusWindow(id);
    return;
  }

  const windowLayer = document.getElementById("window-layer");

  if (!windowLayer) {
    console.error("Missing #window-layer in index.html");
    return;
  }

  const windowElement = document.createElement("section");
  windowElement.className = "os-window focused";
  windowElement.id = `window-${id}`;
  windowElement.style.width = app.width + "px";
  windowElement.style.height = app.height + "px";
  windowElement.style.left = Math.max(24, (innerWidth - app.width) / 2 + Math.random() * 34) + "px";
  windowElement.style.top = Math.max(50, (innerHeight - app.height) / 2 + Math.random() * 24) + "px";
  windowElement.style.zIndex = ++osState.zIndex;

  windowElement.innerHTML = `
    <div class="window-titlebar">
      <div class="window-title">
        ${iconMarkup(app, "app-icon mini-icon")}
        <span>${app.name}</span>
      </div>

      <div class="window-controls">
        <button class="window-control minimize">─</button>
        <button class="window-control maximize">□</button>
        <button class="window-control close">×</button>
      </div>
    </div>

    <div class="window-body">${buildAppContent(id)}</div>
    <div class="resize-handle"></div>
  `;

  windowLayer.appendChild(windowElement);

  osState.openWindows[id] = true;
  osState.minimizedWindows[id] = false;

  bindWindowControls(windowElement, id);
  bindAppContent(id);
  focusWindow(id);
  updateRunningApps();

  if (typeof updateDockIndicators === "function") {
    updateDockIndicators();
  }

}

function buildAppContent(id) {
  if (id === "settings" && typeof buildSettingsApp === "function") return buildSettingsApp();
  if (id === "terminal" && typeof buildTerminalApp === "function") return buildTerminalApp();
  if (id === "files" && typeof buildFilesApp === "function") return buildFilesApp();
  if (id === "calculator" && typeof buildCalculatorApp === "function") return buildCalculatorApp();
  if (id === "compiler" && typeof buildCompilerApp === "function") return buildCompilerApp();
  if (id === "clock" && typeof buildClockApp === "function") return buildClockApp();
  if (id === "weather" && typeof buildWeatherApp === "function") return buildWeatherApp();
  if (id === "calendar" && typeof buildCalendarApp === "function") return buildCalendarApp();
  if (id === "browser") return buildBrowserApp();

  return `
    <div class="app-card">
      <h2>${appRegistry[id].name}</h2>
      <p>${appRegistry[id].name} is registered, but its app file is not loaded or its build function is missing.</p>
      <p style="color:var(--muted-text)">
        Check index.html script order and make sure the app file exists.
      </p>
    </div>
  `;
}

function bindAppContent(id) {
  if (id === "settings" && typeof bindSettingsApp === "function") bindSettingsApp();
  if (id === "terminal" && typeof bindTerminalApp === "function") bindTerminalApp();
  if (id === "files" && typeof bindFilesApp === "function") bindFilesApp();
  if (id === "calculator" && typeof bindCalculatorApp === "function") bindCalculatorApp();
  if (id === "compiler" && typeof bindCompilerApp === "function") bindCompilerApp();
  if (id === "clock" && typeof bindClockApp === "function") bindClockApp();
  if (id === "weather" && typeof bindWeatherApp === "function") bindWeatherApp();
  if (id === "calendar" && typeof bindCalendarApp === "function") bindCalendarApp();
  if (id === "browser" && typeof bindBrowserApp === "function") bindBrowserApp();
}

function bindWindowControls(windowElement, id) {
  windowElement.querySelector(".close").addEventListener("click", () => closeApp(id));
  windowElement.querySelector(".minimize").addEventListener("click", () => minimizeApp(id));
  windowElement.querySelector(".maximize").addEventListener("click", () => maximizeApp(id));
  windowElement.querySelector(".window-titlebar").addEventListener("mousedown", event => dragWindow(event, id));
  windowElement.querySelector(".resize-handle").addEventListener("mousedown", event => resizeWindow(event, id));
  windowElement.addEventListener("mousedown", () => focusWindow(id));
}

function focusWindow(id) {
  document.querySelectorAll(".os-window").forEach(windowElement => {
    windowElement.classList.remove("focused");
  });

  const windowElement = document.getElementById(`window-${id}`);
  if (!windowElement) return;

  windowElement.classList.add("focused");
  windowElement.style.zIndex = ++osState.zIndex;
  osState.activeWindow = id;
}

function closeApp(id) {
  const windowElement = document.getElementById(`window-${id}`);
  if (!windowElement) return;

  windowElement.classList.add("closing");

  setTimeout(() => {
    windowElement.remove();

    delete osState.openWindows[id];
    delete osState.minimizedWindows[id];
    delete osState.maximizedWindows[id];
    delete osState.previousWindowState[id];

    updateRunningApps();

    if (typeof updateDockIndicators === "function") {
      updateDockIndicators();
    }
  }, 160);
}

function minimizeApp(id) {
  const windowElement = document.getElementById(`window-${id}`);
  if (!windowElement) return;

  windowElement.style.display = "none";
  osState.minimizedWindows[id] = true;
  notify(`${appRegistry[id].name} minimized`);
}

function maximizeApp(id) {
  const windowElement = document.getElementById(`window-${id}`);
  if (!windowElement) return;

  if (osState.maximizedWindows[id]) {
    const old = osState.previousWindowState[id];

    if (!old) return;

    windowElement.style.left = old.left;
    windowElement.style.top = old.top;
    windowElement.style.width = old.width;
    windowElement.style.height = old.height;

    osState.maximizedWindows[id] = false;
    return;
  }

  osState.previousWindowState[id] = {
    left: windowElement.style.left,
    top: windowElement.style.top,
    width: windowElement.style.width,
    height: windowElement.style.height
  };

  windowElement.style.left = "8px";
  windowElement.style.top = "8px";
  windowElement.style.width = "calc(100vw - 16px)";
  windowElement.style.height = "calc(100vh - 72px)";

  osState.maximizedWindows[id] = true;
  focusWindow(id);
}

function dragWindow(event, id) {
  if (event.target.tagName === "BUTTON") return;

  const windowElement = document.getElementById(`window-${id}`);
  if (!windowElement) return;

  focusWindow(id);

  const startX = event.clientX;
  const startY = event.clientY;
  const startLeft = windowElement.offsetLeft;
  const startTop = windowElement.offsetTop;

  function move(e) {
    windowElement.style.left = Math.max(0, Math.min(startLeft + e.clientX - startX, innerWidth - 140)) + "px";
    windowElement.style.top = Math.max(0, Math.min(startTop + e.clientY - startY, innerHeight - 90)) + "px";
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
  const windowElement = document.getElementById(`window-${id}`);
  if (!windowElement) return;

  windowElement.style.top = "8px";
  windowElement.style.height = "calc(100vh - 72px)";
  windowElement.style.width = "calc(50vw - 12px)";
  windowElement.style.left = side === "left" ? "8px" : "calc(50vw + 4px)";

  notify(`Snapped ${appRegistry[id].name} ${side}`);
}

function resizeWindow(event, id) {
  event.stopPropagation();

  const windowElement = document.getElementById(`window-${id}`);
  if (!windowElement) return;

  const startX = event.clientX;
  const startY = event.clientY;
  const startWidth = windowElement.offsetWidth;
  const startHeight = windowElement.offsetHeight;

  function move(e) {
    windowElement.style.width = Math.max(340, startWidth + e.clientX - startX) + "px";
    windowElement.style.height = Math.max(240, startHeight + e.clientY - startY) + "px";
  }

  function end() {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", end);
  }

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", end);
}

function updateRunningApps() {
  const container = document.getElementById("running-apps");
  if (!container) return;

  container.innerHTML = "";

  Object.keys(osState.openWindows).forEach(id => {
    const app = appRegistry[id];

    const button = document.createElement("button");
    button.className = "running-app-button";
    button.innerHTML = `${iconMarkup(app)}<span>${app.name}</span>`;
    button.addEventListener("click", () => openApp(id));

    container.appendChild(button);
  });
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

      <div class="browser-note">
        Some websites block embedded browser view. Use Open Tab if a page refuses to load.
      </div>

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

window.openApp = openApp;