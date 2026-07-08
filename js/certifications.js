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
// Create View PDF button for overlay
const overlayPdfBtn = document.createElement('a');
overlayPdfBtn.target = '_blank';
overlayPdfBtn.innerHTML = `
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>View PDF Version
`;
Object.assign(overlayPdfBtn.style, {
  position: 'fixed',
  bottom: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '12px 24px',
  borderRadius: '30px',
  background: '#4a90d9',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: '600',
  boxShadow: '0 8px 24px rgba(74, 144, 217, 0.4)',
  transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
  zIndex: '1001',
  fontFamily: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
});

overlayPdfBtn.addEventListener('mouseenter', () => {
  overlayPdfBtn.style.background = '#357abd';
  overlayPdfBtn.style.boxShadow = '0 8px 28px rgba(74, 144, 217, 0.55)';
  overlayPdfBtn.style.transform = 'translateX(-50%) scale(1.02)';
});
overlayPdfBtn.addEventListener('mouseleave', () => {
  overlayPdfBtn.style.background = '#4a90d9';
  overlayPdfBtn.style.boxShadow = '0 8px 24px rgba(74, 144, 217, 0.4)';
  overlayPdfBtn.style.transform = 'translateX(-50%)';
});

overlay.appendChild(overlayImg);
overlay.appendChild(overlayClose);
overlay.appendChild(overlayPdfBtn);
document.body.appendChild(overlay);

function openOverlay(src, pdfUrl) {
  if (!src) return;
  overlayImg.src = src;
  if (pdfUrl) {
    overlayPdfBtn.href = pdfUrl;
    overlayPdfBtn.style.display = 'inline-flex';
  } else {
    overlayPdfBtn.style.display = 'none';
  }
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
    const pdfUrl = card.getAttribute('data-pdf');
    if (img && img.src && !img.style.display.includes('none')) {
      openOverlay(img.src, pdfUrl);
    }
  });
});
