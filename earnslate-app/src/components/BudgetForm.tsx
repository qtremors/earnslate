'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import Modal from './Modal';
import Input, { Select } from './Input';
import Button from './Button';
import { BUDGET_ICONS } from '@/types';
import styles from './TransactionForm.module.css';

interface BudgetFormProps {
    isOpen: boolean;
    onClose: () => void;
    editId?: string;
}

export default function BudgetForm({ isOpen, onClose, editId }: BudgetFormProps) {
    const addBudget = useAppStore((state) => state.addBudget);
    const budgets = useAppStore((state) => state.budgets);
    const updateBudget = useAppStore((state) => state.updateBudget);

    const existingBudget = editId
        ? budgets.find(b => b.id === editId)
        : null;

    const [formData, setFormData] = useState({
        name: existingBudget?.name || '',
        limit: existingBudget?.limit.toString() || '',
        category: existingBudget?.category || 'Other',
        icon: existingBudget?.icon || 'UtensilsCrossed',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const limit = parseFloat(formData.limit);
        if (isNaN(limit) || limit <= 0) return;

        const budgetData = {
            name: formData.name,
            limit,
            category: formData.category,
            icon: formData.icon,
        };

        if (editId) {
            updateBudget(editId, budgetData);
        } else {
            addBudget(budgetData);
        }

        onClose();
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            limit: '',
            category: 'Other',
            icon: 'UtensilsCrossed',
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
            title={editId ? 'Edit Budget' : 'Create Budget'}
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Budget Name"
                    id="name"
                    placeholder="e.g., Food & Dining, Entertainment..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <Input
                    label="Monthly Limit"
                    id="limit"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                    required
                />

                <Select
                    label="Category"
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    options={BUDGET_ICONS.map(icon => ({ value: icon.label, label: icon.label }))}
                />

                <Select
                    label="Icon"
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    options={BUDGET_ICONS.map(icon => ({ value: icon.name, label: icon.label }))}
                />

                <div className={styles.actions}>
                    <Button type="button" variant="ghost" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        {editId ? 'Save Changes' : 'Create Budget'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
