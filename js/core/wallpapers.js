const wallpaperList = [
  'https://i.ibb.co/SwfZxJKP/index-bg.jpg',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
  'https://images.unsplash.com/photo-1475274047050-1d0c0975864c?w=1920&q=80',
  'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1920&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
  'https://images.unsplash.com/photo-1540206395-68808572332f?w=1920&q=80',
];

let activeWallpaperIndex = 0;

function applyWallpaper(index) {
  activeWallpaperIndex = index;
  document.getElementById('desktop').style.backgroundImage = `url('${wallpaperList[index]}')`;
  document.querySelectorAll('.wallpaper-thumb').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
}

function cycleWallpaper() {
  hideContextMenu();
  const next = (activeWallpaperIndex + 1) % wallpaperList.length;
  applyWallpaper(next);
  showNotification('Wallpaper Changed', 'New wallpaper applied!', '🖼️');
}