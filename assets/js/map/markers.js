import { cities, lodging } from './config.js';
import { UPLOAD_KEY } from './config.js';
import { showLightbox, loadPhotos, uploadPhotos } from './photos.js';

export function addCityMarkers(map) {
  cities.forEach((city, idx) => {
    const marker = L.marker(city.coords, {
      icon: L.divIcon({
        className: 'marker-number',
        html:      `${idx + 1}`,
        iconSize:  [30, 30],
        iconAnchor:[15, 30]
      })
    }).addTo(map);

    const popup = document.createElement('div');
    popup.className = 'popup-container';
    popup.innerHTML = `
      <h3 class="popup-header">${city.name}</h3>
      <p class="popup-desc">${city.description}</p>
      <p class="popup-lodging">${lodging[city.name] || ''}</p>
      ${UPLOAD_KEY
        ? `<input type="file" multiple style="display:none">`
        : ''}
      <div class="photo-preview"></div>
    `.trim();

    const btn   = popup.querySelector('.upload-btn');
    const inp   = popup.querySelector('input[type=file]');
    const prev  = popup.querySelector('.photo-preview');
    const cityName = city.name;


    prev?.addEventListener('click', e => {
      if (e.target.tagName === 'IMG') {
        const imgs = Array.from(prev.querySelectorAll('img'));  // ❗️ On limite à cette preview
        const srcs = imgs.map(i => i.src);
        const idx0 = imgs.findIndex(i => i.src === e.target.src);
        showLightbox(srcs[idx0], city.name, srcs, idx0); // On donne la bonne liste
      }
    });

    if (btn && inp && prev) {
      btn.addEventListener('click', () => inp.click());
      inp.addEventListener('change', () => uploadPhotos(cityName, inp.files, prev));
    }

    marker.bindPopup(popup);

    marker.on('click', () => {
      marker.openPopup();
      setTimeout(() => {
        if (prev.childElementCount === 0) {
          loadPhotos(cityName, prev); // 💡 Ici on charge uniquement les photos de cette ville
        }
      }, 200);
    });
  });
}
