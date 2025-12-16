'use client';

import { useState, useEffect } from 'react';
import { useAppStore, useShallow } from '@/store';
import { useToast } from './Toast';
import { TIME_UNITS, BillingCycle } from '@/types';
import Modal from './Modal';
import Input from './Input';
import { Select } from './Input';
import Button from './Button';
import IconPicker from './IconPicker';
import ColorPicker from './ColorPicker';
import styles from './BudgetForm.module.css';

interface BudgetFormProps {
    isOpen: boolean;
    onClose: () => void;
    editId?: string;
}

export default function BudgetForm({ isOpen, onClose, editId }: BudgetFormProps) {
    const [name, setName] = useState('');
    const [limit, setLimit] = useState('');
    const [category, setCategory] = useState('Other');
    const [icon, setIcon] = useState('Wallet');
    const [color, setColor] = useState('#F59E0B');
    const [periodCount, setPeriodCount] = useState('1');
    const [periodUnit, setPeriodUnit] = useState<BillingCycle['unit']>('month');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use shallow comparison to avoid re-renders when other store parts change
    const { budgets, addBudget, updateBudget, settings } = useAppStore(
        useShallow((state) => ({
            budgets: state.budgets,
            addBudget: state.addBudget,
            updateBudget: state.updateBudget,
            settings: state.settings,
        }))
    );
    const { showToast } = useToast();

    const isEditing = !!editId;
    const existingBudget = editId ? budgets.find(b => b.id === editId) : null;

    useEffect(() => {
        if (existingBudget) {
            setName(existingBudget.name);
            setLimit(String(existingBudget.limit));
            setCategory(existingBudget.category);
            setIcon(existingBudget.icon);
            setColor(existingBudget.color || '#F59E0B');
            setPeriodCount(String(existingBudget.period?.count || 1));
            setPeriodUnit(existingBudget.period?.unit || 'month');
        } else {
            setName('');
            setLimit('');
            setCategory('');
            setIcon('UtensilsCrossed');
            setColor('#F59E0B');
            setPeriodCount('1');
            setPeriodUnit('month');
        }
    }, [existingBudget, isOpen]);

    // Validation state
    const [errors, setErrors] = useState<{ name?: string; limit?: string }>({});

    const validate = (): boolean => {
        const newErrors: { name?: string; limit?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Budget name is required';
        }

        const limitNum = parseFloat(limit);
        if (!limit || isNaN(limitNum) || limitNum <= 0) {
            newErrors.limit = 'Please enter a valid limit';
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
        const limitNum = parseFloat(limit);
        if (limit && !isNaN(limitNum) && limitNum > 0 && errors.limit) {
            setErrors(prev => ({ ...prev, limit: undefined }));
        }
    }, [limit, errors.limit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            showToast('Please fix the errors before submitting', 'error');
            return;
        }

        const period: BillingCycle = {
            count: parseInt(periodCount) || 1,
            unit: periodUnit,
        };

        const budgetData = {
            name,
            limit: parseFloat(limit),
            category: category || name,
            icon,
            color,
            period,
        };

        if (isEditing && editId) {
            updateBudget(editId, budgetData);
            showToast('Budget updated successfully', 'success');
        } else {
            addBudget(budgetData);
            showToast('Budget created successfully', 'success');
        }

        setIsSubmitting(true);
        // Short delay for visual feedback before closing
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
        }, 300);
    };

    // Get categories from settings
    const categories = settings.customCategories
        .filter(c => c.type === 'expense' || c.type === 'both')
        .map(c => ({ value: c.name, label: c.name }));

    // Filter period units (no hourly budgets)
    const budgetPeriodUnits = TIME_UNITS.filter(u => u.value !== 'hour');

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Budget' : 'Create Budget'}
            size="md"
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Budget Name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Food, Entertainment, Travel..."
                    error={errors.name}
                    required
                />

                <div className={styles.row}>
                    <Input
                        label={`Limit (${settings.currencySymbol})`}
                        id="limit"
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        placeholder="5000"
                        error={errors.limit}
                        required
                    />
                    <Select
                        label="Category"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        options={[{ value: '', label: 'Same as name' }, ...categories]}
                    />
                </div>

                {/* Flexible Budget Period */}
                <div className={styles.periodSection}>
                    <label className={styles.sectionLabel}>Budget Period</label>
                    <div className={styles.periodRow}>
                        <span className={styles.periodPrefix}>Resets every</span>
                        <Input
                            id="periodCount"
                            type="number"
                            value={periodCount}
                            onChange={(e) => setPeriodCount(e.target.value)}
                            min="1"
                            className={styles.periodCount}
                        />
                        <Select
                            id="periodUnit"
                            value={periodUnit}
                            onChange={(e) => setPeriodUnit(e.target.value as BillingCycle['unit'])}
                            options={budgetPeriodUnits.map(u => ({ value: u.value, label: u.label }))}
                        />
                    </div>
                </div>

                <div className={styles.row}>
                    <IconPicker
                        label="Icon"
                        value={icon}
                        onChange={setIcon}
                    />
                </div>

                <ColorPicker
                    label="Color"
                    value={color}
                    onChange={setColor}
                />

                <div className={styles.actions}>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={isSubmitting}>
                        {isEditing ? 'Save Changes' : 'Create Budget'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
