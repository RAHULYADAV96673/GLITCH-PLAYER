 function bindQuickSettings() {
  const panel = document.getElementById("quick-settings");
  const tray = document.getElementById("system-tray");

  tray.addEventListener("click", () => {
    panel.classList.toggle("hidden");
    document.getElementById("start-menu").classList.add("hidden");
  });

  document.getElementById("wifi-toggle").addEventListener("click", () => {
    osState.settings.wifi = !osState.settings.wifi;
    saveSettings();
    applySettings();
    notify(osState.settings.wifi ? "Wi-Fi enabled" : "Wi-Fi disabled");
  });

  document.getElementById("bluetooth-toggle").addEventListener("click", () => {
    osState.settings.bluetooth = !osState.settings.bluetooth;
    saveSettings();
    applySettings();
    notify(osState.settings.bluetooth ? "Bluetooth enabled" : "Bluetooth disabled");
  });

  document.getElementById("theme-toggle").addEventListener("click", () => {
    osState.settings.theme = osState.settings.theme === "light" ? "dark" : "light";
    saveSettings();
    applySettings();
  });

  document.getElementById("live-wallpaper-toggle").addEventListener("click", () => {
    osState.settings.liveWallpaper = !osState.settings.liveWallpaper;
    saveSettings();
    applyWallpaper();
  });

  document.getElementById("volume-slider").addEventListener("input", event => {
    osState.settings.volume = Number(event.target.value);
    saveSettings();
    applySettings();
  });

  document.getElementById("brightness-slider").addEventListener("input", event => {
    osState.settings.brightness = Number(event.target.value);
    saveSettings();
    applySettings();
  });
}

function applyQuickSettingsState() {
  const settings = osState.settings;

  document.getElementById("wifi-toggle").classList.toggle("active", settings.wifi);
  document.getElementById("bluetooth-toggle").classList.toggle("active", settings.bluetooth);
  document.getElementById("live-wallpaper-toggle").classList.toggle("active", settings.liveWallpaper);

  document.getElementById("volume-slider").value = settings.volume;
  document.getElementById("brightness-slider").value = settings.brightness;

  document.getElementById("tray-wifi").textContent = settings.wifi ? "Wi-Fi" : "No Wi-Fi";
  document.getElementById("tray-volume").textContent = "Vol " + settings.volume;
}