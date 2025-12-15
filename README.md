# Earnslate - Personal Finance Manager

> A local-first personal finance tracker with god-tier customization.

## Features

### Core
- ✅ **Transactions** - Track income/expenses with custom categories
- ✅ **Budgets** - Set flexible spending limits (weekly/monthly/custom)
- ✅ **Subscriptions** - Manage recurring payments with 55+ service templates

### God-Tier Customization
- ✅ **ServicePicker** - Search 55+ services with brand icons (Netflix, Spotify, etc.)
- ✅ **Treemap View** - Visual bento-box layout sized by cost percentage
- ✅ **Flexible Billing** - Every N hours/days/weeks/months/years
- ✅ **Icon Picker** - 100+ searchable Lucide icons for custom subscriptions
- ✅ **Color Picker** - 12-color palette for personalization
- ✅ **Custom Categories** - 8 built-in, user can add more
- ✅ **Notes Field** - Add memos to subscriptions

### Data
- ✅ **Local Storage** - Data persists in browser localStorage
- ✅ **No Account Required** - Works offline, no sign-up needed

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 |
| Language | TypeScript |
| State | Zustand + localStorage |
| Styling | CSS Modules |
| Icons | Lucide React + react-icons/si |

## Getting Started

```bash
cd earnslate-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

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

## Roadmap

- [ ] Custom icon uploads
- [ ] Toast notifications
- [ ] Data export (CSV/JSON)
- [ ] Category management UI
- [ ] Authentication (Supabase)
- [ ] Cloud sync
