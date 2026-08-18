# EarnSlate Web Tasks

This file tracks web-only work. Shared and cross-platform work belongs in the repository-root [TASKS.md](../TASKS.md).

## Data Integrity

- [ ] Report LocalStorage quota and persistence failures instead of failing silently.
- [ ] Validate every imported record, enum, date, amount, identifier, string, and color before changing state.
- [ ] Add explicit backup schema-version handling.
- [ ] Reassign or clearly preserve references when a custom category is deleted.
- [ ] Provide a safe fallback when `crypto.randomUUID()` is unavailable.

## Accessibility

- [ ] Trap and restore focus in dialogs.
- [ ] Announce toast messages and form validation errors.
- [ ] Add a skip-to-content link and accessible names to icon-only controls.
- [ ] Support keyboard navigation in the custom date picker.
- [ ] Verify contrast and non-color status cues.

## Architecture and Performance

- [ ] Consolidate duplicated chart implementations.
- [ ] Add route-level error boundaries.
- [ ] Move lifecycle side effects out of the store module.
- [ ] Standardize the icon system and avoid whole-library Lucide imports.
- [ ] Memoize expensive dashboard and list calculations.
- [ ] Evaluate virtualization for large transaction datasets.
- [ ] Extract shared form-validation behavior and constants.

## Quality

- [ ] Add automated tests for store actions, maintenance, import, CSV, and formatters.
- [ ] Test hydration, onboarding, backup restore, and large datasets in supported browsers.
- [ ] Keep [CHANGELOG.md](CHANGELOG.md) current for user-visible changes.

