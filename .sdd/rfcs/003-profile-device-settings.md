# RFC 003 — Profile and device settings

**Status:** Proposed
**Owner:** Reparo mobile
**Scope:** Profile tab, account summary, informational settings, logout, and device-settings handoff.

## Decision

The Profile tab is an account home. It shows a friendly local display name and email, the safely shortened local identity, current role, and a compact activity card derived from cached jobs. The card may use a single prominent metric (for example, completed jobs) with role-appropriate supporting counts.

Below the summary, the tab presents a grouped settings list: profile information, an informational language row, app version, device settings, and **Log out**. Language is display-only for this take-home; it is not an in-app picker. The sole way to change between Client and Pro is to log out and choose a role from the login selector.

The settings action uses the platform's settings deep link. If the operating system cannot open it, the app presents a recoverable message rather than failing silently.

## Rationale

The role selector is the intentional boundary between Client and Pro. Logging out returns to that selector without deleting local data. A profile tab provides a stable account home without adding an unrelated settings screen. Appearance and language remain OS-owned; the language row can state the current supported language but must not introduce a competing preference.

## Acceptance criteria

- Profile reflects the restored active role and identity with a friendly local presentation.
- The activity card updates after local job changes and differs sensibly by role: Client requests; Pro claimed/done work.
- The settings list includes informational language and app-version rows, an accessible device-settings action, and Log out.
- Log out returns to role selection as defined by RFC 001; no Switch role action is rendered.
- The device settings action is accessible, labeled, and handles an unavailable deep link.

## Non-goals

- Editing a remote profile, avatar upload, notification settings, appearance toggle, language picker, and in-profile role switcher.
