let activeSettingsTab = "Appearance";

function buildSettingsApp() {
  const tabs = ["Appearance", "Wallpaper", "Clock", "Window", "Dock", "System", "About"];

  return `
    <div class="settings-layout">
      <div class="settings-sidebar">
        ${tabs.map(tab => `<button class="settings-tab ${tab === activeSettingsTab ? "active" : ""}" data-settings-tab="${tab}">${tab}</button>`).join("")}
      </div>
      <div id="settings-content" class="settings-content">
        ${buildSettingsTab(activeSettingsTab)}
      </div>
    </div>
  `;
}

function buildSettingsTab(tab) {
  if (tab === "Appearance") {
    return `
      <div class="settings-card">
        <h3>Appearance</h3>
        <button class="app-button" data-theme="dark">Dark</button>
        <button class="app-button" data-theme="light">Light</button>
        <button class="app-button" data-theme="neon">Neon</button>
        <button class="app-button" data-theme="solar">Solar Punk</button>
      </div>
    `;
  }

  if (tab === "Wallpaper") {
    return `
      <div class="settings-card">
        <h3>Wallpaper</h3>
        <button class="app-button" data-wallpaper="default">Cyber Default</button>
        <button class="app-button" data-wallpaper="aurora">Aurora</button>
        <button class="app-button" data-wallpaper="sunset">Sunset</button>
        <button class="app-button" data-wallpaper="forest">Forest</button>
        <button class="app-button" id="live-wallpaper-button">Live Wallpaper</button>
        <label>Import Image or Video <input id="wallpaper-import" type="file" accept="image/*,video/*"></label>
      </div>
    `;
  }

  if (tab === "Clock") {
    return `
      <div class="settings-card">
        <h3>Mond Clock</h3>
        <label>Size <input id="clock-size-input" type="range" min="60" max="150" value="${osState.settings.clockSize}"></label>
        <label>Time Color <input id="clock-color-input" type="color" value="${osState.settings.clockColor}"></label>
        <label>Date Color <input id="clock-date-color-input" type="color" value="${osState.settings.clockDateColor}"></label>
        <label>Glow <input id="clock-glow-input" type="range" min="0" max="80" value="${osState.settings.clockGlow}"></label>
        <button id="clock-format-button" class="app-button">Toggle 12/24 Hour</button>
      </div>
    `;
  }

  if (tab === "Window") {
    return `
      <div class="settings-card">
        <h3>Windows</h3>
        <label>Glass Blur <input id="blur-input" type="range" min="8" max="45" value="${osState.settings.blur}"></label>
        <label>Window Radius <input id="radius-input" type="range" min="6" max="32" value="${osState.settings.radius}"></label>
        <label>Brightness <input id="brightness-input" type="range" min="45" max="110" value="${osState.settings.brightness}"></label>
      </div>
    `;
  }

  if (tab === "Dock") {
    return `
      <div class="settings-card">
        <h3>Dock</h3>
        <p>Dock uses macOS-like pointer magnification. Icons are generated from one SVG icon system, so they can be changed later.</p>
      </div>
    `;
  }

  if (tab === "System") {
    return `
      <div class="settings-card">
        <h3>System</h3>
        <p>GLITCH OS</p>
        <p>Vanilla HTML, CSS and JavaScript</p>
        <p>LocalStorage enabled</p>
        <p>PWA-ready browser OS</p>
      </div>
    `;
  }

  return `
    <div class="settings-card">
      <h3>About</h3>
      <p>This OS runs inside the browser. It cannot directly run Windows CMD or open Windows File Explorer because browsers block that for security.</p>
      <p>File Explorer uses browser file picker APIs. Terminal controls the Web OS system.</p>
    </div>
  `;
}

function bindSettingsApp() {
  document.querySelectorAll("[data-settings-tab]").forEach(button => {
    button.addEventListener("click", () => {
      activeSettingsTab = button.dataset.settingsTab;
      const body = document.querySelector("#window-settings .window-body");
      body.innerHTML = buildSettingsApp();
      bindSettingsApp();
    });
  });

  document.querySelectorAll("[data-theme]").forEach(button => {
    button.addEventListener("click", () => {
      osState.settings.theme = button.dataset.theme;
      saveSettings();
      applySettings();
    });
  });

  document.querySelectorAll("[data-wallpaper]").forEach(button => {
    button.addEventListener("click", () => {
      osState.settings.wallpaper = button.dataset.wallpaper;
      osState.settings.liveWallpaper = false;
      osState.settings.customWallpaper = "";
      osState.settings.customWallpaperType = "";
      osState.settings.accent = button.dataset.wallpaper === "default" ? "#ff18d8" : "#00d9ff";
      saveSettings();
      applyWallpaper();
    });
  });

  const accentInput = document.getElementById("accent-color-input");
  if (accentInput) {
    accentInput.addEventListener("input", event => {
      osState.settings.accent = event.target.value;
      saveSettings();
      applySettings();
    });
  }

  const liveButton = document.getElementById("live-wallpaper-button");
  if (liveButton) {
    liveButton.addEventListener("click", () => {
      osState.settings.liveWallpaper = true;
      osState.settings.customWallpaper = "";
      osState.settings.customWallpaperType = "";
      saveSettings();
      applyWallpaper();
    });
  }

  const wallpaperImport = document.getElementById("wallpaper-import");
  if (wallpaperImport) {
    wallpaperImport.addEventListener("change", event => {
      const file = event.target.files[0];
      if (!file) return;

      if (file.type.startsWith("image")) {
        const reader = new FileReader();
        reader.onload = () => {
          osState.settings.customWallpaper = reader.result;
          osState.settings.customWallpaperType = "image";
          osState.settings.liveWallpaper = false;
          saveSettings();
          applyWallpaper();
          notify("Wallpaper changed");
        };
        reader.readAsDataURL(file);
        return;
      }

      if (file.type.startsWith("video")) {
        osState.settings.customWallpaper = URL.createObjectURL(file);
        osState.settings.customWallpaperType = "video";
        osState.settings.liveWallpaper = false;
        saveSettings();
        applyWallpaper();
        notify("Video wallpaper active");
      }
    });
  }

  const clockSize = document.getElementById("clock-size-input");
  if (clockSize) {
    clockSize.addEventListener("input", event => {
      osState.settings.clockSize = Number(event.target.value);
      saveSettings();
      applyClockStyle();
    });
  }

  const clockColor = document.getElementById("clock-color-input");
  if (clockColor) {
    clockColor.addEventListener("input", event => {
      osState.settings.clockColor = event.target.value;
      saveSettings();
      applyClockStyle();
    });
  }

  const dateColor = document.getElementById("clock-date-color-input");
  if (dateColor) {
    dateColor.addEventListener("input", event => {
      osState.settings.clockDateColor = event.target.value;
      saveSettings();
      applyClockStyle();
    });
  }

  const clockGlow = document.getElementById("clock-glow-input");
  if (clockGlow) {
    clockGlow.addEventListener("input", event => {
      osState.settings.clockGlow = Number(event.target.value);
      saveSettings();
      applyClockStyle();
    });
  }

  const clockFormat = document.getElementById("clock-format-button");
  if (clockFormat) {
    clockFormat.addEventListener("click", () => {
      osState.settings.clockFormat = osState.settings.clockFormat === "24" ? "12" : "24";
      saveSettings();
      updateClock();
    });
  }

  const blurInput = document.getElementById("blur-input");
  if (blurInput) {
    blurInput.addEventListener("input", event => {
      osState.settings.blur = Number(event.target.value);
      saveSettings();
      applySettings();
    });
  }

  const radiusInput = document.getElementById("radius-input");
  if (radiusInput) {
    radiusInput.addEventListener("input", event => {
      osState.settings.radius = Number(event.target.value);
      saveSettings();
      applySettings();
    });
  }

  const brightnessInput = document.getElementById("brightness-input");
  if (brightnessInput) {
    brightnessInput.addEventListener("input", event => {
      osState.settings.brightness = Number(event.target.value);
      saveSettings();
      applySettings();
    });
  }
}