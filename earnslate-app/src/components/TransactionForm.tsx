'use client';

import { useState, useEffect } from 'react';
import { useAppStore, useShallow } from '@/store';
import { useToast } from './Toast';
import Modal from './Modal';
import Input, { Select } from './Input';
import Button from './Button';
import styles from './TransactionForm.module.css';

interface TransactionFormProps {
    isOpen: boolean;
    onClose: () => void;
    editId?: string;
}

export default function TransactionForm({ isOpen, onClose, editId }: TransactionFormProps) {
    // Use shallow comparison to avoid re-renders when other store parts change
    const { addTransaction, transactions, updateTransaction, settings } = useAppStore(
        useShallow((state) => ({
            addTransaction: state.addTransaction,
            transactions: state.transactions,
            updateTransaction: state.updateTransaction,
            settings: state.settings,
        }))
    );
    const { showToast } = useToast();

    const existingTransaction = editId
        ? transactions.find(t => t.id === editId)
        : null;

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense' as 'income' | 'expense',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate form when editing
    useEffect(() => {
        if (existingTransaction) {
            setFormData({
                description: existingTransaction.description,
                amount: Math.abs(existingTransaction.amount).toString(),
                type: existingTransaction.type,
                category: existingTransaction.category,
                date: existingTransaction.date.split('T')[0],
                notes: existingTransaction.notes || '',
            });
        } else if (isOpen) {
            setFormData({
                description: '',
                amount: '',
                type: 'expense',
                category: 'Other',
                date: new Date().toISOString().split('T')[0],
                notes: '',
            });
        }
    }, [existingTransaction, isOpen]);

    // Get categories from settings based on type
    const categories = settings.customCategories
        .filter(c => c.type === formData.type || c.type === 'both')
        .map(c => ({ value: c.name, label: c.name }));

    // Reset category when type changes and current category is invalid
    useEffect(() => {
        const validCategories = settings.customCategories
            .filter(c => c.type === formData.type || c.type === 'both')
            .map(c => c.name);

        if (!validCategories.includes(formData.category) && validCategories.length > 0) {
            setFormData(prev => ({ ...prev, category: validCategories[0] }));
        }
    }, [formData.type, settings.customCategories]);

    // Validation state
    const [errors, setErrors] = useState<{ description?: string; amount?: string }>({});

    const validate = (): boolean => {
        const newErrors: { description?: string; amount?: string } = {};

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        const amount = parseFloat(formData.amount);
        if (!formData.amount || isNaN(amount) || amount <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Clear errors when user types
    useEffect(() => {
        if (formData.description.trim() && errors.description) {
            setErrors(prev => ({ ...prev, description: undefined }));
        }
    }, [formData.description]);

    useEffect(() => {
        const amount = parseFloat(formData.amount);
        if (formData.amount && !isNaN(amount) && amount > 0 && errors.amount) {
            setErrors(prev => ({ ...prev, amount: undefined }));
        }
    }, [formData.amount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            showToast('Please fix the errors before submitting', 'error');
            return;
        }

        const amount = parseFloat(formData.amount);

        const transactionData = {
            description: formData.description,
            amount: formData.type === 'expense' ? -amount : amount,
            type: formData.type,
            category: formData.category,
            date: formData.date,
            notes: formData.notes || undefined,
        };

        if (editId) {
            updateTransaction(editId, transactionData);
            showToast('Transaction updated successfully', 'success');
        } else {
            addTransaction(transactionData);
            showToast('Transaction added successfully', 'success');
        }

        setIsSubmitting(true);
        // Short delay for visual feedback before closing
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
        }, 300);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editId ? 'Edit Transaction' : 'Add Transaction'}
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Type Toggle */}
                <div className={styles.typeToggle}>
                    <button
                        type="button"
                        className={`${styles.typeButton} ${formData.type === 'expense' ? styles.activeExpense : ''}`}
                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        className={`${styles.typeButton} ${formData.type === 'income' ? styles.activeIncome : ''}`}
                        onClick={() => setFormData({ ...formData, type: 'income' })}
                    >
                        Income
                    </button>
                </div>

                <Input
                    label="Description"
                    id="description"
                    placeholder="e.g., Groceries, Salary, Netflix..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    error={errors.description}
                    required
                />

                <div className={styles.row}>
                    <Input
                        label={`Amount (${settings.currencySymbol})`}
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        error={errors.amount}
                        required
                    />

                    <Select
                        label="Category"
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        options={categories}
                    />
                </div>

                <Input
                    label="Date"
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                />

                <Input
                    label="Notes (optional)"
                    id="notes"
                    placeholder="Additional details..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />

                <div className={styles.actions}>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={isSubmitting}>
                        {editId ? 'Save Changes' : 'Add Transaction'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
