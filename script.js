// ==================== KARBON INTERIORS — EDITORIAL SCRIPT ====================

document.addEventListener('DOMContentLoaded', () => {

    // ==================== LOADER ====================
    const loader = document.getElementById('page-loader');
    const hideLoader = () => loader.classList.add('hidden');
    window.addEventListener('load', () => setTimeout(hideLoader, 2000));
    setTimeout(hideLoader, 3000); // fallback

    // ==================== CUSTOM CURSOR ====================
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = 'a, button, .service-row, .strip-item, .sector-tile, .portfolio-item, input, textarea';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) ring.classList.add('hover');
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) ring.classList.remove('hover');
        });
    }

    // ==================== NAVIGATION ====================
    const navToggle = document.getElementById('nav-toggle');
    const fullscreenMenu = document.getElementById('fullscreen-menu');
    const menuLinks = document.querySelectorAll('.menu-link');
    const menuCounter = document.getElementById('menu-counter');
    const pages = document.querySelectorAll('.page');

    navToggle.addEventListener('click', () => {
        const isOpen = fullscreenMenu.classList.contains('active');
        fullscreenMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    function closeMenu() {
        fullscreenMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Menu hover counter
    menuLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const idx = link.getAttribute('data-index');
            if (menuCounter) menuCounter.textContent = idx;
        });
    });

    // ==================== SPA NAVIGATION ====================
    function navigateTo(pageId) {
        pages.forEach(p => p.classList.remove('active'));
        menuLinks.forEach(l => l.classList.remove('active'));

        const target = document.getElementById(pageId);
        if (target) target.classList.add('active');

        document.querySelectorAll(`[data-page="${pageId}"]`).forEach(l => {
            if (l.classList.contains('menu-link')) l.classList.add('active');
        });

        closeMenu();
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Re-observe reveals
        setTimeout(observeReveals, 200);

        history.pushState(null, '', `#${pageId}`);
    }

    // Handle all data-page clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-page]');
        if (link) {
            e.preventDefault();
            navigateTo(link.getAttribute('data-page'));
        }
    });

    // Browser back/forward
    window.addEventListener('popstate', () => {
        navigateTo(window.location.hash.slice(1) || 'home');
    });

    // Initial page
    const initPage = window.location.hash.slice(1) || 'home';
    if (initPage !== 'home') navigateTo(initPage);

    // ==================== SCROLL REVEAL ====================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    function observeReveals() {
        document.querySelectorAll('.page.active .reveal-up, .page.active .reveal-split').forEach(el => {
            if (!el.classList.contains('visible')) {
                revealObserver.observe(el);
            }
        });
    }
    observeReveals();

    // ==================== HORIZONTAL DRAG SCROLL ====================
    function enableDragScroll(el) {
        if (!el) return;
        let isDown = false, startX, scrollLeft;

        el.addEventListener('mousedown', (e) => {
            isDown = true;
            el.style.cursor = 'grabbing';
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        });
        el.addEventListener('mouseleave', () => { isDown = false; el.style.cursor = 'grab'; });
        el.addEventListener('mouseup', () => { isDown = false; el.style.cursor = 'grab'; });
        el.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            el.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });
    }

    enableDragScroll(document.getElementById('strip-track'));
    enableDragScroll(document.getElementById('sectors-scroll'));

    // ==================== SERVICE ROW ANIMATIONS ====================
    const serviceRows = document.querySelectorAll('.service-row');
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, i * 80);
                serviceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    serviceRows.forEach(row => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        row.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        serviceObserver.observe(row);
    });

    // ==================== HERO IMAGE PARALLAX ====================
    const heroImg = document.getElementById('hero-img');
    let ticking = false;

    function heroParallax() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            if (heroImg && scrollY < window.innerHeight) {
                heroImg.style.transform = `scale(1) translateY(${scrollY * 0.15}px)`;
            }
            ticking = false;
        });
    }
    window.addEventListener('scroll', heroParallax, { passive: true });

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const orig = btn.innerHTML;

            btn.innerHTML = '<span>Sending...</span>';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.5';

            setTimeout(() => {
                btn.innerHTML = orig;
                btn.style.pointerEvents = '';
                btn.style.opacity = '';
                contactForm.reset();
                showToast('Message sent — we\'ll be in touch shortly.');
            }, 1500);
        });
    }

    // ==================== TOAST ====================
    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 3500);
    }

    // ==================== BOTTOM BAR CONTEXT ====================
    const bottomCenter = document.getElementById('bottom-center-text');
    if (bottomCenter) {
        bottomCenter.addEventListener('click', () => {
            navigateTo('portfolio');
        });
    }

    // ==================== SCROLL-TRIGGERED NAV GLASS ====================
    const navbar = document.getElementById('navbar');

    function handleScrollUI() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScrollUI, { passive: true });

    // ==================== IMAGE FADE-IN ====================
    const imgs = document.querySelectorAll('img');
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                imgObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '50px' });

    imgs.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.8s ease';
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            imgObserver.observe(img);
            img.addEventListener('load', () => { img.style.opacity = '1'; });
        }
    });

    // ==================== PREVENT SCROLL WHEN MENU OPEN ====================
    document.body.addEventListener('touchmove', (e) => {
        if (fullscreenMenu.classList.contains('active')) e.preventDefault();
    }, { passive: false });

    // Console branding
    console.log('%cKARBON INTERIORS', 'font-family:serif;font-size:24px;color:#f0ece4;background:#0a0a0a;padding:12px 24px;');
    console.log('%cInterior Design · Dubai, UAE', 'font-size:11px;color:#888;');
});
