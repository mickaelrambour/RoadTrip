export function bindLightbox(previewEl, cityName) {
  if (!previewEl) return;
  previewEl.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') {
      const imgs = Array.from(previewEl.querySelectorAll('img'));
      const srcs = imgs.map(i => i.src);
      const idx0 = imgs.findIndex(i => i.src === e.target.src);
      if (idx0 !== -1) showLightbox(srcs[idx0], cityName, srcs, idx0);
    }
    previewEl.addEventListener('click', e => {

});

  });
}
