document.addEventListener('DOMContentLoaded', function () {
  const profileCard = document.querySelector('.profile-card');

  if (!profileCard) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const offset = scrollY * 0.05; // semakin kecil, semakin lembut
    profileCard.style.transform = `translateY(${offset}px)`;
  });
});

/**
 * Mengatur titik aktif (active dot) pada dock berdasarkan posisi scroll
 */
function updateActiveDot() {
  // Ambil elemen dock secara dinamis karena dimuat via footer.js
  const dockItems = document.querySelectorAll('.dock-item');
  if (dockItems.length === 0) return;

  const scrollY = window.scrollY + window.innerHeight / 3;
  let activeHref = '#';

  dockItems.forEach(item => {
    const dot = item.querySelector('.dock-dot');
    if (dot) dot.classList.remove('active');

    const href = item.getAttribute('href') || '';
    const id = href.startsWith('#') ? href.replace('#', '') : '';
    const el = id ? document.getElementById(id) : null;

    // Cek jika posisi scroll sudah melewati elemen terkait
    if (el && el.offsetTop <= scrollY) {
      activeHref = href;
    }
  });

  // Terapkan kelas active pada item yang sesuai
  dockItems.forEach(item => {
    if ((item.getAttribute('href') || '') === activeHref) {
      const dot = item.querySelector('.dock-dot');
      if (dot) dot.classList.add('active');
    }
  });
}

// Jalankan fungsi saat scroll dan saat halaman selesai dimuat sepenuhnya
window.addEventListener('scroll', updateActiveDot, { passive: true });
window.addEventListener('load', updateActiveDot);

    // ============================
    // Scroll animation on load
    // ============================
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.tl-col, .connect-card').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
      observer.observe(el);
    });