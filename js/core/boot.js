function applySettings() {
  const settings = osState.settings;

  document.body.classList.remove("light-theme", "neon-theme", "solar-theme");

  if (settings.theme === "light") document.body.classList.add("light-theme");
  if (settings.theme === "neon") document.body.classList.add("neon-theme");
  if (settings.theme === "solar") document.body.classList.add("solar-theme");

  document.documentElement.style.setProperty("--accent", settings.accent);
  document.documentElement.style.setProperty("--accent-two", settings.accentTwo);
  document.documentElement.style.setProperty("--blur", settings.blur + "px");
  document.documentElement.style.setProperty("--window-radius", settings.radius + "px");

  const wallpaperLayer = document.getElementById("wallpaper-layer");
  if (wallpaperLayer) {
    wallpaperLayer.style.filter = `brightness(${settings.brightness / 100})`;
  }

  if (typeof applyClockStyle === "function") applyClockStyle();
  if (typeof applyQuickSettingsState === "function") applyQuickSettingsState();
}

function bootGlitchOS() {
  try {
    applySettings();
    applyWallpaper();

    renderDesktopIcons();
    renderDock();
    renderStartMenu();

    bindStartMenu();
    bindQuickSettings();
    bindDockMagnification();

    updateClock();
    setInterval(updateClock, 1000);

    makeClockMovable();


  } catch (error) {
    console.error("GLITCH OS boot failed:", error);
    alert("GLITCH OS boot failed. Open Console and check the error.");
  }
}

document.addEventListener("DOMContentLoaded", bootGlitchOS);