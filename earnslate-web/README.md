# EarnSlate Web

The web edition of EarnSlate is a private, browser-based finance and subscription tracker. It is a separate application from EarnSlate Android and stores its data in the current browser profile.

## Features

- Dashboard summaries, spending breakdowns, recent transactions, and budget alerts
- Transaction, budget, and subscription management
- Search, filters, sorting, pagination, charts, and CSV reports
- More than 100 subscription service templates
- Custom categories, themes, currencies, locales, and date formats
- Explicit JSON backup and restore

## Run Locally

Requirements:

- Node.js 20 or newer
- npm

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validate

```bash
npm run lint
npm run build
```

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Zustand
- CSS Modules
- Browser LocalStorage

No environment file or backend service is required.

## Data Model

Financial records remain in LocalStorage until the user explicitly exports them. JSON backups use the shared EarnSlate envelope: `version`, `exportDate`, `settings`, `transactions`, `budgets`, and `subscriptions`.

The native Android app can read this shared format, but the two applications never connect or synchronize at runtime.

## Documentation

- [Development guide](DEVELOPMENT.md)
- [Web plan](PLAN.md)
- [Web tasks](TASKS.md)
- [Web changelog](CHANGELOG.md)
- [Shared documentation](../README.md)
- [Privacy policy](../PRIVACY.md)
- [License](../LICENSE.md)

