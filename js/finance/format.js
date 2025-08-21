/**
 * Finance Formatting Module
 * Valuta/dato/avrunding – KUN visningsformatering
 */

/**
 * Format number as Norwegian Krone
 * @param {number} n - Amount to format
 * @returns {string} Formatted currency string
 */
export function NOK(n) {
    const v = Number.isFinite(+n) ? +n : 0;
    return v.toLocaleString('nb-NO', { 
        style: 'currency', 
        currency: 'NOK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

/**
 * Format number as Norwegian Krone with decimals
 * @param {number} n - Amount to format
 * @returns {string} Formatted currency string with decimals
 */
export function NOKWithDecimals(n) {
    const v = Number.isFinite(+n) ? +n : 0;
    return v.toLocaleString('nb-NO', { 
        style: 'currency', 
        currency: 'NOK',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Format date as Norwegian locale
 * @param {Date|string} d - Date to format
 * @returns {string} Formatted date string
 */
export function fmtDate(d) {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toLocaleDateString('nb-NO', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
    });
}

/**
 * Format date as short Norwegian locale
 * @param {Date|string} d - Date to format
 * @returns {string} Short formatted date string
 */
export function fmtDateShort(d) {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toLocaleDateString('nb-NO', { 
        month: '2-digit', 
        day: '2-digit' 
    });
}

/**
 * Format date as full Norwegian locale
 * @param {Date|string} d - Date to format
 * @returns {string} Full formatted date string
 */
export function fmtDateFull(d) {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toLocaleDateString('nb-NO', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: '2-digit' 
    });
}

/**
 * Clamp number between min and max values
 * @param {number} n - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(n, min, max) {
    const v = Number(n) || 0;
    return Math.min(max, Math.max(min, v));
}

/**
 * Format percentage
 * @param {number} n - Number to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export function fmtPercent(n, decimals = 1) {
    const v = Number.isFinite(+n) ? +n : 0;
    return v.toFixed(decimals) + '%';
}

/**
 * Format large numbers with K/M/B suffixes
 * @param {number} n - Number to format
 * @returns {string} Formatted number string
 */
export function fmtLargeNumber(n) {
    const v = Number.isFinite(+n) ? +n : 0;
    if (v >= 1000000000) {
        return (v / 1000000000).toFixed(1) + 'B';
    } else if (v >= 1000000) {
        return (v / 1000000).toFixed(1) + 'M';
    } else if (v >= 1000) {
        return (v / 1000).toFixed(1) + 'K';
    }
    return v.toString();
}

/**
 * Format relative time (e.g., "2 timer siden")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export function fmtRelativeTime(date) {
    const dt = new Date(date);
    if (Number.isNaN(dt.getTime())) return '';
    
    const now = new Date();
    const diffMs = now - dt;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Nå';
    if (diffMins < 60) return `${diffMins} minutter siden`;
    if (diffHours < 24) return `${diffHours} timer siden`;
    if (diffDays < 7) return `${diffDays} dager siden`;
    
    return fmtDate(dt);
}
