/**
 * 🚀 ENHANCED DASHBOARD MANAGER
 * Modern dashboard functionality with real-time updates
 */

class DashboardManager {
    constructor() {
        this.user = null;
        this.stats = {
            totalBalance: 45230,
            monthlySavings: 2450,
            budgetProgress: 78
        };
        this.activities = [];
        this.bills = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.updateDashboard();
        this.startRealTimeUpdates();
        this.checkAdminAccess();
    }

    loadUserData() {
        // Load user from session
        const session = JSON.parse(localStorage.getItem('pengeplan_session') || '{}');
        this.user = session.user || {
            name: 'Bruker',
            email: 'bruker@example.com',
            role: 'user'
        };

        // Load demo data if no real data exists
        this.loadDemoData();
    }

    loadDemoData() {
        // Demo activities
        this.activities = [
            {
                id: 1,
                type: 'income',
                title: 'Lønn mottatt',
                description: 'kr 25,000 fra arbeidsgiver',
                amount: 25000,
                time: 'I dag, 09:00',
                icon: '💰'
            },
            {
                id: 2,
                type: 'expense',
                title: 'Husleie betalt',
                description: 'Månedlig husleie',
                amount: -8500,
                time: 'I går, 14:30',
                icon: '🏠'
            },
            {
                id: 3,
                type: 'expense',
                title: 'Dagligvarer',
                description: 'Rema 1000',
                amount: -450,
                time: 'I går, 12:15',
                icon: '🛒'
            }
        ];

        // Demo bills
        this.bills = [
            {
                id: 1,
                title: 'Strømregning',
                description: 'Forfaller om 3 dager',
                amount: 1200,
                icon: '⚡',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: 2,
                title: 'Mobilregning',
                description: 'Forfaller om 8 dager',
                amount: 299,
                icon: '📱',
                dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
            },
            {
                id: 3,
                title: 'Husleie',
                description: 'Forfaller om 15 dager',
                amount: 8500,
                icon: '🏠',
                dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
            }
        ];
    }

    setupEventListeners() {
        // Logout functionality
        window.logout = () => {
            localStorage.removeItem('pengeplan_session');
            window.location.href = 'index.html';
        };

        // Profile link functionality
        const profileLink = document.getElementById('profileLink');
        if (profileLink) {
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'profile.html';
            });
        }

        // Action card animations
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Activity item interactions
        const activityItems = document.querySelectorAll('.activity-item');
        activityItems.forEach(item => {
            item.addEventListener('click', () => {
                this.showActivityDetails(item.dataset.id);
            });
        });
    }

    updateDashboard() {
        this.updateUserInfo();
        this.updateStats();
        this.updateActivities();
        this.updateBills();
        this.updateAIInsights();
    }

    updateUserInfo() {
        const userName = document.getElementById('userName');
        const profileName = document.getElementById('profileName');
        
        if (userName) {
            userName.textContent = this.user.name || 'Dashboard';
        }
        
        if (profileName) {
            profileName.textContent = this.user.email || 'bruker@example.com';
        }
    }

    updateStats() {
        // Update balance
        const totalBalance = document.getElementById('totalBalance');
        if (totalBalance) {
            totalBalance.textContent = `kr ${this.formatNumber(this.stats.totalBalance)}`;
        }

        // Update savings
        const monthlySavings = document.getElementById('monthlySavings');
        if (monthlySavings) {
            const sign = this.stats.monthlySavings >= 0 ? '+' : '';
            monthlySavings.textContent = `${sign}kr ${this.formatNumber(Math.abs(this.stats.monthlySavings))}`;
            monthlySavings.className = this.stats.monthlySavings >= 0 ? 'positive' : 'negative';
        }

        // Update budget progress
        const budgetProgress = document.getElementById('budgetProgress');
        if (budgetProgress) {
            budgetProgress.textContent = `${this.stats.budgetProgress}%`;
        }
    }

    updateActivities() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        activityList.innerHTML = this.activities.map(activity => `
            <div class="activity-item" data-id="${activity.id}">
                <span class="activity-icon">${activity.icon}</span>
                <div class="activity-content">
                    <span class="activity-title">${activity.title}</span>
                    <span class="activity-desc">${activity.description}</span>
                    <span class="activity-time">${activity.time}</span>
                </div>
                <span class="activity-amount ${activity.amount >= 0 ? 'positive' : 'negative'}">
                    ${activity.amount >= 0 ? '+' : ''}kr ${this.formatNumber(Math.abs(activity.amount))}
                </span>
            </div>
        `).join('');

        // Re-attach event listeners
        const activityItems = document.querySelectorAll('.activity-item');
        activityItems.forEach(item => {
            item.addEventListener('click', () => {
                this.showActivityDetails(item.dataset.id);
            });
        });
    }

    updateBills() {
        const billsList = document.getElementById('billsList');
        if (!billsList) return;

        billsList.innerHTML = this.bills.map(bill => `
            <div class="bill-item" data-id="${bill.id}">
                <span class="bill-icon">${bill.icon}</span>
                <div class="bill-content">
                    <span class="bill-title">${bill.title}</span>
                    <span class="bill-desc">${bill.description}</span>
                </div>
                <span class="bill-amount">kr ${this.formatNumber(bill.amount)}</span>
            </div>
        `).join('');
    }

    updateAIInsights() {
        // Generate personalized insights based on user data
        const insightContent = document.querySelector('.insight-content p');
        if (insightContent) {
            const insights = this.generateInsights();
            insightContent.textContent = insights;
        }
    }

    generateInsights() {
        const savingsRate = (this.stats.monthlySavings / 25000) * 100; // Assuming 25k income
        
        if (savingsRate >= 20) {
            return "Utmerket! Du sparer mer enn 20% av inntekten din. Dette er et fantastisk mål som vil hjelpe deg å bygge en solid økonomisk fremtid. Vurder å investere overskuddet for enda bedre avkastning.";
        } else if (savingsRate >= 10) {
            return "Bra jobb! Du sparer mer enn 10% av inntekten din, som er et godt mål. Vurder å øke sparingen til 15% for å nå dine langsiktige mål raskere.";
        } else if (savingsRate >= 5) {
            return "Du sparer litt, men det er rom for forbedring. Prøv å øke sparingen til minst 10% av inntekten din. Start med små endringer som å redusere unødvendige utgifter.";
        } else {
            return "Det ser ut til at sparingen din kan forbedres. Vurder å lage et detaljert budsjett og identifisere områder hvor du kan kutte utgifter. Mål for å spare minst 10% av inntekten din.";
        }
    }

    showActivityDetails(activityId) {
        const activity = this.activities.find(a => a.id == activityId);
        if (!activity) return;

        // Create modal or notification
        this.showNotification(`Detaljer: ${activity.title}`, `Beløp: ${activity.amount >= 0 ? '+' : ''}kr ${this.formatNumber(Math.abs(activity.amount))}`, 'info');
    }

    startRealTimeUpdates() {
        // Update time-based elements every minute
        setInterval(() => {
            this.updateTimeBasedElements();
        }, 60000);

        // Simulate real-time data updates
        setInterval(() => {
            this.simulateDataUpdate();
        }, 300000); // Every 5 minutes
    }

    updateTimeBasedElements() {
        // Update bill due dates
        this.bills.forEach(bill => {
            const daysUntilDue = Math.ceil((bill.dueDate - new Date()) / (1000 * 60 * 60 * 24));
            if (daysUntilDue <= 3) {
                // Highlight urgent bills
                const billElement = document.querySelector(`[data-id="${bill.id}"]`);
                if (billElement) {
                    billElement.style.borderLeft = '4px solid #ef4444';
                }
            }
        });
    }

    simulateDataUpdate() {
        // Simulate small changes in balance
        const change = Math.random() * 100 - 50; // Random change between -50 and +50
        this.stats.totalBalance += change;
        this.updateStats();
    }

    checkAdminAccess() {
        const adminElements = document.querySelectorAll('.admin-only');
        const isAdmin = this.user.role === 'admin' || this.user.email === 'cato@catohansen.no';
        
        adminElements.forEach(element => {
            element.style.display = isAdmin ? 'flex' : 'none';
        });
    }

    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <strong>${title}</strong>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="notification-body">${message}</div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    formatNumber(num) {
        return num.toLocaleString('nb-NO');
    }

    // Public methods for external access
    refreshData() {
        this.loadUserData();
        this.updateDashboard();
    }

    addActivity(activity) {
        this.activities.unshift(activity);
        this.updateActivities();
    }

    addBill(bill) {
        this.bills.push(bill);
        this.updateBills();
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});

// Export for external use
window.DashboardManager = DashboardManager;
