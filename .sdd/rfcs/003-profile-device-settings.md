# RFC 003 — Profile and device settings

**Status:** Proposed
**Owner:** Reparo mobile
**Scope:** Profile tab, account summary, role actions, and device-settings handoff.

## Decision

The Profile tab shows the local demo identity: display name, current role, and a compact activity summary derived from cached jobs. It contains actions for switching role/logging out and an **Open device settings** action.

The settings action uses the platform's settings deep link. If the operating system cannot open it, the app presents a recoverable message rather than failing silently.

## Rationale

The PRD requires a way to change role from within the app. A profile tab provides that stable home without adding an unrelated settings screen. Appearance and language remain OS-owned, so the tab should explain them rather than add controls that compete with the device preference.

## Acceptance criteria

- Profile reflects the restored active role and identity.
- Counts differ sensibly by role: client requests; Pro claimed/done work.
- Switch role and log out follow RFC 001.
- The device settings action is accessible, labeled, and handles an unavailable deep link.

## Non-goals

- Editing a remote profile, avatar upload, notification settings, appearance toggle, and language picker.
