const dockEl = document.getElementById('dock');

dockEl.addEventListener('mousemove', function(e) {
  const items = Array.from(dockEl.querySelectorAll('.dock-item'));
  const ICON_SIZE     = 54;
  const MAX_SCALE     = 1.7;
  const EFFECT_RADIUS = 90;

  items.forEach(item => {
    const wrap = item.querySelector('.dock-icon-wrap');
    if (!wrap) return;

    const rect   = item.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const dist   = Math.abs(e.clientX - center);

    if (dist < EFFECT_RADIUS) {
      const ratio = 1 - dist / EFFECT_RADIUS;
      const scale = 1 + (MAX_SCALE - 1) * ratio;
      const lift  = (scale - 1) * ICON_SIZE * 0.6;
      wrap.style.transform = `translateY(-${lift}px) scale(${scale})`;
    } else {
      wrap.style.transform = '';
    }
  });
});

dockEl.addEventListener('mouseleave', function() {
  dockEl.querySelectorAll('.dock-icon-wrap').forEach(w => {
    w.style.transform = '';
  });
});

function triggerDockBounce(id) {
  const dockItem = document.getElementById('dock-' + id);
  if (!dockItem) return;
  const wrap = dockItem.querySelector('.dock-icon-wrap');
  if (!wrap) return;

  wrap.classList.remove('bouncing');
  void wrap.offsetWidth;

  wrap.style.animation = 'dockBounce 0.65s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
  wrap.addEventListener('animationend', () => {
    wrap.style.animation = '';
  }, { once: true });
}