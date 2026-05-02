let notifTimer = null;

const notifIconMap = {
  explorer: '📁', notepad: '📝', calc: '🧮',
  settings: '⚙️', about: 'ℹ️',
};

function showNotification(title, body, icon) {
  const iconEl  = document.getElementById('notif-icon');
  const titleEl = document.getElementById('notif-title');
  const bodyEl  = document.getElementById('notif-body');
  const el      = document.getElementById('notification');

  if (iconEl)  iconEl.textContent  = icon || '💻';
  if (titleEl) titleEl.textContent = title;
  if (bodyEl)  bodyEl.textContent  = body;

  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');

  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => el.classList.remove('show'), 3200);
}