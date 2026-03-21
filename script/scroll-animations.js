/**
 * Scroll Animations Controller for LK Salon
 * Uses Intersection Observer API for performance and reliability.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ELEMENTS TO ANIMATE
    const revealElements = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');

    // 2. CONFIGURATION FOR INTERSECTION OBSERVER
    const observerOptions = {
        root: null, // use the viewport
        rootMargin: '0px 0px -100px 0px', // trigger 100px before coming fully into view
        threshold: 0.15 // 15% of the element must be visible
    };

    // 3. CREATE THE OBSERVER
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the reveal-visible class
                entry.target.classList.add('reveal-visible');
                
                // If you want it to trigger only once, un-observe
                observer.unobserve(entry.target);
                
                // Optional: Handle specialized triggers
                if (entry.target.hasAttribute('data-reveal-count')) {
                    startCounterAnimation(entry.target);
                }
            }
        });
    }, observerOptions);

    // 4. OBSERVE ALL TARGETED ELEMENTS
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 5. HELPER FOR COUNTERS (IF ADDED LATER)
    function startCounterAnimation(element) {
        // Logic for numerical counters if needed
        const target = parseInt(element.getAttribute('data-reveal-count'));
        let count = 0;
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        
        const timer = setInterval(() => {
            count += step;
            if (count >= target) {
                element.innerText = target;
                clearInterval(timer);
            } else {
                element.innerText = Math.floor(count);
            }
        }, 16);
    }
});

// Refresh observer on window resize or dynamic content updates
window.addEventListener('resize', () => {
    // Intersection Observer handles window resizing natively, 
    // but this is a good place to recalculate if needed.
});
