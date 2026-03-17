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
    // SVG Flow Track — seamless loop duplication
    const svgTrack = document.querySelector('.svg-flow-track');
    if (svgTrack) {
        // Keep only first 6 real items (remove any bad duplicates)
        const allItems = Array.from(svgTrack.querySelectorAll('.svg-item'));
        const originals = allItems.slice(0, 6);

        // Remove everything past the 6 originals
        allItems.slice(6).forEach(el => el.remove());

        // Clone the original 6 and append for seamless loop
        originals.forEach(item => {
            svgTrack.appendChild(item.cloneNode(true));
        });
    }

    // Pricing Tab Loading Logic
    const pricingTabs = document.querySelectorAll('#pricingTabs .nav-link');
    const pricingLoader = document.getElementById('pricingLoader');
    const pricingPanes = document.querySelectorAll('.pricing-content .tab-pane');

    if (pricingTabs.length > 0 && pricingLoader) {
        pricingTabs.forEach(tab => {
            tab.addEventListener('show.bs.tab', (e) => {
                const targetId = e.target.getAttribute('data-bs-target');
                const targetPane = document.querySelector(targetId);

                // Show loader and hide ALL panes immediately
                pricingLoader.classList.add('active');
                pricingPanes.forEach(p => p.classList.add('loading-pane'));

                // After 1.5 seconds, hide loader and show the single target pane
                setTimeout(() => {
                    pricingLoader.classList.remove('active');
                    pricingPanes.forEach(p => p.classList.remove('loading-pane'));
                }, 500); 
            });
        });
    }

    // Video Modal Stop Logic
    const videoModalElement = document.getElementById('videoModal');
    const videoFrameElement = document.getElementById('salonVideoFrame');
    if (videoModalElement && videoFrameElement) {
        const videoSrc = videoFrameElement.src;
        videoModalElement.addEventListener('hidden.bs.modal', function () {
            videoFrameElement.src = "";
            videoFrameElement.src = videoSrc;
        });
    }

    // Feedback Slider Logic
    const track = document.getElementById('feedbackTrack');
    const dots = document.querySelectorAll('#feedbackDots .dot');
    const container = document.querySelector('.feedback-slider-container');
    
    if (track && container) {
        let isPressed = false;
        let startX;
        let scrollLeft;
        let autoSlideInterval;

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                const maxScroll = track.scrollWidth - container.offsetWidth;
                if (container.scrollLeft >= maxScroll - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Slide by one full 'page' (container width)
                    container.scrollBy({ left: container.offsetWidth + 30, behavior: 'smooth' });
                }
            }, 5000); // 5 seconds per view
        };

        const stopAutoSlide = () => clearInterval(autoSlideInterval);

        // Dragging Logic
        container.addEventListener('mousedown', (e) => {
            isPressed = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            stopAutoSlide();
        });

        container.addEventListener('mouseleave', () => {
            isPressed = false;
            startAutoSlide();
        });

        container.addEventListener('mouseup', () => {
            isPressed = false;
            startAutoSlide();
        });

        container.addEventListener('mousemove', (e) => {
            if (!isPressed) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        // Initialize Auto Slide
        startAutoSlide();

        // Update Dots based on 'pages' (3 cards per page)
        container.addEventListener('scroll', () => {
            const pageIndex = Math.round(container.scrollLeft / container.offsetWidth);
            
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === pageIndex);
            });
        });
    }

    // About Section Slideshow Logic
    const aboutSlideContainer = document.querySelector('.about-slideshow-container');
    if (aboutSlideContainer) {
        const slides = aboutSlideContainer.querySelectorAll('.about-slide');
        let currentAboutIndex = 0;

        function nextAboutSlide() {
            // Remove active class from CURRENT
            slides[currentAboutIndex].classList.remove('active');
            
            // Increment index
            currentAboutIndex = (currentAboutIndex + 1) % slides.length;
            
            // Add active class to NEW
            slides[currentAboutIndex].classList.add('active');
        }

        // Set interval for slideshow (4 seconds)
        setInterval(nextAboutSlide, 4000);
    }
});
