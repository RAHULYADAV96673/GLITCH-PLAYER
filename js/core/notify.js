let notifTimer = null;

function showNotification(title, body, icon) {
  const toast = document.getElementById('notif-toast');
  document.getElementById('notif-toast-title').textContent = title;
  document.getElementById('notif-toast-body').textContent  = body;
  document.getElementById('notif-toast-icon').textContent  = icon || '💻';

  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');

  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}