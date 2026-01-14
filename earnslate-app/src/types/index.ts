// ===== Core Data Types =====

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    type: 'income' | 'expense';
    notes?: string;
    createdAt: string;
}

export interface Budget {
    id: string;
    name: string;
    limit: number;
    spent: number;
    category: string;
    icon: string;
    color?: string;
    period: BillingCycle; // Flexible period
    periodStartDate: string; // When current period started (ISO date)
    createdAt: string;
}

export interface Subscription {
    id: string;
    name: string; // Custom name
    amount: number;
    cycle: BillingCycle; // Flexible cycle
    nextBilling: string;
    icon: string; // Any Lucide icon name
    color: string | null;
    active: boolean;
    notes?: string;
    createdAt: string;
}

// ===== Flexible Billing Cycle =====
export interface BillingCycle {
    count: number; // e.g., 4
    unit: 'hour' | 'day' | 'week' | 'month' | 'year';
}

// ===== Custom Category =====
export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: 'income' | 'expense' | 'both';
}

export interface UserSettings {
    displayName: string;
    currency: string;
    currencySymbol: string;
    locale: string; // Number/date formatting locale (e.g., 'en-IN', 'en-US')
    dateFormat: string;
    theme: 'dark' | 'light' | 'system';
    hasCompletedOnboarding: boolean;
    customCategories: Category[];
}

// ===== Time Unit Options =====
export const TIME_UNITS = [
    { value: 'hour', label: 'Hour(s)' },
    { value: 'day', label: 'Day(s)' },
    { value: 'week', label: 'Week(s)' },
    { value: 'month', label: 'Month(s)' },
    { value: 'year', label: 'Year(s)' },
] as const;

// ===== Color Palette =====
export const COLOR_OPTIONS = [
    '#E50914', // Netflix Red
    '#1DB954', // Spotify Green
    '#FF9900', // Amazon Orange
    '#FF0000', // YouTube Red
    '#3693F3', // iCloud Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#64748B', // Slate (neutral)
] as const;

// ===== Chart Colors =====
export const CHART_COLORS = [
    '#E50914', // Red
    '#1DB954', // Green
    '#FF9900', // Orange
    '#3693F3', // Blue
    '#8B5CF6', // Purple
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red variant
] as const;

// ===== Default Categories =====
export const DEFAULT_CATEGORIES: Category[] = [
    { id: 'food', name: 'Food & Dining', icon: 'UtensilsCrossed', color: '#F59E0B', type: 'expense' },
    { id: 'transport', name: 'Transport', icon: 'Car', color: '#3693F3', type: 'expense' },
    { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: '#8B5CF6', type: 'expense' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingCart', color: '#EC4899', type: 'expense' },
    { id: 'utilities', name: 'Utilities', icon: 'Lightbulb', color: '#10B981', type: 'expense' },
    { id: 'health', name: 'Health', icon: 'Heart', color: '#EF4444', type: 'expense' },
    { id: 'income', name: 'Income', icon: 'Briefcase', color: '#1DB954', type: 'income' },
    { id: 'other', name: 'Other', icon: 'Sparkles', color: '#64748B', type: 'both' },
];

// ===== Helper Functions =====

export const calculateNextBilling = (lastBilling: Date, cycle: BillingCycle): Date => {
    const next = new Date(lastBilling);
    const originalDay = next.getDate();

    switch (cycle.unit) {
        case 'hour':
            next.setHours(next.getHours() + cycle.count);
            break;
        case 'day':
            next.setDate(next.getDate() + cycle.count);
            break;
        case 'week':
            next.setDate(next.getDate() + cycle.count * 7);
            break;
        case 'month': {
            // Handle edge case: Jan 31 → Feb should be Feb 28/29, not Mar 3
            const targetMonth = next.getMonth() + cycle.count;
            next.setMonth(targetMonth);
            // If the day changed (month overflowed), clamp to last day of target month
            if (next.getDate() !== originalDay) {
                // setDate(0) goes to last day of the previous month
                // After overflow, "previous month" IS our target month
                next.setDate(0);
            }
            break;
        }
        case 'year': {
            // Handle leap year edge case: Feb 29 → Feb 28 in non-leap year
            const targetYear = next.getFullYear() + cycle.count;
            next.setFullYear(targetYear);
            if (next.getDate() !== originalDay) {
                // Clamp to last day of February in non-leap year
                next.setDate(0);
            }
            break;
        }
    }
    return next;
};


// ===== Currency Formatting =====
export const formatCurrency = (amount: number, symbol: string = '₹', locale: string = 'en-IN'): string => {
    return `${symbol}${Math.abs(amount).toLocaleString(locale)}`;
};

// Note: For strict correctness with international locales, we need the currency code.
// Since this helper might not have access to it, we default to 'USD' if locale is not en-IN.
export const formatCurrencyCompact = (amount: number, symbol: string = '₹', locale: string = 'en-IN', currency: string = 'INR'): string => {
    const abs = Math.abs(amount);

    if (locale === 'en-IN') {
        if (abs >= 10000000) return `${symbol}${(abs / 10000000).toFixed(1)}Cr`;
        if (abs >= 100000) return `${symbol}${(abs / 100000).toFixed(1)}L`;
        if (abs >= 1000) return `${symbol}${(abs / 1000).toFixed(1)}K`;
        return `${symbol}${abs.toLocaleString(locale)}`;
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(amount);
};

// ===== Date Formatting =====
/**
 * Format a date string according to the specified format.
 * @param dateString - ISO date string or date string
 * @param format - 'DD/MM/YYYY', 'MM/DD/YYYY', or 'YYYY-MM-DD'
 * @param locale - Locale for formatting (e.g., 'en-IN', 'en-US')
 */
export const formatDate = (dateString: string, format: string = 'DD/MM/YYYY', locale: string = 'en-IN'): string => {
    const date = new Date(dateString);

    // Use Intl.DateTimeFormat for locale-aware formatting
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };

    // Get locale-formatted parts
    const formatter = new Intl.DateTimeFormat(locale, options);
    const parts = formatter.formatToParts(date);
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';

    switch (format) {
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'DD/MM/YYYY':
        default:
            return `${day}/${month}/${year}`;
    }
};

/**
 * Format a date string for display with short month name.
 */
export const formatDateShort = (dateString: string, locale: string = 'en-IN'): string => {
    return new Date(dateString).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
};

/**
 * Format a date string for display with full format.
 */
export const formatDateFull = (dateString: string, locale: string = 'en-IN'): string => {
    return new Date(dateString).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
};

