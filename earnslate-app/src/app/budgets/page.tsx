import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';
import styles from './page.module.css';

// ===== Sample Data =====
const budgets = [
    { id: 1, name: 'Food & Dining', spent: 8500, limit: 12000, icon: '🍔' },
    { id: 2, name: 'Entertainment', spent: 3200, limit: 5000, icon: '🎬' },
    { id: 3, name: 'Transport', spent: 4200, limit: 6000, icon: '🚗' },
    { id: 4, name: 'Shopping', spent: 7800, limit: 8000, icon: '🛒' },
    { id: 5, name: 'Health & Fitness', spent: 1200, limit: 3000, icon: '💪' },
    { id: 6, name: 'Utilities', spent: 3500, limit: 4000, icon: '💡' },
];

export default function BudgetsPage() {
    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const getRemaining = (spent: number, limit: number) => {
        const remaining = limit - spent;
        return remaining > 0 ? remaining : 0;
    };

    return (
        <div className={styles.page}>
            <Header
                title="Budgets"
                subtitle="Set spending limits and track your progress"
            />

            <div className={styles.content}>
                {/* Summary */}
                <div className={styles.summary}>
                    <Card className={styles.summaryCard}>
                        <div className={styles.summaryValue}>
                            {formatCurrency(budgets.reduce((sum, b) => sum + b.limit, 0))}
                        </div>
                        <div className={styles.summaryLabel}>Total Budget</div>
                    </Card>
                    <Card className={styles.summaryCard}>
                        <div className={styles.summaryValue}>
                            {formatCurrency(budgets.reduce((sum, b) => sum + b.spent, 0))}
                        </div>
                        <div className={styles.summaryLabel}>Total Spent</div>
                    </Card>
                    <Card className={styles.summaryCard}>
                        <div className={`${styles.summaryValue} ${styles.remaining}`}>
                            {formatCurrency(budgets.reduce((sum, b) => sum + getRemaining(b.spent, b.limit), 0))}
                        </div>
                        <div className={styles.summaryLabel}>Remaining</div>
                    </Card>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <Button variant="primary">+ Create Budget</Button>
                </div>

                {/* Budget Cards */}
                <div className={styles.budgetGrid}>
                    {budgets.map((budget) => {
                        const percentage = (budget.spent / budget.limit) * 100;
                        const isOverBudget = budget.spent >= budget.limit;

                        return (
                            <Card key={budget.id} className={styles.budgetCard} hover>
                                <div className={styles.budgetHeader}>
                                    <span className={styles.budgetIcon}>{budget.icon}</span>
                                    <span className={styles.budgetName}>{budget.name}</span>
                                </div>

                                <div className={styles.budgetAmounts}>
                                    <span className={styles.spent}>{formatCurrency(budget.spent)}</span>
                                    <span className={styles.limit}>of {formatCurrency(budget.limit)}</span>
                                </div>

                                <ProgressBar value={budget.spent} max={budget.limit} />

                                <div className={styles.budgetFooter}>
                                    <span className={isOverBudget ? styles.overBudget : styles.underBudget}>
                                        {isOverBudget
                                            ? `Over by ${formatCurrency(budget.spent - budget.limit)}`
                                            : `${formatCurrency(getRemaining(budget.spent, budget.limit))} remaining`
                                        }
                                    </span>
                                    <span className={styles.percentage}>{Math.round(percentage)}%</span>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
