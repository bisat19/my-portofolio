/* ============================================
   UTILITY
============================================ */
function rad(deg) { return deg * Math.PI / 180; }

/* ============================================
   HANDS FALLBACK
============================================ */
function handleHandsFallback() {
  // If the Google Drive image fails, show a nice SVG placeholder
  const wrap = document.getElementById('handsImg');
  wrap.innerHTML = `
    <svg width="420" height="280" viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:90vw">
      <!-- Left hand simplified -->
      <ellipse cx="130" cy="180" rx="80" ry="55" fill="#d4a98a" opacity="0.9"/>
      <ellipse cx="100" cy="155" rx="18" ry="40" fill="#c9986e" transform="rotate(-20 100 155)"/>
      <ellipse cx="120" cy="140" rx="16" ry="44" fill="#d4a98a" transform="rotate(-10 120 140)"/>
      <ellipse cx="142" cy="138" rx="15" ry="46" fill="#d4a98a" transform="rotate(0 142 138)"/>
      <ellipse cx="163" cy="142" rx="14" ry="42" fill="#c9986e" transform="rotate(8 163 142)"/>
      <ellipse cx="180" cy="150" rx="12" ry="36" fill="#c0906a" transform="rotate(16 180 150)"/>
      <!-- Right hand simplified -->
      <ellipse cx="290" cy="180" rx="80" ry="55" fill="#d4a98a" opacity="0.9"/>
      <ellipse cx="320" cy="155" rx="18" ry="40" fill="#c9986e" transform="rotate(20 320 155)"/>
      <ellipse cx="300" cy="140" rx="16" ry="44" fill="#d4a98a" transform="rotate(10 300 140)"/>
      <ellipse cx="278" cy="138" rx="15" ry="46" fill="#d4a98a" transform="rotate(0 278 138)"/>
      <ellipse cx="257" cy="142" rx="14" ry="42" fill="#c9986e" transform="rotate(-8 257 142)"/>
      <ellipse cx="240" cy="150" rx="12" ry="36" fill="#c0906a" transform="rotate(-16 240 150)"/>
    </svg>
  `;
}

/* ============================================
   CARD ORBIT ANIMATION
   - Cards start invisible
   - After "handsDelay" ms, they appear one-by-one (staggered)
   - Each card spins from a fast rotational offset, decelerating
     with an ease-out curve and settling at its final angle
============================================ */

const CARD_COUNT   = 5;
const ORBIT_R_BASE = 260;    // px — matches CSS --orbit-r default

// Final resting angles (degrees, 0 = right, clockwise)
// Positions approximate the mockup: top-left, top-right, mid-left, mid-right, bottom-center
const REST_ANGLES = [-125, -55, -175, -5, 90];

// Animation params
const HANDS_DELAY    = 900;   // ms: wait after page load before cards appear
const STAGGER        = 140;   // ms between each card appearing
const SPIN_DURATION  = 1800;  // ms: full spin-settle animation per card
const SPIN_EXTRA_DEG = 540;   // extra degrees to spin before settling

const cards = Array.from({ length: CARD_COUNT }, (_, i) => document.getElementById(`card${i}`));

// Responsive orbit radius
function getOrbitR() {
  const w = window.innerWidth;
  if (w <= 420) return 160;
  if (w <= 680) return 196;
  return ORBIT_R_BASE;
}

/* Apply transform to a card given a current angle in degrees */
function setCardTransform(card, angleDeg, scale = 1) {
  const r = getOrbitR();
  const a = rad(angleDeg);
  const tx = Math.cos(a) * r;
  const ty = Math.sin(a) * r;
  card.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`;
}

/* Ease out cubic */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

/* Animate a single card: spin → settle */
function animateCard(card, finalAngle, startDelay) {
  const startAngle = finalAngle + SPIN_EXTRA_DEG; // starts further along, spins back

  setTimeout(() => {
    card.style.opacity = '1';
    card.style.transition = 'opacity 0.3s ease';

    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / SPIN_DURATION, 1);
      const et = easeOutCubic(t);

      const currentAngle = startAngle - (startAngle - finalAngle) * et;
      // slight scale pop: grows from 0.6 to 1 quickly
      const scale = 0.6 + 0.4 * Math.min(et * 2, 1);
      setCardTransform(card, currentAngle, scale);

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        // Settle: make sure exact final position
        setCardTransform(card, finalAngle, 1);
        // Enable hover after settling
        card.style.transition = 'box-shadow 0.25s ease';
        addHoverEffect(card, finalAngle);
      }
    }

    // Set initial position (invisible) before opacity transition
    setCardTransform(card, startAngle, 0.6);
    requestAnimationFrame(frame);

  }, startDelay);
}

/* Hover: slight outward float */
function addHoverEffect(card, finalAngle) {
  const r = getOrbitR();
  const a = rad(finalAngle);
  const tx = Math.cos(a) * r;
  const ty = Math.sin(a) * r;

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease';
    const floatR = r + 18;
    const ftx = Math.cos(a) * floatR;
    const fty = Math.sin(a) * floatR;
    card.style.transform = `translate(calc(-50% + ${ftx}px), calc(-50% + ${fty}px)) scale(1.06)`;
    card.style.zIndex = '20';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease';
    card.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1)`;
    card.style.zIndex = '';
  });
}

/* Kick off all card animations */
function startOrbit() {
  cards.forEach((card, i) => {
    const delay = HANDS_DELAY + i * STAGGER;
    animateCard(card, REST_ANGLES[i], delay);
  });
}

/* ============================================
   RESIZE: reposition cards instantly
============================================ */
window.addEventListener('resize', () => {
  cards.forEach((card, i) => {
    if (parseFloat(card.style.opacity) > 0) {
      setCardTransform(card, REST_ANGLES[i], 1);
    }
  });
});

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

/* ============================================
   INIT
============================================ */
window.addEventListener('DOMContentLoaded', () => {
  // Initialize all cards at rest position but invisible
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    setCardTransform(card, REST_ANGLES[i], 0.6);
  });
  startOrbit();
});