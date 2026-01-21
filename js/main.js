document.addEventListener('DOMContentLoaded', function () {
  const title = document.getElementById('title');
  const items = document.querySelectorAll('.image-item');

  if (!title || items.length === 0) return;

  setTimeout(() => {
    title.classList.add('animate');
  }, 300);

  setTimeout(() => {
    const isMobile = window.innerWidth <= 768;

    items.forEach((item, index) => {
      const delay = index * 0.1;
      item.style.transitionDelay = delay + 's';

      const target = item.dataset.target;
      const size = item.dataset.size || 120;
      const rotation = item.dataset.rotate || 0;

      let top, left, right, bottom;

      switch (target) {
        case 'left-top':
          top = isMobile ? '30%' : '20%';
          left = isMobile ? '10%' : '25%';
          break;
        case 'right-top':
          top = isMobile ? '30%' : '20%';
          left = isMobile ? '75%' : '75%';
          break;
        case 'left-bottom':
          bottom = isMobile ? '30%' : '25%';
          left = isMobile ? '10%' : '20%';
          break;
        case 'center-bottom':
          top = isMobile ? '70%' : '70%';
          left = isMobile ? '40%' : '45%';
          break;
        case 'right-bottom':
          bottom = isMobile ? '10%' : '25%';
          left = isMobile ? '70%' : '70%';
          break;
        default:
          top = '50%';
          left = '50%';
      }

      item.style.top = '';
      item.style.left = '';
      item.style.right = '';
      item.style.bottom = '';

      if (top !== undefined) item.style.top = top;
      if (left !== undefined) item.style.left = left;
      if (right !== undefined) item.style.right = right;
      if (bottom !== undefined) item.style.bottom = bottom;

      item.style.setProperty('--size', `${size}px`);
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';

      const img = item.querySelector('img');
      if (img) {
        img.style.setProperty('--rotation', `${rotation}deg`);
      }
    });
  }, 1300);
});