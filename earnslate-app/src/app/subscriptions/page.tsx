'use client';

import { useState } from 'react';
import { useAppStore, formatCycleDisplay, getMonthlyEquivalent } from '@/store';
import { useConfirm } from '@/hooks/useConfirm';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import SubscriptionForm from '@/components/SubscriptionForm';
import SubscriptionTreemap from '@/components/SubscriptionTreemap';
import { Plus, Trash2, Pencil, Play, Pause, LayoutGrid, List } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import * as SimpleIcons from 'react-icons/si';
import styles from './page.module.css';

type ViewMode = 'list' | 'treemap';

export default function SubscriptionsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>();
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    const subscriptions = useAppStore((state) => state.subscriptions);
    const deleteSubscription = useAppStore((state) => state.deleteSubscription);
    const updateSubscription = useAppStore((state) => state.updateSubscription);
    const settings = useAppStore((state) => state.settings);
    const { confirm, ConfirmDialog } = useConfirm();

    const formatCurrency = (amount: number) => {
        return `${settings.currencySymbol}${amount.toLocaleString('en-IN')}`;
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
            title: 'Delete Subscription',
            message: 'Are you sure you want to delete this subscription?',
            confirmText: 'Delete',
            variant: 'danger',
        });
        if (confirmed) deleteSubscription(id);
    };

    const handleToggleActive = (id: string, currentActive: boolean) => {
        updateSubscription(id, { active: !currentActive });
    };

    const getSubscriptionIcon = (iconName: string) => {
        if (iconName.startsWith('brand:')) {
            const brandIcon = iconName.replace('brand:', '');
            const Icon = (SimpleIcons as unknown as Record<string, React.ElementType>)[brandIcon];
            return Icon || LucideIcons.HelpCircle;
        }
        return (LucideIcons as unknown as Record<string, React.ElementType>)[iconName] || LucideIcons.HelpCircle;
    };

    const activeSubscriptions = subscriptions.filter(s => s.active);
    const monthlyTotal = activeSubscriptions.reduce((sum, s) => sum + getMonthlyEquivalent(s.amount, s.cycle), 0);
    const yearlyTotal = monthlyTotal * 12;

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

                    <Button variant="primary" onClick={handleAdd}>
                        <Plus size={18} />
                        Add Subscription
                    </Button>
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
                        {subscriptions.map((sub) => {
                            const Icon = getSubscriptionIcon(sub.icon);
                            return (
                                <Card
                                    key={sub.id}
                                    className={`${styles.subscriptionCard} ${!sub.active ? styles.inactive : ''}`}
                                    hover
                                    style={sub.color ? { borderLeftColor: sub.color } : undefined}
                                >
                                    <div className={styles.subscriptionMain}>
                                        <div className={styles.subscriptionIcon} style={{ color: sub.color || 'var(--text-secondary)' }}>
                                            <Icon size={22} />
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
                            );
                        })}
                    </div>
                )}
            </div>

            <SubscriptionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} editId={editingId} />
            <ConfirmDialog />
        </div>
    );
}
