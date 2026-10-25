// Click-to-enlarge for the home pages' clips: the hero demo and the workflow
// grid, on neboto's page (clips in a .window) and nebaz's (bare video.clip). The page shows them below their 1200px size, the grid at about half,
// too small to read the TUI; the dialog replays the clip from the start, with
// controls and its caption. Esc, the close button, or a click outside the clip
// closes it.
(() => {
  // Each clip is a .window (or a bare video.clip) with a caption: a figcaption
  // in the grid, the .caption paragraph after it in the hero.
  const clips = [...document.querySelectorAll('.demo, .workflow-grid figure')].map(el => ({
    win: el.querySelector('.window, video.clip'),
    caption: el.querySelector('figcaption, .caption'),
    label: el.querySelector('figcaption strong')?.textContent || 'demo',
  }));
  if (!clips.length || typeof HTMLDialogElement !== 'function') return;

  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML =
    '<div class="window">' +
      '<div class="window-bar"><span></span><span></span><span></span>' +
        '<button class="lightbox-close" type="button" aria-label="Close">close ✕</button>' +
      '</div>' +
      '<div class="lightbox-video"></div>' +
    '</div>' +
    '<p class="lightbox-caption"></p>';
  document.body.appendChild(dialog);

  const slot = dialog.querySelector('.lightbox-video');
  const caption = dialog.querySelector('.lightbox-caption');
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  // A click on the dialog element itself (not its children) is the backdrop.
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { slot.replaceChildren(); caption.replaceChildren(); });

  const open = clip => {
    const video = (clip.win.matches('video') ? clip.win : clip.win.querySelector('video')).cloneNode(true);
    video.controls = true;
    video.currentTime = 0;
    slot.replaceChildren(video);
    const text = clip.caption.cloneNode(true);
    text.querySelectorAll('.enlarge').forEach(b => b.remove());
    caption.innerHTML = text.innerHTML;
    dialog.showModal();
    video.play().catch(() => {});
  };

  clips.forEach(clip => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'enlarge';
    btn.textContent = 'enlarge ⤢';
    btn.setAttribute('aria-label', 'Enlarge clip: ' + clip.label);
    // A bare clip has no window bar: the button goes under it, after the caption.
    const bar = clip.win.querySelector('.window-bar');
    if (bar) bar.appendChild(btn); else clip.caption.append(' ', btn);
    btn.addEventListener('click', e => { e.stopPropagation(); open(clip); });
    clip.win.classList.add('zoomable');
    clip.win.addEventListener('click', () => open(clip));
  });
})();
