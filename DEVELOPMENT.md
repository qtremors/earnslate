# Earnslate - Developer Documentation

> Comprehensive documentation for developers working on Earnslate.

**Version:** 1.0.0 | **Last Updated:** 2026-01-12

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Architecture Overview

Earnslate follows a **Client-Side SPA (Single Page Application)** architecture built with Next.js App Router, using local storage for persistence.

```
┌──────────────────────────────────────────────────────────────┐
│                         Next.js UI                            │
│           React Components, Pages, Layouts                    │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                      Zustand Store                            │
│           State Management, Actions, Persistence              │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    Browser LocalStorage                       │
│           Data Persistence (No Backend/DB)                    │
└──────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Zustand** | Lightweight, easy to use, and works seamlessly with local storage persistence. |
| **No Backend** | Ensures complete user privacy and offline functionality ("Local First"). |
| **CSS Modules** | Scoped styling to avoid conflict and maintain a clean separation of concerns without Tailwind overhead. |
| **Iconify** | Dynamic loading of icons to keep initial bundle size small despite supporting 100+ brand icons. |

---

## Project Structure

```
earnslate/
├── earnslate-app/            # Main Application
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # Zustand store definitions
│   │   ├── types/            # TypeScript type definitions
│   │   └── data/             # Static data (templates)
│   └── public/               # Static assets
├── README.md                 # User-facing documentation
├── DEVELOPMENT.md            # This file
├── CHANGELOG.md              # Version history
├── LICENSE.md                # License terms
└── TASKS.md                  # Roadmap and tasks
```

---

## Configuration

The application is designed to run with minimal configuration.

### Environment Variables

Currently, Earnslate does not require any environment variables as it is a purely client-side application.

---

## Testing

### Running Tests

```bash
# Start development server for manual testing
npm run dev

# Note: Automated test suite is currently planned (see TASKS.md)
```

---

## Deployment

### Vercel Deployment

1. Push code to GitHub.
2. Import repository in Vercel.
3. Select `Next.js` framework preset.
4. Deploy.

```bash
# Build command
npm run build

# Start command
npm start
```

### Production Checklist

- [ ] Verify `next.config.ts` matches production requirements.
- [ ] Ensure all local storage references handle SSR (Server Side Rendering) safely (checked via `useEffect`).

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Hydration Error** | Ensure components using `window` or `localStorage` are wrapped in `useEffect` or use the `StoreProvider`. |
| **Icons not loading** | Check internet connection (Iconify fetches on demand) or verify icon name format. |

### Debug Mode

Check the browser console for Zustand state updates if logger middleware is enabled.

---

## Contributing

### Code Style

- **TypeScript**: Strict mode enabled. Define interfaces for all props and state.
- **Styling**: Use CSS Variables defined in `globals.css` for colors and spacing.
- **Components**: PascalCase filenames. One component per file.

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run manual verification (`npm run dev`)
5. Commit with clear messages
6. Push and create a Pull Request

---

<p align="center">
  <a href="README.md">← Back to README</a>
</p>
