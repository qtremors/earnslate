'use client';

import { useAppStore } from '@/store';
import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Briefcase,
  Tv,
  Zap,
  Coffee,
  HelpCircle,
} from 'lucide-react';
import styles from './page.module.css';

// Category to icon mapping
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Food: Coffee,
  Shopping: ShoppingCart,
  Entertainment: Tv,
  Utilities: Zap,
  Income: Briefcase,
};

export default function Dashboard() {
  // Get individual state slices to avoid re-render loops
  const settings = useAppStore((state) => state.settings);
  const transactions = useAppStore((state) => state.transactions);
  const budgets = useAppStore((state) => state.budgets);

  // Compute values from state (not in selectors to avoid infinite loop)
  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'income' &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return `${settings.currencySymbol}${Math.abs(amount).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className={styles.dashboard}>
      <Header
        title="Dashboard"
        subtitle={`Welcome back${settings.displayName !== 'User' ? `, ${settings.displayName}` : ''}! Here's your financial overview.`}
      />

      <div className={styles.content}>
        {/* Summary Cards */}
        <section className={styles.summarySection}>
          <Card className={styles.summaryCard} hover>
            <div className={styles.summaryIcon}>
              <Wallet size={24} />
            </div>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryLabel}>Total Balance</span>
              <span className={`${styles.summaryValue} ${totalBalance >= 0 ? '' : styles.expense}`}>
                {totalBalance >= 0 ? '' : '-'}{formatCurrency(totalBalance)}
              </span>
            </div>
          </Card>

          <Card className={styles.summaryCard} hover>
            <div className={`${styles.summaryIcon} ${styles.incomeIcon}`}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryLabel}>Income (This Month)</span>
              <span className={`${styles.summaryValue} ${styles.income}`}>
                +{formatCurrency(monthlyIncome)}
              </span>
            </div>
          </Card>

          <Card className={styles.summaryCard} hover>
            <div className={`${styles.summaryIcon} ${styles.expenseIcon}`}>
              <TrendingDown size={24} />
            </div>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryLabel}>Expenses (This Month)</span>
              <span className={`${styles.summaryValue} ${styles.expense}`}>
                -{formatCurrency(monthlyExpenses)}
              </span>
            </div>
          </Card>
        </section>

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Recent Transactions */}
          <Card className={styles.transactionsCard}>
            <CardHeader
              title="Recent Transactions"
              action={<a href="/transactions" className={styles.viewAll}>View All →</a>}
            />
            {recentTransactions.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No transactions yet</p>
                <a href="/transactions" className={styles.link}>Add your first transaction</a>
              </div>
            ) : (
              <ul className={styles.transactionList}>
                {recentTransactions.map((tx) => {
                  const Icon = CATEGORY_ICONS[tx.category] || HelpCircle;
                  return (
                    <li key={tx.id} className={styles.transactionItem}>
                      <div className={styles.transactionIcon}>
                        <Icon size={18} />
                      </div>
                      <div className={styles.transactionInfo}>
                        <span className={styles.transactionDesc}>{tx.description}</span>
                        <span className={styles.transactionMeta}>
                          {tx.category} • {formatDate(tx.date)}
                        </span>
                      </div>
                      <span className={`${styles.transactionAmount} ${tx.amount > 0 ? styles.income : styles.expense}`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* Budget Overview */}
          <Card className={styles.budgetCard}>
            <CardHeader
              title="Budget Status"
              action={<a href="/budgets" className={styles.viewAll}>View All →</a>}
            />
            {budgets.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No budgets yet</p>
                <a href="/budgets" className={styles.link}>Create your first budget</a>
              </div>
            ) : (
              <div className={styles.budgetList}>
                {budgets.slice(0, 3).map((budget) => (
                  <div key={budget.id} className={styles.budgetItem}>
                    <div className={styles.budgetHeader}>
                      <span className={styles.budgetName}>{budget.name}</span>
                      <span className={styles.budgetNumbers}>
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                      </span>
                    </div>
                    <ProgressBar value={budget.spent} max={budget.limit} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
