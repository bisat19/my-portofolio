/* ============================================
   CAROUSEL — center-focused with opacity fade
============================================ */
const track      = document.getElementById('carouselTrack');
const slides     = Array.from(track.querySelectorAll('.art-slide'));
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');
const viewport   = document.getElementById('carouselViewport');

let current = Math.floor(slides.length / 2); // start centered

function getSlideW() {
  const gap = 30;
  return (slides[0]?.offsetWidth || 320) + gap;
}

function getViewportCenter() {
  return viewport.offsetWidth / 2;
}

function updateCarousel(animated = true) {
  if (!animated) track.style.transition = 'none';
  else           track.style.transition = 'transform 0.5s cubic-bezier(0.77,0,0.18,1)';

  const sw      = getSlideW();
  const vCenter = getViewportCenter();
  // Track padding-left is 10% of viewport
  const trackPad = viewport.offsetWidth * 0.1;

  // Offset so current slide is centered in viewport
  const offset = trackPad + current * sw - vCenter + slides[0].offsetWidth / 2;
  track.style.transform = `translateX(-${offset}px)`;

  // Update opacity per slide
  slides.forEach((slide, i) => {
    const dist = Math.abs(i - current);
    slide.classList.remove('active', 'side', 'far');
    if (dist === 0)      { slide.classList.add('active'); slide.style.opacity = '1'; }
    else if (dist === 1) { slide.classList.add('side');   slide.style.opacity = '0.55'; }
    else if (dist === 2) {                                 slide.style.opacity = '0.28'; }
    else                 {                                 slide.style.opacity = '0.1'; }
  });
}

function goTo(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  updateCarousel(true);
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

// Click a slide to center it
slides.forEach((slide, i) => {
  slide.addEventListener('click', () => { if (i !== current) goTo(i); });
});

// Keyboard arrows
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  goTo(current - 1);
  if (e.key === 'ArrowRight') goTo(current + 1);
});

// Touch / swipe
let touchStartX = 0;
viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
viewport.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
});

// Wheel scroll on carousel
viewport.addEventListener('wheel', e => {
  e.preventDefault();
  goTo(current + (e.deltaX > 0 || e.deltaY > 0 ? 1 : -1));
}, { passive: false });

window.addEventListener('resize', () => updateCarousel(false));

// Init
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => updateCarousel(false), 50);
});


/* ============================================
   DRAGGABLE OBJECTS
   Works for both mouse and touch
============================================ */
function makeDraggable(el) {
  let startX, startY, origLeft, origTop, isDragging = false;

  // Normalize position to use left/top (convert right/bottom)
  function normalizePosition() {
    el.style.transition = 'none';
    const rect = el.getBoundingClientRect();
    el.style.left   = rect.left + 'px'; 
    el.style.top    = rect.top + 'px';
    el.style.right  = 'auto';
    el.style.bottom = 'auto';
  }

  function onStart(cx, cy) {
    normalizePosition();
    isDragging = true;
    startX = cx;
    startY = cy;
    origLeft = parseFloat(el.style.left) || 0;
    origTop  = parseFloat(el.style.top) || 0;
    el.classList.add('dragging');
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    if (isDragging) {
      el.style.left = (origLeft + e.clientX - startX) + 'px';
      el.style.top  = (origTop  + e.clientY - startY) + 'px';
    }
  }

  function onMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    el.classList.remove('dragging');
    el.style.transition = '';
    
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    // Soft bounce if out of screen
    const rect = el.getBoundingClientRect();
    let l = parseFloat(el.style.left);
    let t = parseFloat(el.style.top);
    if (rect.right  < 20)              l = -el.offsetWidth + 30;
    if (rect.left   > window.innerWidth  - 20) l = window.innerWidth  - 30;
    if (rect.bottom < 20)              t = -el.offsetHeight + 30;
    if (rect.top    > window.innerHeight - 20) t = window.innerHeight - 30;
    el.style.left = l + 'px';
    el.style.top  = t + 'px';
  }

  // Mouse
  el.addEventListener('mousedown', e => {
    e.preventDefault();
    onStart(e.clientX, e.clientY);
  });

  // Touch
  el.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    onStart(t.clientX, t.clientY);
  }, { passive: false });
  el.addEventListener('touchmove', e => {
    e.preventDefault();
    if (isDragging) {
      const t = e.touches[0];
      el.style.left = (origLeft + t.clientX - startX) + 'px';
      el.style.top  = (origTop  + t.clientY - startY) + 'px';
    }
  }, { passive: false });
  el.addEventListener('touchend', onMouseUp);
}

// Make all draggable elements draggable (including sticky title)
document.querySelectorAll('.draggable, .sticky-title').forEach(makeDraggable);


/* ============================================
   DOCK MAGNIFY
============================================ */
const dockItems = document.querySelectorAll('.dock-item');
dockItems.forEach((item, i) => {
  item.addEventListener('mouseenter', () => {
    dockItems.forEach(el => el.classList.remove('neighbor-1'));
    if (i > 0)                    dockItems[i-1].classList.add('neighbor-1');
    if (i < dockItems.length - 1) dockItems[i+1].classList.add('neighbor-1');
  });
  item.addEventListener('mouseleave', () => {
    dockItems.forEach(el => el.classList.remove('neighbor-1'));
  });
});
