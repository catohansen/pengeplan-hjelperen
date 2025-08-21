// Security Module for Pengeplan
// Handles CSRF protection, input validation, rate limiting, and session management

class SecurityManager {
    constructor() {
        this.csrfToken = this.generateCSRFToken();
        this.loginAttempts = new Map();
        this.maxLoginAttempts = 5;
        this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        
        this.init();
    }

    init() {
        // Set CSRF token
        const csrfInput = document.getElementById('csrfToken');
        if (csrfInput) {
            csrfInput.value = this.csrfToken;
        }

        // Check for existing session
        this.checkSession();
        
        // Set up session monitoring
        this.setupSessionMonitoring();
        
        // Set up input validation
        this.setupInputValidation();
    }

    // Generate CSRF token
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Validate CSRF token
    validateCSRFToken(token) {
        return token === this.csrfToken;
    }

    // Rate limiting for login attempts
    checkRateLimit(identifier) {
        const now = Date.now();
        const attempts = this.loginAttempts.get(identifier) || { count: 0, firstAttempt: now, lastAttempt: now };
        
        // Reset if lockout period has passed
        if (now - attempts.lastAttempt > this.lockoutDuration) {
            attempts.count = 0;
            attempts.firstAttempt = now;
        }
        
        attempts.lastAttempt = now;
        attempts.count++;
        
        this.loginAttempts.set(identifier, attempts);
        
        if (attempts.count > this.maxLoginAttempts) {
            const remainingTime = Math.ceil((this.lockoutDuration - (now - attempts.lastAttempt)) / 1000 / 60);
            throw new Error(`For mange innloggingsforsøk. Prøv igjen om ${remainingTime} minutter.`);
        }
        
        return true;
    }

    // Input validation
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || email.length > 254) {
            throw new Error('Ugyldig e-postadresse');
        }
        if (!emailRegex.test(email)) {
            throw new Error('E-postadressen må være i riktig format');
        }
        return true;
    }

    validatePassword(password) {
        if (!password || password.length < 8) {
            throw new Error('Passordet må være minst 8 tegn');
        }
        if (password.length > 128) {
            throw new Error('Passordet er for langt');
        }
        // Check for common weak passwords
        const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'test'];
        if (weakPasswords.includes(password.toLowerCase())) {
            throw new Error('Passordet er for svakt');
        }
        return true;
    }

    // Sanitize input
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .trim();
    }

    // Session management
    createSession(userData) {
        const session = {
            id: this.generateSessionId(),
            user: userData,
            created: Date.now(),
            lastActivity: Date.now()
        };
        
        localStorage.setItem('pengeplan_session', JSON.stringify(session));
        return session;
    }

    getSession() {
        const sessionData = localStorage.getItem('pengeplan_session');
        if (!sessionData) return null;
        
        try {
            const session = JSON.parse(sessionData);
            const now = Date.now();
            
            // Check if session has expired
            if (now - session.lastActivity > this.sessionTimeout) {
                this.destroySession();
                return null;
            }
            
            // Update last activity
            session.lastActivity = now;
            localStorage.setItem('pengeplan_session', JSON.stringify(session));
            
            return session;
        } catch (error) {
            this.destroySession();
            return null;
        }
    }

    destroySession() {
        localStorage.removeItem('pengeplan_session');
        localStorage.removeItem('pengeplan_user');
    }

    generateSessionId() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Check if user is authenticated
    isAuthenticated() {
        const session = this.getSession();
        return session !== null;
    }

    // Check user role
    hasRole(role) {
        const session = this.getSession();
        return session && session.user && session.user.role === role;
    }

    // Redirect if not authenticated
    requireAuth(redirectUrl = 'index.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    // Redirect if not admin
    requireAdmin(redirectUrl = 'dashboard.html') {
        if (!this.hasRole('admin')) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    // Setup session monitoring
    setupSessionMonitoring() {
        // Monitor user activity
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                const session = this.getSession();
                if (session) {
                    session.lastActivity = Date.now();
                    localStorage.setItem('pengeplan_session', JSON.stringify(session));
                }
            }, { passive: true });
        });

        // Check session periodically
        setInterval(() => {
            const session = this.getSession();
            if (session && Date.now() - session.lastActivity > this.sessionTimeout) {
                this.destroySession();
                window.location.href = 'index.html';
            }
        }, 60000); // Check every minute
    }

    // Setup input validation
    setupInputValidation() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                try {
                    this.validateEmail(emailInput.value);
                    this.clearError('emailError');
                } catch (error) {
                    this.showError('emailError', error.message);
                }
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('blur', () => {
                try {
                    this.validatePassword(passwordInput.value);
                    this.clearError('passwordError');
                } catch (error) {
                    this.showError('passwordError', error.message);
                }
            });
        }
    }

    // Error handling
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // Check session on page load
    checkSession() {
        const session = this.getSession();
        if (session && window.location.pathname.includes('index.html')) {
            // User is logged in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    }

    // Logout function
    logout() {
        this.destroySession();
        window.location.href = 'index.html';
    }
}

// Initialize security manager
const security = new SecurityManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityManager;
} else {
    window.SecurityManager = SecurityManager;
    window.security = security;
}
