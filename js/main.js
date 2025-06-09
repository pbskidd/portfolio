// Initialize AOS animations
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && closeMobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.add('active');
        });

        closeMobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-lg', 'py-2');
                navbar.classList.remove('py-3');
            } else {
                navbar.classList.remove('shadow-lg', 'py-2');
                navbar.classList.add('py-3');
            }
        });
    }

    // Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('bg-accent', 'text-white'));
                
                // Add active class to clicked button
                this.classList.add('bg-accent', 'text-white');
                
                const filter = this.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});

// Image Modal Functionality
function openImageModal(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.id = 'imageModal';
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.className = 'image-modal-content';
    
    const exitButton = document.createElement('button');
    exitButton.className = 'exit-button';
    exitButton.textContent = 'Exit';
    exitButton.onclick = closeImageModal;
    
    modal.appendChild(img);
    modal.appendChild(exitButton);
    document.body.appendChild(modal);
    
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.remove();
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
    }
}

// Initialize clickable images on project pages
document.addEventListener('DOMContentLoaded', function() {
    const projectImages = document.querySelectorAll('.project-image');
    if (projectImages.length > 0) {
        projectImages.forEach(image => {
            image.style.cursor = 'pointer';
            image.addEventListener('click', function() {
                openImageModal(this.src);
            });
        });
    }
});
