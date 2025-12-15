import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget, Subscription, UserSettings, DEFAULT_CATEGORIES, BillingCycle, calculateNextBilling } from '@/types';

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
    addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'spent' | 'periodStartDate'>) => void;
    updateBudget: (id: string, updates: Partial<Budget>) => void;
    deleteBudget: (id: string) => void;
    checkAndResetBudgets: () => void;

    // Subscription Actions
    addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => void;
    updateSubscription: (id: string, updates: Partial<Subscription>) => void;
    deleteSubscription: (id: string) => void;
    updateSubscriptionBillingDates: () => void;

    // Settings Actions
    updateSettings: (updates: Partial<UserSettings>) => void;
    completeOnboarding: () => void;

    // Utility
    clearAllData: () => void;
    importData: (data: {
        settings?: Partial<UserSettings>;
        transactions?: Transaction[];
        budgets?: Budget[];
        subscriptions?: Subscription[];
    }) => void;
}

// ===== Constants =====
const DAYS_PER_MONTH = 30; // Used for billing cycle calculations

// ===== Default Values =====
const defaultSettings: UserSettings = {
    displayName: 'User',
    currency: 'INR',
    currencySymbol: '₹',
    dateFormat: 'DD/MM/YYYY',
    firstDayOfWeek: 'monday',
    monthStartDay: 1,
    hasCompletedOnboarding: false,
    customCategories: DEFAULT_CATEGORIES,
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
                const oldTransaction = get().transactions.find(t => t.id === id);

                set((state) => ({
                    transactions: state.transactions.map(t =>
                        t.id === id ? { ...t, ...updates } : t
                    ),
                }));

                // Sync budget if amount or category changed
                if (oldTransaction && oldTransaction.type === 'expense') {
                    const budgets = get().budgets;
                    const oldBudget = budgets.find(b =>
                        b.category.toLowerCase() === oldTransaction.category.toLowerCase()
                    );

                    // Remove old amount from old budget
                    if (oldBudget) {
                        set((state) => ({
                            budgets: state.budgets.map(b =>
                                b.id === oldBudget.id
                                    ? { ...b, spent: Math.max(0, b.spent - Math.abs(oldTransaction.amount)) }
                                    : b
                            ),
                        }));
                    }

                    // Add new amount to new budget (if still expense)
                    const newCategory = updates.category || oldTransaction.category;
                    const newAmount = updates.amount ?? oldTransaction.amount;
                    const newType = updates.type || oldTransaction.type;

                    if (newType === 'expense') {
                        const newBudget = get().budgets.find(b =>
                            b.category.toLowerCase() === newCategory.toLowerCase()
                        );
                        if (newBudget) {
                            set((state) => ({
                                budgets: state.budgets.map(b =>
                                    b.id === newBudget.id
                                        ? { ...b, spent: b.spent + Math.abs(newAmount) }
                                        : b
                                ),
                            }));
                        }
                    }
                }
            },

            deleteTransaction: (id) => {
                const transaction = get().transactions.find(t => t.id === id);

                set((state) => ({
                    transactions: state.transactions.filter(t => t.id !== id),
                }));

                // Update budget spent if deleting an expense
                if (transaction && transaction.type === 'expense') {
                    const budgets = get().budgets;
                    const matchingBudget = budgets.find(b =>
                        b.category.toLowerCase() === transaction.category.toLowerCase()
                    );
                    if (matchingBudget) {
                        set((state) => ({
                            budgets: state.budgets.map(b =>
                                b.id === matchingBudget.id
                                    ? { ...b, spent: Math.max(0, b.spent - Math.abs(transaction.amount)) }
                                    : b
                            ),
                        }));
                    }
                }
            },

            // ===== Budget Actions =====
            addBudget: (budget) => {
                const newBudget: Budget = {
                    ...budget,
                    id: generateId(),
                    spent: 0,
                    periodStartDate: new Date().toISOString().split('T')[0],
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

            checkAndResetBudgets: () => {
                const now = new Date();
                set((state) => ({
                    budgets: state.budgets.map(budget => {
                        // Skip if no periodStartDate (legacy budgets)
                        if (!budget.periodStartDate) {
                            return { ...budget, periodStartDate: now.toISOString().split('T')[0] };
                        }

                        const periodStart = new Date(budget.periodStartDate);
                        const nextPeriodStart = calculateNextBilling(periodStart, budget.period);

                        // If current date is past the next period start, reset the budget
                        if (now >= nextPeriodStart) {
                            return {
                                ...budget,
                                spent: 0,
                                periodStartDate: now.toISOString().split('T')[0],
                            };
                        }
                        return budget;
                    }),
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

            updateSubscriptionBillingDates: () => {
                const now = new Date();
                set((state) => ({
                    subscriptions: state.subscriptions.map(sub => {
                        if (!sub.active) return sub;

                        let nextBilling = new Date(sub.nextBilling);

                        // Keep advancing the billing date until it's in the future
                        while (nextBilling < now) {
                            nextBilling = calculateNextBilling(nextBilling, sub.cycle);
                        }

                        // Only update if the date changed
                        if (nextBilling.toISOString() !== new Date(sub.nextBilling).toISOString()) {
                            return { ...sub, nextBilling: nextBilling.toISOString().split('T')[0] };
                        }
                        return sub;
                    }),
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

            importData: (data: {
                settings?: Partial<UserSettings>;
                transactions?: Transaction[];
                budgets?: Budget[];
                subscriptions?: Subscription[];
            }) => {
                set((state) => ({
                    settings: data.settings ? { ...state.settings, ...data.settings } : state.settings,
                    transactions: data.transactions || state.transactions,
                    budgets: data.budgets || state.budgets,
                    subscriptions: data.subscriptions || state.subscriptions,
                }));
            },
        }),
        {
            name: 'earnslate-storage',
            skipHydration: true,
        }
    )
);

// Manual rehydration on client side + auto-run maintenance tasks
if (typeof window !== 'undefined') {
    useAppStore.persist.rehydrate();
    // Run maintenance tasks after rehydration
    setTimeout(() => {
        useAppStore.getState().checkAndResetBudgets();
        useAppStore.getState().updateSubscriptionBillingDates();
    }, 100);
}

// ===== Helper to format cycle for display =====
export const formatCycleDisplay = (cycle: BillingCycle): string => {
    if (cycle.count === 1) {
        const unitLabels: Record<string, string> = {
            hour: 'Hourly',
            day: 'Daily',
            week: 'Weekly',
            month: 'Monthly',
            year: 'Yearly',
        };
        return unitLabels[cycle.unit] || 'Monthly';
    }
    return `Every ${cycle.count} ${cycle.unit}s`;
};

// ===== Calculate monthly equivalent for sorting/totals =====
export const getMonthlyEquivalent = (amount: number, cycle: BillingCycle): number => {
    switch (cycle.unit) {
        case 'hour':
            return amount * (24 * DAYS_PER_MONTH) / cycle.count;
        case 'day':
            return amount * DAYS_PER_MONTH / cycle.count;
        case 'week':
            return amount * (DAYS_PER_MONTH / 7) / cycle.count;
        case 'month':
            return amount / cycle.count;
        case 'year':
            return amount / (12 * cycle.count);
        default:
            return amount;
    }
};
