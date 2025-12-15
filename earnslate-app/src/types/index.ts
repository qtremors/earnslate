// ===== Core Data Types =====

export interface Transaction {
    id: string;
    description: string;
    amount: number; // Positive for income, negative for expense
    category: string;
    date: string; // ISO date string
    type: 'income' | 'expense';
    createdAt: string;
}

export interface Budget {
    id: string;
    name: string;
    limit: number;
    spent: number;
    category: string;
    icon: string; // Lucide icon name
    createdAt: string;
}

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    cycle: 'monthly' | 'yearly';
    nextBilling: string; // ISO date string
    icon: string; // Brand icon identifier
    color: string | null;
    active: boolean;
    createdAt: string;
}

export interface UserSettings {
    displayName: string;
    email: string;
    currency: string;
    currencySymbol: string;
    dateFormat: string;
    firstDayOfWeek: 'sunday' | 'monday';
    hasCompletedOnboarding: boolean;
}

// ===== Category Types =====

export const TRANSACTION_CATEGORIES = [
    'Food',
    'Transport',
    'Entertainment',
    'Shopping',
    'Utilities',
    'Health',
    'Income',
    'Other',
] as const;

export const BUDGET_ICONS = [
    { name: 'UtensilsCrossed', label: 'Food & Dining' },
    { name: 'Film', label: 'Entertainment' },
    { name: 'Car', label: 'Transport' },
    { name: 'ShoppingCart', label: 'Shopping' },
    { name: 'Dumbbell', label: 'Health' },
    { name: 'Lightbulb', label: 'Utilities' },
    { name: 'Home', label: 'Housing' },
    { name: 'GraduationCap', label: 'Education' },
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];
