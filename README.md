# Earnslate - Personal Finance Manager

> A local-first personal finance tracker with god-tier customization.

## ✨ Features

### Core Modules
- **Transactions** - Search, filter by type/category, pie chart view, CSV export
- **Budgets** - Progress bars, donut chart, alert badges at 80%/90%
- **Subscriptions** - 100+ service templates with brand icons, treemap view
- **Dashboard** - Spending chart, budget alerts, 3-column layout
- **Settings** - Category manager, data export/import, theme toggle

### God-Tier Customization
- **ServicePicker** - Search 100+ services with brand icons (Netflix, Spotify, etc.)
- **Treemap View** - Visual bento-box layout sized by cost percentage
- **Flexible Billing** - Every N hours/days/weeks/months/years
- **Icon Picker** - 100+ searchable Lucide icons for custom subscriptions
- **Color Picker** - 12-color palette for personalization
- **Custom Categories** - 8 built-in, user can add more
- **Dark/Light Theme** - Toggle between dark, light, or system preference

### Data & Privacy
- **Local Storage** - Data persists in browser localStorage
- **No Account Required** - Works offline, no sign-up needed
- **Export/Import** - Backup and restore your data as JSON

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 |
| Language | TypeScript |
| State | Zustand + localStorage |
| Styling | CSS Modules |
| Icons | Lucide React + Iconify |

## 🚀 Getting Started

```bash
cd earnslate-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
earnslate-app/
├── src/
│   ├── app/          # Pages (dashboard, transactions, budgets, etc.)
│   ├── components/   # Reusable UI components
│   ├── data/         # Service templates & constants
│   ├── store/        # Zustand store
│   └── types/        # TypeScript definitions
└── public/           # Static assets
```

## 📋 Roadmap

- [x] Toast notifications
- [x] Data export (CSV/JSON)
- [x] Category management UI
- [x] Dark/Light theme toggle
- [ ] PWA/offline support
- [ ] Subscription reminders
- [ ] Recurring transactions
- [ ] Cloud sync (optional)

## 📄 License

MIT
