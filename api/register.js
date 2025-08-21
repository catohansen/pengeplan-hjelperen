/**
 * Pengeplan - Registration Page Script
 * Handles form validation, password strength, and user registration
 */

class RegistrationManager {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.passwordStrength = document.getElementById('passwordStrength');
        this.submitButton = document.querySelector('.register-btn');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupPasswordStrength();
        this.setupFormValidation();
        this.setupAutoSave();
    }
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Password strength monitoring
        this.passwordInput.addEventListener('input', () => this.checkPasswordStrength());
        this.confirmPasswordInput.addEventListener('input', () => this.validatePasswordMatch());
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
        
        // Terms and conditions
        const termsCheckbox = document.getElementById('terms');
        const privacyCheckbox = document.getElementById('privacy');
        
        [termsCheckbox, privacyCheckbox].forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validateRequiredCheckboxes());
        });
        
        // Auto-save on input
        inputs.forEach(input => {
            input.addEventListener('input', () => this.autoSave());
        });
    }
    
    setupPasswordStrength() {
        this.passwordStrength.innerHTML = `
            <div class="strength-indicator">
                <span class="strength-text">Passordstyrke: </span>
                <span class="strength-value">Ingen</span>
            </div>
            <div class="strength-requirements">
                <div class="requirement" data-requirement="length">Minst 8 tegn</div>
                <div class="requirement" data-requirement="uppercase">Stor bokstav</div>
                <div class="requirement" data-requirement="lowercase">Liten bokstav</div>
                <div class="requirement" data-requirement="number">Tall</div>
                <div class="requirement" data-requirement="special">Spesialtegn</div>
            </div>
        `;
    }
    
    setupFormValidation() {
        // Add validation attributes
        this.passwordInput.setAttribute('minlength', '8');
        this.passwordInput.setAttribute('pattern', '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$');
        
        // Email validation
        const emailInput = document.getElementById('email');
        emailInput.setAttribute('pattern', '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    }
    
    setupAutoSave() {
        // Auto-save form data to localStorage
        const savedData = localStorage.getItem('pengeplan_registration_draft');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.populateForm(data);
                this.showNotification('Tidligere utkast gjenopprettet', 'info');
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }
    
    populateForm(data) {
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = data[key];
                } else {
                    element.value = data[key];
                }
            }
        });
    }
    
    autoSave() {
        const formData = this.getFormData();
        localStorage.setItem('pengeplan_registration_draft', JSON.stringify(formData));
    }
    
    getFormData() {
        const formData = {};
        const inputs = this.form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.name] = input.checked;
            } else {
                formData[input.name] = input.value;
            }
        });
        
        return formData;
    }
    
    checkPasswordStrength() {
        const password = this.passwordInput.value;
        const strength = this.calculatePasswordStrength(password);
        
        const strengthValue = this.passwordStrength.querySelector('.strength-value');
        const requirements = this.passwordStrength.querySelectorAll('.requirement');
        
        // Update strength indicator
        strengthValue.textContent = strength.text;
        strengthValue.className = `strength-value ${strength.class}`;
        
        // Update requirements
        requirements.forEach(req => {
            const requirement = req.dataset.requirement;
            const isMet = strength.requirements[requirement];
            
            req.classList.toggle('met', isMet);
            req.classList.toggle('unmet', !isMet);
        });
        
        // Update input styling
        this.passwordInput.parentElement.classList.remove('error', 'success');
        if (password.length > 0) {
            this.passwordInput.parentElement.classList.add(strength.class);
        }
        
        this.validatePasswordMatch();
    }
    
    calculatePasswordStrength(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };
        
        const metCount = Object.values(requirements).filter(Boolean).length;
        
        let strength = { text: 'Svak', class: 'weak' };
        
        if (metCount >= 5) {
            strength = { text: 'Sterk', class: 'strong' };
        } else if (metCount >= 3) {
            strength = { text: 'Middels', class: 'medium' };
        }
        
        return {
            text: strength.text,
            class: strength.class,
            requirements
        };
    }
    
    validatePasswordMatch() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        
        this.confirmPasswordInput.parentElement.classList.remove('error', 'success');
        
        if (confirmPassword.length > 0) {
            if (password === confirmPassword) {
                this.confirmPasswordInput.parentElement.classList.add('success');
                this.clearFieldError(this.confirmPasswordInput);
            } else {
                this.confirmPasswordInput.parentElement.classList.add('error');
                this.showFieldError(this.confirmPasswordInput, 'Passordene matcher ikke');
            }
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Dette feltet er påkrevd');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Ugyldig e-postadresse');
                return false;
            }
        }
        
        // Phone validation
        if (name === 'phone' && value) {
            const phoneRegex = /^(\+47\s?)?[0-9]{8}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                this.showFieldError(field, 'Ugyldig telefonnummer');
                return false;
            }
        }
        
        // Postal code validation
        if (name === 'postalCode' && value) {
            const postalRegex = /^[0-9]{4}$/;
            if (!postalRegex.test(value)) {
                this.showFieldError(field, 'Ugyldig postnummer');
                return false;
            }
        }
        
        // Income validation
        if (name === 'income' && value) {
            const income = parseInt(value);
            if (isNaN(income) || income < 0) {
                this.showFieldError(field, 'Ugyldig inntekt');
                return false;
            }
        }
        
        // Password validation
        if (name === 'password' && value) {
            const strength = this.calculatePasswordStrength(value);
            if (strength.class === 'weak') {
                this.showFieldError(field, 'Passordet er for svakt');
                return false;
            }
        }
        
        // Mark as valid
        field.parentElement.classList.add('success');
        return true;
    }
    
    validateRequiredCheckboxes() {
        const termsCheckbox = document.getElementById('terms');
        const privacyCheckbox = document.getElementById('privacy');
        
        const termsLabel = termsCheckbox.parentElement;
        const privacyLabel = privacyCheckbox.parentElement;
        
        // Clear previous errors
        termsLabel.classList.remove('error');
        privacyLabel.classList.remove('error');
        
        let isValid = true;
        
        if (!termsCheckbox.checked) {
            termsLabel.classList.add('error');
            isValid = false;
        }
        
        if (!privacyCheckbox.checked) {
            privacyLabel.classList.add('error');
            isValid = false;
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        const container = field.parentElement;
        container.classList.add('error');
        
        // Remove existing error message
        const existingError = container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<span>⚠️</span> ${message}`;
        container.appendChild(errorDiv);
    }
    
    clearFieldError(field) {
        const container = field.parentElement;
        container.classList.remove('error');
        
        const errorMessage = container.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        // Validate all required fields
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        // Validate password match
        if (this.passwordInput.value !== this.confirmPasswordInput.value) {
            this.showFieldError(this.confirmPasswordInput, 'Passordene matcher ikke');
            isValid = false;
        }
        
        // Validate required checkboxes
        if (!this.validateRequiredCheckboxes()) {
            isValid = false;
        }
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showNotification('Vennligst fyll ut alle påkrevde felter korrekt', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            const formData = this.getFormData();
            
            // Simulate API call
            await this.registerUser(formData);
            
            // Clear saved draft
            localStorage.removeItem('pengeplan_registration_draft');
            
            // Show success message
            this.showNotification('Konto opprettet! Du blir omdirigert til innlogging...', 'success');
            
            // Redirect to login page after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            this.showNotification('Kunne ikke opprette konto. Prøv igjen senere.', 'error');
            console.error('Registration error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async registerUser(userData) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Store user data in localStorage (in real app, this would be sent to server)
        const users = JSON.parse(localStorage.getItem('pengeplan_users') || '[]');
        
        // Check if email already exists
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('E-postadressen er allerede registrert');
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            role: 'user',
            plan: 'free',
            status: 'active',
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        
        users.push(newUser);
        localStorage.setItem('pengeplan_users', JSON.stringify(users));
        
        return newUser;
    }
    
    setLoadingState(loading) {
        this.submitButton.disabled = loading;
        
        if (loading) {
            this.submitButton.innerHTML = '<span class="loading-spinner"></span>Oppretter konto...';
            this.form.classList.add('loading');
        } else {
            this.submitButton.innerHTML = '<span>Opprett konto</span>';
            this.form.classList.remove('loading');
        }
    }
    
    showNotification(message, type = 'info') {
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new RegistrationManager();
});

// Add some CSS for password strength requirements
const style = document.createElement('style');
style.textContent = `
    .strength-requirements {
        margin-top: 0.5rem;
        font-size: 0.75rem;
    }
    
    .requirement {
        color: #9ca3af;
        margin: 0.125rem 0;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .requirement::before {
        content: '○';
        font-size: 0.875rem;
    }
    
    .requirement.met {
        color: #10b981;
    }
    
    .requirement.met::before {
        content: '●';
    }
    
    .requirement.unmet {
        color: #ef4444;
    }
    
    .strength-indicator {
        margin-bottom: 0.5rem;
    }
    
    .strength-value {
        font-weight: 600;
    }
    
    .strength-value.weak {
        color: #ef4444;
    }
    
    .strength-value.medium {
        color: #f59e0b;
    }
    
    .strength-value.strong {
        color: #10b981;
    }
    
    .checkbox-label.error {
        color: #ef4444;
    }
    
    .checkbox-label.error .checkmark {
        border-color: #ef4444;
    }
`;
document.head.appendChild(style);
