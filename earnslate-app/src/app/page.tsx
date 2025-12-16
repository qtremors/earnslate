'use client';

import { useState, useMemo } from 'react';
import { useAppStore, useShallow } from '@/store';
import { useFormatters } from '@/hooks/useFormatters';
import { CHART_COLORS } from '@/types';
import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import { Search, TrendingUp, TrendingDown, Banknote, ShoppingCart, Coffee, Film, Car, Home, Briefcase, Heart, Sparkles, UtensilsCrossed, Plane, Gift, Smartphone, Lightbulb, Shirt, User, AlertTriangle, Wallet, HelpCircle } from 'lucide-react';
import styles from './page.module.css';

// Category icons for recent transactions
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Food & Dining': UtensilsCrossed,
  'Food': UtensilsCrossed,
  'Transport': Car,
  'Transportation': Car,
  'Entertainment': Film,
  'Shopping': ShoppingCart,
  'Coffee': Coffee,
  'Groceries': ShoppingCart,
  'Utilities': Lightbulb,
  'Travel': Plane,
  'Health': Heart,
  'Healthcare': Heart,
  'Work': Briefcase,
  'Home': Home,
  'Gifts': Gift,
  'Phone': Smartphone,
  'Clothing': Shirt,
  'Personal': User,
  'Income': Banknote,
  'Salary': Banknote,
  'Other': Sparkles,
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  // Use shallow comparison to avoid re-renders when other store parts change
  const { settings, transactions, budgets } = useAppStore(
    useShallow((state) => ({
      settings: state.settings,
      transactions: state.transactions,
      budgets: state.budgets,
    }))
  );

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'income' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Spending by category for pie chart
  const spendingByCategory = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
      });

    return Object.entries(categoryTotals)
      .map(([category, amount], i) => ({ category, amount, color: CHART_COLORS[i % CHART_COLORS.length] }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, currentMonth, currentYear]);

  // Filter and get recent transactions
  const recentTransactions = useMemo(() => {
    let filtered = transactions;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = transactions.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return filtered.slice(0, 5);
  }, [transactions, searchQuery]);

  const { formatCurrency, formatDate } = useFormatters();

  // Budget alerts (over 80%)
  const budgetAlerts = budgets.filter(b => (b.spent / b.limit) >= 0.8);

  return (
    <div className={styles.dashboard}>
      <Header
        title="Dashboard"
        subtitle={`Welcome back${settings.displayName !== 'User' ? `, ${settings.displayName}` : ''}! Here's your financial overview.`}
      />

      <div className={styles.content}>
        {/* Budget Alerts */}
        {budgetAlerts.length > 0 && (
          <div className={styles.alerts}>
            {budgetAlerts.map(b => {
              const pct = Math.round((b.spent / b.limit) * 100);
              const isOver = pct >= 100;
              return (
                <div key={b.id} className={`${styles.alert} ${isOver ? styles.alertDanger : styles.alertWarning}`}>
                  <AlertTriangle size={16} />
                  <span>{b.name}: {pct}% {isOver ? 'over budget!' : 'of budget used'}</span>
                </div>
              );
            })}
          </div>
        )}

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
              <span className={`${styles.summaryValue} ${styles.income}`}>+{formatCurrency(monthlyIncome)}</span>
            </div>
          </Card>

          <Card className={styles.summaryCard} hover>
            <div className={`${styles.summaryIcon} ${styles.expenseIcon}`}>
              <TrendingDown size={24} />
            </div>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryLabel}>Expenses (This Month)</span>
              <span className={`${styles.summaryValue} ${styles.expense}`}>-{formatCurrency(monthlyExpenses)}</span>
            </div>
          </Card>
        </section>

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Spending Breakdown */}
          <Card className={styles.chartCard}>
            <CardHeader title="Spending by Category" />
            {spendingByCategory.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No expenses this month</p>
              </div>
            ) : (
              <div className={styles.chartContainer}>
                <div className={styles.pieChart}>
                  <svg viewBox="0 0 100 100" className={styles.pie}>
                    {spendingByCategory.length === 1 ? (
                      // Single category - draw a full circle
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill={spendingByCategory[0].color}
                        className={styles.pieSlice}
                      >
                        <title>{spendingByCategory[0].category}: {formatCurrency(spendingByCategory[0].amount)} (100%)</title>
                      </circle>
                    ) : (
                      // Multiple categories - draw pie slices
                      spendingByCategory.reduce((acc, d) => {
                        const startAngle = acc.angle;
                        const sliceAngle = (d.amount / monthlyExpenses) * 360;
                        const endAngle = startAngle + sliceAngle;

                        const startRad = (startAngle - 90) * Math.PI / 180;
                        const endRad = (endAngle - 90) * Math.PI / 180;

                        const x1 = 50 + 40 * Math.cos(startRad);
                        const y1 = 50 + 40 * Math.sin(startRad);
                        const x2 = 50 + 40 * Math.cos(endRad);
                        const y2 = 50 + 40 * Math.sin(endRad);

                        const largeArc = sliceAngle > 180 ? 1 : 0;
                        const pct = Math.round((d.amount / monthlyExpenses) * 100);

                        acc.paths.push(
                          <path
                            key={d.category}
                            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={d.color}
                            stroke="var(--bg-secondary)"
                            strokeWidth="1"
                            className={styles.pieSlice}
                          >
                            <title>{d.category}: {formatCurrency(d.amount)} ({pct}%)</title>
                          </path>
                        );
                        acc.angle = endAngle;
                        return acc;
                      }, { paths: [] as React.ReactElement[], angle: 0 }).paths
                    )}
                  </svg>
                </div>
                <div className={styles.legend}>
                  {spendingByCategory.slice(0, 5).map(d => (
                    <div key={d.category} className={styles.legendItem}>
                      <div className={styles.legendColor} style={{ backgroundColor: d.color }} />
                      <span className={styles.legendLabel}>{d.category}</span>
                      <span className={styles.legendValue}>{formatCurrency(d.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Recent Transactions */}
          <Card className={styles.transactionsCard}>
            <CardHeader
              title="Recent Transactions"
              action={<a href="/transactions" className={styles.viewAll}>View All →</a>}
            />

            {/* Search Input */}
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {recentTransactions.length === 0 ? (
              <div className={styles.emptyState}>
                <p>{searchQuery ? 'No matching transactions' : 'No transactions yet'}</p>
                {!searchQuery && <a href="/transactions" className={styles.link}>Add your first transaction</a>}
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
                        <span className={styles.transactionMeta}>{tx.category} • {formatDate(tx.date)}</span>
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
                {budgets.slice(0, 3).map((budget) => {
                  const pct = (budget.spent / budget.limit) * 100;
                  return (
                    <div key={budget.id} className={styles.budgetItem}>
                      <div className={styles.budgetHeader}>
                        <span className={styles.budgetName}>{budget.name}</span>
                        <span className={`${styles.budgetNumbers} ${pct >= 100 ? styles.expense : pct >= 80 ? styles.warning : ''}`}>
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                        </span>
                      </div>
                      <ProgressBar value={budget.spent} max={budget.limit} />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
