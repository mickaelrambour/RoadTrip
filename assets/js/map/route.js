// assets/js/map/route.js
import { cities } from './config.js';

/**
 * Charge (ou génère) route_summary.json sur le serveur.
 * Retourne un tableau summary où summary[i] = { distance_m, duration_s }.
 */
async function loadRouteSummary() {
  // 1) Essaye de charger le JSON statique
  let resp = await fetch('/route_summary.json');
  if (resp.ok) {
    return resp.json();
  }
  // 2) Si 404 ou autre, on invoque le générateur côté serveur
  resp = await fetch('/generate_route_summary.php');
  if (!resp.ok) {
    console.error('Impossible de générer route_summary.json');
    return [];
  }
  return resp.json();
}

/**
 * Récupère le GeoJSON ORS pour le tronçon i, avec cache localStorage.
 */
export async function getLegGeoJSON(i) {
  const cacheKey = `leg_${i}`;
  const cached   = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const from   = cities[i - 1],
        to     = cities[i],
        coords = [
          [from.coords[1], from.coords[0]],
          [to.coords[1],   to.coords[0]]
        ];

  const res = await fetch('/directions.php', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ coordinates: coords })
  });
  if (!res.ok) throw new Error(`ORS ${res.status}`);
  const geo = await res.json();

  localStorage.setItem(cacheKey, JSON.stringify(geo));
  return geo;
}

/**
 * Trace chaque tronçon sur la carte ET injecte distance+durée
 * issues du JSON de résumé unique.
 */
export async function drawRouteByLegs(map) {
  // 0) Récupération unique de toutes les distances+durées
  const summary = await loadRouteSummary();

  const features = [];
  for (let i = 1; i < cities.length; i++) {
    let feat;
    try {
      const geo = await getLegGeoJSON(i);
      feat = geo.features[0];
    } catch {
      feat = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [cities[i-1].coords[1], cities[i-1].coords[0]],
            [cities[i].coords[1],   cities[i].coords[0]]
          ]
        }
      };
    }
    // on stocke l’index pour relier au <li>
    feat.properties.summary = {
      index: i,
      distance:  summary[i]?.distance_m ?? null,
      duration:  summary[i]?.duration_s ?? null
    };
    features.push(feat);
  }

  // 1) Trace la route sur la carte
  const routeLayer = L.geoJSON(
    { type:'FeatureCollection', features },
    { style:{ color:'blue', weight:4 } }
  ).addTo(map);

  // 2) Injecte distance & durée dans la timeline
  routeLayer.eachLayer(layer => {
    const { distance, duration, index } = layer.feature.properties.summary;
    const li = document.querySelector(`#city-list li[data-index="${index}"]`);
    if (!li) return;

    const meta = li.querySelector('.meta') || li;
    if (distance != null) {
      const km = (distance / 1000).toFixed(1);
      meta.insertAdjacentHTML('beforeend',
        `<span class="distance">🛣 ${km} km</span>`
      );
    }
    if (duration != null) {
      const totalMin = Math.round(duration / 60);
      const h        = Math.floor(totalMin / 60);
      const m        = totalMin % 60;
      const formatted = `${h} h ${m.toString().padStart(2,'0')}`;
      meta.insertAdjacentHTML('beforeend',
        `<span class="duration">⏱ ${formatted}</span>`
      );
    }
  });

  return routeLayer;
}