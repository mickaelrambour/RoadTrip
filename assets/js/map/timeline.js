// assets/js/map/timeline.js
import { haversine } from "./utils.js";

// --- Setup du drag-scroll ---
function setupDragScroll(element) {
  let isDown = false;
  let startX;
  let scrollLeft;

  element.addEventListener('mousedown', e => {
    isDown = true;
    element.classList.add('active');
    startX = e.pageX - element.offsetLeft;
    scrollLeft = element.scrollLeft;
  });

  element.addEventListener('mouseleave', () => {
    isDown = false;
    element.classList.remove('active');
  });

  element.addEventListener('mouseup', () => {
    isDown = false;
    element.classList.remove('active');
  });

  element.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - element.offsetLeft;
    const walk = (x - startX) * 2;  // Ajuste la vitesse du scroll
    element.scrollLeft = scrollLeft - walk;
  });

  // Support tactile
  element.addEventListener('touchstart', e => {
    isDown = true;
    startX = e.touches[0].pageX - element.offsetLeft;
    scrollLeft = element.scrollLeft;
  });
  element.addEventListener('touchend', () => {
    isDown = false;
  });
  element.addEventListener('touchmove', e => {
    if (!isDown) return;
    const x = e.touches[0].pageX - element.offsetLeft;
    const walk = (x - startX) * 2;
    element.scrollLeft = scrollLeft - walk;
  });
}

export async function buildTimeline(cities, lodging, plusBeaux, START_DATE) {
  const tl = document.getElementById('city-list');
  if (!tl) return;
  tl.innerHTML = '';
    // 0) charger route_summary.json
  let routeSummary = [];
  try {
    const resp = await fetch('/route_summary.json');
    if (resp.ok) routeSummary = await resp.json();
  } catch (err) {
    console.warn('Impossible de charger route_summary.json', err);
  }
  // Réactive le drag-scroll sur la timeline
  setupDragScroll(tl);

  let date = new Date(START_DATE);
  let prevCoords = null;

  cities.forEach((city, i) => {
    const startISO = date.toISOString().slice(0,10);
    const nights = lodging[city.name] && lodging[city.name] !== 'traversée'
      ? parseInt(lodging[city.name], 10)
      : 0;
    const endDate = new Date(date);
    if (nights > 0) endDate.setDate(endDate.getDate() + nights);
    const endISO = endDate.toISOString().slice(0,10);
    const km = prevCoords ? haversine(prevCoords, city.coords) : null;
    const isKey = ['Salles-sur-Garonne','Nice','Montélimar','Annemasse'].includes(city.name);
    const isPB  = plusBeaux.includes(city.name);
    const stay  = nights > 0;
    const kind  = stay ? 'hebergement' : isKey ? 'point' : isPB ? 'village' : 'other';

    const li = document.createElement('li');
    li.className = `timeline-item upcoming ${kind}`;
    Object.assign(li.dataset, {
      index: i,
      name: city.name,
      lat: city.coords[0],
      lon: city.coords[1],
      startDateISO: startISO,
      endDateISO: endISO
    });
    li.innerHTML = `
      <div class="progress-bar"></div>
      <h4>${i+1}. ${city.name}</h4>
      <p class="date">${date.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})}</p>

      <p class="weather">☁️ chargement…</p>
    `;
    tl.appendChild(li);
    
    if (stay) {
      date.setDate(date.getDate() + nights);
    } else if (km > 250) {
      date.setDate(date.getDate() + 1);
    }
    prevCoords = city.coords;
  });

  // Météo pour chaque étape
  const MAX_DAYS = 16;
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + MAX_DAYS);

  tl.querySelectorAll('li').forEach(li => {
    const cityName = li.dataset.name;
    const lat      = li.dataset.lat;
    const lon      = li.dataset.lon;
    const startISO = li.dataset.startDateISO;
    const endISO   = li.dataset.endDateISO;
    const weatherEl= li.querySelector('.weather');
    const dStart = new Date(startISO);
    const dEnd   = new Date(endISO);
    if (dStart < today || dEnd > maxDate) {
      weatherEl.textContent = '⚠️ météo pas encore dispo';
      return;
    }
    const url = [
      'https://api.open-meteo.com/v1/forecast',
      `latitude=${encodeURIComponent(lat)}`,
      `longitude=${encodeURIComponent(lon)}`,
      'daily=temperature_2m_max,temperature_2m_min',
      'timezone=Europe/Paris',
      `start_date=${startISO}`,
      `end_date=${endISO}`
    ].join('&').replace('https://api.open-meteo.com/v1/forecast&','https://api.open-meteo.com/v1/forecast?');
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        const temps = data.daily;
        const min0 = Math.round(temps.temperature_2m_min[0]);
        const max0 = Math.round(temps.temperature_2m_max[0]);
        const last = temps.temperature_2m_min.length - 1;
        const min1 = Math.round(temps.temperature_2m_min[last]);
        const max1 = Math.round(temps.temperature_2m_max[last]);
        const nights = lodging[cityName] && lodging[cityName] !== 'traversée'
          ? parseInt(lodging[cityName], 10)
          : 0;
        weatherEl.textContent =
          nights>0
            ? `🌡 ${max0}°/${min0}° → ${max1}°/${min1}°`
            : `🌡 ${max0}°/${min0}°`;
      })
      .catch(() => {
        weatherEl.textContent = '⚠️ météo indispo';
      });
  });
}

export function colorTimeline(currentIdx) {
  document.querySelectorAll('#city-list li').forEach((li, idx) => {
    li.classList.toggle('passed', idx < currentIdx);
    li.classList.toggle('current', idx === currentIdx);
    li.classList.toggle('upcoming', idx > currentIdx);
    const bar = li.querySelector('.progress-bar');
    if (bar) bar.style.width = (idx === currentIdx ? '100%' : '0%');
  });
}

export function setupFilters() {
  document.querySelectorAll('#timeline-filters input[type=checkbox]').forEach(chk => {
    chk.addEventListener('change', () => {
      const active = Array.from(
        document.querySelectorAll('#timeline-filters input:checked')
      ).map(i => i.dataset.filter);
      document.querySelectorAll('.timeline-item').forEach(item => {
        let show = false;
        if (active.includes('all')) {
          show = true;
        } else {
          if (active.includes('village') && item.classList.contains('plusbeaux')) show = true;
          if (active.includes('point')   && item.classList.contains('point')) show = true;
          if (active.includes('hebergement') && item.classList.contains('hebergement')) show = true;
        }
        item.classList.toggle('hidden', !show);
      });
    });
  });
}

export function updateTimelineColor(latlon, cities) {
  const [lat, lon] = latlon;
  let closestIdx = 0;
  let minDist = haversine([lat, lon], cities[0].coords);
  for (let idx = 1; idx < cities.length; idx++) {
    const d = haversine([lat, lon], cities[idx].coords);
    if (d < minDist || (Math.abs(d - minDist) < 0.01 && idx < closestIdx)) {
      minDist = d;
      closestIdx = idx;
    }
  }
  colorTimeline(closestIdx);
  const items = document.querySelectorAll('#city-list li');
  items.forEach(li => {
    li.classList.remove('passed','current','upcoming');
    const bar = li.querySelector('.progress-bar');
    if (bar) bar.style.width = '0%';
  });
  if (minDist < 30) {
    const li = items[closestIdx];
    li.classList.add('current');
    let bar = li.querySelector('.progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'progress-bar';
      li.prepend(bar);
    }
    bar.style.width = '100%';
  } else {
    for (let i = 1; i < cities.length; i++) {
      const from = cities[i-1].coords;
      const to = cities[i].coords;
      const total = haversine(from, to);
      const done = haversine(from, [lat, lon]);
      const ratio = Math.min(1, Math.max(0, done/total));
      const distToLine = Math.abs(haversine([lat, lon], to));
      if (distToLine < 100) {
        const li = items[i];
        li.classList.add('current');
        let bar = li.querySelector('.progress-bar');
        if (!bar) {
          bar = document.createElement('div');
          bar.className = 'progress-bar';
          li.prepend(bar);
        }
        bar.style.width = `${(ratio*100).toFixed(1)}%`;
        break;
      }
    }
  }
  items.forEach((li, idx) => {
    if (idx < closestIdx) li.classList.add('passed');
    if (idx > closestIdx) li.classList.add('upcoming');
  });
}