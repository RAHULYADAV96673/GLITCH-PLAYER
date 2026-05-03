const desktopMenu = document.getElementById('desktop-ctx-menu');

document.getElementById('desktop').addEventListener('contextmenu', e => {
  if (e.target.closest('.d-icon')) return;
  e.preventDefault();
  const x = Math.min(e.clientX, window.innerWidth  - 200);
  const y = Math.min(e.clientY, window.innerHeight - 180);
  desktopMenu.style.left    = x + 'px';
  desktopMenu.style.top     = y + 'px';
  desktopMenu.style.display = 'block';
});

document.addEventListener('click', e => {
  if (!e.target.closest('#desktop-ctx-menu')) hideDesktopMenu();
});

function hideDesktopMenu() {
  desktopMenu.style.display = 'none';
}