/**
 * 📱 MOBILE MENU MANAGER
 * Enhanced sidebar and mobile navigation functionality
 */

class MobileMenuManager {
    constructor() {
        this.sidebar = null;
        this.menuBtn = null;
        this.overlay = null;
        this.isOpen = false;
        this.isDesktop = window.innerWidth >= 769; // Changed from 1024 to match CSS
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupResizeHandler();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        
        // Auto-open sidebar on desktop
        if (this.isDesktop) {
            this.openSidebar();
        }
    }

    setupElements() {
        this.sidebar = document.getElementById('sidebar');
        this.menuBtn = document.querySelector('.mobile-menu-btn');
        
        // Create overlay if it doesn't exist
        if (!document.querySelector('.sidebar-overlay')) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'sidebar-overlay';
            document.body.appendChild(this.overlay);
        } else {
            this.overlay = document.querySelector('.sidebar-overlay');
        }

        if (!this.sidebar || !this.menuBtn) {
            console.warn('MobileMenuManager: Required elements not found');
            return;
        }
    }

    setupEventListeners() {
        // Menu button click
        if (this.menuBtn) {
            this.menuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSidebar();
            });
        }

        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Navigation links - IMPROVED AUTO-CLOSE
        this.setupNavigationListeners();

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSidebar();
            }
        });

        // Click outside sidebar
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.sidebar.contains(e.target) && !this.menuBtn.contains(e.target)) {
                this.closeSidebar();
            }
        });
    }

    setupNavigationListeners() {
        // Enhanced navigation listener setup
        const setupNavLinks = () => {
            const navLinks = this.sidebar?.querySelectorAll('.nav-link, a[href], button[onclick]');
            
            if (navLinks) {
                navLinks.forEach(link => {
                    // Remove existing listeners to prevent duplicates
                    link.removeEventListener('click', this.handleNavClick);
                    link.addEventListener('click', this.handleNavClick.bind(this));
                });
            }
        };

        // Initial setup
        setupNavLinks();

        // Setup mutation observer to handle dynamic content
        if (this.sidebar) {
            const observer = new MutationObserver(() => {
                setupNavLinks();
            });
            
            observer.observe(this.sidebar, {
                childList: true,
                subtree: true
            });
        }
    }

    handleNavClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        const onclick = link.getAttribute('onclick');
        
        // Don't close for external links, anchors, or JavaScript actions
        if (href && (href.startsWith('http') || href.includes('#'))) {
            return;
        }
        
        if (onclick && onclick.includes('logout')) {
            return; // Don't close for logout
        }

        // Close sidebar immediately for internal navigation
        if (!this.isDesktop) {
            this.closeSidebar();
        }
    }

    setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasDesktop = this.isDesktop;
                this.isDesktop = window.innerWidth >= 769; // Match CSS breakpoint
                
                // Handle transition from mobile to desktop
                if (!wasDesktop && this.isDesktop) {
                    this.openSidebar();
                }
                // Handle transition from desktop to mobile
                else if (wasDesktop && !this.isDesktop) {
                    this.closeSidebar();
                }
            }, 250);
        });
    }

    setupKeyboardNavigation() {
        // Tab navigation within sidebar
        if (this.sidebar) {
            this.sidebar.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const focusableElements = this.sidebar.querySelectorAll(
                        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
    }

    setupFocusManagement() {
        // Store last focused element when opening sidebar
        let lastFocusedElement = null;
        
        this.openSidebar = () => {
            if (!this.isOpen) {
                lastFocusedElement = document.activeElement;
                this.isOpen = true;
                
                if (this.sidebar) {
                    this.sidebar.classList.add('active');
                    this.sidebar.setAttribute('aria-hidden', 'false');
                }
                
                if (this.overlay) {
                    this.overlay.classList.add('active');
                }
                
                if (this.menuBtn) {
                    this.menuBtn.classList.add('active');
                    this.menuBtn.setAttribute('aria-expanded', 'true');
                }
                
                // Focus first focusable element in sidebar
                setTimeout(() => {
                    const firstFocusable = this.sidebar?.querySelector(
                        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    if (firstFocusable) {
                        firstFocusable.focus();
                    }
                }, 100);
                
                // Prevent body scroll on mobile
                if (!this.isDesktop) {
                    document.body.style.overflow = 'hidden';
                }
            }
        };
        
        this.closeSidebar = () => {
            if (this.isOpen) {
                this.isOpen = false;
                
                if (this.sidebar) {
                    this.sidebar.classList.remove('active');
                    this.sidebar.setAttribute('aria-hidden', 'true');
                }
                
                if (this.overlay) {
                    this.overlay.classList.remove('active');
                }
                
                if (this.menuBtn) {
                    this.menuBtn.classList.remove('active');
                    this.menuBtn.setAttribute('aria-expanded', 'false');
                }
                
                // Restore focus
                if (lastFocusedElement && lastFocusedElement.focus) {
                    lastFocusedElement.focus();
                }
                
                // Restore body scroll
                document.body.style.overflow = '';
            }
        };
    }

    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    // Public methods
    isSidebarOpen() {
        return this.isOpen;
    }

    getSidebarElement() {
        return this.sidebar;
    }

    getMenuButton() {
        return this.menuBtn;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mobileMenuManager = new MobileMenuManager();
});

// Export for external use
window.MobileMenuManager = MobileMenuManager;
