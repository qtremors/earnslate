# Earnslate - Agent Guidelines

## Critical Rules
1. Use TypeScript strict mode
2. CSS Modules for all styling (no Tailwind)
3. Lucide icons for generic, react-icons/si for brand logos
4. Zustand for state (with localStorage persistence)

## Package Management
- `npm` only (not yarn/pnpm)
- Install from `earnslate-app/` directory

## Naming Conventions
- Components: PascalCase (`Button.tsx`)
- Styles: PascalCase.module.css (`Button.module.css`)
- Utilities: camelCase (`formatCurrency.ts`)

## Design System
- Monochrome with inverted accents
- See `globals.css` for CSS variables
- Use design tokens, not hardcoded values

## Project Structure
```
earnslate-app/
├── src/
│   ├── app/          # Next.js pages
│   ├── components/   # Reusable components
│   ├── data/         # Constants & templates
│   ├── store/        # Zustand store
│   └── types/        # TypeScript types
```

## Key Files
- `src/store/index.ts` - State management
- `src/types/index.ts` - Type definitions
- `src/data/services.ts` - Service templates

## Testing
```bash
cd earnslate-app
npm run dev
# Open http://localhost:3000
```

## Commit Format
```
type: description

- detail 1
- detail 2
```
Types: feat, fix, docs, style, refactor
