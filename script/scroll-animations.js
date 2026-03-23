
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', 
        threshold: 0.15 
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                
                observer.unobserve(entry.target);
                
                if (entry.target.hasAttribute('data-reveal-count')) {
                    startCounterAnimation(entry.target);
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    function startCounterAnimation(element) {
        const target = parseInt(element.getAttribute('data-reveal-count'));
        let count = 0;
        const duration = 2000; 
        const step = target / (duration / 16); 
        
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

window.addEventListener('resize', () => {
   
});
