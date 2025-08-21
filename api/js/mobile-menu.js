// Bootstrap-style Mobile Menu for Pengeplan
// Simple, reliable mobile navigation that works like Bootstrap

class BootstrapMenu {
    constructor() {
        this.sidebar = null;
        this.overlay = null;
        this.menuBtn = null;
        this.isOpen = false;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Find elements
        this.sidebar = document.querySelector('.sidebar');
        this.menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (!this.sidebar) {
            console.warn('Sidebar not found');
            return;
        }

        // Create overlay
        this.createOverlay();
        
        // Setup event listeners
        this.setupEvents();
        
        // Close menu on page load
        this.closeMenu();
    }

    createOverlay() {
        // Remove existing overlay
        const existingOverlay = document.querySelector('.sidebar-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create new overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'sidebar-overlay';
        document.body.appendChild(this.overlay);
    }

    setupEvents() {
        // Menu button click
        if (this.menuBtn) {
            this.menuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        // Overlay click - close menu
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenu();
            });
        }

        // Navigation links - close menu after click
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close menu immediately for better UX
                this.closeMenu();
            });
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Window resize - close menu on desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && this.isOpen) {
                this.closeMenu();
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.sidebar.contains(e.target) && 
                !this.menuBtn.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Prevent body scroll when menu is open
        this.sidebar.addEventListener('touchmove', (e) => {
            if (this.isOpen) {
                e.stopPropagation();
            }
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
        
        // Add classes
        this.sidebar.classList.add('open');
        this.overlay.classList.add('open');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Focus management
        this.focusFirstElement();
        
        // Announce to screen readers
        this.announce('Meny åpnet');
    }

    closeMenu() {
        if (!this.sidebar || !this.overlay) return;
        
        this.isOpen = false;
        
        // Remove classes
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('open');
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        // Return focus to menu button
        if (this.menuBtn) {
            this.menuBtn.focus();
        }
        
        // Announce to screen readers
        this.announce('Meny lukket');
    }

    focusFirstElement() {
        const focusableElements = this.sidebar.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    announce(message) {
        // Create temporary announcement for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }
}

// Initialize Bootstrap-style menu
const bootstrapMenu = new BootstrapMenu();

// Global functions for easy access
window.toggleMobileMenu = () => bootstrapMenu.toggleMenu();
window.closeMobileMenu = () => bootstrapMenu.closeMenu();
window.openMobileMenu = () => bootstrapMenu.openMenu();

// Auto-initialize
if (typeof window !== 'undefined') {
    window.bootstrapMenu = bootstrapMenu;
}
