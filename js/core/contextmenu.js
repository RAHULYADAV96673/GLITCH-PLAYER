const desktopEl    = document.getElementById('desktop');
const contextMenuEl = document.getElementById('context-menu');

desktopEl.addEventListener('contextmenu', e => {
  e.preventDefault();
  const safeX = Math.min(e.clientX, window.innerWidth  - 200);
  const safeY = Math.min(e.clientY, window.innerHeight - 160);
  contextMenuEl.style.left    = safeX + 'px';
  contextMenuEl.style.top     = safeY + 'px';
  contextMenuEl.style.display = 'block';
});

document.addEventListener('click', hideContextMenu);

function hideContextMenu() {
  contextMenuEl.style.display = 'none';
}