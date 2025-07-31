import { showLightbox, loadPhotos } from './photos.js';

let photoLayer = null;

export async function addPhotoMarkers(map) {
  if (photoLayer) {
    photoLayer.addTo(map);
    return photoLayer;
  }

  try {
    const res = await fetch('/location.php');
    if (!res.ok) return null;

    const markers = await res.json();
    photoLayer = L.layerGroup();

    markers.forEach(m => {
      const marker = L.marker([m.lat, m.lon], {
        icon: L.divIcon({
          className: 'photo-marker-icon',
          html: '📷',
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        })
      });

      const popup = document.createElement('div');
      popup.className = 'popup-container';
      popup.innerHTML = `
        <h3 class="popup-header">${m.city}</h3>
        <p class="popup-desc">Photos prises sur la route</p>
        <div class="photo-preview" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
      `.trim();

      const preview = popup.querySelector('.photo-preview');

      preview.addEventListener('click', e => {
        if (e.target.tagName === 'IMG') {
          const imgs = Array.from(preview.querySelectorAll('img'));
          const srcs = imgs.map(i => i.src);
          const idx0 = imgs.findIndex(i => i.src === e.target.src);
          showLightbox(srcs[idx0], m.city, srcs, idx0);
        }
      });

      marker.bindPopup(popup);

      marker.on('click', () => {
        marker.openPopup();
        setTimeout(() => {
          if (preview.childElementCount === 0) {
            loadPhotos(m.city, preview);
          }
        }, 200);
      });

      photoLayer.addLayer(marker);
    });

    photoLayer.addTo(map);
  } catch (err) {
    console.error('❌ Erreur dans addPhotoMarkers:', err);
  }

  return photoLayer;
}

export function togglePhotoLayer(map, show) {
  if (!photoLayer) return;
  show ? photoLayer.addTo(map) : photoLayer.remove();
}
