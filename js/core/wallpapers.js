function applyWallpaper() {
  const wallpaperLayer = document.getElementById("wallpaper-layer");
  const wallpaperVideo = document.getElementById("wallpaper-video");
  const settings = osState.settings;

  if (!wallpaperLayer || !wallpaperVideo) return;

  wallpaperVideo.pause();
  wallpaperVideo.removeAttribute("src");
  wallpaperVideo.style.display = "none";

  if (settings.liveWallpaper) {
    wallpaperVideo.src = "https://cdn.coverr.co/videos/coverr-city-lights-1565/1080p.mp4";
    wallpaperVideo.style.display = "block";
    wallpaperVideo.play();
    wallpaperLayer.style.background = "#050712";
    return;
  }

  if (settings.customWallpaper) {
    if (settings.customWallpaperType === "image") {
      wallpaperLayer.style.background = `url("${settings.customWallpaper}") center / cover`;
      return;
    }

    if (settings.customWallpaperType === "video") {
      wallpaperVideo.src = settings.customWallpaper;
      wallpaperVideo.style.display = "block";
      wallpaperVideo.play();
      wallpaperLayer.style.background = "#050712";
      return;
    }
  }

  if (settings.wallpaper === "aurora") {
    wallpaperLayer.style.background = "radial-gradient(circle at 20% 20%, rgba(139,92,246,.48), transparent 30%), radial-gradient(circle at 80% 30%, rgba(14,165,233,.38), transparent 35%), #020617";
    return;
  }

  if (settings.wallpaper === "sunset") {
    wallpaperLayer.style.background = "linear-gradient(135deg, #25133f, #7c2d12, #f97316)";
    return;
  }

  if (settings.wallpaper === "forest") {
    wallpaperLayer.style.background = "linear-gradient(135deg, #052e16, #14532d, #0f172a)";
    return;
  }

  wallpaperLayer.style.background = "radial-gradient(circle at 14% 18%, rgba(255, 24, 216, 0.38), transparent 30%), radial-gradient(circle at 82% 20%, rgba(0, 217, 255, 0.25), transparent 34%), linear-gradient(135deg, #060817, #101827 50%, #030712)";
}