# RFC 004 — Platform theme and language

**Status:** Proposed
**Owner:** Reparo mobile
**Scope:** System-driven light/dark mode and language boundaries.

## Decision

Reparo follows the device color scheme through Unistyles adaptive themes. It is English-only for this take-home. Neither preference is stored, rendered as a toggle, or overridden by app state.

## Rationale

The user explicitly chose phone-owned appearance. Treating the OS as the source of truth avoids conflicting settings and keeps accessibility expectations intact. Localization is deliberately out of scope because it is not required by the PRD.

## Acceptance criteria

- Changing the device theme updates Reparo without an app preference action.
- The UI has no in-app theme or language switch.
- All current copy is English and centralizes no localization state.

## Non-goals

- Localization, per-account language settings, runtime language selection, and custom color themes.
