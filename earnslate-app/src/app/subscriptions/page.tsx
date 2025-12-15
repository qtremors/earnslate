'use client';

import { useState } from 'react';
import { useAppStore, formatCycleDisplay, getMonthlyEquivalent } from '@/store';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import SubscriptionForm from '@/components/SubscriptionForm';
import { Plus, Trash2, Pencil, Play, Pause } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import * as SimpleIcons from 'react-icons/si';
import styles from './page.module.css';

export default function SubscriptionsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>();

    const subscriptions = useAppStore((state) => state.subscriptions);
    const deleteSubscription = useAppStore((state) => state.deleteSubscription);
    const updateSubscription = useAppStore((state) => state.updateSubscription);
    const settings = useAppStore((state) => state.settings);

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

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this subscription?')) {
            deleteSubscription(id);
        }
    };

    const handleToggleActive = (id: string, currentActive: boolean) => {
        updateSubscription(id, { active: !currentActive });
    };

    // Get icon component (handles both brand: prefix and lucide icons)
    const getSubscriptionIcon = (iconName: string) => {
        if (iconName.startsWith('brand:')) {
            const brandIcon = iconName.replace('brand:', '');
            const Icon = (SimpleIcons as unknown as Record<string, React.ElementType>)[brandIcon];
            return Icon || LucideIcons.HelpCircle;
        }
        return (LucideIcons as unknown as Record<string, React.ElementType>)[iconName] || LucideIcons.HelpCircle;
    };

    const activeSubscriptions = subscriptions.filter(s => s.active);

    // Calculate monthly total using flexible cycles
    const monthlyTotal = activeSubscriptions.reduce((sum, s) => {
        return sum + getMonthlyEquivalent(s.amount, s.cycle);
    }, 0);
    const yearlyTotal = monthlyTotal * 12;

    return (
        <div className={styles.page}>
            <Header
                title="Subscriptions"
                subtitle="Track your recurring payments and subscriptions"
            />

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
                    <Button variant="primary" onClick={handleAdd}>
                        <Plus size={18} />
                        Add Subscription
                    </Button>
                </div>

                {/* Subscriptions List */}
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
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => handleToggleActive(sub.id, sub.active)}
                                            aria-label={sub.active ? 'Pause' : 'Resume'}
                                            title={sub.active ? 'Pause subscription' : 'Resume subscription'}
                                        >
                                            {sub.active ? <Pause size={16} /> : <Play size={16} />}
                                        </button>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => handleEdit(sub.id)}
                                            aria-label="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.deleteButton}`}
                                            onClick={() => handleDelete(sub.id)}
                                            aria-label="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Subscription Form Modal */}
            <SubscriptionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                editId={editingId}
            />
        </div>
    );
}
