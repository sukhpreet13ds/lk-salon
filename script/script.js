document.addEventListener('DOMContentLoaded', () => {
    const dynamicText = document.getElementById('dynamic-text');
    const texts = [
        "CONFIDENCE.",
        "RADIANCE.",
        "ELEGANCE.",
        "LOOK.",
        "SHINE."
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

    // ── Rebuilt Feedback Slider (Infinite Loop + Responsive) ──
    const fbContainer = document.querySelector('.feedback-slider-container');
    const fbTrack = document.getElementById('feedbackTrack');
    const fbDotsContainer = document.getElementById('feedbackDots');
    
    if (fbContainer && fbTrack) {
        let items = Array.from(fbTrack.children);
        let perView = window.innerWidth < 768 ? 1 : (window.innerWidth < 1200 ? 2 : 3);
        const cardGap = perView === 1 ? 0 : 30; // Matches CSS responsive gap
        let currentIndex = perView; 
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;
        let autoSlideInterval;

        // 1. Clone items for seamless loop
        const firstClones = items.slice(0, perView).map(el => el.cloneNode(true));
        const lastClones = items.slice(-perView).map(el => el.cloneNode(true));
        
        lastClones.reverse().forEach(clone => fbTrack.prepend(clone));
        firstClones.forEach(clone => fbTrack.appendChild(clone));
        
        const allCards = Array.from(fbTrack.children);

        // 2. Dots Logic (Once + Update)
        const initDots = () => {
            if (!fbDotsContainer) return;
            fbDotsContainer.innerHTML = '';
            const pageCount = items.length > 6 ? 6 : items.length; // Max 6 clean dots
            
            for (let i = 0; i < pageCount; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    stopAutoSlide();
                    // Maps dot index to card index
                    const targetCardIndex = Math.round((i / (pageCount - 1)) * (items.length - 1)) + perView;
                    goToIndex(targetCardIndex);
                    startAutoSlide();
                });
                fbDotsContainer.appendChild(dot);
            }
        };

        const updateDots = () => {
            const dots = fbDotsContainer.querySelectorAll('.dot');
            if (dots.length === 0) return;
            
            // Map current card progress to dot index
            const progress = (currentIndex - perView + items.length) % items.length;
            const activeDotIndex = Math.round((progress / (items.length - 1)) * (dots.length - 1));
            
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === activeDotIndex);
            });
        };

        const getCardWidth = () => {
            const containerWidth = fbContainer.offsetWidth;
            if (perView === 1) return containerWidth;
            return (containerWidth - (cardGap * (perView - 1))) / perView;
        };

        const setPositionByIndex = (smooth = true) => {
            const cardWidth = getCardWidth();
            currentTranslate = -currentIndex * (cardWidth + cardGap);
            prevTranslate = currentTranslate;
            fbTrack.style.transition = smooth ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none';
            fbTrack.style.transform = `translateX(${currentTranslate}px)`;
            updateDots();
        };

        const goToIndex = (index) => {
            currentIndex = index;
            setPositionByIndex();
            
            // Handle seamless jump
            setTimeout(() => {
                if (currentIndex >= allCards.length - perView) {
                    currentIndex = perView;
                    setPositionByIndex(false);
                }
                if (currentIndex < perView) {
                    currentIndex = allCards.length - (perView * 2);
                    setPositionByIndex(false);
                }
            }, 600);
        };

        // 3. Interactions
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                goToIndex(currentIndex + 1);
            }, 4000);
        };
        const stopAutoSlide = () => clearInterval(autoSlideInterval);

        fbContainer.addEventListener('mouseenter', stopAutoSlide);
        fbContainer.addEventListener('mouseleave', startAutoSlide);

        // Dragging
        const touchStart = (index) => (e) => {
            stopAutoSlide();
            isDragging = true;
            startPos = (e.type.includes('mouse')) ? e.pageX : e.touches[0].clientX;
            animationID = requestAnimationFrame(animation);
        };

        const touchMove = (e) => {
            if (!isDragging) return;
            const currentPosition = (e.type.includes('mouse')) ? e.pageX : e.touches[0].clientX;
            const diff = currentPosition - startPos;
            currentTranslate = prevTranslate + diff;
        };

        const touchEnd = () => {
            isDragging = false;
            cancelAnimationFrame(animationID);
            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -100) goToIndex(currentIndex + 1);
            else if (movedBy > 100) goToIndex(currentIndex - 1);
            else setPositionByIndex();
            
            startAutoSlide();
        };

        const animation = () => {
            fbTrack.style.transform = `translateX(${currentTranslate}px)`;
            if (isDragging) requestAnimationFrame(animation);
        };

        fbTrack.addEventListener('mousedown', touchStart(currentIndex));
        fbTrack.addEventListener('touchstart', touchStart(currentIndex));
        fbTrack.addEventListener('mousemove', touchMove);
        fbTrack.addEventListener('touchmove', touchMove);
        fbTrack.addEventListener('mouseup', touchEnd);
        fbTrack.addEventListener('touchend', touchEnd);
        fbTrack.addEventListener('mouseleave', () => { if(isDragging) touchEnd(); });

        // Resize
        window.addEventListener('resize', () => {
            perView = window.innerWidth < 768 ? 1 : (window.innerWidth < 1200 ? 2 : 3);
            setPositionByIndex(false);
        });

        // Initialize
        initDots();
        setPositionByIndex(false);
        startAutoSlide();
        updateDots();
    }

    // About Section Slideshow Logic
    const aboutSlideContainer = document.querySelector('.about-slideshow-container');
    if (aboutSlideContainer) {
        const slides = aboutSlideContainer.querySelectorAll('.about-slide');
        let currentAboutIndex = 0;

        function nextAboutSlide() {
            slides[currentAboutIndex].classList.remove('active');
            currentAboutIndex = (currentAboutIndex + 1) % slides.length;
            slides[currentAboutIndex].classList.add('active');
        }
        setInterval(nextAboutSlide, 2500);
    }

    // Mobile Feature Stack Interaction
    const featureStackRow = document.querySelector('.features-cards-row');
    if (featureStackRow) {
        const stackItems = Array.from(featureStackRow.children);
        
        stackItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                if (window.innerWidth >= 768) return;

                if (!item.classList.contains('stack-active')) {
                    // Remove ALL stack classes from all items
                    stackItems.forEach(el => {
                        el.classList.remove('stack-active', 'stack-behind-1', 'stack-behind-2');
                    });
                    
                    // Set current item to ACTIVE (moves to bottom, but z-index front)
                    item.classList.add('stack-active');
                    
                    // Assign others to the "Behind" positions (top tabs)
                    const others = stackItems.filter(el => el !== item);
                    if (others[0]) others[0].classList.add('stack-behind-1');
                    if (others[1]) others[1].classList.add('stack-behind-2');
                }
            });
        });

        // Initialize (Third item is active to show the stack below it by default)
        if (window.innerWidth < 768 && stackItems[2]) {
            stackItems[2].click();
        }
    }
});
