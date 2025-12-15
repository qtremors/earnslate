import Header from '@/components/Header';
import Card, { CardHeader } from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import styles from './page.module.css';

// ===== Sample Data (will be replaced with real data later) =====
const financialSummary = {
  totalBalance: 45230.00,
  monthlyIncome: 65000.00,
  monthlyExpenses: 32450.00,
  currency: '₹',
};

const recentTransactions = [
  { id: 1, description: 'Groceries - BigBasket', amount: -2450, date: 'Dec 14', category: 'Food' },
  { id: 2, description: 'Salary - December', amount: 65000, date: 'Dec 1', category: 'Income' },
  { id: 3, description: 'Netflix Subscription', amount: -649, date: 'Dec 1', category: 'Entertainment' },
  { id: 4, description: 'Electricity Bill', amount: -1850, date: 'Nov 28', category: 'Utilities' },
  { id: 5, description: 'Coffee Shop', amount: -320, date: 'Nov 27', category: 'Food' },
];

const budgets = [
  { name: 'Food & Dining', spent: 8500, limit: 12000 },
  { name: 'Entertainment', amount: 3200, limit: 5000 },
  { name: 'Transport', spent: 4200, limit: 6000 },
];

export default function Dashboard() {
  const formatCurrency = (amount: number) => {
    return `${financialSummary.currency}${Math.abs(amount).toLocaleString('en-IN')}`;
  };

  return (
    <div className={styles.dashboard}>
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's your financial overview."
      />

      <div className={styles.content}>
        {/* Summary Cards */}
        <section className={styles.summarySection}>
          <Card className={styles.summaryCard} hover>
            <div className={styles.summaryIcon}>💰</div>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryLabel}>Total Balance</span>
              <span className={styles.summaryValue}>
                {formatCurrency(financialSummary.totalBalance)}
              </span>
            </div>
          </Card>

          <Card className={styles.summaryCard} hover>
            <div className={styles.summaryIcon}>📈</div>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryLabel}>Income (Dec)</span>
              <span className={`${styles.summaryValue} ${styles.income}`}>
                +{formatCurrency(financialSummary.monthlyIncome)}
              </span>
            </div>
          </Card>

          <Card className={styles.summaryCard} hover>
            <div className={styles.summaryIcon}>📉</div>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryLabel}>Expenses (Dec)</span>
              <span className={`${styles.summaryValue} ${styles.expense}`}>
                -{formatCurrency(financialSummary.monthlyExpenses)}
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
            <ul className={styles.transactionList}>
              {recentTransactions.map((tx) => (
                <li key={tx.id} className={styles.transactionItem}>
                  <div className={styles.transactionInfo}>
                    <span className={styles.transactionDesc}>{tx.description}</span>
                    <span className={styles.transactionMeta}>
                      {tx.category} • {tx.date}
                    </span>
                  </div>
                  <span className={`${styles.transactionAmount} ${tx.amount > 0 ? styles.income : styles.expense}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Budget Overview */}
          <Card className={styles.budgetCard}>
            <CardHeader
              title="Budget Status"
              action={<a href="/budgets" className={styles.viewAll}>View All →</a>}
            />
            <div className={styles.budgetList}>
              {budgets.map((budget) => {
                const spent = 'spent' in budget ? budget.spent : (budget as { amount?: number }).amount ?? 0;
                return (
                  <div key={budget.name} className={styles.budgetItem}>
                    <div className={styles.budgetHeader}>
                      <span className={styles.budgetName}>{budget.name}</span>
                      <span className={styles.budgetNumbers}>
                        {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                      </span>
                    </div>
                    <ProgressBar value={spent} max={budget.limit} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
