export async function initGallery() {
  const container = document.getElementById('gallery-container');
  if (!container) return;

  let photos = [];

  try {
    const res = await fetch('/list_uploads.php');
    if (!res.ok) throw new Error(res.statusText);
    photos = await res.json();
  } catch (e) {
    console.error('❌ Erreur chargement photos:', e);
    return;
  }

  if (photos.length === 0) return;

  // 2) Affiche-les toutes
  photos.forEach(({ file: src, city }, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img data-index="${idx}" src="${src}" alt="${city}">
      <div class="city-label">${city}</div>
    `;
    container.appendChild(item);
  });

  // Reste de ton code identique...
  const lb        = document.getElementById('lightbox');
  const imgEl     = document.getElementById('lightbox-img');
  const titleEl   = document.getElementById('lightbox-title');
  const counterEl = document.getElementById('lightbox-counter');
  const prevBtn   = document.getElementById('lightbox-prev');
  const nextBtn   = document.getElementById('lightbox-next');
  const closeBtn  = document.getElementById('lightbox-close');

  let currentIdx = 0;

  function showLightbox(idx) {
    currentIdx = idx;
    const { file: src, city } = photos[idx];
    imgEl.src = src;
    titleEl.textContent = city;
    counterEl.textContent = `${idx + 1} / ${photos.length}`;
    lb.style.display = 'flex';
    updateNav();
  }

  function updateNav() {
    prevBtn.style.visibility = currentIdx > 0 ? 'visible' : 'hidden';
    nextBtn.style.visibility = currentIdx < photos.length - 1 ? 'visible' : 'hidden';
  }

  function hideLightbox() {
    lb.style.display = 'none';
    imgEl.src = '';
  }

  container.querySelectorAll('img[data-index]').forEach(img => {
    img.addEventListener('click', e => {
      const idx = Number(e.currentTarget.dataset.index);
      showLightbox(idx);
    });
  });

  prevBtn.addEventListener('click', e => { e.stopPropagation(); if (currentIdx > 0) showLightbox(currentIdx - 1); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); if (currentIdx < photos.length - 1) showLightbox(currentIdx + 1); });
  closeBtn.addEventListener('click', hideLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) hideLightbox(); });
}
