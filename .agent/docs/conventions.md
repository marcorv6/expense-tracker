# SpendFlow Coding Conventions

## Coding & Framework Guidelines

### 1. React 19 / Next.js Compiler Rules
- **Pure Effect Hooks**: Do NOT call `setState()` directly inside `useEffect()` to reset forms or synchronize local state (`react-hooks/set-state-in-effect`). Perform state resets in event handlers or wrap calculations in `useMemo`.
- **Pure Rendering**: Avoid calling impure functions (like `Date.now()`) directly inside component render bodies. Wrap them in `useMemo` or compute in event handlers.

### 2. Component Design & Styling
- Use Tailwind CSS utility classes exclusively.
- Use explicit interactive feedback (`cursor-pointer`, `hover:scale-105`, `transition-all`).
- Render custom UI controls (e.g. `DatePicker.tsx`) over native browser form controls for consistent cross-browser look & feel.

### 3. Internationalization & Formatting
- Always use `usePreferences()` from `@/context/PreferencesContext` to access translation dictionaries `t` and formatting helper `formatCurrency`.
- Maintain translations parity across both English (`en`) and Spanish (`es`) in `lib/i18n/translations.ts`.
