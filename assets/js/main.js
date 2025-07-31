// assets/js/map/main.js
import { initMap, map } from './map/index.js';
import { cities, lodging, plusBeaux, START_DATE } from './map/config.js';
import { buildTimeline, setupFilters } from './map/timeline.js';
import { initCountdown } from './countdown.js';
import { initGlobalUpload, hidePrivateSections } from './upload.js';
import { initGuestbook } from './guestbook.js';
import { initComments } from './comments.js';
import { initGallery } from './gallery.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1) timeline, carte & modules
  await buildTimeline(cities, lodging, plusBeaux, START_DATE);
  setupFilters();
  await initMap();
  initGallery();
  initGlobalUpload();
  hidePrivateSections();
  initGuestbook();
  initComments();
  initCountdown();

  // 2) mini-menu “Comment ça roule ?”
  const cards    = document.querySelectorAll('#how-it-works .card');
  const sections = document.querySelectorAll('.content-box');

  // en haut de ton module
  let journalToggleInitialized = false;

  function initJournalToggle() {
    const toggleBtn  = document.getElementById('toggle-intro');
    const fullIntro  = document.getElementById('journal-content');
    if (!toggleBtn || !fullIntro) return;

    toggleBtn.addEventListener('click', () => {
      fullIntro.classList.toggle('open');
      toggleBtn.textContent = fullIntro.classList.contains('open')
        ? '🔽 Masquer'
        : '📖 Lire l’intro complète';
    });
  }

  function showSection(id) {
    // 1. Affichage / masquage des sections
    sections.forEach(sec => {
      sec.style.display = sec.id === id ? 'block' : 'none';
    });
    // 2. Marquer la carte active
    cards.forEach(c => c.classList.toggle('active', c.dataset.target === id));

    // 3. Re‐redessiner la carte quand on revient sur la section roadtrip
    if (id === 'roadtrip-section') {
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    // 4. Initialiser le toggle du journal la première fois qu'on y arrive
    if (id === 'guestbook-section' && !journalToggleInitialized) {
      initJournalToggle();
      journalToggleInitialized = true;
    }
  }


    cards.forEach(card => {
    card.addEventListener('click', () => {
      const target = card.dataset.target;
      if (!target) return;
      showSection(target);

      // Sur mobile, on scrolle sous la barre de navigation
      const section = document.getElementById(target);
      if (section) {
        const offset = window.innerWidth <= 767 ? -60 : 0;
        const top = section.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  if (cards[0]) {
    showSection(cards[0].dataset.target);
  }
});
