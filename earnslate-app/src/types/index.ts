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

// ===== Icon Library for Picker =====
export const ICON_OPTIONS = [
    // Services & Brands
    { name: 'Tv', label: 'Streaming' },
    { name: 'Music', label: 'Music' },
    { name: 'Film', label: 'Movies' },
    { name: 'Gamepad2', label: 'Gaming' },
    { name: 'Cloud', label: 'Cloud Storage' },
    { name: 'Smartphone', label: 'Phone' },
    { name: 'Wifi', label: 'Internet' },
    // Lifestyle
    { name: 'Dumbbell', label: 'Fitness' },
    { name: 'Heart', label: 'Health' },
    { name: 'Pill', label: 'Medicine' },
    { name: 'BookOpen', label: 'Education' },
    { name: 'Newspaper', label: 'News' },
    // Transport
    { name: 'Car', label: 'Car' },
    { name: 'Bike', label: 'Bike' },
    { name: 'Bus', label: 'Transit' },
    { name: 'Plane', label: 'Travel' },
    // Home
    { name: 'Home', label: 'Home' },
    { name: 'Lightbulb', label: 'Utilities' },
    { name: 'Flame', label: 'Gas' },
    { name: 'Droplet', label: 'Water' },
    // Food
    { name: 'UtensilsCrossed', label: 'Food' },
    { name: 'Coffee', label: 'Coffee' },
    { name: 'Wine', label: 'Drinks' },
    { name: 'ShoppingCart', label: 'Groceries' },
    // Finance
    { name: 'Wallet', label: 'Wallet' },
    { name: 'CreditCard', label: 'Card' },
    { name: 'Banknote', label: 'Cash' },
    { name: 'PiggyBank', label: 'Savings' },
    // Work
    { name: 'Briefcase', label: 'Work' },
    { name: 'Building', label: 'Office' },
    { name: 'Laptop', label: 'Tech' },
    { name: 'Headphones', label: 'Audio' },
    // Other
    { name: 'Gift', label: 'Gift' },
    { name: 'Baby', label: 'Kids' },
    { name: 'Dog', label: 'Pets' },
    { name: 'Sparkles', label: 'Other' },
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
export const formatCycle = (cycle: BillingCycle): string => {
    const unit = cycle.count === 1
        ? cycle.unit.replace(/s$/, '')
        : cycle.unit + 's';
    return cycle.count === 1
        ? `Every ${cycle.unit}`
        : `Every ${cycle.count} ${unit}`;
};

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
            next.setMonth(next.getMonth() + cycle.count);
            // If the day changed (rolled over), set to last day of target month
            if (next.getDate() !== originalDay) {
                next.setDate(0); // Go to last day of previous month (which is target month)
            }
            break;
        }
        case 'year': {
            // Handle leap year edge case: Feb 29 → Feb 28 in non-leap year
            next.setFullYear(next.getFullYear() + cycle.count);
            if (next.getDate() !== originalDay) {
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

export const formatCurrencyCompact = (amount: number, symbol: string = '₹', locale: string = 'en-IN'): string => {
    const abs = Math.abs(amount);
    if (abs >= 10000000) { // 1 Crore
        return `${symbol}${(abs / 10000000).toFixed(1)}Cr`;
    }
    if (abs >= 100000) { // 1 Lakh
        return `${symbol}${(abs / 100000).toFixed(1)}L`;
    }
    if (abs >= 1000) { // 1K
        return `${symbol}${(abs / 1000).toFixed(1)}K`;
    }
    return `${symbol}${abs.toLocaleString(locale)}`;
};

// ===== Date Formatting =====
/**
 * Format a date string according to the specified format.
 * @param dateString - ISO date string or date string
 * @param format - 'DD/MM/YYYY', 'MM/DD/YYYY', or 'YYYY-MM-DD'
 * @param locale - Locale for month names (e.g., 'en-IN', 'en-US')
 */
export const formatDate = (dateString: string, format: string = 'DD/MM/YYYY', locale: string = 'en-IN'): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

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

