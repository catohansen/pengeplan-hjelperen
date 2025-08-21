/**
 * Finance Calculation Engine
 * Kjerneberegninger – PURE functions (ingen DOM eller sideeffekter)
 */

/**
 * Validate and sanitize amount input
 * @param {number|string} n - Amount to validate
 * @returns {number} Validated amount (0 if invalid)
 */
export function validateAmount(n) {
    const v = Number(n);
    if (!Number.isFinite(v) || v < 0) return 0;
    return +v;
}

/**
 * Sum items by type
 * @param {Array} items - Array of items
 * @param {string} type - Type to filter by
 * @returns {number} Sum of amounts for the type
 */
export function sumByType(items = [], type) {
    return items
        .filter(i => i?.type === type)
        .reduce((s, i) => s + validateAmount(i.amount), 0);
}

/**
 * Calculate monthly balance from income and expenses
 * @param {Array} items - Array of budget items
 * @returns {Object} Object with income, expense, and balance
 */
export function monthlyBalance(items = []) {
    const income = sumByType(items, 'income');
    const expense = sumByType(items, 'expense');
    return { 
        income, 
        expense, 
        balance: income - expense,
        savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0
    };
}

/**
 * Calculate category totals
 * @param {Array} items - Array of items with category and amount
 * @returns {Array} Array of category totals
 */
export function categoryTotals(items = []) {
    const map = new Map();
    for (const i of items) {
        const key = i?.category || 'Uten kategori';
        map.set(key, (map.get(key) || 0) + validateAmount(i.amount));
    }
    return Array.from(map, ([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);
}

/**
 * Calculate bills totals by status
 * @param {Array} bills - Array of bills
 * @returns {Object} Object with planned, paid, and overdue totals
 */
export function billsTotals(bills = []) {
    const out = { planned: 0, paid: 0, overdue: 0, total: 0 };
    for (const b of bills) {
        const amt = validateAmount(b.amount);
        out.total += amt;
        
        if (b.status === 'paid') {
            out.paid += amt;
        } else if (b.status === 'overdue') {
            out.overdue += amt;
        } else {
            out.planned += amt;
        }
    }
    return out;
}

/**
 * Get upcoming bills within a date range
 * @param {Array} bills - Array of bills
 * @param {Date|string} from - Start date
 * @param {number} days - Number of days to look ahead
 * @returns {Array} Array of upcoming bills
 */
export function upcomingBills(bills = [], from = new Date(), days = 7) {
    const start = new Date(from);
    const end = new Date(from); 
    end.setDate(end.getDate() + days);
    
    return bills.filter(b => {
        if (b.status === 'paid') return false;
        const d = new Date(b.due_date || b.dueDate || b.date);
        return !Number.isNaN(d.getTime()) && d >= start && d <= end;
    }).sort((a, b) => new Date(a.due_date || a.dueDate || a.date) - new Date(b.due_date || b.dueDate || b.date));
}

/**
 * Calculate debt totals and weighted APR
 * @param {Array} debts - Array of debts
 * @returns {Object} Object with principal, minPayment, and weighted APR
 */
export function debtTotals(debts = []) {
    let principal = 0, minPayment = 0, weightedAPR = 0;
    
    for (const d of debts) {
        const p = validateAmount(d.principal);
        const m = validateAmount(d.min_payment);
        const r = Number(d.interest_rate_apr) || 0;
        
        principal += p;
        minPayment += m;
        weightedAPR += p * r;
    }
    
    const apr = principal ? weightedAPR / principal : 0;
    const debtToIncomeRatio = principal > 0 ? (minPayment / principal) * 100 : 0;
    
    return { 
        principal, 
        minPayment, 
        apr,
        debtToIncomeRatio,
        totalInterest: principal * (apr / 100)
    };
}

/**
 * Snowball debt repayment plan
 * Prioritize lowest balance; extra payment to first in queue
 * @param {Array} debts - Array of debts
 * @param {number} extra - Extra payment amount
 * @param {number} maxMonths - Maximum months to calculate
 * @returns {Array} Array of debt payoff schedule
 */
export function snowballPlan(debts = [], extra = 0, maxMonths = 600) {
    const list = debts
        .map(d => ({
            id: d.id, 
            creditor: d.creditor,
            principal: validateAmount(d.principal),
            min_payment: validateAmount(d.min_payment),
            interest_rate: Number(d.interest_rate_apr) || 0
        }))
        .filter(d => d.principal > 0)
        .sort((a, b) => a.principal - b.principal); // Snowball: lowest balance first

    const schedule = [];
    let month = 0, snow = validateAmount(extra);
    const monthlyPayments = [];

    while (list.length && month < maxMonths) {
        month++;
        let extraAvail = snow;
        let monthTotal = 0;
        
        for (const d of list) {
            const pay = d.min_payment + extraAvail;
            const interest = d.principal * (d.interest_rate / 100 / 12);
            const principalPayment = Math.min(d.principal, pay - interest);
            
            d.principal = Math.max(0, d.principal - principalPayment);
            monthTotal += pay;
            
            if (extraAvail > 0) extraAvail = 0; // Send entire extra to first in round
        }
        
        monthlyPayments.push(monthTotal);
        
        // Remove paid off debts
        for (let i = list.length - 1; i >= 0; i--) {
            if (list[i].principal <= 0) {
                snow += list[i].min_payment; // Free up min payment for next debt
                schedule.push({ 
                    id: list[i].id, 
                    creditor: list[i].creditor,
                    monthPaidOff: month,
                    totalPaid: monthlyPayments.reduce((sum, payment) => sum + payment, 0)
                });
                list.splice(i, 1);
            }
        }
    }
    
    return {
        schedule,
        totalMonths: month,
        totalPaid: monthlyPayments.reduce((sum, payment) => sum + payment, 0),
        remainingDebts: list.length
    };
}

/**
 * Avalanche debt repayment plan
 * Prioritize highest interest rate
 * @param {Array} debts - Array of debts
 * @param {number} extra - Extra payment amount
 * @param {number} maxMonths - Maximum months to calculate
 * @returns {Array} Array of debt payoff schedule
 */
export function avalanchePlan(debts = [], extra = 0, maxMonths = 600) {
    const list = debts
        .map(d => ({
            id: d.id, 
            creditor: d.creditor,
            principal: validateAmount(d.principal),
            min_payment: validateAmount(d.min_payment),
            interest_rate: Number(d.interest_rate_apr) || 0
        }))
        .filter(d => d.principal > 0)
        .sort((a, b) => b.interest_rate - a.interest_rate); // Avalanche: highest rate first

    const schedule = [];
    let month = 0, snow = validateAmount(extra);
    const monthlyPayments = [];

    while (list.length && month < maxMonths) {
        month++;
        let extraAvail = snow;
        let monthTotal = 0;
        
        for (const d of list) {
            const pay = d.min_payment + extraAvail;
            const interest = d.principal * (d.interest_rate / 100 / 12);
            const principalPayment = Math.min(d.principal, pay - interest);
            
            d.principal = Math.max(0, d.principal - principalPayment);
            monthTotal += pay;
            
            if (extraAvail > 0) extraAvail = 0;
        }
        
        monthlyPayments.push(monthTotal);
        
        for (let i = list.length - 1; i >= 0; i--) {
            if (list[i].principal <= 0) {
                snow += list[i].min_payment;
                schedule.push({ 
                    id: list[i].id, 
                    creditor: list[i].creditor,
                    monthPaidOff: month,
                    totalPaid: monthlyPayments.reduce((sum, payment) => sum + payment, 0)
                });
                list.splice(i, 1);
            }
        }
    }
    
    return {
        schedule,
        totalMonths: month,
        totalPaid: monthlyPayments.reduce((sum, payment) => sum + payment, 0),
        remainingDebts: list.length
    };
}

/**
 * Calculate net worth
 * @param {Array} assets - Array of assets
 * @param {Array} liabilities - Array of liabilities
 * @returns {Object} Net worth calculation
 */
export function calculateNetWorth(assets = [], liabilities = []) {
    const totalAssets = assets.reduce((sum, asset) => sum + validateAmount(asset.value), 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + validateAmount(liability.amount), 0);
    const netWorth = totalAssets - totalLiabilities;
    
    return {
        assets: totalAssets,
        liabilities: totalLiabilities,
        netWorth,
        debtToAssetRatio: totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0
    };
}

/**
 * Calculate emergency fund adequacy
 * @param {number} monthlyExpenses - Monthly expenses
 * @param {number} emergencyFund - Current emergency fund
 * @param {number} targetMonths - Target months of expenses (default 6)
 * @returns {Object} Emergency fund analysis
 */
export function emergencyFundAnalysis(monthlyExpenses, emergencyFund, targetMonths = 6) {
    const target = monthlyExpenses * targetMonths;
    const current = validateAmount(emergencyFund);
    const shortfall = Math.max(0, target - current);
    const adequacy = target > 0 ? (current / target) * 100 : 100;
    
    return {
        target,
        current,
        shortfall,
        adequacy,
        monthsCovered: monthlyExpenses > 0 ? current / monthlyExpenses : 0,
        status: adequacy >= 100 ? 'adequate' : adequacy >= 50 ? 'partial' : 'inadequate'
    };
}
