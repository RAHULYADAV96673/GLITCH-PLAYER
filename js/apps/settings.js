 registerApp('settings', function buildSettingsHTML() {
  const wallpaperThumbs = wallpaperList.map((url, i) => `
    <div
      class="wallpaper-thumb ${i === activeWallpaperIndex ? 'active' : ''}"
      id="wp-thumb-${i}"
      style="background-image: url('${url}')"
      onclick="applyWallpaper(${i}); showNotification('Wallpaper Changed', 'New wallpaper applied!')">
    </div>
  `).join('');

  return `
    <div class="settings-section-title">APPEARANCE</div>
    <div class="setting-row">
      <span class="setting-label">Dark Mode</span>
      <div class="toggle on" onclick="this.classList.toggle('on')"></div>
    </div>
    <div class="setting-row">
      <span class="setting-label">Blur Effects</span>
      <div class="toggle on" onclick="this.classList.toggle('on')"></div>
    </div>
    <div class="setting-row">
      <span class="setting-label">Animations</span>
      <div class="toggle on" onclick="this.classList.toggle('on')"></div>
    </div>
    <div style="margin-top: 16px;">
      <div class="settings-section-title">WALLPAPER</div>
      <div class="wallpaper-grid">${wallpaperThumbs}</div>
    </div>
  `;
});