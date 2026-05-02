setTimeout(() => {
  const bootScreen = document.getElementById('boot-screen');
  bootScreen.style.opacity = '0';
  setTimeout(() => {
    bootScreen.remove();
    showNotification('Welcome to WebOS', 'Double-click icons or right-click desktop to explore!');
  }, 600);
}, 2200);