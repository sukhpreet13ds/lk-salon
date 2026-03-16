document.addEventListener('DOMContentLoaded', () => {
    const dynamicText = document.getElementById('dynamic-text');
    const texts = [
        "YOUR CONFIDENCE.",
        "YOUR RADIANCE.",
        "YOUR ELEGANCE.",
        "YOUR LOOK.",
        "YOUR SHINE."
    ];
    let currentIndex = 0;

    function rotateText() {
        // Step 1: Fade out the current text
        dynamicText.classList.add('fade-out');

        setTimeout(() => {
            // Step 2: Change text and prepare for fade in
            currentIndex = (currentIndex + 1) % texts.length;
            dynamicText.textContent = texts[currentIndex];

            dynamicText.classList.remove('fade-out');
            dynamicText.classList.add('fade-in');

            // Force reflow
            void dynamicText.offsetWidth;

            // Step 3: Fade in the new text
            dynamicText.classList.remove('fade-in');
        }, 500); // Wait for fade-out transition (0.5s)
    }

    // Set interval for rotation
    setInterval(rotateText, 3000);

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;

    if (menuToggle && mobileMenu) {
        const menuClose = document.getElementById('menuClose');

        const toggleMenu = (forceClose = false) => {
            if (forceClose) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
            } else {
                menuToggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                
                if (mobileMenu.classList.contains('active')) {
                    body.style.overflow = 'hidden';
                } else {
                    body.style.overflow = '';
                }
            }
        };

        menuToggle.addEventListener('click', () => toggleMenu());
        
        if (menuClose) {
            menuClose.addEventListener('click', () => toggleMenu(true));
        }

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(true));
        });
    }
});
