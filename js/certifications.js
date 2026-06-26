/* ============================================
   FOLDER CLICK — reveal certificates
============================================ */
const folder    = document.getElementById('folderWrap');
const clickLabel = document.getElementById('clickLabel');
const certTitle  = document.getElementById('certTitle');
const cards      = document.querySelectorAll('.cert-card');

let opened = false;

function openFolder() {
  if (opened) return;
  opened = true;

  // 1. Animate folder: open bounce
  const body = folder.querySelector('.folder-body');
  body.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  body.style.transform = 'translateY(-12px) scale(1.04)';
  setTimeout(() => { body.style.transform = ''; }, 320);

  // 2. Hide "Click Me!" → show cert title
  clickLabel.classList.add('hidden');
  setTimeout(() => {
    certTitle.classList.add('visible');
  }, 250);

  // 3. Reveal cards one by one with stagger
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('revealed');
    }, 380 + i * 90);
  });

  // Change cursor
  folder.style.cursor = 'default';
  folder.title = '';
  clickLabel.style.cursor = 'default';
}

folder.addEventListener('click', openFolder);
clickLabel.addEventListener('click', openFolder);

/* ============================================
   CARD LIGHTBOX — click to see full cert
============================================ */
// Create overlay
const overlay = document.createElement('div');
overlay.id = 'certOverlay';
Object.assign(overlay.style, {
  position: 'fixed', inset: '0',
  background: 'rgba(0,0,0,0.72)',
  backdropFilter: 'blur(8px)',
  zIndex: '1000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: '0',
  pointerEvents: 'none',
  transition: 'opacity 0.25s ease',
});

const overlayImg = document.createElement('img');
Object.assign(overlayImg.style, {
  maxWidth: '88vw', maxHeight: '88vh',
  borderRadius: '12px',
  boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  transform: 'scale(0.92)',
  transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
  cursor: 'default',
});

const overlayClose = document.createElement('button');
Object.assign(overlayClose.style, {
  position: 'fixed', top: '20px', right: '24px',
  width: '42px', height: '42px',
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(6px)',
  color: '#fff',
  fontSize: '1.4rem',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.2s',
  zIndex: '1001',
});
overlayClose.textContent = '×';
overlayClose.addEventListener('mouseenter', () => overlayClose.style.background = 'rgba(255,255,255,0.28)');
overlayClose.addEventListener('mouseleave', () => overlayClose.style.background = 'rgba(255,255,255,0.15)');

overlay.appendChild(overlayImg);
overlay.appendChild(overlayClose);
document.body.appendChild(overlay);

function openOverlay(src) {
  if (!src) return;
  overlayImg.src = src;
  overlay.style.pointerEvents = 'all';
  overlay.style.opacity = '1';
  setTimeout(() => { overlayImg.style.transform = 'scale(1)'; }, 10);
  document.body.style.overflow = 'hidden';
}

function closeOverlay() {
  overlay.style.opacity = '0';
  overlayImg.style.transform = 'scale(0.92)';
  overlay.style.pointerEvents = 'none';
  document.body.style.overflow = '';
}

overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
overlayClose.addEventListener('click', closeOverlay);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlay(); });

cards.forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('.cert-img-wrap img');
    if (img && img.src && !img.style.display.includes('none')) {
      openOverlay(img.src);
    }
  });
});
