// ========================================
// PORTFOLIO RESPONSIVE JAVASCRIPT
// ========================================

(function() {
    'use strict';
    
    // ========================================
    // 1. GLOBAL VARIABLES & DOM ELEMENTS
    // ========================================
    
    let isLoading = true;
    let scrollTimeout;
    let resizeTimeout;
    
    const elements = {
        loadingScreen: document.getElementById('loadingScreen'),
        navbar: document.getElementById('mainNavbar'),
        navLinks: document.querySelectorAll('.nav-link'),
        backToTop: document.getElementById('backToTop'),
        contactForm: document.querySelector('.contact-form'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        projectItems: document.querySelectorAll('.project-item'),
        skillBars: document.querySelectorAll('.skill-progress')
    };
    
    // ========================================
    // 2. LOADING SCREEN ANIMATION
    // ========================================
    
    function initLoadingScreen() {
        const loadingProgress = document.querySelector('.loading-progress');
        let progress = 0;
        
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            if (loadingProgress) {
                loadingProgress.style.width = progress + '%';
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(hideLoadingScreen, 500);
            }
        }, 100);
    }
    
    function hideLoadingScreen() {
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                elements.loadingScreen.style.display = 'none';
                isLoading = false;
                initScrollAnimations();
            }, 500);
        }
    }
    
    // ========================================
    // 3. SMOOTH SCROLLING NAVIGATION
    // ========================================
    
    function initSmoothScrolling() {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const href = this.getAttribute('href');
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    updateActiveNavLink(href.substring(1));
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.getElementById('navbarNav');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            });
        });
    }
    
    // ========================================
    // 4. ACTIVE SECTION DETECTION
    // ========================================
    
    function detectActiveSection() {
        if (isLoading) return;
        
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 150;
        
        let activeSection = 'home';
        
        // Check if we're at the banner
        const banner = document.querySelector('.banner');
        if (banner && scrollPosition < banner.offsetHeight) {
            activeSection = 'home';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && 
                    scrollPosition < sectionTop + sectionHeight) {
                    activeSection = section.id;
                }
            });
        }
        
        updateActiveNavLink(activeSection);
    }
    
    function updateActiveNavLink(activeId) {
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + activeId) {
                link.classList.add('active');
            }
        });
    }
    
    // ========================================
    // 5. NAVBAR SCROLL EFFECTS
    // ========================================
    
    function handleNavbarScroll() {
        if (isLoading) return;
        
        const scrolled = window.pageYOffset;
        
        if (elements.navbar) {
            if (scrolled > 50) {
                elements.navbar.classList.add('scrolled');
            } else {
                elements.navbar.classList.remove('scrolled');
            }
        }
        
        // Show/hide back to top button
        if (elements.backToTop) {
            if (scrolled > 300) {
                elements.backToTop.classList.add('show');
            } else {
                elements.backToTop.classList.remove('show');
            }
        }
    }
    
    // ========================================
    // 6. PARALLAX EFFECTS
    // ========================================
    
    function handleParallaxEffects() {
        if (isLoading) return;
        
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax for banner elements
        const circleGroup = document.querySelector('.circle-group');
        const starWrapper = document.querySelector('.star-wrapper');
        
        if (circleGroup) {
            circleGroup.style.transform = `translateY(${rate * 0.3}px)`;
        }
        
        if (starWrapper) {
            starWrapper.style.transform = `translateY(${rate * 0.2}px) rotate(${scrolled * 0.1}deg)`;
        }
        
        // Parallax for background elements
        const aboutCircle = document.querySelector('.about-circle');
        const experienceBg = document.querySelector('.experience-bg');
        
        if (aboutCircle) {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const rect = aboutSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                    aboutCircle.style.transform = `translateY(${progress * 50}px) scale(${1 + progress * 0.1})`;
                }
            }
        }
        
        if (experienceBg) {
            const expSection = document.getElementById('experience');
            if (expSection) {
                const rect = expSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                    experienceBg.style.transform = `scale(${1 + progress * 0.1}) rotate(${progress * 5}deg)`;
                }
            }
        }
    }
    
    // ========================================
    // 7. INTERSECTION OBSERVER ANIMATIONS
    // ========================================
    
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Add visible class for CSS animations
                    element.classList.add('visible');
                    
                    // Handle specific animations
                    if (element.classList.contains('skill-progress')) {
                        animateSkillBar(element);
                    }
                    
                    if (element.classList.contains('project-card')) {
                        animateProjectCard(element);
                    }
                    
                    if (element.classList.contains('timeline-item')) {
                        animateTimelineItem(element);
                    }
                    
                    if (element.classList.contains('certificate-item')) {
                        animateCertificateItem(element);
                    }
                    
                    // Unobserve after animation
                    observer.unobserve(element);
                }
            });
        }, observerOptions);
        
        // Observe all animated elements
        const animatedElements = document.querySelectorAll(`
            .animate-fade-up,
            .animate-slide-right,
            .animate-slide-left,
            .animate-scale-up,
            .animate-slide-up,
            .skill-progress,
            .project-card,
            .timeline-item,
            .certificate-item,
            .gallery-item
        `);
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // ========================================
    // 8. SPECIFIC ANIMATIONS
    // ========================================
    
    function animateSkillBar(skillBar) {
        const progress = skillBar.getAttribute('data-progress');
        setTimeout(() => {
            skillBar.style.width = progress + '%';
        }, 200);
    }
    
    function animateProjectCard(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, 100);
    }
    
    function animateTimelineItem(item) {
        const content = item.querySelector('.timeline-content');
        const marker = item.querySelector('.timeline-marker');
        
        if (content && marker) {
            content.style.opacity = '0';
            marker.style.opacity = '0';
            marker.style.transform = 'scale(0)';
            
            setTimeout(() => {
                marker.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                marker.style.opacity = '1';
                marker.style.transform = 'scale(1)';
                
                setTimeout(() => {
                    content.style.transition = 'all 0.6s ease';
                    content.style.opacity = '1';
                }, 200);
            }, 100);
        }
    }
    
    function animateCertificateItem(item) {
        const icon = item.querySelector('.certificate-icon');
        
        if (icon) {
            icon.style.transform = 'scale(0) rotate(180deg)';
            
            setTimeout(() => {
                icon.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }
    }
    
    // ========================================
    // 9. PROJECT FILTERING
    // ========================================
    
    function initProjectFiltering() {
        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active filter button
                elements.filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects with animation
                filterProjects(filter);
            });
        });
    }
    
    function filterProjects(filter) {
        elements.projectItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            // Animate out
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                if (shouldShow) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            }, 150);
        });
    }
    
    // ========================================
    // 10. CONTACT FORM HANDLING
    // ========================================
    
    function initContactForm() {
        if (!elements.contactForm) return;
        
        elements.contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.btn-contact');
            const nama = this.querySelector('#nama').value.trim();
            const email = this.querySelector('#email').value.trim();
            const subjek = this.querySelector('#subjek').value.trim();
            const pesan = this.querySelector('#pesan').value.trim();
            
            // Validation
            if (!nama || !email || !subjek || !pesan) {
                showNotification('Mohon lengkapi semua field!', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Format email tidak valid!', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Pesan berhasil dikirim! Terima kasih.', 'success');
                this.reset();
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Add success animation
                submitBtn.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    submitBtn.style.transform = 'scale(1)';
                }, 200);
            }, 2000);
        });
    }
    
    // ========================================
    // 11. UTILITY FUNCTIONS
    // ========================================
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotif = document.querySelector('.notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-content">
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '20px',
            borderRadius: '12px',
            color: 'white',
            fontSize: '14px',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            minWidth: '320px',
            maxWidth: '400px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            animation: 'slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            backgroundColor: getNotificationColor(type),
            border: '1px solid rgba(255,255,255,0.2)'
        });
        
        // Add notification styles if not exists
        if (!document.querySelector('#notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-icon {
                    flex-shrink: 0;
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }
                .notification-content {
                    flex: 1;
                    line-height: 1.4;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 14px;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    opacity: 0.8;
                    flex-shrink: 0;
                }
                .notification-close:hover {
                    opacity: 1;
                    background: rgba(255,255,255,0.1);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
    
    function getNotificationColor(type) {
        switch(type) {
            case 'success': return 'linear-gradient(135deg, #4CAF50, #45a049)';
            case 'error': return 'linear-gradient(135deg, #f44336, #da190b)';
            case 'warning': return 'linear-gradient(135deg, #ff9800, #f57c00)';
            default: return 'linear-gradient(135deg, #2196F3, #0b7dda)';
        }
    }
    
    // ========================================
    // 12. RESPONSIVE ADJUSTMENTS
    // ========================================
    
    function handleResponsiveAdjustments() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
        
        // Adjust portfolio title on mobile
        const portfolioTitle = document.querySelector('.portfolio-title');
        if (portfolioTitle && isMobile) {
            portfolioTitle.style.transform = 'translate(-50%, -50%) scale(0.8)';
        } else if (portfolioTitle) {
            portfolioTitle.style.transform = 'translate(-50%, -50%) scale(1)';
        }
        
        // Adjust circle group on mobile
        const circleGroup = document.querySelector('.circle-group');
        if (circleGroup) {
            if (isMobile) {
                circleGroup.style.flexDirection = 'row';
                circleGroup.style.gap = '8px';
            } else {
                circleGroup.style.flexDirection = 'row';
                circleGroup.style.gap = '20px';
            }
        }
        
        // Adjust timeline for mobile
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            const content = item.querySelector('.timeline-content');
            if (content) {
                if (isMobile || isTablet) {
                    content.style.marginLeft = isMobile ? '60px' : '80px';
                    content.style.marginRight = '0';
                    content.style.textAlign = 'left';
                } else {
                    // Reset to original layout for desktop
                    if (index % 2 === 0) {
                        content.style.marginRight = '55%';
                        content.style.marginLeft = '0';
                        content.style.textAlign = 'right';
                    } else {
                        content.style.marginLeft = '55%';
                        content.style.marginRight = '0';
                        content.style.textAlign = 'left';
                    }
                }
            }
        });
        
        // Adjust project grid
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            if (isMobile) {
                projectsGrid.style.gridTemplateColumns = '1fr';
            } else if (isTablet) {
                projectsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            }
        }
    }
    
    // ========================================
    // 13. ADVANCED INTERACTIONS
    // ========================================
    
    function initAdvancedInteractions() {
        // Magnetic effect for buttons
        const magneticElements = document.querySelectorAll('.btn-contact, .filter-btn, .social-btn');
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', handleMagneticEffect);
            element.addEventListener('mouseleave', resetMagneticEffect);
        });
        
        // Tilt effect for project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', handleTiltEffect);
            card.addEventListener('mouseleave', resetTiltEffect);
        });
        
        // Parallax mouse movement for banner elements
        document.addEventListener('mousemove', handleMouseParallax);
        
        // Smooth reveal on scroll for gallery items
        initGalleryReveal();
        
        // Certificate image modal
        initCertificateModal();
    }
    
    function handleMagneticEffect(e) {
        const element = e.target;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.2;
        const deltaY = (e.clientY - centerY) * 0.2;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }
    
    function resetMagneticEffect(e) {
        const element = e.target;
        element.style.transform = 'translate(0px, 0px)';
    }
    
    function handleTiltEffect(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = (e.clientY - centerY) / 10;
        const rotateY = (centerX - e.clientX) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }
    
    function resetTiltEffect(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
    
    function handleMouseParallax(e) {
        if (window.innerWidth <= 768) return; // Disable on mobile
        
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const circles = document.querySelectorAll('.circle');
        const star = document.querySelector('.star-shape');
        
        circles.forEach((circle, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            circle.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        if (star) {
            const x = (mouseX - 0.5) * 10;
            const y = (mouseY - 0.5) * 10;
            star.style.transform = `translate(${x}px, ${y}px)`;
        }
    }
    
    function initGalleryReveal() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(50px) scale(0.9)';
            item.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            revealObserver.observe(item);
        });
    }
    
    function initCertificateModal() {
        const certImages = document.querySelectorAll('.cert-img-wrapper');
        
        certImages.forEach(wrapper => {
            wrapper.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    openImageModal(img.src, img.alt);
                }
            });
        });
    }
    
    function openImageModal(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <img src="${src}" alt="${alt}">
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add modal styles
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.9)',
            animation: 'fadeIn 0.3s ease'
        });
        
        const modalContent = modal.querySelector('.modal-content');
        Object.assign(modalContent.style, {
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90%',
            animation: 'zoomIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        });
        
        const img = modal.querySelector('img');
        Object.assign(img.style, {
            width: '100%',
            height: 'auto',
            borderRadius: '10px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        });
        
        const closeBtn = modal.querySelector('.modal-close');
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s ease'
        });
        
        // Add modal animations if not exists
        if (!document.querySelector('#modalStyles')) {
            const style = document.createElement('style');
            style.id = 'modalStyles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes zoomIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes zoomOut {
                    from { transform: scale(1); opacity: 1; }
                    to { transform: scale(0.8); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(modal);
        
        // Close modal events
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            modalContent.style.animation = 'zoomOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Close with Escape key
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }
    
    // ========================================
    // 14. BACK TO TOP FUNCTIONALITY
    // ========================================
    
    function initBackToTop() {
        if (elements.backToTop) {
            elements.backToTop.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Add click animation
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        }
    }
    
    // ========================================
    // 15. PERFORMANCE OPTIMIZATIONS
    // ========================================
    
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    // ========================================
    // 16. EVENT LISTENERS SETUP
    // ========================================
    
    function setupEventListeners() {
        // Scroll events with throttling
        window.addEventListener('scroll', throttle(() => {
            detectActiveSection();
            handleNavbarScroll();
            handleParallaxEffects();
        }, 16)); // ~60fps
        
        // Resize events with debouncing
        window.addEventListener('resize', debounce(() => {
            handleResponsiveAdjustments();
        }, 250));
        
        // Load event
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (isLoading) hideLoadingScreen();
            }, 1000);
        });
        
        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // Resume animations or refresh data if needed
                initScrollAnimations();
            }
        });
        
        // Error handling for images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                this.style.opacity = '0.5';
                this.alt = 'Image not available';
            });
        });
    }
    
    // ========================================
    // 17. INITIALIZATION
    // ========================================
    
    function init() {
        console.log('🚀 Initializing Portfolio...');
        
        // Start loading screen
        initLoadingScreen();
        
        // Setup basic functionality
        initSmoothScrolling();
        initProjectFiltering();
        initContactForm();
        initBackToTop();
        
        // Setup advanced interactions
        initAdvancedInteractions();
        
        // Setup responsive adjustments
        handleResponsiveAdjustments();
        
        // Setup event listeners
        setupEventListeners();
        
        // Add some initial animations
        setTimeout(() => {
            const portfolioLetters = document.querySelectorAll('.portfolio-title span');
            portfolioLetters.forEach((letter, index) => {
                letter.style.animationDelay = (index * 0.1) + 's';
                letter.classList.add('animate-bounce-in');
            });
        }, 500);
        
        console.log('Portfolio initialized successfully!');
    }
    
    // ========================================
    // 18. START APPLICATION
    // ========================================
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();