import { initMap } from './map/index.js';
import { cities, lodging, plusBeaux, START_DATE } from './map/config.js';
import { buildTimeline } from './map/timeline.js';
import { initCountdown } from './countdown.js';
import { initGlobalUpload, hidePrivateSections } from './upload.js';
import { initGuestbook } from './guestbook.js';
import { initComments } from './comments.js';
import { initGallery } from './gallery.js';

document.addEventListener('DOMContentLoaded', async () => {
  await buildTimeline(cities, lodging, plusBeaux, START_DATE);
  await initMap();
  initGallery();
  initGlobalUpload();
  hidePrivateSections();
  initGuestbook();
  initComments();
  initCountdown();

  const toggleBtn = document.getElementById('toggle-intro');
  const fullIntro = document.getElementById('journal-content');
  if (toggleBtn && fullIntro) {
    toggleBtn.addEventListener('click', () => {
      fullIntro.classList.toggle('show');
      toggleBtn.textContent = fullIntro.classList.contains('show')
        ? '🔽 Masquer'
        : '📖 Lire l\u2019intro complète';
    });
  }
});

// Drag-to-scroll vertical sur la timeline
const timeline = document.querySelector('.timeline-card .timeline-grid');
if (timeline) {
  let isDown = false;
  let startY, scrollTop;

  timeline.addEventListener('mousedown', e => {
    isDown = true;
    timeline.classList.add('dragging');
    startY = e.pageY - timeline.offsetTop;
    scrollTop = timeline.scrollTop;
  });

  timeline.addEventListener('mouseleave', () => {
    isDown = false;
    timeline.classList.remove('dragging');
  });

  timeline.addEventListener('mouseup', () => {
    isDown = false;
    timeline.classList.remove('dragging');
  });

  timeline.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const y = e.pageY - timeline.offsetTop;
    const walk = (y - startY) * 1;    // multiplier pour accélérer ou ralentir
    timeline.scrollTop = scrollTop - walk;
  });

  // support tactile (optionnel)
  let touchStartY, touchScrollTop;
  timeline.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].pageY;
    touchScrollTop = timeline.scrollTop;
  });
  timeline.addEventListener('touchmove', e => {
    const y = e.touches[0].pageY;
    const walk = (y - touchStartY);
    timeline.scrollTop = touchScrollTop - walk;
  });
}

const youtubeVideos = [
  'https://youtu.be/aQ_wEkFwdN8',
  'https://youtu.be/Rs2VPsz7VGk',
  'https://youtu.be/_M6ka1ABmRA',
  'https://youtu.be/Zn8_gI1Xu-U',
  'https://youtu.be/hHQQknl_F-8',
  'https://youtu.be/MA9YECZEY28'
  
];

function displayYouTubeVideos(videoUrls) {
  const container = document.getElementById('youtube-gallery');
  if (!container) return;
  
  videoUrls.forEach(url => {
    const id = extractYouTubeID(url);
    if (!id) return;

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${id}`;
    iframe.width = '100%';
    iframe.height = '200';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.style.marginBottom = '1rem';
    iframe.style.borderRadius = '8px';

    container.appendChild(iframe);
  });
}

function extractYouTubeID(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^\s&]+)/);
  return match ? match[1] : null;
}

document.addEventListener('DOMContentLoaded', () => {
  displayYouTubeVideos(youtubeVideos);
});
