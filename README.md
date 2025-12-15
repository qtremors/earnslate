# 💰 Earnslate

> **Personal Finance Manager** - Track your income, expenses, budgets, and subscriptions with a premium monochrome interface.

A modern, privacy-focused personal finance application built with Next.js. Manage your financial life with an elegant dark UI featuring clean typography and intuitive navigation.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

---

## ✨ Features

### 📊 Dashboard
- Financial overview at a glance
- Income vs. expenses summary
- Recent transactions
- Budget status indicators

### 💸 Transactions
- Track income and expenses
- Category-based organization
- Date filtering and search
- Quick add functionality

### 📋 Budgets
- Category-based budgets
- Visual progress tracking
- Monthly reset cycles
- Overspending alerts

### 🔄 Subscriptions
- Recurring payment tracker
- Monthly cost overview
- Renewal date reminders
- Service categorization

### ⚙️ Settings
- Profile management
- Currency preferences
- Theme options
- Data export

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Framework** | Next.js 16 |
| **Language** | TypeScript 5 |
| **Styling** | CSS Modules |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/qtremors/earnslate.git
cd earnslate/earnslate-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📂 Project Structure

```
earnslate/
├── earnslate-app/          # Next.js application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── transactions/         # Transactions page
│   │   │   ├── budgets/              # Budgets page
│   │   │   ├── subscriptions/        # Subscriptions page
│   │   │   ├── settings/             # Settings page
│   │   │   └── onboarding/           # First-time setup
│   │   └── components/     # Reusable UI components
│   └── public/             # Static assets
│
├── README.md               # This file
├── CHANGELOG.md            # Version history
├── AGENTS.md               # AI assistant guidelines
└── TASKS.md                # Development roadmap
```

---

## 📝 Documentation

| Document | Description |
|----------|-------------|
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [AGENTS.md](AGENTS.md) | AI assistant guidelines |
| [TASKS.md](TASKS.md) | Development roadmap |

---

## 🎨 Design Theme

**Monochrome with Inverted Accents**
- Dark backgrounds (`#0a0a0a` → `#1a1a1a`)
- White/light accent elements for emphasis
- High contrast for readability
- Clean, minimal aesthetic

---

<p align="center">
  Made with 💖 by <a href="https://github.com/qtremors">Tremors</a>
</p>
