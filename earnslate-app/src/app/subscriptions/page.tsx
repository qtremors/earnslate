import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './page.module.css';

// ===== Sample Data =====
const subscriptions = [
    { id: 1, name: 'Netflix', amount: 649, cycle: 'monthly', nextBilling: 'Jan 1, 2026', icon: '🎬', active: true },
    { id: 2, name: 'Spotify', amount: 119, cycle: 'monthly', nextBilling: 'Jan 5, 2026', icon: '🎵', active: true },
    { id: 3, name: 'Amazon Prime', amount: 1499, cycle: 'yearly', nextBilling: 'Mar 15, 2026', icon: '📦', active: true },
    { id: 4, name: 'YouTube Premium', amount: 129, cycle: 'monthly', nextBilling: 'Jan 10, 2026', icon: '▶️', active: true },
    { id: 5, name: 'iCloud Storage', amount: 75, cycle: 'monthly', nextBilling: 'Jan 12, 2026', icon: '☁️', active: true },
    { id: 6, name: 'Gym Membership', amount: 1200, cycle: 'monthly', nextBilling: 'Jan 1, 2026', icon: '💪', active: false },
];

export default function SubscriptionsPage() {
    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN')}`;
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
                    <Button variant="primary">+ Add Subscription</Button>
                </div>

                {/* Subscriptions List */}
                <div className={styles.subscriptionList}>
                    {subscriptions.map((sub) => (
                        <Card key={sub.id} className={`${styles.subscriptionCard} ${!sub.active ? styles.inactive : ''}`} hover>
                            <div className={styles.subscriptionMain}>
                                <span className={styles.subscriptionIcon}>{sub.icon}</span>
                                <div className={styles.subscriptionInfo}>
                                    <span className={styles.subscriptionName}>{sub.name}</span>
                                    <span className={styles.subscriptionMeta}>
                                        {sub.cycle === 'yearly' ? 'Yearly' : 'Monthly'} • Next: {sub.nextBilling}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.subscriptionRight}>
                                <span className={styles.subscriptionAmount}>{formatCurrency(sub.amount)}</span>
                                <span className={styles.subscriptionCycle}>/{sub.cycle === 'yearly' ? 'year' : 'month'}</span>
                            </div>

                            <span className={`${styles.statusBadge} ${sub.active ? styles.active : styles.paused}`}>
                                {sub.active ? 'Active' : 'Paused'}
                            </span>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
