import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget, Subscription, UserSettings } from '@/types';

// ===== Store State =====
interface AppState {
    // Data
    transactions: Transaction[];
    budgets: Budget[];
    subscriptions: Subscription[];
    settings: UserSettings;

    // Transaction Actions
    addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;

    // Budget Actions
    addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'spent'>) => void;
    updateBudget: (id: string, updates: Partial<Budget>) => void;
    deleteBudget: (id: string) => void;

    // Subscription Actions
    addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => void;
    updateSubscription: (id: string, updates: Partial<Subscription>) => void;
    deleteSubscription: (id: string) => void;

    // Settings Actions
    updateSettings: (updates: Partial<UserSettings>) => void;
    completeOnboarding: () => void;

    // Utility
    clearAllData: () => void;
}

// ===== Default Values =====
const defaultSettings: UserSettings = {
    displayName: 'User',
    email: '',
    currency: 'INR',
    currencySymbol: '₹',
    dateFormat: 'DD/MM/YYYY',
    firstDayOfWeek: 'monday',
    hasCompletedOnboarding: false,
};

// ===== Helper Functions =====
const generateId = () => crypto.randomUUID();
const getTimestamp = () => new Date().toISOString();

// ===== Store =====
export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial State
            transactions: [],
            budgets: [],
            subscriptions: [],
            settings: defaultSettings,

            // ===== Transaction Actions =====
            addTransaction: (transaction) => {
                const newTransaction: Transaction = {
                    ...transaction,
                    id: generateId(),
                    createdAt: getTimestamp(),
                };

                set((state) => ({
                    transactions: [newTransaction, ...state.transactions],
                }));

                // Update budget spent if it's an expense
                if (transaction.type === 'expense') {
                    const budgets = get().budgets;
                    const matchingBudget = budgets.find(b =>
                        b.category.toLowerCase() === transaction.category.toLowerCase()
                    );
                    if (matchingBudget) {
                        set((state) => ({
                            budgets: state.budgets.map(b =>
                                b.id === matchingBudget.id
                                    ? { ...b, spent: b.spent + Math.abs(transaction.amount) }
                                    : b
                            ),
                        }));
                    }
                }
            },

            updateTransaction: (id, updates) => {
                set((state) => ({
                    transactions: state.transactions.map(t =>
                        t.id === id ? { ...t, ...updates } : t
                    ),
                }));
            },

            deleteTransaction: (id) => {
                set((state) => ({
                    transactions: state.transactions.filter(t => t.id !== id),
                }));
            },

            // ===== Budget Actions =====
            addBudget: (budget) => {
                const newBudget: Budget = {
                    ...budget,
                    id: generateId(),
                    spent: 0,
                    createdAt: getTimestamp(),
                };

                set((state) => ({
                    budgets: [...state.budgets, newBudget],
                }));
            },

            updateBudget: (id, updates) => {
                set((state) => ({
                    budgets: state.budgets.map(b =>
                        b.id === id ? { ...b, ...updates } : b
                    ),
                }));
            },

            deleteBudget: (id) => {
                set((state) => ({
                    budgets: state.budgets.filter(b => b.id !== id),
                }));
            },

            // ===== Subscription Actions =====
            addSubscription: (subscription) => {
                const newSubscription: Subscription = {
                    ...subscription,
                    id: generateId(),
                    createdAt: getTimestamp(),
                };

                set((state) => ({
                    subscriptions: [...state.subscriptions, newSubscription],
                }));
            },

            updateSubscription: (id, updates) => {
                set((state) => ({
                    subscriptions: state.subscriptions.map(s =>
                        s.id === id ? { ...s, ...updates } : s
                    ),
                }));
            },

            deleteSubscription: (id) => {
                set((state) => ({
                    subscriptions: state.subscriptions.filter(s => s.id !== id),
                }));
            },

            // ===== Settings Actions =====
            updateSettings: (updates) => {
                set((state) => ({
                    settings: { ...state.settings, ...updates },
                }));
            },

            completeOnboarding: () => {
                set((state) => ({
                    settings: { ...state.settings, hasCompletedOnboarding: true },
                }));
            },

            // ===== Utility =====
            clearAllData: () => {
                set({
                    transactions: [],
                    budgets: [],
                    subscriptions: [],
                    settings: defaultSettings,
                });
            },
        }),
        {
            name: 'earnslate-storage',
            skipHydration: true, // Important: skip automatic hydration
        }
    )
);

// Manual rehydration on client side
if (typeof window !== 'undefined') {
    useAppStore.persist.rehydrate();
}

// ===== Selectors =====
export const selectTotalBalance = (state: AppState) => {
    return state.transactions.reduce((sum, t) => sum + t.amount, 0);
};

export const selectMonthlyIncome = (state: AppState) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return state.transactions
        .filter(t => {
            const date = new Date(t.date);
            return t.type === 'income' &&
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
};

export const selectMonthlyExpenses = (state: AppState) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return state.transactions
        .filter(t => {
            const date = new Date(t.date);
            return t.type === 'expense' &&
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

export const selectRecentTransactions = (state: AppState, limit = 5) => {
    return state.transactions.slice(0, limit);
};

export const selectActiveSubscriptions = (state: AppState) => {
    return state.subscriptions.filter(s => s.active);
};

export const selectMonthlySubscriptionCost = (state: AppState) => {
    return state.subscriptions
        .filter(s => s.active)
        .reduce((sum, s) => {
            return sum + (s.cycle === 'yearly' ? s.amount / 12 : s.amount);
        }, 0);
};
