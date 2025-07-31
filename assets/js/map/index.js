// assets/js/map/index.js
import { drawRouteByLegs } from './route.js';
import { addCityMarkers } from './markers.js';
import { showStoredLocation } from './location.js';
export { getLegGeoJSON } from './route.js';
export { haversine } from './utils.js';

let map, viewerMarker, routeLayer;

export async function initMap() {
  const FRANCE_CENTER = [46.5, 2.5];
  map = L.map('map', {
    fullscreenControl: true ,
    center: FRANCE_CENTER,
    zoom: 6,
    scrollWheelZoom: false
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  // Juste après la création de la carte :
    map.on('enterFullscreen', () => {
      console.log('🌕 Carte en plein écran !');
    });

    map.on('exitFullscreen', () => {
      console.log('↩️ Retour à la vue normale');
    });
  const sw = L.latLng(41.0, -5.0),
        ne = L.latLng(51.7, 9.6);
  map.setMaxBounds(L.latLngBounds(sw, ne));
  map.on('drag', () => map.panInsideBounds(map.getBounds(), { animate:false }));
  map.getContainer().addEventListener('mouseleave', () =>
    map.scrollWheelZoom.disable()
  );
  map.on('click', () =>
    map.scrollWheelZoom.enable()
  );

  routeLayer = await drawRouteByLegs(map);
  addCityMarkers(map);
  viewerMarker = await showStoredLocation(map, viewerMarker);
}

export { map };