'use client';

import { useState, useMemo } from 'react';
import { useAppStore, useShallow, formatCycleDisplay } from '@/store';
import { CHART_COLORS } from '@/types';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/components/Toast';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import BudgetForm from '@/components/BudgetForm';
import ProgressBar from '@/components/ProgressBar';
import { Plus, Trash2, Pencil, PieChart, LayoutGrid, AlertTriangle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import styles from './page.module.css';

type ViewMode = 'grid' | 'chart';

export default function BudgetsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>();
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // Use shallow comparison to avoid re-renders when other store parts change
    const { budgets, deleteBudget, settings } = useAppStore(
        useShallow((state) => ({
            budgets: state.budgets,
            deleteBudget: state.deleteBudget,
            settings: state.settings,
        }))
    );
    const { confirm, ConfirmDialog } = useConfirm();
    const { showToast } = useToast();

    const formatCurrency = (amount: number) => `${settings.currencySymbol}${amount.toLocaleString(settings.locale || 'en-IN')}`;

    const getRemaining = (spent: number, limit: number) => {
        const remaining = limit - spent;
        return remaining > 0 ? remaining : 0;
    };

    const getStatus = (spent: number, limit: number) => {
        const percentage = (spent / limit) * 100;
        if (percentage >= 100) return 'over';
        if (percentage >= 90) return 'danger';
        if (percentage >= 80) return 'warning';
        return 'safe';
    };

    const handleEdit = (id: string) => {
        setEditingId(id);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingId(undefined);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Delete Budget',
            message: 'Are you sure you want to delete this budget?',
            confirmText: 'Delete',
            variant: 'danger',
        });
        if (confirmed) {
            deleteBudget(id);
            showToast('Budget deleted', 'success');
        }
    };

    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = budgets.reduce((sum, b) => sum + getRemaining(b.spent, b.limit), 0);

    // Chart data for donut
    const chartData = useMemo(() => {
        return budgets.map((b, i) => ({
            name: b.name,
            spent: b.spent,
            limit: b.limit,
            color: b.color || CHART_COLORS[i % CHART_COLORS.length],
            remaining: getRemaining(b.spent, b.limit),
        }));
    }, [budgets]);

    return (
        <div className={styles.page}>
            <Header title="Budgets" subtitle="Set spending limits and track your progress" />

            <div className={styles.content}>
                {/* Summary */}
                <div className={styles.summary}>
                    <Card className={styles.summaryCard}>
                        <div className={styles.summaryValue}>{formatCurrency(totalBudget)}</div>
                        <div className={styles.summaryLabel}>Total Budget</div>
                    </Card>
                    <Card className={styles.summaryCard}>
                        <div className={styles.summaryValue}>{formatCurrency(totalSpent)}</div>
                        <div className={styles.summaryLabel}>Total Spent</div>
                    </Card>
                    <Card className={`${styles.summaryCard} ${totalRemaining < totalBudget * 0.2 ? styles.warningCard : ''}`}>
                        <div className={`${styles.summaryValue} ${styles.remaining}`}>{formatCurrency(totalRemaining)}</div>
                        <div className={styles.summaryLabel}>Remaining</div>
                    </Card>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            className={`${styles.viewButton} ${viewMode === 'chart' ? styles.active : ''}`}
                            onClick={() => setViewMode('chart')}
                            title="Chart View"
                        >
                            <PieChart size={18} />
                        </button>
                    </div>

                    <Button variant="primary" onClick={handleAdd}>
                        <Plus size={18} />
                        Create Budget
                    </Button>
                </div>

                {/* Content */}
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
                ) : viewMode === 'chart' ? (
                    <Card>
                        <div className={styles.chartContainer}>
                            {/* Donut Chart */}
                            <div className={styles.donutChart}>
                                <svg viewBox="0 0 100 100" className={styles.donut}>
                                    {chartData.reduce((acc, d, i) => {
                                        const startAngle = acc.angle;
                                        const sliceAngle = totalBudget > 0 ? (d.limit / totalBudget) * 360 : 0;
                                        const endAngle = startAngle + sliceAngle;

                                        const startRad = (startAngle - 90) * Math.PI / 180;
                                        const endRad = (endAngle - 90) * Math.PI / 180;

                                        const outerR = 45;
                                        const innerR = 30;

                                        const x1o = 50 + outerR * Math.cos(startRad);
                                        const y1o = 50 + outerR * Math.sin(startRad);
                                        const x2o = 50 + outerR * Math.cos(endRad);
                                        const y2o = 50 + outerR * Math.sin(endRad);
                                        const x1i = 50 + innerR * Math.cos(endRad);
                                        const y1i = 50 + innerR * Math.sin(endRad);
                                        const x2i = 50 + innerR * Math.cos(startRad);
                                        const y2i = 50 + innerR * Math.sin(startRad);

                                        const largeArc = sliceAngle > 180 ? 1 : 0;

                                        acc.paths.push(
                                            <path
                                                key={d.name}
                                                d={`M ${x1o} ${y1o} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2i} ${y2i} Z`}
                                                fill={d.color}
                                                stroke="var(--bg-primary)"
                                                strokeWidth="1"
                                                opacity={d.spent > 0 ? 1 : 0.3}
                                            />
                                        );

                                        acc.angle = endAngle;
                                        return acc;
                                    }, { paths: [] as React.ReactElement[], angle: 0 }).paths}
                                </svg>
                                <div className={styles.donutCenter}>
                                    <span className={styles.donutTotal}>{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</span>
                                    <span className={styles.donutLabel}>used</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className={styles.legend}>
                                {chartData.map((d) => {
                                    const percentage = Math.round((d.spent / d.limit) * 100);
                                    const status = getStatus(d.spent, d.limit);
                                    return (
                                        <div key={d.name} className={`${styles.legendItem} ${styles[status]}`}>
                                            <div className={styles.legendColor} style={{ backgroundColor: d.color }} />
                                            <span className={styles.legendLabel}>{d.name}</span>
                                            <span className={styles.legendSpent}>{formatCurrency(d.spent)}</span>
                                            <span className={styles.legendLimit}>/ {formatCurrency(d.limit)}</span>
                                            <span className={`${styles.legendPercent} ${styles[status]}`}>{percentage}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className={styles.budgetGrid}>
                        {budgets.map((budget) => {
                            const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[budget.icon] || LucideIcons.HelpCircle;
                            const percentage = (budget.spent / budget.limit) * 100;
                            const status = getStatus(budget.spent, budget.limit);

                            return (
                                <Card key={budget.id} className={`${styles.budgetCard} ${styles[status]}`} hover>
                                    <div className={styles.cardActions}>
                                        <button className={styles.actionButton} onClick={() => handleEdit(budget.id)} aria-label="Edit">
                                            <Pencil size={16} />
                                        </button>
                                        <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(budget.id)} aria-label="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Alert badge for warning/danger */}
                                    {(status === 'warning' || status === 'danger' || status === 'over') && (
                                        <div className={`${styles.alertBadge} ${styles[status]}`}>
                                            <AlertTriangle size={12} />
                                            {status === 'over' ? 'Over budget!' : status === 'danger' ? '90%+' : '80%+'}
                                        </div>
                                    )}

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
                                        <span className={status === 'over' ? styles.overBudget : styles.underBudget}>
                                            {status === 'over'
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

            <BudgetForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} editId={editingId} />
            <ConfirmDialog />
        </div>
    );
}
