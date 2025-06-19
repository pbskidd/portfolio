// =============================================================
// HERO CAROUSEL  —  endless right-to-left loop + per-slide Ken Burns
// =============================================================
//  * Carousel never vanishes: DOM‑shuffle method keeps translateX range 0→‑100%
//  * Slides always advance in the SAME direction (right→left) with no jerk
//  * Prev / Next buttons, dots, hover-pause & touch‑swipe all work
//  * Each slide gets its own 12 s Ken-Burns pan‑zoom that NEVER shows empty
//    edges (max ±6 % pan; img startsbigger than frame)
//
//  HTML assumptions (already in your markup):
//    <div id="carouselTrack" class="flex w-full">  <!-- overflow hidden on wrapper -->
//      <div class="carousel-slide"><img src="…"></div>
//      <div class="carousel-slide"><img src="…"></div>
//      <div class="carousel-slide"><img src="…"></div>
//    </div>
//    <button id="prevBtn">…</button>   <button id="nextBtn">…</button>
//    <span class="carousel-dot"></span> … (optional)
// -------------------------------------------------------------
(() => {
  // ---------- CONFIG ----------
  const SLIDE_MS = 7_000;           // one slide = 7 s
  const TRANSITION_MS = 700;         // slide scroll time

  // Per slide KenBurns specs (percent pan so edges never show)
  const PANS = [
    { name: 'pan0', from: 'scale(1.35) translate(0,0)',       to: 'scale(1.20) translate(6%,0)'  }, // out + right
    { name: 'pan1', from: 'scale(1.20) translate(0,0)',       to: 'scale(1.35) translate(-6%,0)' }, // in  + left
    { name: 'pan2', from: 'scale(1.35) translate(0,0)',       to: 'scale(1.20) translate(6%,6%)' }  // out + down‑right
  ];

  // ---------- ELEMENT HOOKS ----------
  const track   = document.getElementById('carouselTrack');
  if (!track) return;  // bail on pages w/out carousel

  const wrapper = track.parentElement;   // assumes overflow‑hidden on wrapper
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots    = Array.from(document.querySelectorAll('.carousel-dot'));

  // Store original index before we start shuffling
  Array.from(track.children).forEach((s, i) => (s.dataset.idx = i));

  // ---------- BUILD KEYFRAMES ONCE ----------
  const styleTag = document.createElement('style');
  styleTag.id = 'hero‑ken‑burns';
  styleTag.textContent = PANS.map(
    p => `@keyframes ${p.name}{0%{transform:${p.from}}100%{transform:${p.to}}}`
  ).join('\n');
  document.head.appendChild(styleTag);

  // ---------- HELPERS ----------
  let autoId; // interval id

  function children() {
    return Array.from(track.children);
  }

  function setActiveDot(realIdx) {
    dots.forEach((d, i) => d.classList.toggle('active', i === realIdx));
  }

  function runKenBurns() {
    // Active slide is always track.children[0]
    const slides = children();
    slides.forEach((slide) => {
      const img = slide.querySelector('img');
      if (!img) return;
      img.style.animation = 'none'; // reset
    });

    const activeSlide = slides[0];
    const realIdx = Number(activeSlide.dataset.idx) % PANS.length;
    const img = activeSlide.querySelector('img');
    if (img) {
      img.style.animation = `${PANS[realIdx].name} ${SLIDE_MS}ms linear forwards`;
    }

    setActiveDot(realIdx);
  }

  function shiftLeft() {
    track.style.transition = `transform ${TRANSITION_MS}ms ease-in-out`;
    track.style.transform = 'translateX(-100%)';

    track.addEventListener('transitionend', () => {
      // Step 1: stop transition and reset position
      track.style.transition = 'none';
      track.style.transform = 'translateX(0)';

      // Step 2: move first slide to end (DOM shuffle)
      track.appendChild(track.firstElementChild);

      runKenBurns();
    }, { once: true });
  }

  function shiftRight() {
    // Prepend last slide, offset, then animate back to 0
    track.style.transition = 'none';
    track.insertBefore(track.lastElementChild, track.firstElementChild);
    track.style.transform = 'translateX(-100%)';

    // Force reflow so next transition is recognised
    void track.offsetWidth;

    track.style.transition = `transform ${TRANSITION_MS}ms ease-in-out`;
    track.style.transform = 'translateX(0)';

    track.addEventListener('transitionend', runKenBurns, { once: true });
  }

  function startAuto() {
    stopAuto();
    autoId = setInterval(shiftLeft, SLIDE_MS);
  }

  function stopAuto() {
    if (autoId) clearInterval(autoId);
  }

  // ---------- EVENT BINDINGS ----------
  nextBtn?.addEventListener('click', () => { shiftLeft(); startAuto(); });
  prevBtn?.addEventListener('click', () => { shiftRight(); startAuto(); });

  dots.forEach((dot, i) =>
    dot.addEventListener('click', () => {
      // Figure out current visible real index
      const currentReal = Number(children()[0].dataset.idx);
      let steps = (i - currentReal + PANS.length) % PANS.length;
      if (steps === 0) return;
      // Decide shortest direction: left only because carousel is uni-directional
      for (let s = 0; s < steps; s++) shiftLeft();
      startAuto();
    })
  );

  // Hover pause (desktop) / touch pause (mobile)
  wrapper.addEventListener('mouseenter', stopAuto);
  wrapper.addEventListener('mouseleave', startAuto);
  wrapper.addEventListener('touchstart', stopAuto, { passive: true });
  wrapper.addEventListener('touchend', startAuto);

  // Simple swipe detection
  let touchX = null;
  wrapper.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  wrapper.addEventListener('touchend', (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) dx < 0 ? shiftLeft() : shiftRight();
    touchX = null;
    startAuto();
  });

  // ---------- INIT ----------
  runKenBurns();
  startAuto();
})();
