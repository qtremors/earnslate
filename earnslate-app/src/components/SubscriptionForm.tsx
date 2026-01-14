'use client';

import { useState, useEffect } from 'react';
import { useAppStore, useShallow } from '@/store';
import { TIME_UNITS, BillingCycle } from '@/types';
import { useToast } from './Toast';
import Modal from './Modal';
import Input, { Select } from './Input';
import DatePicker from './DatePicker';
import Button from './Button';
import IconPicker from './IconPicker';
import ColorPicker from './ColorPicker';
import ServicePicker from './ServicePicker';
import { DynamicIcon, isBrandIcon } from './DynamicIcon';
import { POPULAR_SERVICES, ServiceTemplate } from '@/data/services';
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
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [icon, setIcon] = useState('CreditCard');
    const [color, setColor] = useState('#E50914');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

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
            // For editing, show the next billing date as start date
            setStartDate(existingSubscription.nextBilling.split('T')[0]);
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
        // Default start date to today
        setStartDate(new Date().toISOString().split('T')[0]);
        setIcon('Tv');
        setColor('#E50914');
        setNotes('');
    };

    const handleServiceSelect = (service: ServiceTemplate) => {
        setName(service.name);
        setIcon(service.icon);
        setColor(service.color);
        // User enters their own amount and cycle
        setAmount('');
        setCycleCount('1');
        setCycleUnit('month');
        setStartDate(new Date().toISOString().split('T')[0]);
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

        // Calculate next billing date from start date + cycle
        const start = new Date(startDate);
        switch (cycle.unit) {
            case 'hour':
                start.setHours(start.getHours() + cycle.count);
                break;
            case 'day':
                start.setDate(start.getDate() + cycle.count);
                break;
            case 'week':
                start.setDate(start.getDate() + (cycle.count * 7));
                break;
            case 'month':
                start.setMonth(start.getMonth() + cycle.count);
                break;
            case 'year':
                start.setFullYear(start.getFullYear() + cycle.count);
                break;
        }
        const nextBilling = start.toISOString().split('T')[0];

        // Store icon directly (already in correct Iconify format from ServicePicker)
        const subscriptionData = {
            name,
            amount: parseFloat(amount),
            cycle,
            nextBilling,
            icon,  // No prefix needed - Iconify format or Lucide name
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

    const handleIconChange = (newIcon: string) => {
        setIcon(newIcon);
        setIsIconPickerOpen(false);
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
                        <button
                            type="button"
                            className={styles.previewIcon}
                            style={{ backgroundColor: `${color}20`, color: color }}
                            onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                            title="Click to change icon"
                        >
                            <DynamicIcon name={icon} color={color} size={24} />
                        </button>
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
                        <DatePicker
                            label="Start Date"
                            id="startDate"
                            value={startDate}
                            onChange={setStartDate}
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

                    {/* Icon Picker - opened by clicking the preview icon */}
                    <IconPicker
                        value={icon}
                        onChange={handleIconChange}
                        isOpen={isIconPickerOpen}
                        onOpenChange={setIsIconPickerOpen}
                    />

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
