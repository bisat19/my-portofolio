/**
 * Fungsi untuk memuat footer.html secara dinamis
 */
async function initDynamicFooter() {
    try {
        const response = await fetch('footer.html');
        const html = await response.text();
        
        // Memasukkan konten footer ke bagian bawah body
        document.body.insertAdjacentHTML('beforeend', html);

        const dockItems = document.querySelectorAll('.dock-item');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        // Set active dot based on current page
        dockItems.forEach(item => {
            const href = item.getAttribute('href');
            const dot = item.querySelector('.dock-dot');
            
            if (dot) {
                // Jika href sesuai dengan nama file saat ini, atau jika di resume.html dan link adalah #
                if (href === currentPath || (currentPath === 'resume.html' && href === '#')) {
                    dot.classList.add('active');
                }
            }
        });

        // Jalankan efek magnify setelah elemen masuk ke DOM
        dockItems.forEach((item, i) => {
            item.addEventListener('mouseenter', () => {
                // Reset all
                dockItems.forEach(el => el.classList.remove('neighbor-1'));
                // Add neighbor class to adjacent items
                if (i > 0) dockItems[i - 1].classList.add('neighbor-1');
                if (i < dockItems.length - 1) dockItems[i + 1].classList.add('neighbor-1');
            });

            item.addEventListener('mouseleave', () => {
                dockItems.forEach(el => el.classList.remove('neighbor-1'));
            });
        });
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

document.addEventListener('DOMContentLoaded', initDynamicFooter);