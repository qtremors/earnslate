'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import Modal from './Modal';
import Input, { Select } from './Input';
import Button from './Button';
import { TRANSACTION_CATEGORIES } from '@/types';
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

    const existingTransaction = editId
        ? transactions.find(t => t.id === editId)
        : null;

    const [formData, setFormData] = useState({
        description: existingTransaction?.description || '',
        amount: existingTransaction ? Math.abs(existingTransaction.amount).toString() : '',
        type: existingTransaction?.type || 'expense' as 'income' | 'expense',
        category: existingTransaction?.category || 'Other',
        date: existingTransaction?.date || new Date().toISOString().split('T')[0],
    });

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
        };

        if (editId) {
            updateTransaction(editId, transactionData);
        } else {
            addTransaction(transactionData);
        }

        onClose();
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            description: '',
            amount: '',
            type: 'expense',
            category: 'Other',
            date: new Date().toISOString().split('T')[0],
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

                <Select
                    label="Category"
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    options={TRANSACTION_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                />

                <Input
                    label="Date"
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                />

                <div className={styles.actions}>
                    <Button type="button" variant="ghost" onClick={handleClose}>
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
