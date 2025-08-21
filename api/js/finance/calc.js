/**
 * 💰 FINANCIAL CALCULATION ENGINE
 * Centralized calculations for Pengeplan
 */

// Core calculation functions
export const monthlyBalance = (budgetItems) => {
    const income = budgetItems
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);
    
    const expenses = budgetItems
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);
    
    return {
        income,
        expenses,
        balance: income - expenses,
        savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0
    };
};

export const billsTotals = (bills) => {
    const paid = bills
        .filter(bill => bill.status === 'paid')
        .reduce((sum, bill) => sum + bill.amount, 0);
    
    const pending = bills
        .filter(bill => bill.status === 'pending')
        .reduce((sum, bill) => sum + bill.amount, 0);
    
    const overdue = bills
        .filter(bill => bill.status === 'overdue')
        .reduce((sum, bill) => sum + bill.amount, 0);
    
    return { paid, pending, overdue, total: paid + pending + overdue };
};

export const debtTotals = (debts) => {
    const principal = debts.reduce((sum, debt) => sum + debt.principal, 0);
    const monthlyPayments = debts.reduce((sum, debt) => sum + debt.min_payment, 0);
    const totalInterest = debts.reduce((sum, debt) => {
        const annualInterest = debt.principal * (debt.interest_rate_apr / 100);
        return sum + annualInterest;
    }, 0);
    
    return {
        principal,
        monthlyPayments,
        totalInterest,
        averageRate: principal > 0 ? (totalInterest / principal) * 100 : 0
    };
};

export const upcomingBills = (bills, currentDate, daysAhead = 7) => {
    const cutoffDate = new Date(currentDate);
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
    
    return bills
        .filter(bill => {
            const dueDate = new Date(bill.due_date);
            return dueDate >= currentDate && dueDate <= cutoffDate && bill.status !== 'paid';
        })
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
};

// Budget analysis functions
export const budgetAnalysis = (budgetItems) => {
    const categories = {};
    
    budgetItems.forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = { income: 0, expenses: 0 };
        }
        
        if (item.type === 'income') {
            categories[item.category].income += item.amount;
        } else {
            categories[item.category].expenses += item.amount;
        }
    });
    
    return Object.entries(categories).map(([category, data]) => ({
        category,
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses
    }));
};

export const spendingTrends = (budgetItems, months = 6) => {
    const monthlyData = {};
    
    budgetItems.forEach(item => {
        const date = new Date(item.date || Date.now());
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { income: 0, expenses: 0 };
        }
        
        if (item.type === 'income') {
            monthlyData[monthKey].income += item.amount;
        } else {
            monthlyData[monthKey].expenses += item.amount;
        }
    });
    
    return Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-months)
        .map(([month, data]) => ({
            month,
            income: data.income,
            expenses: data.expenses,
            balance: data.income - data.expenses
        }));
};

// Debt management functions
export const debtPayoffStrategy = (debts, strategy = 'avalanche') => {
    const sortedDebts = [...debts];
    
    if (strategy === 'avalanche') {
        // Pay highest interest rate first
        sortedDebts.sort((a, b) => b.interest_rate_apr - a.interest_rate_apr);
    } else if (strategy === 'snowball') {
        // Pay smallest balance first
        sortedDebts.sort((a, b) => a.principal - b.principal);
    }
    
    return sortedDebts.map((debt, index) => ({
        ...debt,
        priority: index + 1,
        payoffOrder: index + 1
    }));
};

export const debtPayoffTime = (debt, monthlyPayment) => {
    const principal = debt.principal;
    const rate = debt.interest_rate_apr / 100 / 12; // Monthly rate
    const payment = monthlyPayment;
    
    if (rate === 0) {
        return Math.ceil(principal / payment);
    }
    
    const months = Math.log(payment / (payment - principal * rate)) / Math.log(1 + rate);
    return Math.ceil(months);
};

export const totalInterestPaid = (debt, monthlyPayment) => {
    const months = debtPayoffTime(debt, monthlyPayment);
    const totalPaid = months * monthlyPayment;
    return totalPaid - debt.principal;
};

// Savings and investment functions
export const compoundInterest = (principal, rate, time, contributions = 0, frequency = 'monthly') => {
    const r = rate / 100;
    const n = frequency === 'monthly' ? 12 : frequency === 'quarterly' ? 4 : 1;
    const t = time;
    
    const futureValue = principal * Math.pow(1 + r/n, n*t) + 
                       contributions * ((Math.pow(1 + r/n, n*t) - 1) / (r/n));
    
    return {
        principal,
        interest: futureValue - principal - (contributions * t * n),
        total: futureValue,
        breakdown: {
            initialInvestment: principal,
            totalContributions: contributions * t * n,
            interestEarned: futureValue - principal - (contributions * t * n)
        }
    };
};

export const retirementSavings = (currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn) => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyRate = expectedReturn / 100 / 12;
    const months = yearsToRetirement * 12;
    
    const futureValue = compoundInterest(currentSavings, expectedReturn, yearsToRetirement, monthlyContribution, 'monthly');
    
    return {
        yearsToRetirement,
        monthlyContribution,
        expectedReturn,
        projectedSavings: futureValue.total,
        breakdown: futureValue.breakdown
    };
};

// Emergency fund calculations
export const emergencyFundTarget = (monthlyExpenses, monthsCoverage = 6) => {
    return monthlyExpenses * monthsCoverage;
};

export const emergencyFundProgress = (currentSavings, monthlyExpenses, targetMonths = 6) => {
    const target = emergencyFundTarget(monthlyExpenses, targetMonths);
    const progress = (currentSavings / target) * 100;
    
    return {
        current: currentSavings,
        target,
        progress: Math.min(progress, 100),
        monthsCovered: currentSavings / monthlyExpenses,
        targetMonths,
        status: progress >= 100 ? 'complete' : progress >= 75 ? 'good' : progress >= 50 ? 'fair' : 'poor'
    };
};

// Tax calculations (Norwegian context)
export const norwegianTaxEstimate = (annualIncome, deductions = 0) => {
    const taxableIncome = annualIncome - deductions;
    
    // Simplified Norwegian tax brackets (2024)
    let tax = 0;
    
    if (taxableIncome <= 220000) {
        tax = taxableIncome * 0.22;
    } else if (taxableIncome <= 580000) {
        tax = 220000 * 0.22 + (taxableIncome - 220000) * 0.23;
    } else {
        tax = 220000 * 0.22 + 360000 * 0.23 + (taxableIncome - 580000) * 0.24;
    }
    
    return {
        grossIncome: annualIncome,
        deductions,
        taxableIncome,
        tax,
        effectiveRate: (tax / annualIncome) * 100,
        netIncome: annualIncome - tax
    };
};

// Support program calculations
export const supportProgramEligibility = (income, expenses, familySize = 1) => {
    const disposableIncome = income - expenses;
    const perPersonIncome = disposableIncome / familySize;
    
    // Simplified eligibility criteria
    const programs = [];
    
    if (perPersonIncome < 250000) {
        programs.push({
            name: 'Housing Benefit',
            eligibility: 'Likely eligible',
            estimatedAmount: Math.max(0, (250000 - perPersonIncome) * 0.3)
        });
    }
    
    if (familySize > 1 && perPersonIncome < 300000) {
        programs.push({
            name: 'Child Benefit',
            eligibility: 'Likely eligible',
            estimatedAmount: 1054 * familySize // Monthly child benefit
        });
    }
    
    if (disposableIncome < 0) {
        programs.push({
            name: 'Social Assistance',
            eligibility: 'May be eligible',
            estimatedAmount: Math.abs(disposableIncome) * 0.8
        });
    }
    
    return {
        disposableIncome,
        perPersonIncome,
        familySize,
        eligiblePrograms: programs,
        totalEstimatedSupport: programs.reduce((sum, prog) => sum + prog.estimatedAmount, 0)
    };
};

// Utility functions
export const percentageChange = (oldValue, newValue) => {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
};

export const average = (values) => {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
};

export const median = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};

export const standardDeviation = (values) => {
    const avg = average(values);
    const squaredDiffs = values.map(val => Math.pow(val - avg, 2));
    const avgSquaredDiff = average(squaredDiffs);
    return Math.sqrt(avgSquaredDiff);
};

// Export all functions
export default {
    monthlyBalance,
    billsTotals,
    debtTotals,
    upcomingBills,
    budgetAnalysis,
    spendingTrends,
    debtPayoffStrategy,
    debtPayoffTime,
    totalInterestPaid,
    compoundInterest,
    retirementSavings,
    emergencyFundTarget,
    emergencyFundProgress,
    norwegianTaxEstimate,
    supportProgramEligibility,
    percentageChange,
    average,
    median,
    standardDeviation
};
