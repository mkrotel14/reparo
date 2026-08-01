## Goal

Implement S-004: system-owned light/dark appearance with English-only copy for the take-home.

## Phases

- [ ] **Phase 1 — Theme foundation**
  - Verify adaptive Unistyles setup and complete semantic light/dark tokens.
  - Apply tokens to navigation and shared design-system primitives.

- [ ] **Phase 2 — Feature integration**
  - Replace feature-level hard-coded colors with semantic tokens.
  - Cover status, loading, empty, error, and interactive states in both themes.

- [ ] **Phase 3 — Preference boundaries**
  - Remove or avoid in-app theme/language selectors and persisted preference state.
  - Keep all take-home copy English-only.

- [ ] **Phase 4 — Tests and handoff**
  - Test representative screens in light and dark system schemes.
  - Verify contrast/accessibility and document the deliberate English-only scope.

## Acceptance criteria

- The app follows the device appearance automatically.
- No app preference can override appearance or language.
- Shared and feature UI remain legible in both themes.

## References

- `.sdd/specs/S-004-system-preferences.md`
- `.sdd/rfcs/004-platform-preferences.md`
