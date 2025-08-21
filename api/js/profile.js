// Profile Management for Pengeplan
// Enhanced with elegant HR-style layout, advanced functionality, and perfect accessibility

class ProfileManager {
    constructor() {
        this.profile = null;
        this.originalProfile = null;
        this.isLoading = false;
        this.init();
    }

    async init() {
        try {
            this.showLoading('Laster profil...');
            await this.loadProfile();
            this.setupEventListeners();
            this.renderProfile();
            this.checkAdminAccess();
            this.setupKeyboardNavigation();
        } catch (error) {
            console.error('Error initializing profile:', error);
            this.showNotification('Feil ved lasting av profil', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async loadProfile() {
        try {
            this.profile = await db.getProfile();
            if (!this.profile) {
                this.profile = this.createDefaultProfile();
            }
            this.originalProfile = JSON.parse(JSON.stringify(this.profile));
        } catch (error) {
            console.error('Error loading profile:', error);
            this.profile = this.createDefaultProfile();
            this.originalProfile = JSON.parse(JSON.stringify(this.profile));
        }
    }

    createDefaultProfile() {
        return {
            id: crypto.randomUUID(),
            firstName: '',
            lastName: '',
            email: 'bruker@epost.no',
            phone: '',
            postalCode: '',
            role: 'user',
            plan: 'free',
            avatar: null,
            joinDate: new Date().toISOString(),
            notifications: {
                email: true,
                sms: false,
                push: true
            },
            privacy: {
                dataSharing: true,
                marketingEmails: false
            },
            status: 'active'
        };
    }

    setupEventListeners() {
        // Profile image upload
        const profileImageInput = document.getElementById('profileImageInput');
        if (profileImageInput) {
            profileImageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        // Form validation with debouncing
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', this.debounce(() => this.validateField(input), 300));
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Auto-save on changes with debouncing
        const formElements = document.querySelectorAll('input, select');
        formElements.forEach(element => {
            element.addEventListener('change', this.debounce(() => this.autoSave(), 1000));
        });

        // Toggle switch keyboard support
        const toggleSwitches = document.querySelectorAll('.toggle-switch');
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('keydown', (e) => this.handleToggleKeydown(e));
        });

        // Form submission prevention
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => e.preventDefault());
        });
    }

    setupKeyboardNavigation() {
        // Focus management for better keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }
        });

        // Trap focus in modals when they're open
        this.setupFocusTrap();
    }

    setupFocusTrap() {
        // Focus trap for better accessibility
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const activeElement = document.activeElement;
                const container = activeElement.closest('.profile-section, .profile-image-section');
                
                if (container) {
                    const focusable = container.querySelectorAll(focusableElements);
                    const firstElement = focusable[0];
                    const lastElement = focusable[focusable.length - 1];
                    
                    if (e.shiftKey) {
                        if (activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            }
        });
    }

    handleEscapeKey(e) {
        // Close any open modals or return to previous state
        if (this.isLoading) {
            this.hideLoading();
        }
    }

    handleToggleKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const checkbox = e.target.previousElementSibling;
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
                this.updateToggleAria(checkbox);
            }
        }
    }

    updateToggleAria(checkbox) {
        const toggleSwitch = checkbox.nextElementSibling;
        if (toggleSwitch) {
            toggleSwitch.setAttribute('aria-checked', checkbox.checked.toString());
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    renderProfile() {
        this.updateProfileHeader();
        this.updateProfileForm();
        this.updateSidebarUser();
        this.updateAvatar();
        this.updateToggleAriaStates();
    }

    updateProfileHeader() {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const joinDate = document.getElementById('joinDate');
        const profileAvatarLarge = document.getElementById('profileAvatarLarge');

        if (profileName) {
            const fullName = `${this.profile.firstName} ${this.profile.lastName}`.trim() || 'Bruker Navn';
            profileName.textContent = fullName;
        }

        if (profileEmail) {
            profileEmail.textContent = this.profile.email;
        }

        if (joinDate) {
            const date = new Date(this.profile.joinDate);
            joinDate.textContent = date.getFullYear();
        }

        if (profileAvatarLarge) {
            this.updateAvatarElement(profileAvatarLarge, this.profile.avatar, this.getInitials());
        }
    }

    updateProfileForm() {
        // Personal information
        this.setFieldValue('firstName', this.profile.firstName);
        this.setFieldValue('lastName', this.profile.lastName);
        this.setFieldValue('email', this.profile.email);
        this.setFieldValue('phone', this.profile.phone);
        this.setFieldValue('postalCode', this.profile.postalCode);

        // Role and plan
        this.setFieldValue('role', this.profile.role);
        this.setFieldValue('plan', this.profile.plan);

        // Notifications
        this.setFieldValue('emailNotifications', this.profile.notifications.email);
        this.setFieldValue('smsNotifications', this.profile.notifications.sms);
        this.setFieldValue('pushNotifications', this.profile.notifications.push);

        // Privacy
        this.setFieldValue('dataSharing', this.profile.privacy.dataSharing);
        this.setFieldValue('marketingEmails', this.profile.privacy.marketingEmails);
    }

    updateToggleAriaStates() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            this.updateToggleAria(checkbox);
        });
    }

    updateSidebarUser() {
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const userAvatar = document.getElementById('userAvatar');

        if (userName) {
            const fullName = `${this.profile.firstName} ${this.profile.lastName}`.trim() || 'Bruker';
            userName.textContent = fullName;
        }

        if (userRole) {
            const roleNames = {
                user: 'Bruker',
                partner: 'Partner',
                admin: 'Administrator'
            };
            userRole.textContent = roleNames[this.profile.role] || 'Bruker';
        }

        if (userAvatar) {
            this.updateAvatarElement(userAvatar, this.profile.avatar, this.getInitials());
        }
    }

    updateAvatar() {
        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
            this.updateAvatarElement(profileImage, this.profile.avatar, this.getInitials());
        }
    }

    updateAvatarElement(element, avatarData, initials) {
        if (avatarData) {
            element.style.backgroundImage = `url(${avatarData})`;
            element.style.backgroundSize = 'cover';
            element.style.backgroundPosition = 'center';
            element.innerHTML = '';
            element.setAttribute('aria-label', 'Profilbilde');
        } else {
            element.style.backgroundImage = '';
            element.innerHTML = `<span class="${element.classList.contains('user-avatar') ? 'avatar-initials' : 'avatar-initials-large'}">${initials}</span>`;
            element.setAttribute('aria-label', `Profilbilde med initialer: ${initials}`);
        }
    }

    getInitials() {
        const firstName = this.profile.firstName || '';
        const lastName = this.profile.lastName || '';
        const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        return initials || 'U';
    }

    setFieldValue(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field.type === 'checkbox') {
                field.checked = value;
            } else {
                field.value = value;
            }
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        this.clearFieldError(field);

        // Validation rules
        switch (field.name) {
            case 'firstName':
                if (value.length > 0 && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Fornavn må være minst 2 tegn';
                }
                break;
            case 'lastName':
                if (value.length > 0 && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Etternavn må være minst 2 tegn';
                }
                break;
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Vennligst skriv inn en gyldig e-postadresse';
                }
                break;
            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Vennligst skriv inn et gyldig telefonnummer (minst 8 siffer)';
                }
                break;
            case 'postalCode':
                if (value && !this.isValidPostalCode(value)) {
                    isValid = false;
                    errorMessage = 'Vennligst skriv inn et gyldig postnummer (4 siffer)';
                }
                break;
        }

        // Apply validation result
        if (!isValid) {
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', `error-${field.id}`);
        } else {
            field.setAttribute('aria-invalid', 'false');
            field.removeAttribute('aria-describedby');
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        return phoneRegex.test(phone);
    }

    isValidPostalCode(postalCode) {
        const postalRegex = /^[0-9]{4}$/;
        return postalRegex.test(postalCode);
    }

    showFieldError(field, message) {
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.id = `error-${field.id}`;
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            this.showNotification('Vennligst velg et bilde', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showNotification('Bildet er for stort. Maksimal størrelse er 5MB', 'error');
            return;
        }

        try {
            this.showLoading('Laster opp profilbilde...');
            const resizedImage = await this.resizeToSquare(file, 512);
            this.profile.avatar = resizedImage;
            this.updateAvatar();
            this.updateSidebarUser();
            this.updateProfileHeader();
            this.showNotification('Profilbilde oppdatert!', 'success');
            await this.autoSave();
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showNotification('Feil ved opplasting av bilde. Prøv igjen.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async resizeToSquare(file, size) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                try {
                    canvas.width = size;
                    canvas.height = size;

                    // Calculate dimensions to maintain aspect ratio
                    const minDimension = Math.min(img.width, img.height);
                    const startX = (img.width - minDimension) / 2;
                    const startY = (img.height - minDimension) / 2;

                    ctx.drawImage(img, startX, startY, minDimension, minDimension, 0, 0, size, size);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));

            img.src = URL.createObjectURL(file);
        });
    }

    async autoSave() {
        if (this.isLoading) return;
        
        try {
            await this.saveProfile();
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }

    async saveProfile() {
        if (this.isLoading) return false;

        try {
            this.isLoading = true;
            this.showLoading('Lagrer endringer...');

            // Collect form data
            this.profile.firstName = document.getElementById('firstName').value.trim();
            this.profile.lastName = document.getElementById('lastName').value.trim();
            this.profile.phone = document.getElementById('phone').value.trim();
            this.profile.postalCode = document.getElementById('postalCode').value.trim();
            this.profile.role = document.getElementById('role').value;
            this.profile.plan = document.getElementById('plan').value;

            // Notifications
            this.profile.notifications.email = document.getElementById('emailNotifications').checked;
            this.profile.notifications.sms = document.getElementById('smsNotifications').checked;
            this.profile.notifications.push = document.getElementById('pushNotifications').checked;

            // Privacy
            this.profile.privacy.dataSharing = document.getElementById('dataSharing').checked;
            this.profile.privacy.marketingEmails = document.getElementById('marketingEmails').checked;

            // Validate required fields
            if (!this.validateAllFields()) {
                this.showNotification('Vennligst fyll ut alle påkrevde felter', 'error');
                return false;
            }

            // Save to database
            await db.setProfile(this.profile);
            this.originalProfile = JSON.parse(JSON.stringify(this.profile));
            
            this.showNotification('Profil lagret!', 'success');
            this.renderProfile();
            return true;
        } catch (error) {
            console.error('Error saving profile:', error);
            this.showNotification('Feil ved lagring av profil. Prøv igjen.', 'error');
            return false;
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    validateAllFields() {
        const requiredFields = ['firstName', 'lastName', 'email'];
        return requiredFields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && this.validateField(field);
        });
    }

    cancelChanges() {
        if (this.isLoading) return;
        
        this.profile = JSON.parse(JSON.stringify(this.originalProfile));
        this.renderProfile();
        this.showNotification('Endringer avbrutt', 'info');
    }

    async exportData() {
        try {
            this.showLoading('Eksporterer data...');
            
            const data = {
                profile: this.profile,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pengeplan-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);

            this.showNotification('Data eksportert!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showNotification('Feil ved eksport av data', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async downloadData() {
        try {
            this.showLoading('Forbereder nedlasting...');
            // This would create a ZIP file with all user data
            // For now, we'll just export as JSON
            await this.exportData();
        } catch (error) {
            console.error('Error downloading data:', error);
            this.showNotification('Feil ved nedlasting av data', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async deleteAccount() {
        if (this.isLoading) return;
        
        const confirmed = confirm('Er du sikker på at du vil slette kontoen din? Dette kan ikke angres.');
        if (!confirmed) return;

        try {
            this.showLoading('Sletter konto...');
            // Clear all data
            localStorage.clear();
            this.showNotification('Konto slettet', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch (error) {
            console.error('Error deleting account:', error);
            this.showNotification('Feil ved sletting av konto', 'error');
        } finally {
            this.hideLoading();
        }
    }

    copyToClipboard(fieldId) {
        const field = document.getElementById(fieldId);
        if (field && field.value) {
            navigator.clipboard.writeText(field.value).then(() => {
                this.showNotification('Kopiert til utklippstavle!', 'success');
            }).catch(() => {
                this.showNotification('Feil ved kopiering', 'error');
            });
        }
    }

    checkAdminAccess() {
        const adminElements = document.querySelectorAll('.admin-only');
        const isAdmin = this.profile.role === 'admin';
        
        adminElements.forEach(element => {
            element.style.display = isAdmin ? 'block' : 'none';
            element.setAttribute('aria-hidden', (!isAdmin).toString());
        });
    }

    showLoading(message = 'Laster...') {
        this.isLoading = true;
        const loading = document.getElementById('loading');
        const loadingText = loading?.querySelector('.loading-text');
        
        if (loading) {
            loading.style.display = 'flex';
            if (loadingText) {
                loadingText.textContent = message;
            }
        }
    }

    hideLoading() {
        this.isLoading = false;
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.className = `notification notification-${type}`;
            notification.style.display = 'block';
            
            // Announce to screen readers
            notification.setAttribute('aria-live', 'assertive');
            
            setTimeout(() => {
                notification.style.display = 'none';
                notification.setAttribute('aria-live', 'polite');
            }, 5000);
        }
    }
}

// Global functions for HTML onclick handlers
window.changeProfileImage = () => {
    document.getElementById('profileImageInput').click();
};

window.saveProfile = async () => {
    await profileManager.saveProfile();
};

window.cancelChanges = () => {
    profileManager.cancelChanges();
};

window.exportData = () => {
    profileManager.exportData();
};

window.downloadData = () => {
    profileManager.downloadData();
};

window.deleteAccount = () => {
    profileManager.deleteAccount();
};

window.copyToClipboard = (fieldId) => {
    profileManager.copyToClipboard(fieldId);
};

// Initialize profile manager
let profileManager;
document.addEventListener('DOMContentLoaded', () => {
    profileManager = new ProfileManager();
});
