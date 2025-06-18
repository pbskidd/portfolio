/* --------------------------------------------------
   Before / After slider – robust vanilla JS
-------------------------------------------------- */
const slider   = document.getElementById("slider");
const handle   = document.getElementById("handle");
const reveal   = document.getElementById("revealImg");

let isDragging = false;
let pct        = 0.5;          // current split, 0 … 1

/* utility */
const clamp = (v) => Math.min(Math.max(v, 0), 1);

/* render both clip-path & handle position */
function render() {
  const pctStr = (pct * 100) + "%";
  reveal.style.clipPath = `inset(0 0 0 ${pctStr})`;
  handle.style.left      = pctStr;
}

/* convert clientX to percentage & update */
function setFromX(clientX) {
  const rect = slider.getBoundingClientRect();
  pct = clamp((clientX - rect.left) / rect.width);
  render();
}

/* ---------- pointer events ---------- */
function down(e) {
  isDragging = true;
  setFromX(e.touches ? e.touches[0].clientX : e.clientX);
}
function move(e) {
  if (!isDragging) return;
  setFromX(e.touches ? e.touches[0].clientX : e.clientX);
}
function up() {
  isDragging = false;
}

/* listen on the whole slider for easier grabbing */
slider.addEventListener("mousedown",  down);
window.addEventListener("mousemove",  move);
window.addEventListener("mouseup",    up);

slider.addEventListener("touchstart", down, { passive: true });
window.addEventListener("touchmove",  move, { passive: false });
window.addEventListener("touchend",   up);

/* ---------- keyboard (← / →) ---------- */
window.addEventListener("keydown", (e) => {
  const step = 0.02;               // 2 %
  if (e.key === "ArrowLeft")  { pct = clamp(pct - step); render(); }
  if (e.key === "ArrowRight") { pct = clamp(pct + step); render(); }
});

/* -------- fit-to-width helper ------------------------------------
   Make the slider’s height = width × (image-aspect-ratio)
--------------------------------------------------------------------*/
function setSliderHeight() {
  // Use the base image (could be either one)
  const img = slider.querySelector('img');

  // Wait until the image is loaded the first time
  if (!img.complete) {
    img.onload = setSliderHeight;
    return;
  }

  const ratio = img.naturalHeight / img.naturalWidth;
  slider.style.height = slider.offsetWidth * ratio + 'px';
}

// Run once and on every resize
window.addEventListener('load',     setSliderHeight);
window.addEventListener('resize',   setSliderHeight);


/* initial draw */
render();
