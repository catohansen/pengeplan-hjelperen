/**
 * Profile Manager
 * Handles user profile, subscription, and payment functionality
 */

// Import NOK function or define it locally
function NOK(amount) {
    return new Intl.NumberFormat('nb-NO', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: 0
    }).format(amount);
}

class ProfileManager {
    constructor() {
        this.profile = {};
        this.subscription = 'free';
        this.paymentMethods = [];
        this.notifications = {};
    }

    async init() {
        try {
            await this.loadProfile();
            this.setupEventListeners();
            this.renderProfile();
            this.checkAdminAccess();
        } catch (error) {
            console.error('Profile initialization failed:', error);
            this.showNotification('Feil ved lasting av profil', 'error');
        }
    }

    async loadProfile() {
        try {
            // Load from localStorage (will be replaced with Supabase)
            const storedProfile = localStorage.getItem('userProfile');
            if (storedProfile) {
                this.profile = JSON.parse(storedProfile);
            } else {
                this.profile = this.createDefaultProfile();
                this.saveProfile();
            }

            // Load subscription and payment info
            this.subscription = localStorage.getItem('userSubscription') || 'free';
            this.paymentMethods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');
            this.notifications = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
        } catch (error) {
            console.error('Failed to load profile:', error);
            this.profile = this.createDefaultProfile();
        }
    }

    createDefaultProfile() {
        return {
            firstName: 'Cato',
            lastName: 'Hansen',
            email: 'cato@catohansen.no',
            phone: '+47 123 45 678',
            address: 'Oslo, Norge',
            postalCode: '0001',
            avatar: null,
            role: 'user',
            plan: 'free',
            joinDate: '2024-01-01',
            status: 'active'
        };
    }

    saveProfile() {
        try {
            localStorage.setItem('userProfile', JSON.stringify(this.profile));
            localStorage.setItem('userSubscription', this.subscription);
            localStorage.setItem('paymentMethods', JSON.stringify(this.paymentMethods));
            localStorage.setItem('notificationSettings', JSON.stringify(this.notifications));
        } catch (error) {
            console.error('Failed to save profile:', error);
        }
    }

    setupEventListeners() {
        // Avatar upload
        const avatarInput = document.getElementById('avatarInput');
        const profileAvatar = document.getElementById('profileAvatar');
        
        if (profileAvatar && avatarInput) {
            profileAvatar.addEventListener('click', () => avatarInput.click());
            avatarInput.addEventListener('change', (e) => this.handleAvatarUpload(e));
        }

        // Form auto-save
        const formInputs = document.querySelectorAll('.form-group input');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => this.autoSave());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.autoSave();
            });
        });

        // Notification toggles
        const toggles = document.querySelectorAll('.toggle-switch input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', () => this.saveNotificationSettings());
        });
    }

    renderProfile() {
        this.updateProfileHeader();
        this.updateFormFields();
        this.updateSubscriptionDisplay();
        this.updateNotificationSettings();
        this.updateSidebarUser();
    }

    updateProfileHeader() {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileAvatar = document.getElementById('profileAvatar');
        const statusBadge = document.getElementById('statusBadge');

        if (profileName) {
            profileName.textContent = `${this.profile.firstName} ${this.profile.lastName}`;
        }

        if (profileEmail) {
            profileEmail.textContent = this.profile.email;
        }

        if (profileAvatar) {
            if (this.profile.avatar) {
                profileAvatar.style.backgroundImage = `url(${this.profile.avatar})`;
                profileAvatar.style.backgroundSize = 'cover';
                profileAvatar.style.backgroundPosition = 'center';
                profileAvatar.innerHTML = '';
            } else {
                const initials = this.getInitials(`${this.profile.firstName} ${this.profile.lastName}`);
                profileAvatar.innerHTML = `<span class="avatar-initials">${initials}</span>`;
            }
        }

        if (statusBadge) {
            statusBadge.textContent = this.profile.status === 'active' ? 'Aktiv' : 'Inaktiv';
            statusBadge.className = `status-badge ${this.profile.status === 'active' ? 'active' : 'inactive'}`;
        }
    }

    updateFormFields() {
        const fields = {
            'firstName': this.profile.firstName,
            'lastName': this.profile.lastName,
            'email': this.profile.email,
            'phone': this.profile.phone,
            'address': this.profile.address,
            'postalCode': this.profile.postalCode
        };

        Object.entries(fields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element && element.value !== value) {
                element.value = value;
            }
        });
    }

    updateSubscriptionDisplay() {
        const planCards = document.querySelectorAll('.plan-card');
        planCards.forEach(card => {
            const plan = card.dataset.plan;
            const button = card.querySelector('.plan-btn');
            
            if (plan === this.subscription) {
                card.classList.add('current-plan');
                if (button) {
                    button.className = 'plan-btn current';
                    button.textContent = 'Nåværende plan';
                    button.disabled = true;
                }
            } else {
                card.classList.remove('current-plan');
                if (button) {
                    button.className = 'plan-btn upgrade';
                    button.disabled = false;
                }
            }
        });
    }

    updateNotificationSettings() {
        const settings = {
            'emailNotifications': true,
            'pushNotifications': false,
            'monthlyReport': true,
            'supportNotifications': true,
            ...this.notifications
        };

        Object.entries(settings).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.checked = value;
            }
        });
    }

    updateSidebarUser() {
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const userAvatar = document.getElementById('userAvatar');

        if (userName) {
            userName.textContent = `${this.profile.firstName} ${this.profile.lastName}`;
        }

        if (userRole) {
            const roleNames = {
                'user': 'Bruker',
                'partner': 'Partner',
                'admin': 'Administrator'
            };
            userRole.textContent = roleNames[this.profile.role] || 'Bruker';
        }

        if (userAvatar) {
            if (this.profile.avatar) {
                userAvatar.style.backgroundImage = `url(${this.profile.avatar})`;
                userAvatar.style.backgroundSize = 'cover';
                userAvatar.style.backgroundPosition = 'center';
                userAvatar.innerHTML = '';
            } else {
                const initials = this.getInitials(`${this.profile.firstName} ${this.profile.lastName}`);
                userAvatar.innerHTML = `<span class="avatar-initials">${initials}</span>`;
            }
        }
    }

    async handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const imageUrl = await this.resizeAndUploadImage(file);
            this.profile.avatar = imageUrl;
            this.saveProfile();
            this.renderProfile();
            this.showNotification('Profilbilde oppdatert', 'success');
        } catch (error) {
            console.error('Avatar upload failed:', error);
            this.showNotification('Feil ved opplasting av bilde', 'error');
        }
    }

    async resizeAndUploadImage(file) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                const size = 200;
                canvas.width = size;
                canvas.height = size;

                // Create circular crop
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
                ctx.clip();

                // Draw and resize image
                ctx.drawImage(img, 0, 0, size, size);
                
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve(dataUrl);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    autoSave() {
        const fields = {
            'firstName': 'firstName',
            'lastName': 'lastName',
            'email': 'email',
            'phone': 'phone',
            'address': 'address',
            'postalCode': 'postalCode'
        };

        Object.entries(fields).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                this.profile[key] = element.value;
            }
        });

        this.saveProfile();
        this.renderProfile();
    }

    saveNotificationSettings() {
        const settings = {
            'emailNotifications': document.getElementById('emailNotifications')?.checked || false,
            'pushNotifications': document.getElementById('pushNotifications')?.checked || false,
            'monthlyReport': document.getElementById('monthlyReport')?.checked || false,
            'supportNotifications': document.getElementById('supportNotifications')?.checked || false
        };

        this.notifications = settings;
        this.saveProfile();
    }

    getInitials(name) {
        return name.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    // Subscription and Payment Methods
    upgradeToPro() {
        this.showPaymentModal('pro', 'Pro', 99);
    }

    upgradeToPartner() {
        this.showPaymentModal('partner', 'Partner', 199);
    }

    showPaymentModal(plan, planName, price) {
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.style.display = 'block';
            modal.dataset.plan = plan;
            modal.dataset.price = price;
            
            // Update modal content
            const header = modal.querySelector('.modal-header h3');
            if (header) {
                header.textContent = `Oppgrader til ${planName} - ${NOK(price)}/mnd`;
            }
        }
    }

    closePaymentModal() {
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async processPayment() {
        const modal = document.getElementById('paymentModal');
        const plan = modal?.dataset.plan;
        const price = modal?.dataset.price;

        if (!plan || !price) {
            this.showNotification('Feil ved betaling', 'error');
            return;
        }

        // Simulate payment processing
        this.showNotification('Behandler betaling...', 'info');
        
        setTimeout(() => {
            this.subscription = plan;
            this.saveProfile();
            this.renderProfile();
            this.closePaymentModal();
            this.showNotification('Abonnement oppgradert!', 'success');
        }, 2000);
    }

    addPaymentMethod() {
        this.showPaymentModal('payment_method', 'Legg til betalingsmetode', 0);
    }

    removePaymentMethod() {
        if (confirm('Er du sikker på at du vil fjerne denne betalingsmetoden?')) {
            this.paymentMethods = this.paymentMethods.slice(1);
            this.saveProfile();
            this.showNotification('Betalingsmetode fjernet', 'success');
        }
    }

    // Data Export and Privacy
    async exportData() {
        try {
            const data = {
                profile: this.profile,
                subscription: this.subscription,
                paymentMethods: this.paymentMethods,
                notifications: this.notifications,
                exportDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `pengeplan-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            this.showNotification('Data eksportert', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            this.showNotification('Feil ved eksport', 'error');
        }
    }

    async downloadData() {
        // Simulate ZIP download
        this.showNotification('Forbereder ZIP-fil...', 'info');
        
        setTimeout(() => {
            this.showNotification('ZIP-fil lastet ned', 'success');
        }, 1500);
    }

    requestDataDeletion() {
        if (confirm('Er du sikker på at du vil slette kontoen din? Dette kan ikke angres.')) {
            this.showNotification('Konto slettet', 'success');
            setTimeout(() => {
                localStorage.clear();
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    saveProfile() {
        this.autoSave();
        this.showNotification('Profil lagret', 'success');
    }

    checkAdminAccess() {
        if (this.profile.role === 'admin') {
            const adminLink = document.querySelector('.admin-link');
            if (adminLink) {
                adminLink.style.display = 'block';
            }
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
window.saveProfile = function() {
    if (window.profileManager) {
        window.profileManager.saveProfile();
    }
};

window.exportData = function() {
    if (window.profileManager) {
        window.profileManager.exportData();
    }
};

window.upgradeToPro = function() {
    if (window.profileManager) {
        window.profileManager.upgradeToPro();
    }
};

window.upgradeToPartner = function() {
    if (window.profileManager) {
        window.profileManager.upgradeToPartner();
    }
};

window.addPaymentMethod = function() {
    if (window.profileManager) {
        window.profileManager.addPaymentMethod();
    }
};

window.removePaymentMethod = function() {
    if (window.profileManager) {
        window.profileManager.removePaymentMethod();
    }
};

window.downloadData = function() {
    if (window.profileManager) {
        window.profileManager.downloadData();
    }
};

window.requestDataDeletion = function() {
    if (window.profileManager) {
        window.profileManager.requestDataDeletion();
    }
};

window.closePaymentModal = function() {
    if (window.profileManager) {
        window.profileManager.closePaymentModal();
    }
};

window.processPayment = function() {
    if (window.profileManager) {
        window.profileManager.processPayment();
    }
};

// Initialize profile manager
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
    window.profileManager.init();
});
