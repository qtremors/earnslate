'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import SubscriptionForm from '@/components/SubscriptionForm';
import { Plus, Trash2, Pencil, Play, Pause } from 'lucide-react';
import {
    SiNetflix,
    SiSpotify,
    SiAmazon,
    SiYoutube,
    SiIcloud,
    SiApple,
} from 'react-icons/si';
import { Dumbbell, HelpCircle } from 'lucide-react';
import styles from './page.module.css';

// Icon mapping for subscriptions
const ICON_MAP: Record<string, React.ElementType> = {
    netflix: SiNetflix,
    spotify: SiSpotify,
    amazon: SiAmazon,
    youtube: SiYoutube,
    icloud: SiIcloud,
    apple: SiApple,
    gym: Dumbbell,
    other: HelpCircle,
};

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

    const activeSubscriptions = subscriptions.filter(s => s.active);
    const monthlyTotal = activeSubscriptions.reduce((sum, s) => {
        return sum + (s.cycle === 'yearly' ? s.amount / 12 : s.amount);
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
                            const Icon = ICON_MAP[sub.icon] || HelpCircle;
                            return (
                                <Card key={sub.id} className={`${styles.subscriptionCard} ${!sub.active ? styles.inactive : ''}`} hover>
                                    <div className={styles.subscriptionMain}>
                                        <div
                                            className={styles.subscriptionIcon}
                                            style={sub.color ? { background: `${sub.color}20`, color: sub.color } : undefined}
                                        >
                                            <Icon size={22} />
                                        </div>
                                        <div className={styles.subscriptionInfo}>
                                            <span className={styles.subscriptionName}>{sub.name}</span>
                                            <span className={styles.subscriptionMeta}>
                                                {sub.cycle === 'yearly' ? 'Yearly' : 'Monthly'} • Next: {new Date(sub.nextBilling).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.subscriptionRight}>
                                        <span className={styles.subscriptionAmount}>{formatCurrency(sub.amount)}</span>
                                        <span className={styles.subscriptionCycle}>/{sub.cycle === 'yearly' ? 'year' : 'month'}</span>
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
