'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import Button from '@/components/Button';
import TransactionForm from '@/components/TransactionForm';
import { Plus, Trash2, Pencil } from 'lucide-react';
import styles from './page.module.css';

export default function TransactionsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>();
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

    const transactions = useAppStore((state) => state.transactions);
    const deleteTransaction = useAppStore((state) => state.deleteTransaction);
    const settings = useAppStore((state) => state.settings);

    const formatCurrency = (amount: number) => {
        return `${settings.currencySymbol}${Math.abs(amount).toLocaleString('en-IN')}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        return t.type === filter;
    });

    const handleEdit = (id: string) => {
        setEditingId(id);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingId(undefined);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(id);
        }
    };

    return (
        <div className={styles.page}>
            <Header
                title="Transactions"
                subtitle="Track and manage all your income and expenses"
            />

            <div className={styles.content}>
                {/* Actions Bar */}
                <div className={styles.actionsBar}>
                    <div className={styles.filters}>
                        <Button
                            variant={filter === 'all' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilter('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={filter === 'income' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilter('income')}
                        >
                            Income
                        </Button>
                        <Button
                            variant={filter === 'expense' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilter('expense')}
                        >
                            Expenses
                        </Button>
                    </div>
                    <Button variant="primary" onClick={handleAdd}>
                        <Plus size={18} />
                        Add Transaction
                    </Button>
                </div>

                {/* Transactions List */}
                <Card>
                    <CardHeader title={`${filteredTransactions.length} Transactions`} />

                    {filteredTransactions.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No transactions yet</p>
                            <Button variant="secondary" onClick={handleAdd}>
                                <Plus size={16} />
                                Add your first transaction
                            </Button>
                        </div>
                    ) : (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((tx) => (
                                        <tr key={tx.id} className={styles.tableRow}>
                                            <td className={styles.description}>{tx.description}</td>
                                            <td>
                                                <span className={styles.categoryBadge}>{tx.category}</span>
                                            </td>
                                            <td className={styles.date}>{formatDate(tx.date)}</td>
                                            <td className={`${styles.amount} ${tx.amount > 0 ? styles.income : styles.expense}`}>
                                                {tx.amount > 0 ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </td>
                                            <td className={styles.actions}>
                                                <button
                                                    className={styles.actionButton}
                                                    onClick={() => handleEdit(tx.id)}
                                                    aria-label="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                                    onClick={() => handleDelete(tx.id)}
                                                    aria-label="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            {/* Transaction Form Modal */}
            <TransactionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                editId={editingId}
            />
        </div>
    );
}
