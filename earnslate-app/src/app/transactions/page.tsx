'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/store';
import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import Button from '@/components/Button';
import TransactionForm from '@/components/TransactionForm';
import { Plus, Trash2, Pencil, Search, Download, PieChart, List } from 'lucide-react';
import styles from './page.module.css';

type ViewMode = 'list' | 'chart';
type TypeFilter = 'all' | 'income' | 'expense';

export default function TransactionsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>();
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    const transactions = useAppStore((state) => state.transactions);
    const deleteTransaction = useAppStore((state) => state.deleteTransaction);
    const settings = useAppStore((state) => state.settings);

    const formatCurrency = (amount: number) => `${settings.currencySymbol}${Math.abs(amount).toLocaleString('en-IN')}`;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // Get unique categories from transactions
    const categories = useMemo(() => {
        const cats = [...new Set(transactions.map(t => t.category))];
        return cats.sort();
    }, [transactions]);

    // Filtered transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            if (typeFilter !== 'all' && t.type !== typeFilter) return false;
            if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                if (!t.description.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) {
                    return false;
                }
            }
            return true;
        });
    }, [transactions, typeFilter, categoryFilter, searchQuery]);

    // Calculate totals for chart
    const chartData = useMemo(() => {
        const expenses = filteredTransactions.filter(t => t.type === 'expense');
        const categoryTotals: Record<string, number> = {};

        expenses.forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
        });

        return Object.entries(categoryTotals)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount);
    }, [filteredTransactions]);

    const totalExpenses = chartData.reduce((sum, d) => sum + d.amount, 0);

    // Chart colors
    const chartColors = ['#E50914', '#1DB954', '#FF9900', '#3693F3', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

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

    const handleExportCSV = () => {
        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
        const rows = filteredTransactions.map(t => [
            t.date,
            t.description,
            t.category,
            t.type,
            t.amount.toString()
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.page}>
            <Header title="Transactions" subtitle="Track and manage all your income and expenses" />

            <div className={styles.content}>
                {/* Search & Filters */}
                <div className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filters}>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.actionsBar}>
                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                        <button
                            className={`${styles.viewButton} ${viewMode === 'chart' ? styles.active : ''}`}
                            onClick={() => setViewMode('chart')}
                            title="Chart View"
                        >
                            <PieChart size={18} />
                        </button>
                    </div>

                    <div className={styles.actionButtons}>
                        <Button variant="ghost" size="sm" onClick={handleExportCSV}>
                            <Download size={16} />
                            Export
                        </Button>
                        <Button variant="primary" onClick={handleAdd}>
                            <Plus size={18} />
                            Add Transaction
                        </Button>
                    </div>
                </div>

                {/* Content based on view mode */}
                {viewMode === 'chart' ? (
                    <Card>
                        <CardHeader title="Spending by Category" />
                        {chartData.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>No expense data to display</p>
                            </div>
                        ) : (
                            <div className={styles.chartContainer}>
                                <div className={styles.pieChart}>
                                    <svg viewBox="0 0 100 100" className={styles.pie}>
                                        {chartData.reduce((acc, d, i) => {
                                            const startAngle = acc.angle;
                                            const sliceAngle = (d.amount / totalExpenses) * 360;
                                            const endAngle = startAngle + sliceAngle;

                                            const startRad = (startAngle - 90) * Math.PI / 180;
                                            const endRad = (endAngle - 90) * Math.PI / 180;

                                            const x1 = 50 + 40 * Math.cos(startRad);
                                            const y1 = 50 + 40 * Math.sin(startRad);
                                            const x2 = 50 + 40 * Math.cos(endRad);
                                            const y2 = 50 + 40 * Math.sin(endRad);

                                            const largeArc = sliceAngle > 180 ? 1 : 0;

                                            acc.paths.push(
                                                <path
                                                    key={d.category}
                                                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                    fill={chartColors[i % chartColors.length]}
                                                    stroke="var(--bg-primary)"
                                                    strokeWidth="0.5"
                                                />
                                            );

                                            acc.angle = endAngle;
                                            return acc;
                                        }, { paths: [] as JSX.Element[], angle: 0 }).paths}
                                    </svg>
                                </div>

                                <div className={styles.legend}>
                                    {chartData.map((d, i) => (
                                        <div key={d.category} className={styles.legendItem}>
                                            <div
                                                className={styles.legendColor}
                                                style={{ backgroundColor: chartColors[i % chartColors.length] }}
                                            />
                                            <span className={styles.legendLabel}>{d.category}</span>
                                            <span className={styles.legendValue}>{formatCurrency(d.amount)}</span>
                                            <span className={styles.legendPercent}>
                                                {Math.round((d.amount / totalExpenses) * 100)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                ) : (
                    <Card>
                        <CardHeader title={`${filteredTransactions.length} Transactions`} />

                        {filteredTransactions.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>{searchQuery || categoryFilter !== 'all' ? 'No matching transactions' : 'No transactions yet'}</p>
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
                                                    <button className={styles.actionButton} onClick={() => handleEdit(tx.id)} aria-label="Edit">
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(tx.id)} aria-label="Delete">
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
                )}
            </div>

            <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} editId={editingId} />
        </div>
    );
}
