document.addEventListener('DOMContentLoaded', function () {
  const profileCard = document.querySelector('.profile-card');

  if (!profileCard) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const offset = scrollY * 0.05; // semakin kecil, semakin lembut
    profileCard.style.transform = `translateY(${offset}px)`;
  });
});