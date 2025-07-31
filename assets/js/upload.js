// assets/js/upload.js

import { LOCATION_KEY } from './map/config.js';
import { map } from './map/index.js';
import { addPhotoMarkers } from './map/photoMarkers.js';

export function initGlobalUpload() {
  const btn   = document.getElementById('global-upload-btn');
  const input = document.getElementById('global-upload-input');
  if (!btn || !input) return;

  // 1) CLIC → ouvre immédiatement le file picker
  btn.addEventListener('click', () => {
    input.click();
  });

  // 2) Quand l’utilisateur choisit ses photos…
  input.addEventListener('change', async e => {
    const files = e.target.files;
    if (!files.length) {
      return alert('❗️ Aucune photo sélectionnée.');
    }
    // 3) On récupère la position stockée depuis currentLocation.json
    let coords;
    try {
      const res = await fetch(`/currentLocation.json?ts=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const { lat, lon } = data;
      if (lat == null || lon == null) {
        return alert('❌ Position non disponible.');
      }
      coords = { latitude: lat, longitude: lon };
    } catch (err) {
      console.error('Impossible de récupérer la position stockée :', err);
      return alert('❌ Impossible de récupérer votre position.');
    }

    // 4) Détermine un nom de “ville”
    const { latitude: lat, longitude: lon } = coords;
    let cityName = `Coord_${lat.toFixed(3)}_${lon.toFixed(3)}`;
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        cityName = geoData.address?.city
                || geoData.address?.town
                || geoData.address?.village
                || cityName;
      }
    } catch {/* silent */}

    // 5) Prépare l’upload en générant un nom unique pour chaque fichier
    const fd = new FormData();
    Array.from(files).forEach((f, i) => {
      // on extrait l’extension
      const ext = f.name.split('.').pop().toLowerCase();
      // on crée un nom unique : timestamp + index
      const filename = `${Date.now()}_${i}.${ext}`;
      // on ajoute en passant filename en 3ème paramètre
      fd.append('photos[]', f, filename);
    });

    try {
      const res = await fetch(
        `/upload.php?city=${encodeURIComponent(cityName)}&key=${encodeURIComponent(LOCATION_KEY)}&lat=${lat}&lon=${lon}`,
        { method: 'POST', body: fd }
      );
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || res.statusText);
      }
      const { files: uploaded } = await res.json();
      alert(`✅ ${uploaded.length} photo(s) uploadée(s) avec succès à “${cityName}” !`);
      addPhotoMarkers(map);
    } catch (err) {
      console.error('Erreur lors de l’upload global :', err);
      alert(`❌ Échec de l’upload : ${err.message}`);
    }
  });
}

export function hidePrivateSections() {
  if (!LOCATION_KEY) {
    document.querySelectorAll(
      '#reservations, #guestbook-form-container, #global-upload-btn, #global-upload-input'
    ).forEach(el => {
      if (el) el.style.display = 'none';
    });
  }
}