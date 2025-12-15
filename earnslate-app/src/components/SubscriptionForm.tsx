'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import Modal from './Modal';
import Input, { Select } from './Input';
import Button from './Button';
import styles from './TransactionForm.module.css';

// Available services with their brand colors
const SUBSCRIPTION_SERVICES = [
    { name: 'Netflix', icon: 'netflix', color: '#E50914' },
    { name: 'Spotify', icon: 'spotify', color: '#1DB954' },
    { name: 'Amazon Prime', icon: 'amazon', color: '#FF9900' },
    { name: 'YouTube Premium', icon: 'youtube', color: '#FF0000' },
    { name: 'iCloud', icon: 'icloud', color: '#3693F3' },
    { name: 'Disney+', icon: 'disney', color: '#113CCF' },
    { name: 'Apple Music', icon: 'apple', color: '#FA2D48' },
    { name: 'HBO Max', icon: 'hbo', color: '#9B4DFF' },
    { name: 'Gym Membership', icon: 'gym', color: null },
    { name: 'Other', icon: 'other', color: null },
];

interface SubscriptionFormProps {
    isOpen: boolean;
    onClose: () => void;
    editId?: string;
}

export default function SubscriptionForm({ isOpen, onClose, editId }: SubscriptionFormProps) {
    const addSubscription = useAppStore((state) => state.addSubscription);
    const subscriptions = useAppStore((state) => state.subscriptions);
    const updateSubscription = useAppStore((state) => state.updateSubscription);

    const existingSub = editId
        ? subscriptions.find(s => s.id === editId)
        : null;

    const [formData, setFormData] = useState({
        name: existingSub?.name || 'Netflix',
        amount: existingSub?.amount.toString() || '',
        cycle: existingSub?.cycle || 'monthly' as 'monthly' | 'yearly',
        nextBilling: existingSub?.nextBilling || new Date().toISOString().split('T')[0],
        active: existingSub?.active ?? true,
    });

    const selectedService = SUBSCRIPTION_SERVICES.find(s => s.name === formData.name);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const amount = parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) return;

        const subscriptionData = {
            name: formData.name,
            amount,
            cycle: formData.cycle,
            nextBilling: formData.nextBilling,
            icon: selectedService?.icon || 'other',
            color: selectedService?.color || null,
            active: formData.active,
        };

        if (editId) {
            updateSubscription(editId, subscriptionData);
        } else {
            addSubscription(subscriptionData);
        }

        onClose();
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: 'Netflix',
            amount: '',
            cycle: 'monthly',
            nextBilling: new Date().toISOString().split('T')[0],
            active: true,
        });
    };

    const handleClose = () => {
        onClose();
        if (!editId) resetForm();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={editId ? 'Edit Subscription' : 'Add Subscription'}
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <Select
                    label="Service"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    options={SUBSCRIPTION_SERVICES.map(s => ({ value: s.name, label: s.name }))}
                />

                <Input
                    label="Amount"
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                />

                {/* Cycle Toggle */}
                <div>
                    <label className={styles.label} style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Billing Cycle
                    </label>
                    <div className={styles.typeToggle}>
                        <button
                            type="button"
                            className={`${styles.typeButton} ${formData.cycle === 'monthly' ? styles.activeIncome : ''}`}
                            onClick={() => setFormData({ ...formData, cycle: 'monthly' })}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            className={`${styles.typeButton} ${formData.cycle === 'yearly' ? styles.activeIncome : ''}`}
                            onClick={() => setFormData({ ...formData, cycle: 'yearly' })}
                        >
                            Yearly
                        </button>
                    </div>
                </div>

                <Input
                    label="Next Billing Date"
                    id="nextBilling"
                    type="date"
                    value={formData.nextBilling}
                    onChange={(e) => setFormData({ ...formData, nextBilling: e.target.value })}
                    required
                />

                <div className={styles.actions}>
                    <Button type="button" variant="ghost" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        {editId ? 'Save Changes' : 'Add Subscription'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
