document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

    // Close mobile menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animation (Fade In)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .project-card, .skill-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add class for animation when in view
    const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const fadeObserver = new IntersectionObserver(handleIntersection, observerOptions);


    document.querySelectorAll('.section, .project-card, .skill-card').forEach(el => {
        fadeObserver.observe(el);
    });

    // Star Generation
    const createStars = (type, count) => {
        const layer = document.getElementById(type);
        if (!layer) return;

        let boxShadow = '';
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * 2000);
            const y = Math.floor(Math.random() * 2000);
            boxShadow += `${x}px ${y}px #FFF, `;
        }
        layer.style.boxShadow = boxShadow.slice(0, -2);
    };

    createStars('stars', 700);
    createStars('stars2', 200);
    createStars('stars3', 100);

    // ===== Stack Carousel (Tech Skills) =====
    const stackCarousel = document.getElementById('stackCarousel');

    if (stackCarousel) {
        const slides = stackCarousel.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        let carouselInterval;
        const slideDuration = 8000; // 8 seconds

        const goToSlide = (index) => {
            slides[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        };

        const startCarousel = () => {
            carouselInterval = setInterval(nextSlide, slideDuration);
        };

        const stopCarousel = () => {
            clearInterval(carouselInterval);
        };

        // Pause on hover
        stackCarousel.addEventListener('mouseenter', stopCarousel);
        stackCarousel.addEventListener('mouseleave', startCarousel);

        // Start auto-rotation
        startCarousel();
    }

    // Auto-Scroll Project Carousel
    const carousel = document.querySelector('.projects-carousel');

    if (carousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let autoScrollInterval;
        const scrollAmount = 320; // Approximate card width + gap
        const scrollDelay = 3000; // 3 seconds

        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
                    carousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }, scrollDelay);
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Start auto-scroll initially
        startAutoScroll();

        // Pause on hover/touch
        carousel.addEventListener('mouseenter', stopAutoScroll);
        carousel.addEventListener('mouseleave', startAutoScroll);
        carousel.addEventListener('touchstart', stopAutoScroll);
        carousel.addEventListener('touchend', startAutoScroll);
    }
});
