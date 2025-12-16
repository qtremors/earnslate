'use client';

import { useState, useEffect } from 'react';
import { useAppStore, useShallow } from '@/store';
import { TIME_UNITS, BillingCycle } from '@/types';
import { useToast } from './Toast';
import Modal from './Modal';
import Input, { Select } from './Input';
import Button from './Button';
import IconPicker from './IconPicker';
import ColorPicker from './ColorPicker';
import ServicePicker from './ServicePicker';
import { POPULAR_SERVICES, ServiceTemplate } from '@/data/services';
import * as LucideIcons from 'lucide-react';
import * as SimpleIcons from 'react-icons/si';
import styles from './SubscriptionForm.module.css';

interface SubscriptionFormProps {
    isOpen: boolean;
    onClose: () => void;
    editId?: string;
}

export default function SubscriptionForm({ isOpen, onClose, editId }: SubscriptionFormProps) {
    const [mode, setMode] = useState<'picker' | 'custom' | 'edit'>('picker');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [cycleCount, setCycleCount] = useState('1');
    const [cycleUnit, setCycleUnit] = useState<BillingCycle['unit']>('month');
    const [nextBilling, setNextBilling] = useState(new Date().toISOString().split('T')[0]);
    const [icon, setIcon] = useState('CreditCard');
    const [iconType, setIconType] = useState<'brand' | 'lucide'>('lucide');
    const [color, setColor] = useState('#E50914');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use shallow comparison to avoid re-renders when other store parts change
    const { subscriptions, addSubscription, updateSubscription, settings } = useAppStore(
        useShallow((state) => ({
            subscriptions: state.subscriptions,
            addSubscription: state.addSubscription,
            updateSubscription: state.updateSubscription,
            settings: state.settings,
        }))
    );
    const { showToast } = useToast();

    const isEditing = !!editId;
    const existingSubscription = editId ? subscriptions.find(s => s.id === editId) : null;

    useEffect(() => {
        if (existingSubscription) {
            setMode('edit');
            setName(existingSubscription.name);
            setAmount(String(existingSubscription.amount));
            setCycleCount(String(existingSubscription.cycle.count));
            setCycleUnit(existingSubscription.cycle.unit);
            setNextBilling(existingSubscription.nextBilling.split('T')[0]);
            setIcon(existingSubscription.icon);
            setColor(existingSubscription.color || '#E50914');
            setNotes(existingSubscription.notes || '');
        } else if (isOpen) {
            setMode('picker');
            resetForm();
        }
    }, [existingSubscription, isOpen]);

    const resetForm = () => {
        setName('');
        setAmount('');
        setCycleCount('1');
        setCycleUnit('month');
        setNextBilling(new Date().toISOString().split('T')[0]);
        setIcon('Tv');
        setIconType('lucide');
        setColor('#E50914');
        setNotes('');
    };

    const handleServiceSelect = (service: ServiceTemplate) => {
        setName(service.name);
        setIcon(service.icon);
        setIconType(service.iconType);
        setColor(service.color);
        if (service.suggestedAmount) {
            setAmount(String(service.suggestedAmount));
        }
        if (service.suggestedCycle) {
            setCycleCount(String(service.suggestedCycle.count));
            setCycleUnit(service.suggestedCycle.unit);
        }
        setMode('custom'); // Switch to form to confirm/edit
    };

    const handleCustom = () => {
        resetForm();
        setMode('custom');
    };

    // Validation state
    const [errors, setErrors] = useState<{ name?: string; amount?: string }>({});

    const validate = (): boolean => {
        const newErrors: { name?: string; amount?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Subscription name is required';
        }

        const amountNum = parseFloat(amount);
        if (!amount || isNaN(amountNum) || amountNum <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Clear errors when user types
    useEffect(() => {
        if (name.trim() && errors.name) {
            setErrors(prev => ({ ...prev, name: undefined }));
        }
    }, [name, errors.name]);

    useEffect(() => {
        const amountNum = parseFloat(amount);
        if (amount && !isNaN(amountNum) && amountNum > 0 && errors.amount) {
            setErrors(prev => ({ ...prev, amount: undefined }));
        }
    }, [amount, errors.amount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            showToast('Please fix the errors before submitting', 'error');
            return;
        }

        const cycle: BillingCycle = {
            count: parseInt(cycleCount) || 1,
            unit: cycleUnit,
        };

        // Store icon with type prefix for rendering
        const iconValue = iconType === 'brand' ? `brand:${icon}` : icon;

        const subscriptionData = {
            name,
            amount: parseFloat(amount),
            cycle,
            nextBilling,
            icon: iconValue,
            color,
            notes: notes || undefined,
            active: true,
        };

        if (isEditing && editId) {
            updateSubscription(editId, subscriptionData);
            showToast('Subscription updated successfully', 'success');
        } else {
            addSubscription(subscriptionData);
            showToast('Subscription added successfully', 'success');
        }

        setIsSubmitting(true);
        // Short delay for visual feedback before closing
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
        }, 300);
    };

    const handleBack = () => {
        setMode('picker');
    };

    // Get icon component for preview
    const getPreviewIcon = () => {
        if (iconType === 'brand') {
            const Icon = (SimpleIcons as unknown as Record<string, React.ElementType>)[icon];
            return Icon ? <Icon size={24} /> : <LucideIcons.HelpCircle size={24} />;
        }
        const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[icon];
        return Icon ? <Icon size={24} /> : <LucideIcons.HelpCircle size={24} />;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                mode === 'picker' ? 'Choose a Service' :
                    isEditing ? 'Edit Subscription' :
                        'Add Subscription'
            }
            size={mode === 'picker' ? 'lg' : 'md'}
        >
            {mode === 'picker' ? (
                <ServicePicker
                    onSelect={handleServiceSelect}
                    onCustom={handleCustom}
                />
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Preview & Name */}
                    <div className={styles.header}>
                        <div
                            className={styles.previewIcon}
                            style={{ backgroundColor: `${color}20`, color: color }}
                        >
                            {getPreviewIcon()}
                        </div>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Subscription name..."
                            error={errors.name}
                            required
                            className={styles.nameInput}
                        />
                    </div>

                    <div className={styles.row}>
                        <Input
                            label={`Amount (${settings.currencySymbol})`}
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            error={errors.amount}
                            required
                        />
                        <Input
                            label="Next Billing"
                            id="nextBilling"
                            type="date"
                            value={nextBilling}
                            onChange={(e) => setNextBilling(e.target.value)}
                            required
                        />
                    </div>

                    {/* Flexible Billing Cycle */}
                    <div className={styles.cycleSection}>
                        <label className={styles.sectionLabel}>Billing Cycle</label>
                        <div className={styles.cycleRow}>
                            <span className={styles.cyclePrefix}>Every</span>
                            <Input
                                id="cycleCount"
                                type="number"
                                value={cycleCount}
                                onChange={(e) => setCycleCount(e.target.value)}
                                min="1"
                                className={styles.cycleCount}
                            />
                            <Select
                                id="cycleUnit"
                                value={cycleUnit}
                                onChange={(e) => setCycleUnit(e.target.value as BillingCycle['unit'])}
                                options={TIME_UNITS.map(u => ({ value: u.value, label: u.label }))}
                            />
                        </div>
                    </div>

                    {/* Only show icon picker for custom (non-brand) subscriptions */}
                    {iconType === 'lucide' && (
                        <IconPicker
                            label="Icon"
                            value={icon}
                            onChange={setIcon}
                        />
                    )}

                    <ColorPicker
                        label="Color"
                        value={color}
                        onChange={setColor}
                    />

                    <Input
                        label="Notes (optional)"
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Account details, cancel date, etc."
                    />

                    <div className={styles.actions}>
                        {!isEditing && (
                            <Button type="button" variant="ghost" onClick={handleBack}>
                                ← Back
                            </Button>
                        )}
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={isSubmitting}>
                            {isEditing ? 'Save Changes' : 'Add Subscription'}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
