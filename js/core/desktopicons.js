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
    media: `<svg viewBox="0 0 64 64"><rect x="10" y="14" width="44" height="36" rx="8"/><path d="M28 24l14 8-14 8z"/></svg>`,
    browser: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24"/><path d="M8 32h48M32 8c8 8 8 40 0 48M32 8c-8 8-8 40 0 48"/></svg>`,
    game: `<svg viewBox="0 0 64 64"><rect x="9" y="22" width="46" height="26" rx="13"/><path d="M21 31v8M17 35h8M42 32h1M49 38h1"/></svg>`,
    calculator: `<svg viewBox="0 0 64 64"><rect x="14" y="7" width="36" height="50" rx="8"/><path d="M22 18h20M23 30h1M32 30h1M41 30h1M23 40h1M32 40h1M41 40h1M23 50h1M32 50h10"/></svg>`,
  };

  return icons[type] || icons.browser;
}

function iconMarkup(app, className = "app-icon") {
  return `<div class="${className}" style="--icon-color:${app.color}">${appIcon(app.icon)}</div>`;
}

function renderDesktopIcons() {
  const container = document.getElementById("desktop-icons");
  if (!container) return;

  container.innerHTML = "";

  const positions = loadFromStorage("glitch-icon-positions", {});

  Object.entries(appRegistry).forEach(([id, app], index) => {
    const icon = document.createElement("div");
    icon.className = "desktop-icon";
    icon.style.left = (positions[id]?.left ?? 0) + "px";
    icon.style.top = (positions[id]?.top ?? index * 96) + "px";

    icon.innerHTML = `
      ${iconMarkup(app)}
      <div class="desktop-icon-label">${app.name}</div>
    `;

    icon.addEventListener("dblclick", () => openApp(id));

    makeDesktopIconDraggable(icon, id);
    container.appendChild(icon);
  });
}

function makeDesktopIconDraggable(icon, id) {
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

      const positions = loadFromStorage("glitch-icon-positions", {});
      positions[id] = {
        left: icon.offsetLeft,
        top: icon.offsetTop
      };

      saveToStorage("glitch-icon-positions", positions);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
  });
}