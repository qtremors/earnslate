# Earnslate

A personal finance manager with a premium monochrome design.

## Features

- **Dashboard** - Overview of balance, income, expenses
- **Transactions** - Track income and expenses with categories
- **Budgets** - Set spending limits and monitor progress
- **Subscriptions** - Manage recurring payments with brand icons
- **Settings** - Customize currency, name, preferences

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **State**: Zustand with localStorage persistence
- **Styling**: CSS Modules + CSS Variables
- **Icons**: Lucide React + React Icons (brand logos)
- **Font**: Inter

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
│   ├── app/           # Pages (dashboard, transactions, budgets, etc.)
│   ├── components/    # Reusable UI components
│   ├── store/         # Zustand store with persistence
│   └── types/         # TypeScript interfaces
```

## Design Theme

- **Colors**: Monochrome with inverted (white) accents
- **Background**: #0a0a0a → #1a1a1a gradient
- **Text**: White primary, gray secondary
- **Accents**: White borders, hover states
