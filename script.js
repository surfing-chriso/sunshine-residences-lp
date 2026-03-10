/* ================================================================
   SUNSHINE — Landing Page Scripts
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ——— Scroll Reveal (IntersectionObserver) ——— */
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));

    /* ——— Smooth Scroll for Anchor Links ——— */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ——— Parallax Hero Background ——— */
    const heroBg = document.querySelector('.hero__bg img');
    if (heroBg) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (scrollY < window.innerHeight) {
                        heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /* ——— Header scroll effect ——— */
    const header = document.querySelector('.top-bar');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    /* ——— Counter Animation for Glance Stats ——— */
    const stats = document.querySelectorAll('.glance-stat__number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const finalText = el.textContent;
                const finalNum = parseFloat(finalText);

                if (!isNaN(finalNum) && finalNum <= 500) {
                    const isFloat = finalText.includes('.');
                    const duration = 1200;
                    const startTime = performance.now();

                    const animate = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = finalNum * eased;

                        if (isFloat) {
                            el.textContent = current.toFixed(1);
                        } else {
                            el.textContent = Math.round(current);
                        }

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            el.textContent = finalText;
                        }
                    };

                    requestAnimationFrame(animate);
                }

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => counterObserver.observe(stat));

});
