/**
 * 🔒 SECURITY MANAGER
 * Enhanced security with administrator role switching
 */

class SecurityManager {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.adminEmail = 'cato@catohansen.no';
        this.init();
    }

    init() {
        this.loadUserSession();
        this.setupAdminControls();
        this.checkAdminAccess();
        this.setupEventListeners();
    }

    loadUserSession() {
        const session = JSON.parse(localStorage.getItem('pengeplan_session') || '{}');
        this.currentUser = session.user || {
            name: 'Bruker',
            email: 'bruker@example.com',
            role: 'user'
        };
        
        // Check if current user is admin
        this.isAdmin = this.currentUser.email === this.adminEmail || this.currentUser.role === 'admin';
    }

    setupAdminControls() {
        // Create admin role switcher if user is admin
        if (this.isAdmin) {
            this.createAdminRoleSwitcher();
        }
    }

    createAdminRoleSwitcher() {
        // Create admin controls container
        let adminControls = document.querySelector('.admin-controls');
        if (!adminControls) {
            adminControls = document.createElement('div');
            adminControls.className = 'admin-controls';
            adminControls.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 1001;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 15px;
                padding: 15px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(0, 0, 0, 0.1);
                min-width: 200px;
            `;
            document.body.appendChild(adminControls);
        }

        adminControls.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: 600; color: #1f2937; font-size: 0.9rem;">
                🔧 Admin Kontroll
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 0.8rem; color: #6b7280;">
                    Aktuell rolle:
                </label>
                <span id="currentRole" style="font-weight: 600; color: #168d60; font-size: 0.9rem;">
                    ${this.currentUser.role === 'admin' ? 'Administrator' : 'Bruker'}
                </span>
            </div>
            <div style="display: flex; gap: 8px; flex-direction: column;">
                <button id="switchToUser" class="admin-btn" style="
                    background: ${this.currentUser.role === 'user' ? '#168d60' : '#f3f4f6'};
                    color: ${this.currentUser.role === 'user' ? 'white' : '#374151'};
                    border: 1px solid ${this.currentUser.role === 'user' ? '#168d60' : '#d1d5db'};
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    👤 Vanlig Bruker
                </button>
                <button id="switchToAdmin" class="admin-btn" style="
                    background: ${this.currentUser.role === 'admin' ? '#dc2626' : '#f3f4f6'};
                    color: ${this.currentUser.role === 'admin' ? 'white' : '#374151'};
                    border: 1px solid ${this.currentUser.role === 'admin' ? '#dc2626' : '#d1d5db'};
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    ⚙️ Administrator
                </button>
            </div>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                <div style="font-size: 0.7rem; color: #9ca3af; line-height: 1.3;">
                    Logget inn som: ${this.currentUser.email}
                </div>
            </div>
        `;

        // Add event listeners
        const userBtn = document.getElementById('switchToUser');
        const adminBtn = document.getElementById('switchToAdmin');

        if (userBtn) {
            userBtn.addEventListener('click', () => this.switchRole('user'));
        }
        if (adminBtn) {
            adminBtn.addEventListener('click', () => this.switchRole('admin'));
        }
    }

    switchRole(role) {
        // Update user role
        this.currentUser.role = role;
        
        // Update session
        const session = {
            user: this.currentUser,
            timestamp: Date.now(),
            expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        localStorage.setItem('pengeplan_session', JSON.stringify(session));

        // Update UI
        this.updateRoleDisplay();
        this.checkAdminAccess();
        
        // Show notification
        this.showNotification(`Rolle endret til: ${role === 'admin' ? 'Administrator' : 'Vanlig Bruker'}`, 'success');
        
        // Refresh page to update all admin elements
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    updateRoleDisplay() {
        const currentRole = document.getElementById('currentRole');
        if (currentRole) {
            currentRole.textContent = this.currentUser.role === 'admin' ? 'Administrator' : 'Bruker';
        }

        // Update button styles
        const userBtn = document.getElementById('switchToUser');
        const adminBtn = document.getElementById('switchToAdmin');

        if (userBtn) {
            userBtn.style.background = this.currentUser.role === 'user' ? '#168d60' : '#f3f4f6';
            userBtn.style.color = this.currentUser.role === 'user' ? 'white' : '#374151';
            userBtn.style.borderColor = this.currentUser.role === 'user' ? '#168d60' : '#d1d5db';
        }

        if (adminBtn) {
            adminBtn.style.background = this.currentUser.role === 'admin' ? '#dc2626' : '#f3f4f6';
            adminBtn.style.color = this.currentUser.role === 'admin' ? 'white' : '#374151';
            adminBtn.style.borderColor = this.currentUser.role === 'admin' ? '#dc2626' : '#d1d5db';
        }
    }

    checkAdminAccess() {
        const adminElements = document.querySelectorAll('.admin-only');
        const isAdmin = this.currentUser.role === 'admin' || this.currentUser.email === this.adminEmail;
        
        adminElements.forEach(element => {
            element.style.display = isAdmin ? 'flex' : 'none';
        });

        // Update user info display
        this.updateUserInfo();
    }

    updateUserInfo() {
        const userName = document.getElementById('userName');
        const profileName = document.getElementById('profileName');
        
        if (userName) {
            const roleText = this.currentUser.role === 'admin' ? ' (Admin)' : '';
            userName.textContent = `${this.currentUser.name}${roleText}`;
        }
        
        if (profileName) {
            profileName.textContent = this.currentUser.email;
        }
    }

    setupEventListeners() {
        // Logout functionality
        window.logout = () => {
            localStorage.removeItem('pengeplan_session');
            window.location.href = 'index.html';
        };

        // Keyboard shortcuts for admin
        if (this.isAdmin) {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+A to switch to admin
                if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                    e.preventDefault();
                    this.switchRole('admin');
                }
                // Ctrl+Shift+U to switch to user
                if (e.ctrlKey && e.shiftKey && e.key === 'U') {
                    e.preventDefault();
                    this.switchRole('user');
                }
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-weight: 500;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        // Add animation styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Public methods
    isUserAdmin() {
        return this.currentUser.role === 'admin' || this.currentUser.email === this.adminEmail;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getCurrentRole() {
        return this.currentUser.role;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.securityManager = new SecurityManager();
});

// Export for external use
window.SecurityManager = SecurityManager;
