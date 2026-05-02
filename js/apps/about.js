registerApp('about', function buildAboutHTML() {
  return `
    <div class="about-container">
      <div class="about-logo">💻</div>
      <div class="about-name">WebOS</div>
      <div class="about-version">Version 1.0 — Built with HTML, CSS &amp; JS</div>
      <div class="about-details">
        Apps: Files, Notepad, Calculator, Settings<br>
        Features: Drag, Resize, Maximize, Minimize<br>
        Wallpaper changer, Live clock<br><br>
        <span class="about-highlight">Made by Apna Naam 🚀</span>
      </div>
    </div>
  `;
});