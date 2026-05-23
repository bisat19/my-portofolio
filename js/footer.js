/**
 * Fungsi untuk memuat footer.html secara dinamis
 */
async function initDynamicFooter() {
    try {
        const response = await fetch('footer.html');
        const html = await response.text();
        
        // Memasukkan konten footer ke bagian bawah body
        document.body.insertAdjacentHTML('beforeend', html);

        // Jalankan efek magnify setelah elemen masuk ke DOM
        const dockItems = document.querySelectorAll('.dock-item');

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