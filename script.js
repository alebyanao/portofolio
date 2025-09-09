// ========================================
// PORTFOLIO INTERACTIVE JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. SMOOTH SCROLLING NAVIGATION
    // ========================================
    
    // Update navbar links dengan id yang sesuai
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, .banner');
    
    // Mapping untuk navigasi
    const sectionMap = {
        'Tentang': 'about',
        'Pengalaman': 'experience', 
        'Sertifikat': 'certificate',
        'Kontak': 'contact'
    };
    
    // Setup smooth scrolling untuk setiap nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const linkText = this.textContent.trim();
            let targetId = sectionMap[linkText];
            
            // Jika About, scroll ke banner terlebih dahulu
            if (linkText === 'About') {
                const banner = document.querySelector('.banner');
                const aboutSection = document.getElementById('about');
                
                if (banner && aboutSection) {
                    // Scroll ke posisi antara banner dan about section
                    const bannerHeight = banner.offsetHeight;
                    const scrollPosition = bannerHeight - 100; // offset sedikit
                    
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });
                }
            } else if (targetId) {
                const targetSection = document.getElementById(targetId) || 
                                    document.querySelector(`.${targetId}-section`);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 90; // Account for navbar height
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            
            // Add active state
            navLinks.forEach(nl => nl.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // ========================================
    // 2. ACTIVE SECTION DETECTION ON SCROLL
    // ========================================
    
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 150;
        
        // Check banner area
        const banner = document.querySelector('.banner');
        const aboutSection = document.getElementById('about');
        
        if (banner && scrollPosition < banner.offsetHeight + (aboutSection ? aboutSection.offsetTop / 2 : 500)) {
            setActiveLink('Tentang');
        } else {
            // Check other sections
            const experienceSection = document.getElementById('experience') || document.querySelector('.experience-section');
            const certificateSection = document.querySelector('.certificate-section');
            const contactSection = document.getElementById('contact');
            
            if (experienceSection && scrollPosition >= experienceSection.offsetTop - 150 && 
                scrollPosition < experienceSection.offsetTop + experienceSection.offsetHeight - 150) {
                setActiveLink('Pengalaman');
            } else if (certificateSection && scrollPosition >= certificateSection.offsetTop - 150 && 
                      scrollPosition < certificateSection.offsetTop + certificateSection.offsetHeight - 150) {
                setActiveLink('Sertifikat');
            } else if (contactSection && scrollPosition >= contactSection.offsetTop - 150) {
                setActiveLink('Kontak');
            } else if (aboutSection && scrollPosition >= aboutSection.offsetTop - 150) {
                setActiveLink('Tentang');
            }
        }
    }
    
    function setActiveLink(linkText) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.textContent.trim() === linkText) {
                link.classList.add('active');
            }
        });
    }
    
    // ========================================
    // 3. SCROLL ANIMATIONS & EFFECTS
    // ========================================
    
    // Parallax effect for banner elements
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.circle-group, .star-wrapper');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
    
    // Navbar background opacity on scroll
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar-custom');
        const scrolled = window.pageYOffset;
        
        if (scrolled > 50) {
            navbar.style.background = 'linear-gradient(to bottom, rgba(160, 19, 150, 0.95), rgba(255, 255, 255, 0.95))';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(to bottom, #a013968f, #ffffff)';
            navbar.style.backdropFilter = 'none';
        }
    }
    
    // ========================================
    // 4. INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Add fade-in animation to elements
    const animateElements = document.querySelectorAll('.exp-item, .certificate-section, .contact-info');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // ========================================
    // 5. PORTFOLIO TITLE ANIMATION
    // ========================================
    
    function animatePortfolioTitle() {
        const letters = document.querySelectorAll('.portfolio-title span');
        
        letters.forEach((letter, index) => {
            letter.style.opacity = '0';
            letter.style.transform = 'translateY(50px) rotate(0deg)';
            letter.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                letter.style.opacity = '1';
                letter.style.transform = letter.style.transform.replace('translateY(50px)', 'translateY(0px)');
            }, index * 100 + 500); // Delay untuk setiap huruf
        });
        
        // Animate name
        const portfolioName = document.querySelector('.portfolio-name');
        if (portfolioName) {
            portfolioName.style.opacity = '0';
            portfolioName.style.transform = 'translateY(30px)';
            portfolioName.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                portfolioName.style.opacity = '1';
                portfolioName.style.transform = 'translateY(0px)';
            }, letters.length * 100 + 800);
        }
    }
    
    // ========================================
    // 6. CONTACT FORM FUNCTIONALITY
    // ========================================
    
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const nama = this.querySelector('input[placeholder="Nama Lengkap"]').value;
            const email = this.querySelector('input[placeholder="Email"]').value;
            const pesan = this.querySelector('textarea').value;
            
            // Simple validation
            if (!nama || !email || !pesan) {
                showNotification('Mohon lengkapi semua field!', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Format email tidak valid!', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('.btn-contact');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Mengirim...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Pesan berhasil dikirim! Terima kasih.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // ========================================
    // 7. UTILITY FUNCTIONS
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
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideInRight 0.3s ease',
            backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'
        });
        
        // Add animation keyframes
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
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: auto;
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
    
    // ========================================
    // 8. MOBILE RESPONSIVE ADJUSTMENTS
    // ========================================
    
    function handleMobileAdjustments() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Adjust portfolio title size for mobile
            const portfolioTitle = document.querySelector('.portfolio-title');
            if (portfolioTitle) {
                portfolioTitle.style.fontSize = '0.6em';
            }
            
            // Adjust circle group position
            const circleGroup = document.querySelector('.circle-group');
            if (circleGroup) {
                circleGroup.style.top = '50px';
                circleGroup.style.left = '20px';
            }
            
            // Adjust star position
            const starWrapper = document.querySelector('.star-wrapper');
            if (starWrapper) {
                starWrapper.style.right = '20px';
                starWrapper.style.transform = 'scale(0.7)';
            }
        }
    }
    
    // ========================================
    // 9. SMOOTH REVEAL ON SCROLL
    // ========================================
    
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.exp-img-wrapper');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.style.transform = 'translateY(0)';
                element.style.opacity = '1';
            }
        });
    }
    
    // Initialize reveal animations
    const revealElements = document.querySelectorAll('.exp-img-wrapper');
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    // ========================================
    // 10. EVENT LISTENERS
    // ========================================
    
    // Scroll events with throttling
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            requestAnimationFrame(function() {
                updateActiveNavLink();
                handleParallax();
                handleNavbarScroll();
                revealOnScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    // Resize events
    window.addEventListener('resize', function() {
        handleMobileAdjustments();
    });
    
    // ========================================
    // 11. INITIALIZE EVERYTHING
    // ========================================
    
    // Initial setup
    setTimeout(animatePortfolioTitle, 300);
    handleMobileAdjustments();
    updateActiveNavLink();
    
    // Add custom CSS for active nav links
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: #A01397 !important;
            font-weight: 700 !important;
            text-shadow: 0px 2px 4px rgba(160, 19, 151, 0.3);
        }
        
        .nav-link {
            transition: all 0.3s ease;
        }
        
        .nav-link:hover {
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .navbar-custom .navbar-nav {
                flex-direction: column !important;
                gap: 10px !important;
                padding: 20px !important;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 10px;
                margin-top: 10px;
            }
            
            .portfolio-title {
                flex-wrap: wrap;
                gap: 2px !important;
            }
            
            .certificate-section {
                width: 95% !important;
                margin: 20px auto !important;
            }
            
            .experience-images {
                flex-direction: column;
                align-items: center;
            }
            
            .exp-img-wrapper {
                width: 250px !important;
            }
        }
        
        /* Smooth scroll behavior */
        html {
            scroll-behavior: smooth;
        }
        
        /* Loading animation for images */
        img {
            transition: opacity 0.3s ease;
        }
        
        img:not([src]) {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🚀 Portfolio JavaScript initialized successfully!');
});