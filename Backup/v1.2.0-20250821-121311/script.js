document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupLink = document.getElementById('signupLink');
    const spinner = document.getElementById('spinner');
    const btnText = document.querySelector('.btn-text');

    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('pengeplan_logged_in');
    if (isLoggedIn === 'true') {
        window.location.href = 'dashboard.html';
        return;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validate inputs
        if (!email || !password) {
            showNotification('Vennligst fyll ut alle feltene', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Vennligst skriv inn en gyldig e-postadresse', 'error');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        // Simulate login process
        setTimeout(() => {
            // For demo purposes, accept any valid email/password combination
            if (email && password) {
                // Store login state
                localStorage.setItem('pengeplan_logged_in', 'true');
                localStorage.setItem('pengeplan_email', email);
                
                showNotification('Innlogging vellykket!', 'success');
                
                // Redirect based on role (if profile exists and is admin)
                setTimeout(() => {
                    try {
                        const p = JSON.parse(localStorage.getItem('pengeplan_profile')||'{}');
                        if (p && p.role === 'admin') {
                            window.location.href = 'admin.html';
                        } else {
                            window.location.href = 'dashboard.html';
                        }
                    } catch {
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);
            } else {
                showNotification('Feil e-post eller passord', 'error');
                setLoadingState(false);
            }
        }, 1500);
    });

    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Registreringsfunksjonalitet kommer snart!', 'info');
    });

    // Alternative login methods (client-only demo hooks)
    const emailLinkBtn = document.getElementById('loginWithEmailLink');
    const bankIdBtn = document.getElementById('loginWithBankID');
    const googleBtn = document.getElementById('loginWithGoogle');
    const appleBtn = document.getElementById('loginWithApple');

    if (emailLinkBtn) {
        emailLinkBtn.addEventListener('click', async () => {
            // Try to fetch public Supabase config and simulate magic link
            try {
                const res = await fetch('/api/public/auth-config');
                const data = await res.json().catch(() => ({}));
                if (data && data.ok) {
                    showNotification('Sender innloggingslenke (demo): Sjekk e‑posten din', 'success');
                } else {
                    showNotification('Demo: Magic link simulert – logger inn', 'success');
                    setLoadingState(true);
                    setTimeout(() => {
                        localStorage.setItem('pengeplan_logged_in', 'true');
                        localStorage.setItem('pengeplan_email', 'demo@pengeplan.no');
                        window.location.href = 'dashboard.html';
                    }, 700);
                }
            } catch {
                showNotification('Demo: Magic link simulert – logger inn', 'success');
            }
        });
    }

    if (bankIdBtn) {
        bankIdBtn.addEventListener('click', () => {
            showNotification('BankID (simulert): Logger inn...', 'info');
            setLoadingState(true);
            setTimeout(() => {
                localStorage.setItem('pengeplan_logged_in', 'true');
                localStorage.setItem('pengeplan_email', 'bankid@pengeplan.no');
                window.location.href = 'dashboard.html';
            }, 900);
        });
    }

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showNotification('Google‑innlogging (demo) – logger inn...', 'info');
            setLoadingState(true);
            setTimeout(() => {
                localStorage.setItem('pengeplan_logged_in', 'true');
                localStorage.setItem('pengeplan_email', 'google@pengeplan.no');
                window.location.href = 'dashboard.html';
            }, 700);
        });
    }

    // Facebook login
    const facebookBtn = document.getElementById('loginWithFacebook');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            showNotification('Facebook‑innlogging (demo) – logger inn...', 'info');
            setLoadingState(true);
            setTimeout(() => {
                localStorage.setItem('pengeplan_logged_in', 'true');
                localStorage.setItem('pengeplan_email', 'facebook@pengeplan.no');
                window.location.href = 'dashboard.html';
            }, 700);
        });
    }

    function setLoadingState(loading) {
        if (loading) {
            btnText.style.opacity = '0';
            spinner.style.display = 'block';
            loginForm.querySelector('button').disabled = true;
        } else {
            btnText.style.opacity = '1';
            spinner.style.display = 'none';
            loginForm.querySelector('button').disabled = false;
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        
        // Set message and type
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Add some interactive features
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Add enter key support
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    });

    // Add demo credentials hint
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Add placeholder text that shows demo credentials
    emailInput.addEventListener('focus', function() {
        if (!this.value) {
            this.placeholder = 'Demo: demo@pengeplan.no';
        }
    });
    
    emailInput.addEventListener('blur', function() {
        if (!this.value) {
            this.placeholder = 'din@epost.no';
        }
    });
    
    passwordInput.addEventListener('focus', function() {
        if (!this.value) {
            this.placeholder = 'Demo: password123';
        }
    });
    
    passwordInput.addEventListener('blur', function() {
        if (!this.value) {
            this.placeholder = 'Ditt passord';
        }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
        }
        
        // Escape to clear form
        if (e.key === 'Escape') {
            loginForm.reset();
            inputs.forEach(input => input.parentElement.classList.remove('focused'));
        }
    });

    // Add some visual feedback for form validation
    function validateForm() {
        const email = emailInput.value;
        const password = passwordInput.value;
        const submitBtn = loginForm.querySelector('button');
        
        if (email && password) {
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
        }
    }

    // Add real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });

    // Initial validation
    validateForm();

    // Add some nice animations
    const authCard = document.querySelector('.auth-card');
    authCard.style.opacity = '0';
    authCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        authCard.style.transition = 'all 0.5s ease';
        authCard.style.opacity = '1';
        authCard.style.transform = 'translateY(0)';
    }, 100);

    // Add feature overview animation
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });

    console.log('Pengeplan Login initialized successfully!');
});
