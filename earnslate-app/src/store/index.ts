import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { Transaction, Budget, Subscription, UserSettings, DEFAULT_CATEGORIES, BillingCycle, calculateNextBilling } from '@/types';

// Re-export useShallow for components to use optimized selectors
export { useShallow };

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
    deleteMultipleTransactions: (ids: string[]) => void;

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


// ===== Default Values =====
const defaultSettings: UserSettings = {
    displayName: 'User',
    currency: 'INR',
    currencySymbol: '₹',
    locale: 'en-IN',
    dateFormat: 'DD/MM/YYYY',
    theme: 'dark',
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
                set((state) => {
                    const oldTransaction = state.transactions.find(t => t.id === id);
                    if (!oldTransaction) return state;

                    // Update transaction
                    const newTransactions = state.transactions.map(t =>
                        t.id === id ? { ...t, ...updates } : t
                    );

                    // Calculate budget adjustments atomically
                    let newBudgets = state.budgets;

                    if (oldTransaction.type === 'expense') {
                        const oldBudgetId = state.budgets.find(b =>
                            b.category.toLowerCase() === oldTransaction.category.toLowerCase()
                        )?.id;

                        const newCategory = updates.category || oldTransaction.category;
                        const newAmount = updates.amount ?? oldTransaction.amount;
                        const newType = updates.type || oldTransaction.type;

                        const newBudgetId = state.budgets.find(b =>
                            b.category.toLowerCase() === newCategory.toLowerCase()
                        )?.id;

                        newBudgets = state.budgets.map(b => {
                            let spent = b.spent;

                            // Remove old amount from old budget
                            if (b.id === oldBudgetId) {
                                spent = Math.max(0, spent - Math.abs(oldTransaction.amount));
                            }

                            // Add new amount to new budget (if still expense)
                            if (newType === 'expense' && b.id === newBudgetId) {
                                spent = spent + Math.abs(newAmount);
                            }

                            return spent !== b.spent ? { ...b, spent } : b;
                        });
                    }

                    return { transactions: newTransactions, budgets: newBudgets };
                });
            },

            deleteTransaction: (id) => {
                set((state) => {
                    const transaction = state.transactions.find(t => t.id === id);
                    const newTransactions = state.transactions.filter(t => t.id !== id);

                    // Update budget spent if deleting an expense
                    let newBudgets = state.budgets;
                    if (transaction && transaction.type === 'expense') {
                        const matchingBudgetId = state.budgets.find(b =>
                            b.category.toLowerCase() === transaction.category.toLowerCase()
                        )?.id;

                        if (matchingBudgetId) {
                            newBudgets = state.budgets.map(b =>
                                b.id === matchingBudgetId
                                    ? { ...b, spent: Math.max(0, b.spent - Math.abs(transaction.amount)) }
                                    : b
                            );
                        }
                    }

                    return { transactions: newTransactions, budgets: newBudgets };
                });
            },

            deleteMultipleTransactions: (ids) => {
                set((state) => {
                    const idsSet = new Set(ids);
                    const toDelete = state.transactions.filter(t => idsSet.has(t.id));
                    const newTransactions = state.transactions.filter(t => !idsSet.has(t.id));

                    // Update budgets for all deleted expenses
                    let newBudgets = state.budgets;
                    const budgetAdjustments: Record<string, number> = {};

                    toDelete.forEach(tx => {
                        if (tx.type === 'expense') {
                            const matchingBudget = state.budgets.find(b =>
                                b.category.toLowerCase() === tx.category.toLowerCase()
                            );
                            if (matchingBudget) {
                                budgetAdjustments[matchingBudget.id] =
                                    (budgetAdjustments[matchingBudget.id] || 0) + Math.abs(tx.amount);
                            }
                        }
                    });

                    if (Object.keys(budgetAdjustments).length > 0) {
                        newBudgets = state.budgets.map(b =>
                            budgetAdjustments[b.id]
                                ? { ...b, spent: Math.max(0, b.spent - budgetAdjustments[b.id]) }
                                : b
                        );
                    }

                    return { transactions: newTransactions, budgets: newBudgets };
                });
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
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                set((state) => ({
                    subscriptions: state.subscriptions.map(sub => {
                        if (!sub.active) return sub;

                        let nextBilling = new Date(sub.nextBilling + 'T12:00:00'); // Noon to avoid TZ issues
                        const originalDate = sub.nextBilling;

                        // Keep advancing the billing date until it's in the future
                        while (nextBilling.toISOString().split('T')[0] < today) {
                            nextBilling = calculateNextBilling(nextBilling, sub.cycle);
                        }

                        const newDate = nextBilling.toISOString().split('T')[0];
                        // Only update if the date changed
                        if (newDate !== originalDate) {
                            return { ...sub, nextBilling: newDate };
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
                // Validate date format (YYYY-MM-DD or ISO)
                const isValidDate = (dateStr: unknown): boolean => {
                    if (typeof dateStr !== 'string') return false;
                    const date = new Date(dateStr);
                    return !isNaN(date.getTime());
                };

                // Sanitize string fields to prevent XSS
                const sanitizeString = (str: string | undefined): string => {
                    if (typeof str !== 'string') return '';
                    return str
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .slice(0, 500); // Limit string length
                };

                // Validate transaction type
                const isValidTransactionType = (type: unknown): type is 'income' | 'expense' => {
                    return type === 'income' || type === 'expense';
                };

                // Validate and sanitize transactions
                const sanitizedTransactions = data.transactions?.map(t => ({
                    ...t,
                    id: typeof t.id === 'string' ? t.id : '',
                    description: sanitizeString(t.description),
                    category: sanitizeString(t.category),
                    amount: typeof t.amount === 'number' && isFinite(t.amount) ? t.amount : 0,
                    type: isValidTransactionType(t.type) ? t.type : 'expense',
                    date: isValidDate(t.date) ? t.date : new Date().toISOString().split('T')[0],
                })).filter(t => t.id && t.description) || undefined;

                // Validate and sanitize budgets
                const sanitizedBudgets = data.budgets?.map(b => ({
                    ...b,
                    id: typeof b.id === 'string' ? b.id : '',
                    name: sanitizeString(b.name),
                    category: sanitizeString(b.category),
                    limit: typeof b.limit === 'number' && isFinite(b.limit) ? Math.max(0, b.limit) : 0,
                    spent: typeof b.spent === 'number' && isFinite(b.spent) ? Math.max(0, b.spent) : 0,
                })).filter(b => b.id && b.name) || undefined;

                // Validate and sanitize subscriptions
                const sanitizedSubscriptions = data.subscriptions?.map(s => ({
                    ...s,
                    id: typeof s.id === 'string' ? s.id : '',
                    name: sanitizeString(s.name),
                    amount: typeof s.amount === 'number' && isFinite(s.amount) ? Math.max(0, s.amount) : 0,
                    nextBilling: isValidDate(s.nextBilling) ? s.nextBilling : new Date().toISOString().split('T')[0],
                })).filter(s => s.id && s.name) || undefined;

                // Sanitize settings
                const currentSettings = get().settings;
                const sanitizedSettings = data.settings ? {
                    ...data.settings,
                    displayName: data.settings.displayName ? sanitizeString(data.settings.displayName) : currentSettings.displayName,
                } : undefined;

                set((state) => ({
                    settings: sanitizedSettings ? { ...state.settings, ...sanitizedSettings } : state.settings,
                    transactions: sanitizedTransactions || state.transactions,
                    budgets: sanitizedBudgets || state.budgets,
                    subscriptions: sanitizedSubscriptions || state.subscriptions,
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

    // Re-check budgets when user returns to the app (after being away)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            useAppStore.getState().checkAndResetBudgets();
            useAppStore.getState().updateSubscriptionBillingDates();
        }
    });
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
    const DAYS_PER_MONTH = 30; // Approximate days per month
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
