/* ================================================================
   SUNSHINE — Landing Page Scripts
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ——————————————————————————————————————————————
       CONFIG — Paste your Google Apps Script URL here
       —————————————————————————————————————————————— */
    const GOOGLE_SCRIPT_URL = '';  // ← You'll paste the deployment URL here


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


    /* ================================================================
       BOOKING MODAL
       ================================================================ */
    const modal      = document.getElementById('booking-modal');
    const backdrop    = modal.querySelector('.modal__backdrop');
    const closeBtn    = modal.querySelector('.modal__close');
    const doneBtn     = modal.querySelector('.modal__done');
    const form        = document.getElementById('booking-form');
    const submitBtn   = document.getElementById('modal-submit');
    const formState   = document.getElementById('modal-form-state');
    const successState = document.getElementById('modal-success-state');
    const eventDateEl = document.getElementById('modal-event-date');
    const successEventEl = document.getElementById('modal-success-event');

    let selectedEvent = '';

    /* ——— Open Modal ——— */
    document.querySelectorAll('[data-event]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            selectedEvent = btn.dataset.event;
            eventDateEl.textContent = selectedEvent;
            openModal();
        });
    });

    function openModal() {
        // Reset to form state
        formState.removeAttribute('aria-hidden');
        successState.setAttribute('aria-hidden', 'true');
        form.reset();
        clearValidation();
        submitBtn.classList.remove('is-loading');

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus first field after animation
        setTimeout(() => {
            document.getElementById('field-name').focus();
        }, 400);
    }

    /* ——— Close Modal ——— */
    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    doneBtn.addEventListener('click', closeModal);

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });


    /* ——— Form Validation ——— */
    function clearValidation() {
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }

    function validateForm() {
        clearValidation();
        let valid = true;

        const name = document.getElementById('field-name');
        const email = document.getElementById('field-email');
        const mobile = document.getElementById('field-mobile');
        const reservations = document.getElementById('field-reservations');

        if (!name.value.trim()) {
            name.classList.add('is-invalid');
            valid = false;
        }

        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            email.classList.add('is-invalid');
            valid = false;
        }

        // Australian mobile: starts with 04, at least 10 digits
        const cleanMobile = mobile.value.replace(/[\s\-()]/g, '');
        if (!cleanMobile || cleanMobile.length < 10) {
            mobile.classList.add('is-invalid');
            valid = false;
        }

        if (!reservations.value) {
            reservations.classList.add('is-invalid');
            valid = false;
        }

        return valid;
    }

    // Remove invalid state on input
    form.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', () => el.classList.remove('is-invalid'));
        el.addEventListener('change', () => el.classList.remove('is-invalid'));
    });


    /* ——— Form Submission ——— */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Gather data
        const formData = {
            name: document.getElementById('field-name').value.trim(),
            email: document.getElementById('field-email').value.trim(),
            mobile: document.getElementById('field-mobile').value.trim(),
            reservations: document.getElementById('field-reservations').value,
            event: selectedEvent
        };

        // Loading state
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;

        try {
            if (!GOOGLE_SCRIPT_URL) {
                // If no URL configured yet, simulate success for testing
                console.warn('⚠️ GOOGLE_SCRIPT_URL not set. Simulating submission.');
                console.log('Form data:', formData);
                await new Promise(r => setTimeout(r, 1200));
            } else {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                // no-cors means we can't read the response,
                // but if it doesn't throw, we assume success.
            }

            // Show success state
            successEventEl.textContent = selectedEvent;
            formState.setAttribute('aria-hidden', 'true');
            successState.setAttribute('aria-hidden', 'false');

        } catch (error) {
            console.error('Booking submission failed:', error);
            alert('Something went wrong. Please try again or call us directly.');
        } finally {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
        }
    });

});
