# Earnslate - Personal Finance Manager

<p align="center">
  <strong>A beautiful, local-first personal finance tracker.</strong><br>
  Track expenses, manage budgets, and control subscriptions — all without an account.
</p>

---

## ✨ Features

### 📊 Dashboard
- **At-a-glance overview** of your financial health
- Balance, income, and expenses for the current month
- Spending breakdown by category (pie chart)
- Recent transactions with quick search
- Budget alerts when you're over 80%

### 💸 Transactions
- Track income and expenses with categories
- Filter by type (income/expense) and category
- Sort by date, amount, or category
- Visual spending analysis with chart view
- Export to CSV for spreadsheets

### 📈 Budgets
- Set spending limits by category
- Real-time progress tracking with visual progress bars
- Alerts at 80% and 90% thresholds
- Donut chart showing budget allocation
- Flexible billing periods (weekly, monthly, yearly)

### 🔄 Subscriptions
- **100+ service templates** with brand icons (Netflix, Spotify, etc.)
- Treemap visualization sized by cost
- Flexible billing cycles (every N hours/days/weeks/months/years)
- Track active vs. paused subscriptions
- Monthly and yearly cost projections

### ⚙️ Settings
- Custom categories with icons and colors
- Multiple currency support (₹, $, €, £, ¥)
- Date format preferences
- Theme toggle (dark/light/system)
- Full data export/import (JSON)

---

## 🔒 Privacy First

| Feature | Description |
|---------|-------------|
| **Local Storage** | All data stays in your browser |
| **No Account** | Works offline, zero sign-up |
| **No Tracking** | No analytics, no telemetry |
| **Export Anytime** | Full JSON backup/restore |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 |
| Language | TypeScript |
| State | Zustand + localStorage persist |
| Styling | CSS Modules |
| Icons | Lucide React + Iconify (brand icons) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/earnslate.git
cd earnslate/earnslate-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
earnslate/
├── earnslate-app/
│   ├── src/
│   │   ├── app/              # Next.js pages
│   │   │   ├── page.tsx      # Dashboard
│   │   │   ├── transactions/ # Transaction management
│   │   │   ├── budgets/      # Budget tracking
│   │   │   ├── subscriptions/# Subscription management
│   │   │   ├── settings/     # User preferences
│   │   │   └── onboarding/   # First-run setup
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── data/             # Service templates & constants
│   │   ├── store/            # Zustand state management
│   │   └── types/            # TypeScript definitions
│   └── public/               # Static assets
├── TASKS.md                  # Development roadmap
├── AGENTS.md                 # AI agent guidelines
└── README.md
```

---

## 🎨 Customization

### Adding Custom Categories
Navigate to **Settings → Categories** to add your own categories with custom icons and colors.

### Changing Currency
Go to **Settings → Preferences → Currency** to select from INR, USD, EUR, GBP, or JPY.

### Theme
Toggle between dark mode, light mode, or follow system preference in **Settings → Preferences**.

---

## 📋 Roadmap

- [ ] PWA / Offline support
- [ ] Subscription due reminders
- [ ] Recurring transactions
- [ ] Cloud sync (optional)
- [ ] Data visualization improvements
- [ ] Multi-currency tracking

See [TASKS.md](TASKS.md) for detailed development tasks.

---

## 🤝 Contributing

Contributions are welcome! Please read [AGENTS.md](AGENTS.md) for development guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for personal use. See repository for license details.

---

<p align="center">
  Made with ❤️ for personal finance management
</p>
