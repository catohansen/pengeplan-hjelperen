/**
 * Login Page Script
 * Handles login form and social authentication
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize security manager if available
    if (typeof SecurityManager !== 'undefined') {
        new SecurityManager().init();
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.getAttribute('data-provider') || this.textContent.trim();
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="loading-spinner"></span> Logger inn...';
            this.disabled = true;
            
            // Simulate social login
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                showNotification(`${provider} innlogging kommer snart!`, 'info');
            }, 1500);
        });
    });
    
    // Add visual feedback for form interactions
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
    
    // Show/hide password toggle
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        const togglePassword = document.createElement('button');
        togglePassword.type = 'button';
        togglePassword.className = 'password-toggle';
        togglePassword.innerHTML = '👁️';
        togglePassword.style.cssText = `
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            opacity: 0.6;
            transition: opacity 0.3s ease;
            z-index: 10;
        `;
        
        const inputContainer = passwordInput.parentElement;
        inputContainer.style.position = 'relative';
        inputContainer.appendChild(togglePassword);
        
        togglePassword.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.innerHTML = '🙈';
            } else {
                passwordInput.type = 'password';
                this.innerHTML = '👁️';
            }
        });
        
        togglePassword.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
        });
        
        togglePassword.addEventListener('mouseleave', function() {
            this.style.opacity = '0.6';
        });
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Vennligst fyll ut både e-post og passord', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Vennligst skriv inn en gyldig e-postadresse', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = document.querySelector('.login-btn');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading-spinner"></span>Logger inn...';
    submitButton.disabled = true;
    
    try {
        // Check if user exists in registered users
        const users = JSON.parse(localStorage.getItem('pengeplan_users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (user) {
            // Registered user - check password
            if (user.password === password) {
                // Create session
                const session = {
                    user: {
                        id: user.id,
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                        role: user.role || 'user'
                    },
                    created: Date.now(),
                    lastActivity: Date.now()
                };
                
                localStorage.setItem('pengeplan_session', JSON.stringify(session));
                localStorage.setItem('userProfile', JSON.stringify(session.user));
                
                // Update user's last login
                user.lastLogin = new Date().toISOString();
                localStorage.setItem('pengeplan_users', JSON.stringify(users));
                
                showNotification('Innlogging vellykket! Omdirigerer...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
                
            } else {
                showNotification('Feil passord', 'error');
            }
        } else {
            // Check demo users (for admin access)
            const demoUsers = {
                'cato@catohansen.no': {
                    password: 'Kilma2386!!?',
                    name: 'Cato Hansen',
                    role: 'admin',
                    email: 'cato@catohansen.no'
                },
                'admin@pengeplan.no': {
                    password: 'admin123',
                    name: 'System Administrator',
                    role: 'admin',
                    email: 'admin@pengeplan.no'
                },
                'user@pengeplan.no': {
                    password: 'user123',
                    name: 'Test User',
                    role: 'user',
                    email: 'user@pengeplan.no'
                }
            };
            
            const demoUser = demoUsers[email];
            
            if (demoUser && demoUser.password === password) {
                // Create session for demo user
                const session = {
                    user: {
                        id: Date.now(),
                        name: demoUser.name,
                        email: demoUser.email,
                        role: demoUser.role
                    },
                    created: Date.now(),
                    lastActivity: Date.now()
                };
                
                localStorage.setItem('pengeplan_session', JSON.stringify(session));
                localStorage.setItem('userProfile', JSON.stringify(session.user));
                
                showNotification('Innlogging vellykket! Omdirigerer...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
                
            } else {
                showNotification('Bruker ikke funnet. Registrer deg først.', 'error');
            }
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Kunne ikke logge inn. Prøv igjen senere.', 'error');
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}
