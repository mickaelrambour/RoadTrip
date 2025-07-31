// assets/js/guestbook.js

import { LOCATION_KEY } from './map/config.js';

// Charge et affiche les entrées du carnet intime
async function loadGuestbook() {
  const res = await fetch('/guestbook.php?action=list');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const msgs = await res.json();
  const ul = document.getElementById('guestbook-messages');
  if (!ul) return;
  ul.innerHTML = '';
  msgs.forEach(({ name, message, date }) => {
    const li = document.createElement('li');
    const header = document.createElement('div');
    header.className = 'gb-header';

    const author = document.createElement('span');
    author.className = 'gb-author';
    author.textContent = name;

    const timeEl = document.createElement('time');
    timeEl.className = 'gb-date';
    timeEl.textContent = date;

    header.append(author, timeEl);

    const p = document.createElement('p');
    p.textContent = message;

    li.append(header, p);
    ul.appendChild(li);
  });
}

// Initialise le carnet intime (sans reposer sur DOMContentLoaded interne)
export function initGuestbook() {
  // 0) Affiche le form si on a la clé
  if (LOCATION_KEY === 'mic') {
    const container = document.getElementById('guestbook-form-container');
    if (container) container.style.display = 'block';
  }

  // 1) Charge au démarrage
  loadGuestbook().catch(err => {
    console.error('Impossible de charger le carnet intime :', err);
  });

  // 2) Gère l’envoi du formulaire
  const form = document.getElementById('guestbook-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(form);
    formData.append('key', LOCATION_KEY);

    try {
      const res = await fetch('/guestbook.php?action=add', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      await loadGuestbook();
      alert('✅ Message ajouté au carnet intime !');
    } catch (err) {
      console.error('Erreur lors de l’envoi du carnet intime :', err);
      alert('❌ Échec de l’envoi.');
    }
  });
}