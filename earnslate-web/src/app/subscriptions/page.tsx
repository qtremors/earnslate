'use client';

import { useState } from 'react';
import { useAppStore, useShallow, formatCycleDisplay, getMonthlyEquivalent } from '@/store';
import { useFormatters } from '@/hooks/useFormatters';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/components/Toast';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import SubscriptionForm from '@/components/SubscriptionForm';
import SubscriptionTreemap from '@/components/SubscriptionTreemap';
import { DynamicIcon } from '@/components/DynamicIcon';
import { Plus, Trash2, Pencil, Play, Pause, LayoutGrid, List, Download } from 'lucide-react';
import { generateCSV, downloadCSV } from '@/utils/csv';
import styles from './page.module.css';

type ViewMode = 'list' | 'treemap';

export default function SubscriptionsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>();
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    // Use shallow comparison to avoid re-renders when other store parts change
    const { subscriptions, deleteSubscription, updateSubscription, settings } = useAppStore(
        useShallow((state) => ({
            subscriptions: state.subscriptions,
            deleteSubscription: state.deleteSubscription,
            updateSubscription: state.updateSubscription,
            settings: state.settings,
        }))
    );
    const { confirm, ConfirmDialog } = useConfirm();
    const { showToast } = useToast();
    const { formatCurrency } = useFormatters();

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
            title: 'Delete Subscription',
            message: 'Are you sure you want to delete this subscription?',
            confirmText: 'Delete',
            variant: 'danger',
        });
        if (confirmed) {
            deleteSubscription(id);
            showToast('Subscription deleted', 'success');
        }
    };

    const handleToggleActive = (id: string, currentActive: boolean) => {
        updateSubscription(id, { active: !currentActive });
        showToast(currentActive ? 'Subscription paused' : 'Subscription resumed', 'info');
    };

    const activeSubscriptions = subscriptions.filter(s => s.active);
    const monthlyTotal = activeSubscriptions.reduce((sum, s) => sum + getMonthlyEquivalent(s.amount, s.cycle), 0);
    const yearlyTotal = monthlyTotal * 12;

    const handleExportCSV = () => {
        const headers = ['Name', 'Amount', 'Cycle', 'Next Billing', 'Active', 'Monthly Equivalent'];
        const rows = subscriptions.map(s => [
            s.name,
            s.amount.toString(),
            formatCycleDisplay(s.cycle),
            s.nextBilling,
            s.active ? 'Yes' : 'No',
            Math.round(getMonthlyEquivalent(s.amount, s.cycle)).toString()
        ]);

        const csv = generateCSV(headers, rows);
        downloadCSV(csv, `subscriptions_${new Date().toISOString().split('T')[0]}.csv`);
    };

    return (
        <div className={styles.page}>
            <Header title="Subscriptions" subtitle="Track your recurring payments and subscriptions" />

            <div className={styles.content}>
                {/* Summary */}
                <div className={styles.summary}>
                    <Card className={styles.summaryCard}>
                        <div className={styles.summaryValue}>{activeSubscriptions.length}</div>
                        <div className={styles.summaryLabel}>Active Subscriptions</div>
                    </Card>
                    <Card className={styles.summaryCard}>
                        <div className={styles.summaryValue}>{formatCurrency(Math.round(monthlyTotal))}</div>
                        <div className={styles.summaryLabel}>Monthly Cost</div>
                    </Card>
                    <Card className={styles.summaryCard}>
                        <div className={styles.summaryValue}>{formatCurrency(Math.round(yearlyTotal))}</div>
                        <div className={styles.summaryLabel}>Yearly Cost</div>
                    </Card>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                        <button
                            className={`${styles.viewButton} ${viewMode === 'treemap' ? styles.active : ''}`}
                            onClick={() => setViewMode('treemap')}
                            title="Treemap View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>

                    <div className={styles.actionButtons}>
                        <Button variant="ghost" size="sm" onClick={handleExportCSV}>
                            <Download size={16} />
                            Export
                        </Button>
                        <Button variant="primary" onClick={handleAdd}>
                            <Plus size={18} />
                            Add Subscription
                        </Button>
                    </div>
                </div>

                {/* Content */}
                {subscriptions.length === 0 ? (
                    <Card>
                        <div className={styles.emptyState}>
                            <p>No subscriptions yet</p>
                            <Button variant="secondary" onClick={handleAdd}>
                                <Plus size={16} />
                                Add your first subscription
                            </Button>
                        </div>
                    </Card>
                ) : viewMode === 'treemap' ? (
                    <SubscriptionTreemap subscriptions={subscriptions} currencySymbol={settings.currencySymbol} />
                ) : (
                    <div className={styles.subscriptionList}>
                        {subscriptions.map((sub) => (
                            <Card
                                key={sub.id}
                                className={`${styles.subscriptionCard} ${!sub.active ? styles.inactive : ''}`}
                                hover
                                style={sub.color ? { borderLeftColor: sub.color } : undefined}
                            >
                                <div className={styles.subscriptionMain}>
                                    <div className={styles.subscriptionIcon}>
                                        <DynamicIcon name={sub.icon} color={sub.color || undefined} size={24} />
                                    </div>
                                    <div className={styles.subscriptionInfo}>
                                        <span className={styles.subscriptionName}>{sub.name}</span>
                                        <span className={styles.subscriptionMeta}>
                                            {formatCycleDisplay(sub.cycle)} • Next: {new Date(sub.nextBilling).toLocaleDateString()}
                                        </span>
                                        {sub.notes && <span className={styles.subscriptionNotes}>{sub.notes}</span>}
                                    </div>
                                </div>

                                <div className={styles.subscriptionRight}>
                                    <span className={styles.subscriptionAmount}>{formatCurrency(sub.amount)}</span>
                                    <span className={styles.subscriptionCycle}>/{sub.cycle.count === 1 ? sub.cycle.unit : `${sub.cycle.count} ${sub.cycle.unit}s`}</span>
                                </div>

                                <div className={styles.cardActions}>
                                    <button className={styles.actionButton} onClick={() => handleToggleActive(sub.id, sub.active)} title={sub.active ? 'Pause' : 'Resume'}>
                                        {sub.active ? <Pause size={16} /> : <Play size={16} />}
                                    </button>
                                    <button className={styles.actionButton} onClick={() => handleEdit(sub.id)} aria-label="Edit">
                                        <Pencil size={16} />
                                    </button>
                                    <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(sub.id)} aria-label="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <SubscriptionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} editId={editingId} />
            <ConfirmDialog />
        </div>
    );
}
