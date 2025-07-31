// assets/js/map/photos.js
import { UPLOAD_KEY } from './config.js';

export function showLightbox(currentSrc, city, all, idx) {
  const lb        = document.getElementById('lightbox');
  const imgEl     = document.getElementById('lightbox-img');
  const titleEl   = document.getElementById('lightbox-title');
  const counterEl = document.getElementById('lightbox-counter');
  const prevBtn   = document.getElementById('lightbox-prev');
  const nextBtn   = document.getElementById('lightbox-next');
  const closeBtn  = document.getElementById('lightbox-close');

  let currentIdx = idx;

  function updateView() {
    imgEl.src = all[currentIdx];
    titleEl.textContent = city;
    counterEl.textContent = `${currentIdx + 1} / ${all.length}`;
    prevBtn.style.visibility = currentIdx > 0 ? 'visible' : 'hidden';
    nextBtn.style.visibility = currentIdx < all.length - 1 ? 'visible' : 'hidden';
  }

  function hideLightbox() {
    lb.style.display = 'none';
    imgEl.src = '';
  }

  prevBtn.onclick = e => {
    e.stopPropagation();
    if (currentIdx > 0) {
      currentIdx--;
      updateView();
    }
  };

  nextBtn.onclick = e => {
    e.stopPropagation();
    if (currentIdx < all.length - 1) {
      currentIdx++;
      updateView();
    }
  };

  closeBtn.onclick = hideLightbox;
  lb.onclick = e => { if (e.target === lb) hideLightbox(); };

  lb.style.display = 'flex';
  updateView();
}


export function loadPhotos(city, preview) {
  fetch(`/photos.php?city=${encodeURIComponent(city)}`)
    .then(r => r.ok? r.json(): Promise.reject(r.status))
    .then(data => {
      preview.innerHTML = '';
      data.files.forEach(u => {
        const src = u.startsWith('http')? u : window.location.origin+u;
        const img = new Image(); img.src = src; img.alt = city;
        preview.appendChild(img);
      });
    })
    .catch(console.error);
}

export function uploadPhotos(city, files, preview) {
  if (!UPLOAD_KEY) return alert('❗️ Recharge la page avec ?key=TaClé');
  const fd = new FormData();
  Array.from(files).forEach(f => fd.append('photos[]', f));
  fetch(`/upload.php?city=${encodeURIComponent(city)}&key=${encodeURIComponent(UPLOAD_KEY)}`, {
    method:'POST', body:fd
  })
    .then(r => r.ok? r.json(): Promise.reject(r.status))
    .then(res => {
      preview.innerHTML = '';
      res.files.forEach(u => {
        const src = u.startsWith('http')? u : window.location.origin+u;
        preview.insertAdjacentHTML('beforeend', `<img src="${src}" alt="${city}">`);
      });
      alert(`✅ ${res.files.length} photo(s) uploadée(s) !`);
    })
    .catch(err => {
      console.error('Erreur upload :', err);
      alert('❌ Échec de l’upload');
    });
}