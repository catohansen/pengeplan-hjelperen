// Mobile Menu Manager for Pengeplan
// Fixes menu navigation issues and improves mobile UX

class MobileMenuManager {
    constructor() {
        this.sidebar = null;
        this.overlay = null;
        this.menuBtn = null;
        this.isOpen = false;
        this.currentPage = null;
        
        this.init();
    }

    init() {
        // Create overlay if it doesn't exist
        this.createOverlay();
        
        // Find elements
        this.sidebar = document.querySelector('.sidebar');
        this.overlay = document.querySelector('.sidebar-overlay');
        this.menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (!this.sidebar) {
            console.warn('Sidebar not found');
            return;
        }

        // Set up event listeners
        this.setupEventListeners();
        
        // Set current page
        this.setCurrentPage();
        
        // Close menu on page load (fixes the issue where menu stays open)
        this.closeMenu();
    }

    createOverlay() {
        if (!document.querySelector('.sidebar-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }
    }

    setupEventListeners() {
        // Menu button
        if (this.menuBtn) {
            this.menuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });
        }

        // Overlay click to close
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't prevent default for actual navigation
                // Just close the menu after a short delay
                setTimeout(() => {
                    this.closeMenu();
                }, 100);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && this.isOpen) {
                this.closeMenu();
            }
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (this.isOpen) {
                    this.closeMenu();
                }
            }, 100);
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        if (!this.sidebar || !this.overlay) return;
        
        this.isOpen = true;
        this.sidebar.classList.add('open');
        this.overlay.classList.add('open');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        this.trapFocus();
        
        // Announce to screen readers
        this.announceToScreenReader('Meny åpnet');
    }

    closeMenu() {
        if (!this.sidebar || !this.overlay) return;
        
        this.isOpen = false;
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('open');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to menu button
        if (this.menuBtn) {
            this.menuBtn.focus();
        }
        
        // Announce to screen readers
        this.announceToScreenReader('Meny lukket');
    }

    setCurrentPage() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // Check if this link matches current page
            const href = link.getAttribute('href');
            if (href && (currentPath.includes(href) || 
                (currentPath === '/' && href === 'dashboard.html') ||
                (currentPath.includes('index.html') && href === 'dashboard.html'))) {
                link.classList.add('active');
                this.currentPage = href;
            }
        });
    }

    // Focus trap for accessibility
    trapFocus() {
        const focusableElements = this.sidebar.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        firstElement.focus();
        
        // Handle tab navigation
        this.sidebar.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    // Screen reader announcements
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Update menu state based on authentication
    updateMenuState() {
        const session = localStorage.getItem('pengeplan_session');
        const isAuthenticated = session !== null;
        
        // Show/hide admin link based on role
        const adminLink = document.querySelector('[href="admin.html"]');
        if (adminLink) {
            try {
                const userData = JSON.parse(session);
                if (userData && userData.user && userData.user.role === 'admin') {
                    adminLink.style.display = 'flex';
                } else {
                    adminLink.style.display = 'none';
                }
            } catch (error) {
                adminLink.style.display = 'none';
            }
        }
        
        // Update logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.style.display = isAuthenticated ? 'flex' : 'none';
        }
    }

    // Smooth scroll to top when navigating
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize mobile menu manager
const mobileMenu = new MobileMenuManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileMenuManager;
} else {
    window.MobileMenuManager = MobileMenuManager;
    window.mobileMenu = mobileMenu;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Update menu state
    if (window.mobileMenu) {
        window.mobileMenu.updateMenuState();
    }
    
    // Add smooth scrolling to all internal links
    const internalLinks = document.querySelectorAll('a[href^="#"], a[href^="./"], a[href^="/"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't interfere with actual navigation
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
