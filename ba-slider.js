/* ================================================================
   Multi-instance “before / after” slider (vanilla JS)
   – drop once per page, works for any number of .ba-slider blocks
================================================================ */
(function () {
  const sliders = document.querySelectorAll('.ba-slider');
  const clamp   = (v) => Math.min(Math.max(v, 0), 1);

  sliders.forEach(initSlider);

  /* ---------- initialise one slider ---------- */
  function initSlider(slider) {
    const imgs    = slider.querySelectorAll('.ba-img');
    const reveal  = slider.querySelector('.ba-img--reveal');
    const handle  = slider.querySelector('.ba-handle');

    /* Set proportional height based on first image’s aspect */
    function setHeight() {
      const img = imgs[0];
      if (!img.complete) { img.onload = setHeight; return; }
      const ratio = img.naturalHeight / img.naturalWidth;
      slider.style.height = slider.offsetWidth * ratio + 'px';
    }
    window.addEventListener('load', setHeight);
    window.addEventListener('resize', setHeight);

    /* Shared state */
    let pct = 0.5, dragging = false;
    render();

    /* Pointer & keyboard controls */
    slider.addEventListener('mousedown',  start);
    slider.addEventListener('touchstart', start, { passive: true });

    window.addEventListener('mousemove',  move);
    window.addEventListener('touchmove',  move, { passive: false });
    window.addEventListener('mouseup',    stop);
    window.addEventListener('touchend',   stop);

    slider.addEventListener('keydown', keyControl);

    /* ---------- helpers ---------- */
    function start(e) { dragging = true;  move(e); }
    function stop()  { dragging = false; }

    function move(e) {
      if (!dragging) return;
      const x = (e.touches ? e.touches[0].clientX : e.clientX);
      const rect = slider.getBoundingClientRect();
      pct = clamp((x - rect.left) / rect.width);
      render();
    }

    function keyControl(e) {
      const step = .02;
      if (e.key === 'ArrowLeft')  pct = clamp(pct - step);
      if (e.key === 'ArrowRight') pct = clamp(pct + step);
      render();
    }

    function render() {
      const pctStr = (pct * 100) + '%';
      reveal.style.clipPath = `inset(0 0 0 ${pctStr})`;
      handle.style.left      = pctStr;
    }
  }
})();
