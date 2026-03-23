document.addEventListener('DOMContentLoaded', () => {
    const dynamicText = document.getElementById('dynamic-text');
    if (dynamicText) {
        const texts = [
            "CONFIDENCE.",
            "RADIANCE.",
            "ELEGANCE.",
            "LOOK.",
            "SHINE."
        ];
        let currentIndex = 0;

        function rotateText() {
            dynamicText.classList.add('fade-out');

            setTimeout(() => {
                currentIndex = (currentIndex + 1) % texts.length;
                dynamicText.textContent = texts[currentIndex];

                dynamicText.classList.remove('fade-out');
                dynamicText.classList.add('fade-in');

                void dynamicText.offsetWidth;

                dynamicText.classList.remove('fade-in');
            }, 500); 
        }

        setInterval(rotateText, 3000);
    }

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

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(true));
        });
    }
    const svgTrack = document.querySelector('.svg-flow-track');
    if (svgTrack) {
        const allItems = Array.from(svgTrack.querySelectorAll('.svg-item'));
        const originals = allItems.slice(0, 6);

        allItems.slice(6).forEach(el => el.remove());

        originals.forEach(item => {
            svgTrack.appendChild(item.cloneNode(true));
        });
    }

    const pricingTabs = document.querySelectorAll('#pricingTabs .nav-link');
    const pricingLoader = document.getElementById('pricingLoader');
    const pricingPanes = document.querySelectorAll('.pricing-content .tab-pane');

    if (pricingTabs.length > 0 && pricingLoader) {
        pricingTabs.forEach(tab => {
            tab.addEventListener('show.bs.tab', (e) => {
                const targetId = e.target.getAttribute('data-bs-target');
                const targetPane = document.querySelector(targetId);

                pricingLoader.classList.add('active');
                pricingPanes.forEach(p => p.classList.add('loading-pane'));

                setTimeout(() => {
                    pricingLoader.classList.remove('active');
                    pricingPanes.forEach(p => p.classList.remove('loading-pane'));
                }, 500); 
            });
        });
    }

    const videoModalElement = document.getElementById('videoModal');
    const videoFrameElement = document.getElementById('salonVideoFrame');
    if (videoModalElement && videoFrameElement) {
        const videoSrc = videoFrameElement.src;
        videoModalElement.addEventListener('hidden.bs.modal', function () {
            videoFrameElement.src = "";
            videoFrameElement.src = videoSrc;
        });
    }

    const fbContainer = document.querySelector('.feedback-slider-container');
    const fbTrack = document.getElementById('feedbackTrack');
    const fbDotsContainer = document.getElementById('feedbackDots');
    
    if (fbContainer && fbTrack) {
        let items = Array.from(fbTrack.children);
        let perView = window.innerWidth < 768 ? 1 : (window.innerWidth < 1200 ? 2 : 3);
        const cardGap = perView === 1 ? 0 : 30;
        let currentIndex = perView; 
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;
        let autoSlideInterval;

        const firstClones = items.slice(0, perView).map(el => el.cloneNode(true));
        const lastClones = items.slice(-perView).map(el => el.cloneNode(true));
        
        lastClones.reverse().forEach(clone => fbTrack.prepend(clone));
        firstClones.forEach(clone => fbTrack.appendChild(clone));
        
        const allCards = Array.from(fbTrack.children);

        const initDots = () => {
            if (!fbDotsContainer) return;
            fbDotsContainer.innerHTML = '';
            const pageCount = items.length > 6 ? 6 : items.length; 
            
            for (let i = 0; i < pageCount; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    stopAutoSlide();
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

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                goToIndex(currentIndex + 1);
            }, 4000);
        };
        const stopAutoSlide = () => clearInterval(autoSlideInterval);

        fbContainer.addEventListener('mouseenter', stopAutoSlide);
        fbContainer.addEventListener('mouseleave', startAutoSlide);

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

        window.addEventListener('resize', () => {
            perView = window.innerWidth < 768 ? 1 : (window.innerWidth < 1200 ? 2 : 3);
            setPositionByIndex(false);
        });

        initDots();
        setPositionByIndex(false);
        startAutoSlide();
        updateDots();
    }

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

    const featureStackRow = document.querySelector('.features-cards-row');
    if (featureStackRow) {
        const stackItems = Array.from(featureStackRow.children);
        
        stackItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                if (window.innerWidth >= 768) return;

                if (!item.classList.contains('stack-active')) {
                    stackItems.forEach(el => {
                        el.classList.remove('stack-active', 'stack-behind-1', 'stack-behind-2');
                    });
                    
                    item.classList.add('stack-active');
                    
                    const others = stackItems.filter(el => el !== item);
                    if (others[0]) others[0].classList.add('stack-behind-1');
                    if (others[1]) others[1].classList.add('stack-behind-2');
                }
            });
        });

        if (window.innerWidth < 768 && stackItems[2]) {
            stackItems[2].click();
        }
    }

    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.id = 'galleryLightbox';
        lightbox.className = 'gallery-custom-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="Expanded Image" id="lightboxImage">
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('#lightboxImage');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        const openLightbox = (src) => {
            lightboxImg.src = src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const img = item.querySelector('img');
                if (img) openLightbox(img.src);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.closest('.lightbox-content') === null || e.target.classList.contains('lightbox-content')) {
                if(e.target !== lightboxImg) {
                    closeLightbox();
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    const videoTrigger = document.querySelector('.video-gallery-trigger');
    if (videoTrigger) {
        const videoGridLightbox = document.createElement('div');
        videoGridLightbox.className = 'video-grid-lightbox';
        videoGridLightbox.innerHTML = `
            <button class="video-grid-close">&times;</button>
            <div class="video-grid-container">
                <h2 class="video-grid-title">OUR VIDEO GALLERY</h2>
                <div class="video-grid">
                    ${Array(6).fill(`
                        <div class="video-item">
                            <video src="assets/gallery-video.mp4" muted loop></video>
                            <div class="video-play-hint"><i class="fa-solid fa-play"></i></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(videoGridLightbox);

        const fullscreenPlayer = document.createElement('div');
        fullscreenPlayer.className = 'fullscreen-video-player';
        fullscreenPlayer.innerHTML = `
            <button class="player-close">&times;</button>
            <video src="assets/gallery-video.mp4" controls autoplay></video>
        `;
        document.body.appendChild(fullscreenPlayer);

        const gridVideos = videoGridLightbox.querySelectorAll('.video-item');
        const fsVideo = fullscreenPlayer.querySelector('video');

        videoTrigger.addEventListener('click', (e) => {
            e.stopPropagation(); 
            videoGridLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            gridVideos.forEach(item => {
                const v = item.querySelector('video');
                item.addEventListener('mouseenter', () => v.play());
                item.addEventListener('mouseleave', () => {
                    v.pause();
                    v.currentTime = 0;
                });
            });
        });

        gridVideos.forEach(item => {
            item.addEventListener('click', () => {
                const src = item.querySelector('video').src;
                fsVideo.src = src;
                fullscreenPlayer.classList.add('active');
            });
        });

        const closeGrid = () => {
            videoGridLightbox.classList.remove('active');
            if (!fullscreenPlayer.classList.contains('active')) {
                document.body.style.overflow = '';
            }
        };

        const closePlayer = () => {
            fullscreenPlayer.classList.remove('active');
            fsVideo.pause();
            if (!videoGridLightbox.classList.contains('active')) {
                document.body.style.overflow = '';
            }
        };

        videoGridLightbox.querySelector('.video-grid-close').addEventListener('click', closeGrid);
        fullscreenPlayer.querySelector('.player-close').addEventListener('click', closePlayer);
        
        videoGridLightbox.addEventListener('click', (e) => {
            if (e.target === videoGridLightbox) closeGrid();
        });
        fullscreenPlayer.addEventListener('click', (e) => {
            if (e.target === fullscreenPlayer) closePlayer();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (fullscreenPlayer.classList.contains('active')) closePlayer();
                else if (videoGridLightbox.classList.contains('active')) closeGrid();
            }
        });
    }

    const journeyReadMoreBtn = document.querySelector('.journey-read-more-btn');
    const journeyBox = document.querySelector('.journey-content-box');
    if (journeyReadMoreBtn && journeyBox) {
        journeyReadMoreBtn.addEventListener('click', () => {
            journeyBox.classList.toggle('expanded');
            if (journeyBox.classList.contains('expanded')) {
                journeyReadMoreBtn.innerHTML = 'Read Less <span class="ms-1"><i class="fa-solid fa-chevron-up"></i></span>';
            } else {
                journeyReadMoreBtn.innerHTML = 'Read More <span class="ms-1"><i class="fa-solid fa-chevron-down"></i></span>';
            }
        });
    }
});


