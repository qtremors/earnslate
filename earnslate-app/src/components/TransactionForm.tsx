'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
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
    const addTransaction = useAppStore((state) => state.addTransaction);
    const transactions = useAppStore((state) => state.transactions);
    const updateTransaction = useAppStore((state) => state.updateTransaction);
    const settings = useAppStore((state) => state.settings);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const amount = parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) return;

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
        } else {
            addTransaction(transactionData);
        }

        onClose();
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
                    <Button type="submit" variant="primary">
                        {editId ? 'Save Changes' : 'Add Transaction'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
