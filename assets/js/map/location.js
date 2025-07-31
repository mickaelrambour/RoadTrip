// assets/js/map/location.js
import { fetchWeather, renderWeather, applyTimeBasedBackground } from '../weather.js';
import { updateTimelineColor } from './timeline.js';
import { cities } from './config.js';

export async function showStoredLocation(map, viewerMarker) {
  try {
    const res = await fetch('/currentLocation.json?ts='+Date.now());
    if (!res.ok) throw new Error(res.status);
    const { lat, lon, city, timestamp } = await res.json();
    if (lat==null||lon==null) return viewerMarker;

    const ll = [lat, lon];
    if (!viewerMarker) {
      viewerMarker = L.marker(ll, {
        icon: L.divIcon({
          className:'user-marker-icon',
          html: `<div class="user-marker">
                   <img src="images/me.jpg" class="user-marker-img"/>
                   <div class="user-marker-label">Moi</div>
                 </div>`,
          iconSize:[50,50],
          iconAnchor:[25,50]
        }),
        zIndexOffset:-200
      }).addTo(map);
    } else {
      viewerMarker.setLatLng(ll).setZIndexOffset(-200);
    }

    const el = document.getElementById('current-position');
    if (el) {
      const d = new Date(timestamp*1000);
      el.innerHTML = `Actuellement à : <strong>${city||'inconnu'}</strong><br>
                      Dernière position : ${d.toLocaleString('fr-FR')}`;
    }

    updateTimelineColor(ll, cities);
    try {
      const w = await fetchWeather(lat, lon);
      renderWeather(w);
    } catch {}
  } catch (e) {
    console.error('showStoredLocation:', e);
  }
  return viewerMarker;
}