// Profile Management for Pengeplan
// Enhanced with elegant HR-style layout and advanced functionality

class ProfileManager {
    constructor() {
        this.profile = null;
        this.originalProfile = null;
        this.init();
    }

    async init() {
        await this.loadProfile();
        this.setupEventListeners();
        this.renderProfile();
        this.checkAdminAccess();
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

        // Form validation
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Auto-save on changes
        const formElements = document.querySelectorAll('input, select');
        formElements.forEach(element => {
            element.addEventListener('change', () => this.autoSave());
        });
    }

    renderProfile() {
        this.updateProfileHeader();
        this.updateProfileForm();
        this.updateSidebarUser();
        this.updateAvatar();
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
        } else {
            element.style.backgroundImage = '';
            element.innerHTML = `<span class="${element.classList.contains('user-avatar') ? 'avatar-initials' : 'avatar-initials-large'}">${initials}</span>`;
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

        // Validation rules
        switch (field.name) {
            case 'firstName':
            case 'lastName':
                if (value.length > 0 && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Må være minst 2 tegn';
                }
                break;
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Ugyldig e-postadresse';
                }
                break;
            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Ugyldig telefonnummer';
                }
                break;
            case 'postalCode':
                if (value && !this.isValidPostalCode(value)) {
                    isValid = false;
                    errorMessage = 'Ugyldig postnummer';
                }
                break;
        }

        // Apply validation result
        if (!isValid) {
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
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

        try {
            const resizedImage = await this.resizeToSquare(file, 512);
            this.profile.avatar = resizedImage;
            this.updateAvatar();
            this.updateSidebarUser();
            this.updateProfileHeader();
            this.showNotification('Profilbilde oppdatert!', 'success');
            await this.autoSave();
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showNotification('Feil ved opplasting av bilde', 'error');
        }
    }

    async resizeToSquare(file, size) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = size;
                canvas.height = size;

                // Calculate dimensions to maintain aspect ratio
                const minDimension = Math.min(img.width, img.height);
                const startX = (img.width - minDimension) / 2;
                const startY = (img.height - minDimension) / 2;

                ctx.drawImage(img, startX, startY, minDimension, minDimension, 0, 0, size, size);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };

            img.src = URL.createObjectURL(file);
        });
    }

    async autoSave() {
        try {
            await this.saveProfile();
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }

    async saveProfile() {
        try {
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
            this.showNotification('Feil ved lagring av profil', 'error');
            return false;
        }
    }

    validateAllFields() {
        const fields = ['firstName', 'lastName', 'email'];
        return fields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && this.validateField(field);
        });
    }

    cancelChanges() {
        this.profile = JSON.parse(JSON.stringify(this.originalProfile));
        this.renderProfile();
        this.showNotification('Endringer avbrutt', 'info');
    }

    async exportData() {
        try {
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
        }
    }

    async downloadData() {
        try {
            // This would create a ZIP file with all user data
            // For now, we'll just export as JSON
            await this.exportData();
        } catch (error) {
            console.error('Error downloading data:', error);
            this.showNotification('Feil ved nedlasting av data', 'error');
        }
    }

    async deleteAccount() {
        if (confirm('Er du sikker på at du vil slette kontoen din? Dette kan ikke angres.')) {
            try {
                // Clear all data
                localStorage.clear();
                this.showNotification('Konto slettet', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } catch (error) {
                console.error('Error deleting account:', error);
                this.showNotification('Feil ved sletting av konto', 'error');
            }
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
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.className = `notification notification-${type}`;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
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
