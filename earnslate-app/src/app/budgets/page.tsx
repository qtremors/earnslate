'use client';

import { useState } from 'react';
import { useAppStore, formatCycleDisplay } from '@/store';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import BudgetForm from '@/components/BudgetForm';
import ProgressBar from '@/components/ProgressBar';
import { Plus, Trash2, Pencil } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import styles from './page.module.css';

export default function BudgetsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>();

    const budgets = useAppStore((state) => state.budgets);
    const deleteBudget = useAppStore((state) => state.deleteBudget);
    const settings = useAppStore((state) => state.settings);

    const formatCurrency = (amount: number) => {
        return `${settings.currencySymbol}${amount.toLocaleString('en-IN')}`;
    };

    const getRemaining = (spent: number, limit: number) => {
        const remaining = limit - spent;
        return remaining > 0 ? remaining : 0;
    };

    const handleEdit = (id: string) => {
        setEditingId(id);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingId(undefined);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this budget?')) {
            deleteBudget(id);
        }
    };

    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = budgets.reduce((sum, b) => sum + getRemaining(b.spent, b.limit), 0);

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
                            {formatCurrency(totalBudget)}
                        </div>
                        <div className={styles.summaryLabel}>Total Budget</div>
                    </Card>
                    <Card className={styles.summaryCard}>
                        <div className={styles.summaryValue}>
                            {formatCurrency(totalSpent)}
                        </div>
                        <div className={styles.summaryLabel}>Total Spent</div>
                    </Card>
                    <Card className={styles.summaryCard}>
                        <div className={`${styles.summaryValue} ${styles.remaining}`}>
                            {formatCurrency(totalRemaining)}
                        </div>
                        <div className={styles.summaryLabel}>Remaining</div>
                    </Card>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <Button variant="primary" onClick={handleAdd}>
                        <Plus size={18} />
                        Create Budget
                    </Button>
                </div>

                {/* Budget Cards */}
                {budgets.length === 0 ? (
                    <Card>
                        <div className={styles.emptyState}>
                            <p>No budgets yet</p>
                            <Button variant="secondary" onClick={handleAdd}>
                                <Plus size={16} />
                                Create your first budget
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className={styles.budgetGrid}>
                        {budgets.map((budget) => {
                            // Dynamic icon loading from Lucide
                            const Icon = (LucideIcons as Record<string, React.ElementType>)[budget.icon] || LucideIcons.HelpCircle;
                            const percentage = (budget.spent / budget.limit) * 100;
                            const isOverBudget = budget.spent >= budget.limit;

                            return (
                                <Card key={budget.id} className={styles.budgetCard} hover>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => handleEdit(budget.id)}
                                            aria-label="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.deleteButton}`}
                                            onClick={() => handleDelete(budget.id)}
                                            aria-label="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className={styles.budgetHeader}>
                                        <div
                                            className={styles.budgetIcon}
                                            style={budget.color ? { background: `${budget.color}20`, color: budget.color } : undefined}
                                        >
                                            <Icon size={20} />
                                        </div>
                                        <div className={styles.budgetTitleBlock}>
                                            <span className={styles.budgetName}>{budget.name}</span>
                                            {budget.period && (
                                                <span className={styles.budgetPeriod}>{formatCycleDisplay(budget.period)}</span>
                                            )}
                                        </div>
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
                )}
            </div>

            {/* Budget Form Modal */}
            <BudgetForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                editId={editingId}
            />
        </div>
    );
}
