/**
 * Recurrence Module
 * Enkle gjentakelser for regninger/budsjett
 */

/**
 * Calculate next occurrence date based on recurrence rule
 * @param {Date|string} startDate - Start date
 * @param {string} rule - Recurrence rule ('weekly', 'monthly', 'quarterly', 'yearly')
 * @param {Date|string} from - From date (defaults to current date)
 * @returns {Date|null} Next occurrence date or null if invalid
 */
export function nextOccurrence(startDate, rule = 'monthly', from = new Date()) {
    const start = new Date(startDate);
    if (Number.isNaN(start.getTime())) return null;
    
    const base = new Date(from < start ? start : from);
    const d = new Date(base);
    
    switch (rule) {
        case 'weekly':
            d.setDate(base.getDate() + 7);
            break;
        case 'monthly':
            d.setMonth(base.getMonth() + 1);
            break;
        case 'quarterly':
            d.setMonth(base.getMonth() + 3);
            break;
        case 'yearly':
            d.setFullYear(base.getFullYear() + 1);
            break;
        default:
            return null;
    }
    
    return d;
}

/**
 * Expand a series of recurring items in a date interval
 * @param {Object} item - Item with start_date and recurrence_rule
 * @param {Date|string} from - Start of interval
 * @param {Date|string} to - End of interval (optional, defaults to 3 months from from)
 * @returns {Array} Array of expanded items with due_date
 */
export function expandSeries(item, from = new Date(), to) {
    const out = [];
    const start = new Date(item.start_date || item.date || from);
    const end = to ? new Date(to) : new Date(from.getFullYear(), from.getMonth() + 3, from.getDate());
    
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || !item.recurrence_rule) {
        return out;
    }

    let cur = new Date(start);
    while (cur <= end) {
        if (cur >= from) {
            out.push({ 
                ...item, 
                due_date: cur.toISOString().slice(0, 10),
                original_date: item.start_date || item.date
            });
        }
        const n = nextOccurrence(cur, item.recurrence_rule, cur);
        if (!n) break;
        cur = n;
    }
    
    return out;
}

/**
 * Get all recurring items for a given period
 * @param {Array} items - Array of items with recurrence rules
 * @param {Date|string} from - Start date
 * @param {Date|string} to - End date
 * @returns {Array} All recurring items in the period
 */
export function getAllRecurringItems(items = [], from = new Date(), to) {
    const allItems = [];
    
    for (const item of items) {
        if (item.recurrence_rule && item.recurrence_rule !== 'none') {
            const expanded = expandSeries(item, from, to);
            allItems.push(...expanded);
        } else if (item.due_date || item.date) {
            // Single occurrence items
            const itemDate = new Date(item.due_date || item.date);
            const fromDate = new Date(from);
            const toDate = to ? new Date(to) : new Date(from.getFullYear(), from.getMonth() + 3, from.getDate());
            
            if (itemDate >= fromDate && itemDate <= toDate) {
                allItems.push({ ...item, due_date: item.due_date || item.date });
            }
        }
    }
    
    return allItems.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
}

/**
 * Check if a date is a valid recurrence rule
 * @param {string} rule - Recurrence rule to validate
 * @returns {boolean} True if valid rule
 */
export function isValidRecurrenceRule(rule) {
    const validRules = ['none', 'weekly', 'monthly', 'quarterly', 'yearly'];
    return validRules.includes(rule);
}

/**
 * Get human readable recurrence description
 * @param {string} rule - Recurrence rule
 * @returns {string} Human readable description
 */
export function getRecurrenceDescription(rule) {
    const descriptions = {
        'none': 'Engangs',
        'weekly': 'Ukentlig',
        'monthly': 'Månedlig',
        'quarterly': 'Kvartalsvis',
        'yearly': 'Årlig'
    };
    return descriptions[rule] || 'Ukjent';
}

/**
 * Calculate total amount for recurring items in a period
 * @param {Array} items - Array of recurring items
 * @param {Date|string} from - Start date
 * @param {Date|string} to - End date
 * @returns {number} Total amount
 */
export function getRecurringTotal(items = [], from = new Date(), to) {
    const recurringItems = getAllRecurringItems(items, from, to);
    return recurringItems.reduce((total, item) => {
        const amount = Number(item.amount) || 0;
        return total + amount;
    }, 0);
}
