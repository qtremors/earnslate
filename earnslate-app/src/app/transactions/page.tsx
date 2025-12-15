import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import Button from '@/components/Button';
import styles from './page.module.css';

// ===== Sample Data =====
const transactions = [
    { id: 1, description: 'Groceries - BigBasket', amount: -2450, date: 'Dec 14, 2025', category: 'Food', type: 'expense' },
    { id: 2, description: 'Salary - December', amount: 65000, date: 'Dec 1, 2025', category: 'Income', type: 'income' },
    { id: 3, description: 'Netflix Subscription', amount: -649, date: 'Dec 1, 2025', category: 'Entertainment', type: 'expense' },
    { id: 4, description: 'Electricity Bill', amount: -1850, date: 'Nov 28, 2025', category: 'Utilities', type: 'expense' },
    { id: 5, description: 'Coffee Shop', amount: -320, date: 'Nov 27, 2025', category: 'Food', type: 'expense' },
    { id: 6, description: 'Freelance Payment', amount: 15000, date: 'Nov 25, 2025', category: 'Income', type: 'income' },
    { id: 7, description: 'Gym Membership', amount: -1200, date: 'Nov 20, 2025', category: 'Health', type: 'expense' },
    { id: 8, description: 'Amazon Shopping', amount: -3500, date: 'Nov 18, 2025', category: 'Shopping', type: 'expense' },
];

export default function TransactionsPage() {
    const formatCurrency = (amount: number) => {
        return `₹${Math.abs(amount).toLocaleString('en-IN')}`;
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
                        <Button variant="secondary" size="sm">All</Button>
                        <Button variant="ghost" size="sm">Income</Button>
                        <Button variant="ghost" size="sm">Expenses</Button>
                    </div>
                    <Button variant="primary">+ Add Transaction</Button>
                </div>

                {/* Transactions List */}
                <Card>
                    <CardHeader title="All Transactions" />
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className={styles.tableRow}>
                                        <td className={styles.description}>{tx.description}</td>
                                        <td>
                                            <span className={styles.categoryBadge}>{tx.category}</span>
                                        </td>
                                        <td className={styles.date}>{tx.date}</td>
                                        <td className={`${styles.amount} ${tx.amount > 0 ? styles.income : styles.expense}`}>
                                            {tx.amount > 0 ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}
