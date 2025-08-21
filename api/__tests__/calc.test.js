/**
 * Finance Calculation Engine Tests
 */

import { 
    validateAmount, 
    sumByType, 
    monthlyBalance, 
    categoryTotals, 
    billsTotals, 
    upcomingBills, 
    debtTotals, 
    snowballPlan, 
    avalanchePlan,
    calculateNetWorth,
    emergencyFundAnalysis
} from '../js/finance/calc.js';

describe('validateAmount', () => {
    test('validates positive numbers', () => {
        expect(validateAmount(100)).toBe(100);
        expect(validateAmount('500')).toBe(500);
        expect(validateAmount(0)).toBe(0);
    });

    test('returns 0 for invalid inputs', () => {
        expect(validateAmount(-100)).toBe(0);
        expect(validateAmount('invalid')).toBe(0);
        expect(validateAmount(null)).toBe(0);
        expect(validateAmount(undefined)).toBe(0);
        expect(validateAmount(NaN)).toBe(0);
    });
});

describe('sumByType', () => {
    test('sums items by type correctly', () => {
        const items = [
            { type: 'income', amount: 1000 },
            { type: 'expense', amount: 400 },
            { type: 'income', amount: 500 },
            { type: 'expense', amount: 100 }
        ];
        
        expect(sumByType(items, 'income')).toBe(1500);
        expect(sumByType(items, 'expense')).toBe(500);
        expect(sumByType(items, 'savings')).toBe(0);
    });

    test('handles empty array', () => {
        expect(sumByType([], 'income')).toBe(0);
    });

    test('handles invalid amounts', () => {
        const items = [
            { type: 'income', amount: 'invalid' },
            { type: 'income', amount: -100 },
            { type: 'income', amount: 500 }
        ];
        
        expect(sumByType(items, 'income')).toBe(500);
    });
});

describe('monthlyBalance', () => {
    test('calculates monthly balance correctly', () => {
        const items = [
            { type: 'income', amount: 1000 },
            { type: 'expense', amount: 400 },
            { type: 'expense', amount: 100 }
        ];
        
        const result = monthlyBalance(items);
        expect(result.income).toBe(1000);
        expect(result.expense).toBe(500);
        expect(result.balance).toBe(500);
        expect(result.savingsRate).toBe(50);
    });

    test('handles zero income', () => {
        const items = [
            { type: 'expense', amount: 400 }
        ];
        
        const result = monthlyBalance(items);
        expect(result.income).toBe(0);
        expect(result.expense).toBe(400);
        expect(result.balance).toBe(-400);
        expect(result.savingsRate).toBe(0);
    });
});

describe('categoryTotals', () => {
    test('groups and sums by category', () => {
        const items = [
            { category: 'Food', amount: 200 },
            { category: 'Transport', amount: 150 },
            { category: 'Food', amount: 100 },
            { category: 'Entertainment', amount: 50 }
        ];
        
        const result = categoryTotals(items);
        expect(result).toEqual([
            { category: 'Food', amount: 300 },
            { category: 'Transport', amount: 150 },
            { category: 'Entertainment', amount: 50 }
        ]);
    });

    test('handles items without category', () => {
        const items = [
            { amount: 100 },
            { category: 'Food', amount: 200 }
        ];
        
        const result = categoryTotals(items);
        expect(result).toEqual([
            { category: 'Food', amount: 200 },
            { category: 'Uten kategori', amount: 100 }
        ]);
    });
});

describe('billsTotals', () => {
    test('buckets bills by status correctly', () => {
        const bills = [
            { amount: 500, status: 'planned' },
            { amount: 200, status: 'paid' },
            { amount: 300, status: 'overdue' },
            { amount: 100, status: 'planned' }
        ];
        
        const result = billsTotals(bills);
        expect(result.planned).toBe(600);
        expect(result.paid).toBe(200);
        expect(result.overdue).toBe(300);
        expect(result.total).toBe(1100);
    });

    test('handles empty bills array', () => {
        const result = billsTotals([]);
        expect(result.planned).toBe(0);
        expect(result.paid).toBe(0);
        expect(result.overdue).toBe(0);
        expect(result.total).toBe(0);
    });
});

describe('upcomingBills', () => {
    test('filters upcoming bills correctly', () => {
        const today = new Date('2024-01-15');
        const bills = [
            { amount: 100, status: 'planned', due_date: '2024-01-20' },
            { amount: 200, status: 'paid', due_date: '2024-01-18' },
            { amount: 300, status: 'planned', due_date: '2024-01-25' },
            { amount: 150, status: 'planned', due_date: '2024-01-10' } // past
        ];
        
        const result = upcomingBills(bills, today, 7);
        expect(result).toHaveLength(1);
        expect(result[0].amount).toBe(100);
    });

    test('sorts by due date', () => {
        const today = new Date('2024-01-15');
        const bills = [
            { amount: 300, status: 'planned', due_date: '2024-01-25' },
            { amount: 100, status: 'planned', due_date: '2024-01-20' }
        ];
        
        const result = upcomingBills(bills, today, 15);
        expect(result[0].amount).toBe(100);
        expect(result[1].amount).toBe(300);
    });
});

describe('debtTotals', () => {
    test('calculates debt totals and weighted APR', () => {
        const debts = [
            { principal: 1000, min_payment: 100, interest_rate_apr: 0.2 },
            { principal: 1000, min_payment: 50, interest_rate_apr: 0.1 }
        ];
        
        const result = debtTotals(debts);
        expect(result.principal).toBe(2000);
        expect(result.minPayment).toBe(150);
        expect(Math.round(result.apr * 1000) / 1000).toBe(0.15);
        expect(result.debtToIncomeRatio).toBe(7.5);
    });

    test('handles zero principal', () => {
        const debts = [
            { principal: 0, min_payment: 100, interest_rate_apr: 0.2 }
        ];
        
        const result = debtTotals(debts);
        expect(result.principal).toBe(0);
        expect(result.apr).toBe(0);
    });
});

describe('snowballPlan', () => {
    test('pays smallest debt first', () => {
        const debts = [
            { id: 'A', principal: 500, min_payment: 100, interest_rate_apr: 0.1 },
            { id: 'B', principal: 1000, min_payment: 100, interest_rate_apr: 0.2 }
        ];
        
        const plan = snowballPlan(debts, 100);
        expect(plan.schedule[0].id).toBe('A');
        expect(plan.schedule[1].id).toBe('B');
    });

    test('calculates total months and payments', () => {
        const debts = [
            { id: 'A', principal: 500, min_payment: 100, interest_rate_apr: 0.1 }
        ];
        
        const plan = snowballPlan(debts, 100);
        expect(plan.totalMonths).toBeGreaterThan(0);
        expect(plan.totalPaid).toBeGreaterThan(500);
        expect(plan.remainingDebts).toBe(0);
    });
});

describe('avalanchePlan', () => {
    test('pays highest interest rate first', () => {
        const debts = [
            { id: 'A', principal: 500, min_payment: 100, interest_rate_apr: 0.1 },
            { id: 'B', principal: 1000, min_payment: 100, interest_rate_apr: 0.2 }
        ];
        
        const plan = avalanchePlan(debts, 100);
        expect(plan.schedule[0].id).toBe('B');
        expect(plan.schedule[1].id).toBe('A');
    });
});

describe('calculateNetWorth', () => {
    test('calculates net worth correctly', () => {
        const assets = [
            { value: 50000 },
            { value: 25000 }
        ];
        const liabilities = [
            { amount: 20000 },
            { amount: 5000 }
        ];
        
        const result = calculateNetWorth(assets, liabilities);
        expect(result.assets).toBe(75000);
        expect(result.liabilities).toBe(25000);
        expect(result.netWorth).toBe(50000);
        expect(result.debtToAssetRatio).toBe(33.33);
    });
});

describe('emergencyFundAnalysis', () => {
    test('analyzes emergency fund adequacy', () => {
        const result = emergencyFundAnalysis(5000, 30000, 6);
        expect(result.target).toBe(30000);
        expect(result.current).toBe(30000);
        expect(result.shortfall).toBe(0);
        expect(result.adequacy).toBe(100);
        expect(result.status).toBe('adequate');
    });

    test('identifies inadequate emergency fund', () => {
        const result = emergencyFundAnalysis(5000, 15000, 6);
        expect(result.adequacy).toBe(50);
        expect(result.status).toBe('partial');
        expect(result.shortfall).toBe(15000);
    });
});
