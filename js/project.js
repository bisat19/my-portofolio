/* ===========================
   SCROLL REVEAL
=========================== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => revealObserver.observe(el));


/* ===========================
   CAROUSEL
=========================== */
const track      = document.getElementById('carouselTrack');
const slides     = track.querySelectorAll('.carousel-slide');
const dotsWrap   = document.getElementById('carouselDots');
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');

// How many slides visible at once
const visibleCount = () => window.innerWidth <= 640 ? 1 : 2;
let currentIndex = 0;
let dots = [];

function buildDots() {
  dotsWrap.innerHTML = '';
  dots = [];
  const totalSteps = slides.length - visibleCount() + 1;
  for (let i = 0; i < totalSteps; i++) {
    const d = document.createElement('div');
    d.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
    dots.push(d);
  }
}

function goTo(index) {
  const total = slides.length - visibleCount() + 1;
  currentIndex = Math.max(0, Math.min(index, total - 1));

  const slideW = slides[0].offsetWidth;
  const gap = 20;
  track.style.transform = `translateX(-${currentIndex * (slideW + gap)}px)`;

  dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
}

prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

// Touch / swipe
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goTo(currentIndex + (diff > 0 ? 1 : -1));
});

buildDots();
window.addEventListener('resize', () => { buildDots(); goTo(Math.min(currentIndex, slides.length - visibleCount())); });


/* ===========================
   3D IPHONE TILT ON MOUSE MOVE
=========================== */
const iphoneEl   = document.getElementById('iphoneEl');
const iphoneBody = iphoneEl?.querySelector('.iphone-body');

if (iphoneBody) {
  document.addEventListener('mousemove', (e) => {
    const rect = iphoneEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / window.innerWidth;
    const dy = (e.clientY - cy) / window.innerHeight;

    const rotY = -8 + dx * 10;
    const rotX = 3  - dy * 6;
    iphoneBody.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;
  });
}


