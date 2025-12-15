'use client';

import { useMemo } from 'react';
import { Subscription } from '@/types';
import { getMonthlyEquivalent, formatCycleDisplay } from '@/store';
import * as LucideIcons from 'lucide-react';
import * as SimpleIcons from 'react-icons/si';
import styles from './SubscriptionTreemap.module.css';

interface SubscriptionTreemapProps {
    subscriptions: Subscription[];
    currencySymbol: string;
}

export default function SubscriptionTreemap({ subscriptions, currencySymbol }: SubscriptionTreemapProps) {
    const processedSubs = useMemo(() => {
        const activeOnly = subscriptions.filter(s => s.active);
        const withMonthly = activeOnly.map(s => ({
            ...s,
            monthlyEquiv: getMonthlyEquivalent(s.amount, s.cycle),
        }));
        // Sort by monthly equivalent (largest first for sizing)
        return withMonthly.sort((a, b) => b.monthlyEquiv - a.monthlyEquiv);
    }, [subscriptions]);

    const totalMonthly = processedSubs.reduce((sum, s) => sum + s.monthlyEquiv, 0);
    const totalYearly = totalMonthly * 12;

    const getIcon = (iconName: string) => {
        if (iconName.startsWith('brand:')) {
            const brandIcon = iconName.replace('brand:', '');
            return (SimpleIcons as unknown as Record<string, React.ElementType>)[brandIcon] || LucideIcons.HelpCircle;
        }
        return (LucideIcons as unknown as Record<string, React.ElementType>)[iconName] || LucideIcons.HelpCircle;
    };

    const getItemSize = (monthlyEquiv: number): 'xl' | 'lg' | 'md' | 'sm' | 'xs' => {
        const percentage = (monthlyEquiv / totalMonthly) * 100;
        if (percentage >= 20) return 'xl';
        if (percentage >= 12) return 'lg';
        if (percentage >= 6) return 'md';
        if (percentage >= 3) return 'sm';
        return 'xs';
    };

    const formatAmount = (amount: number) => `${currencySymbol}${Math.round(amount).toLocaleString()}`;

    // Get cycle label (short format)
    const getCycleLabel = (cycle: { count: number; unit: string }) => {
        if (cycle.count === 1) {
            const labels: Record<string, string> = { hour: '/hr', day: '/day', week: '/wk', month: '/mo', year: '/yr' };
            return labels[cycle.unit] || '/mo';
        }
        return `/${cycle.count}${cycle.unit.charAt(0)}`;
    };

    if (processedSubs.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>Add subscriptions to see your spending breakdown</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.treemap}>
                {processedSubs.map((sub) => {
                    const Icon = getIcon(sub.icon);
                    const size = getItemSize(sub.monthlyEquiv);
                    const percentage = Math.round((sub.monthlyEquiv / totalMonthly) * 100);

                    return (
                        <div
                            key={sub.id}
                            className={`${styles.item} ${styles[size]}`}
                            style={{
                                background: `linear-gradient(135deg, ${sub.color || '#666'}20 0%, ${sub.color || '#666'}40 100%)`,
                                borderColor: `${sub.color || '#666'}30`,
                            }}
                        >
                            <div className={styles.itemHeader}>
                                <div className={styles.itemIcon} style={{ color: sub.color || '#666' }}>
                                    <Icon />
                                </div>
                                <span className={styles.itemPercentage}>{percentage}%</span>
                            </div>

                            {size !== 'xs' && (
                                <span className={styles.itemName}>{sub.name}</span>
                            )}

                            {/* Show ACTUAL amount with cycle */}
                            <div className={styles.itemPricing}>
                                <span className={styles.itemAmount} style={{ color: sub.color || 'var(--text-primary)' }}>
                                    {formatAmount(sub.amount)}
                                </span>
                                <span className={styles.itemCycle}>{getCycleLabel(sub.cycle)}</span>
                            </div>

                            {/* Show yearly projection for larger cards */}
                            {(size === 'xl' || size === 'lg') && (
                                <span className={styles.itemYearly}>~{formatAmount(sub.monthlyEquiv * 12)}/yr</span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={styles.footer}>
                <div className={styles.totalSection}>
                    <span className={styles.totalLabel}>TOTAL / MONTH</span>
                    <span className={styles.totalAmount}>{formatAmount(totalMonthly)}</span>
                </div>
                <div className={styles.totalSection}>
                    <span className={styles.totalLabel}>YEARLY PROJECTION</span>
                    <span className={styles.totalAmountSecondary}>{formatAmount(totalYearly)}</span>
                </div>
            </div>
        </div>
    );
}
