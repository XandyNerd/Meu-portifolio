document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    //  Galaxy Theme & Scroll Reveal
    // =========================================

    const scrollElements = document.querySelectorAll("[data-scroll]");

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
    };

    const displayScrollElement = (element) => {
        element.classList.add("reveal-active");
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.1)) { // 1.1 = slightly before bottom
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener("scroll", () => {
        handleScrollAnimation();
    });

    // Trigger once on load
    handleScrollAnimation();


    // =========================================
    //  GitHub Project Counter (Dynamic)
    // =========================================

    const repoCountElement = document.getElementById('repo-count');
    const githubUsernames = ['XandyNerd', 'XandyNerdX'];

    async function fetchGitHubStats() {
        if (!repoCountElement) return;

        // Fallback value
        let totalRepos = 15;

        try {
            const promises = githubUsernames.map(user =>
                fetch(`https://api.github.com/users/${user}`)
                    .then(res => {
                        if (!res.ok) throw new Error('User not found');
                        return res.json();
                    })
                    .then(data => data.public_repos || 0)
            );

            const results = await Promise.all(promises);
            totalRepos = results.reduce((a, b) => a + b, 0);

            // Animate counter
            animateValue(repoCountElement, 0, totalRepos, 2000);

        } catch (error) {
            console.warn('GitHub fetch failed, using fallback.', error);
            repoCountElement.innerText = "15+"; // Fallback static
        }
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start) + "+";
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Trigger stats when visible
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fetchGitHubStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // =========================================
    //  Legacy Main.js Logic (Mobile Menu, etc)
    // =========================================

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

    // Star Generation (Legacy from Hero, keeping if needed or for other sections)
    // The new galaxy theme about section has its own CSS stars,
    // but if index.html still has #stars containers, this keeps them working.
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


    // =========================================
    //  Project Image Slideshow (CS Móveis — standard fade)
    // =========================================
    const slideshowContainers = document.querySelectorAll('.slideshow-container');

    slideshowContainers.forEach(container => {
        const slides = container.querySelectorAll('.slide');
        if (slides.length <= 1) return;

        let currentSlide = 0;

        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // 5 seconds per slide
    });

    //  GelaCena Scroll Slideshow
    //  Scrolls from top-to-bottom, then fades to next image
    // =========================================
    const scrollContainers = document.querySelectorAll('.scroll-slideshow');

    scrollContainers.forEach(container => {
        const slides = container.querySelectorAll('.scroll-slide');
        if (slides.length <= 1) return;

        let currentSlide = 0;

        function runScrollCycle() {
            const current = slides[currentSlide];

            // Ensure clean state: remove scrolling, reset inline styles
            current.style.transition = 'none';
            current.style.objectPosition = 'top center';
            void current.offsetWidth; // force reflow

            // Show image at top
            current.style.transition = '';
            current.classList.add('active');

            // Step 2: After pause, animate scroll to bottom
            setTimeout(() => {
                current.style.transition = 'object-position 6s ease-in-out';
                current.style.objectPosition = 'bottom center';
            }, 1500);

            // Step 3: After scroll completes, fade out and go to next
            setTimeout(() => {
                current.classList.remove('active');

                // Clean up current
                setTimeout(() => {
                    current.style.transition = 'none';
                    current.style.objectPosition = 'top center';
                }, 1000); // wait for fade-out

                // Move to next
                currentSlide = (currentSlide + 1) % slides.length;

                // Small delay then start next cycle
                setTimeout(() => {
                    runScrollCycle();
                }, 1200);
            }, 9000); // 1.5s top + 6s scroll + 1.5s bottom
        }

        // Start first cycle
        setTimeout(() => runScrollCycle(), 500);
    });

    // =========================================
    //  Scroll-triggered Reveal Animations
    // =========================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // =========================================
    //  Other Projects Carousel — 3 visible, center highlight, auto-loop
    // =========================================
    const carousel = document.getElementById('projects-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (carousel && prevBtn && nextBtn) {
        const cards = Array.from(carousel.querySelectorAll('.mini-card'));
        const total = cards.length;
        let centerIndex = 0;
        let autoPlayTimer;

        function updateCarousel() {
            // Calculate the 3 visible indices (wrapping)
            const leftIdx = (centerIndex - 1 + total) % total;
            const rightIdx = (centerIndex + 1) % total;

            // Update each card
            cards.forEach((card, i) => {
                card.classList.remove('visible', 'center');

                if (i === centerIndex) {
                    card.style.display = 'block';
                    card.style.order = '2';
                    card.classList.add('center');
                } else if (i === leftIdx) {
                    card.style.display = 'block';
                    card.style.order = '1';
                    card.classList.add('visible');
                } else if (i === rightIdx) {
                    card.style.display = 'block';
                    card.style.order = '3';
                    card.classList.add('visible');
                } else {
                    card.style.display = 'none';
                    card.style.order = '99';
                }
            });
        }

        function nextSlide() {
            centerIndex = (centerIndex + 1) % total;
            updateCarousel();
        }

        function prevSlide() {
            centerIndex = (centerIndex - 1 + total) % total;
            updateCarousel();
        }

        // Initialize
        updateCarousel();

        // Helper functions for auto-play
        const startAutoPlay = () => {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(nextSlide, 8000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayTimer);
        };

        const resetAutoPlay = () => {
            stopAutoPlay();
            startAutoPlay();
        };

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        // Touch support for swipe
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay(); // Pause on touch
        }, { passive: true });

        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay(); // Resume on lift
        }, { passive: true });

        // Resume if touch is cancelled (e.g. scrolling page)
        carousel.addEventListener('touchcancel', () => {
            startAutoPlay();
        }, { passive: true });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                nextSlide(); // Swipe left -> Next
            }
            if (touchEndX > touchStartX + 50) {
                prevSlide(); // Swipe right -> Prev
            }
        }

        startAutoPlay(); // Start loop
    }

});
