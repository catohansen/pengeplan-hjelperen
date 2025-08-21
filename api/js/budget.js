/**
 * 💰 BUDGET MANAGER
 * Comprehensive budget management functionality
 */

class BudgetManager {
    constructor() {
        this.transactions = [];
        this.categories = {};
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateBudgetDisplay();
        this.updateTransactionsList();
        this.updateCategoriesGrid();
        this.setupFormValidation();
    }

    loadData() {
        // Load transactions from localStorage
        const storedTransactions = localStorage.getItem('pengeplan_transactions');
        if (storedTransactions) {
            this.transactions = JSON.parse(storedTransactions);
        } else {
            // Load demo data
            this.loadDemoData();
        }

        // Load categories
        this.categories = {
            income: {
                salary: { name: 'Lønn', icon: '💰', color: '#10b981' },
                bonus: { name: 'Bonus', icon: '🎁', color: '#f59e0b' },
                investment: { name: 'Investeringer', icon: '📈', color: '#3b82f6' },
                'other-income': { name: 'Annet', icon: '💵', color: '#8b5cf6' }
            },
            expense: {
                housing: { name: 'Husleie/bolig', icon: '🏠', color: '#ef4444' },
                utilities: { name: 'Strøm/vann/internett', icon: '⚡', color: '#f97316' },
                food: { name: 'Mat og dagligvarer', icon: '🛒', color: '#ec4899' },
                transport: { name: 'Transport', icon: '🚗', color: '#06b6d4' },
                insurance: { name: 'Forsikring', icon: '🛡️', color: '#84cc16' },
                entertainment: { name: 'Underholdning', icon: '🎬', color: '#a855f7' },
                health: { name: 'Helse', icon: '🏥', color: '#f43f5e' },
                'other-expense': { name: 'Annet', icon: '📝', color: '#64748b' }
            }
        };
    }

    loadDemoData() {
        this.transactions = [
            {
                id: 1,
                type: 'income',
                amount: 25000,
                category: 'salary',
                description: 'Månedslønn',
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now()
            },
            {
                id: 2,
                type: 'expense',
                amount: 8500,
                category: 'housing',
                description: 'Husleie',
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now() - 86400000
            },
            {
                id: 3,
                type: 'expense',
                amount: 1200,
                category: 'utilities',
                description: 'Strømregning',
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now() - 172800000
            },
            {
                id: 4,
                type: 'expense',
                amount: 2000,
                category: 'food',
                description: 'Dagligvarer',
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now() - 259200000
            },
            {
                id: 5,
                type: 'expense',
                amount: 1500,
                category: 'transport',
                description: 'Kollektivtransport',
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now() - 345600000
            }
        ];
        this.saveData();
    }

    setupEventListeners() {
        // Transaction form
        const form = document.getElementById('transactionForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTransaction();
            });
        }

        // Transaction type change
        const typeSelect = document.getElementById('transactionType');
        if (typeSelect) {
            typeSelect.addEventListener('change', () => {
                this.updateCategoryOptions();
            });
        }

        // Set default date to today
        const dateInput = document.getElementById('transactionDate');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    setupFormValidation() {
        const amountInput = document.getElementById('transactionAmount');
        if (amountInput) {
            amountInput.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                if (value < 0) {
                    e.target.value = Math.abs(value);
                }
            });
        }
    }

    updateCategoryOptions() {
        const typeSelect = document.getElementById('transactionType');
        const categorySelect = document.getElementById('transactionCategory');
        
        if (!typeSelect || !categorySelect) return;

        const type = typeSelect.value;
        const categoryGroup = this.categories[type];
        
        if (!categoryGroup) return;

        // Clear existing options
        categorySelect.innerHTML = '<option value="">Velg kategori</option>';
        
        // Add new options
        Object.entries(categoryGroup).forEach(([key, category]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${category.icon} ${category.name}`;
            categorySelect.appendChild(option);
        });
    }

    addTransaction() {
        const form = document.getElementById('transactionForm');
        if (!form) return;

        const formData = new FormData(form);
        const type = formData.get('transactionType');
        const amount = parseFloat(formData.get('transactionAmount'));
        const category = formData.get('transactionCategory');
        const date = formData.get('transactionDate');
        const description = formData.get('transactionDescription');

        if (!type || !amount || !category || !date) {
            this.showNotification('Vennligst fyll ut alle påkrevde felter', 'error');
            return;
        }

        const transaction = {
            id: Date.now(),
            type,
            amount,
            category,
            description: description || this.categories[type][category]?.name || 'Ingen beskrivelse',
            date,
            timestamp: Date.now()
        };

        this.transactions.unshift(transaction);
        this.saveData();
        this.updateBudgetDisplay();
        this.updateTransactionsList();
        this.updateCategoriesGrid();
        this.clearForm();
        
        this.showNotification('Transaksjon lagt til!', 'success');
    }

    clearForm() {
        const form = document.getElementById('transactionForm');
        if (form) {
            form.reset();
            // Reset date to today
            const dateInput = document.getElementById('transactionDate');
            if (dateInput) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }
        }
    }

    updateBudgetDisplay() {
        const currentMonthTransactions = this.getCurrentMonthTransactions();
        const balance = this.calculateBalance(currentMonthTransactions);
        
        // Update stats
        this.updateStat('totalIncome', balance.income);
        this.updateStat('totalExpenses', balance.expenses);
        this.updateStat('netBalance', balance.balance);
        this.updateStat('savingsRate', balance.savingsRate);
    }

    updateStat(elementId, value) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (elementId === 'savingsRate') {
            element.textContent = `${value.toFixed(1)}%`;
        } else if (elementId === 'netBalance') {
            const sign = value >= 0 ? '+' : '';
            element.textContent = `${sign}kr ${this.formatNumber(Math.abs(value))}`;
            element.className = value >= 0 ? 'positive' : 'negative';
        } else {
            element.textContent = `kr ${this.formatNumber(value)}`;
        }
    }

    updateTransactionsList() {
        const container = document.getElementById('transactionsList');
        if (!container) return;

        const recentTransactions = this.transactions.slice(0, 10);
        
        container.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item" data-id="${transaction.id}">
                <div class="transaction-icon ${transaction.type}">
                    ${this.categories[transaction.type][transaction.category]?.icon || '📄'}
                </div>
                <div class="transaction-content">
                    <div class="transaction-title">${transaction.description}</div>
                    <div class="transaction-category">${this.categories[transaction.type][transaction.category]?.name || transaction.category}</div>
                    <div class="transaction-date">${this.formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount ${transaction.type === 'income' ? 'positive' : 'negative'}">
                    ${transaction.type === 'income' ? '+' : '-'}kr ${this.formatNumber(transaction.amount)}
                </div>
            </div>
        `).join('');
    }

    updateCategoriesGrid() {
        const container = document.getElementById('categoriesGrid');
        if (!container) return;

        const currentMonthTransactions = this.getCurrentMonthTransactions();
        const categoryTotals = this.calculateCategoryTotals(currentMonthTransactions);
        
        container.innerHTML = Object.entries(categoryTotals).map(([type, categories]) => `
            <div class="category-section">
                <h3>${type === 'income' ? 'Inntekter' : 'Utgifter'}</h3>
                ${Object.entries(categories).map(([category, data]) => `
                    <div class="category-card">
                        <div class="category-header">
                            <span class="category-name">
                                ${this.categories[type][category]?.icon || '📄'} 
                                ${this.categories[type][category]?.name || category}
                            </span>
                            <span class="category-amount ${type === 'income' ? 'positive' : 'negative'}">
                                ${type === 'income' ? '+' : '-'}kr ${this.formatNumber(data.amount)}
                            </span>
                        </div>
                        <div class="category-progress">
                            <div class="progress-fill" style="width: ${data.percentage}%"></div>
                        </div>
                        <div class="category-stats">
                            <span>${data.count} transaksjoner</span>
                            <span>${data.percentage.toFixed(1)}% av total</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    getCurrentMonthTransactions() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        });
    }

    calculateBalance(transactions) {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const balance = income - expenses;
        const savingsRate = income > 0 ? (balance / income) * 100 : 0;
        
        return { income, expenses, balance, savingsRate };
    }

    calculateCategoryTotals(transactions) {
        const totals = { income: {}, expense: {} };
        const balance = this.calculateBalance(transactions);
        
        transactions.forEach(transaction => {
            const type = transaction.type;
            const category = transaction.category;
            
            if (!totals[type][category]) {
                totals[type][category] = { amount: 0, count: 0 };
            }
            
            totals[type][category].amount += transaction.amount;
            totals[type][category].count += 1;
        });
        
        // Calculate percentages
        Object.keys(totals).forEach(type => {
            const total = type === 'income' ? balance.income : balance.expenses;
            Object.keys(totals[type]).forEach(category => {
                totals[type][category].percentage = total > 0 ? 
                    (totals[type][category].amount / total) * 100 : 0;
            });
        });
        
        return totals;
    }

    exportTransactions() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `transaksjoner_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    generateCSV() {
        const headers = ['Dato', 'Type', 'Kategori', 'Beskrivelse', 'Beløp'];
        const rows = this.transactions.map(t => [
            t.date,
            t.type === 'income' ? 'Inntekt' : 'Utgift',
            this.categories[t.type][t.category]?.name || t.category,
            t.description,
            t.amount
        ]);
        
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    formatNumber(num) {
        return num.toLocaleString('nb-NO');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'I dag';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'I går';
        } else {
            return date.toLocaleDateString('nb-NO');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <strong>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${type.toUpperCase()}</strong>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="notification-body">${message}</div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    saveData() {
        localStorage.setItem('pengeplan_transactions', JSON.stringify(this.transactions));
    }

    // Public methods
    getTransactions() {
        return this.transactions;
    }

    getCategories() {
        return this.categories;
    }

    addTransactionManually(transaction) {
        this.transactions.unshift(transaction);
        this.saveData();
        this.updateBudgetDisplay();
        this.updateTransactionsList();
        this.updateCategoriesGrid();
    }
}

// Global functions for HTML onclick handlers
window.clearForm = () => {
    if (window.budgetManager) {
        window.budgetManager.clearForm();
    }
};

window.exportTransactions = () => {
    if (window.budgetManager) {
        window.budgetManager.exportTransactions();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.budgetManager = new BudgetManager();
});

// Export for external use
window.BudgetManager = BudgetManager;
