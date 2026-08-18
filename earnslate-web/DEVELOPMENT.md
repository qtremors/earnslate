# EarnSlate Web Development

This document covers only the web application. Repository-wide rules and the shared data contract are documented in [the root development guide](../DEVELOPMENT.md).

## Setup

```bash
npm install
npm run dev
```

No environment variables or external services are required.

## Structure

```text
src/
├── app/          # Next.js routes and route-specific styles
├── components/   # Forms, navigation, dialogs, charts, and shared controls
├── data/         # Local subscription service catalog
├── hooks/        # Formatting, confirmation, and keyboard behavior
├── store/        # Zustand state, persistence, CRUD, and maintenance
├── types/        # Shared TypeScript models
└── utils/        # CSV and other pure utilities
```

The application uses the Next.js App Router. Interactive pages and persisted state run on the client. `StoreProvider` owns hydration and lifecycle behavior so server rendering does not read browser-only storage.

## Persistence and Maintenance

Zustand persists application state to LocalStorage. Transaction changes update budget state, expired budget periods reset, and overdue subscription billing dates advance when the application lifecycle invokes maintenance.

Backup files follow the repository-wide JSON contract. Partial imports must leave omitted sections unchanged. Treat all imported values as untrusted input.

## Validation

Run both checks before considering a web change complete:

```bash
npm run lint
npm run build
```

Also exercise the affected workflow in a clean browser profile when changing persistence, hydration, onboarding, import, or theme behavior.

## Privacy Requirements

- Do not add accounts, analytics, advertising, or a finance-data backend.
- Do not transmit financial records without an explicit user action.
- Keep export and import behavior compatible with the shared EarnSlate envelope.
- Document every user-visible web change in [CHANGELOG.md](CHANGELOG.md).

Do not change the web version unless explicitly requested.

