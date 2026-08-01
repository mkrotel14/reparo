## Goal

Implement S-003: a Profile tab that feels like an account home, reflects the active local identity and activity, provides informational settings and logout, and hands off to device settings.

## Phases

- [x] **Phase 1 — Profile data and summary**
  - Define the friendly local display name/email and display-safe local identity representation.
  - Define role-specific job-summary selectors backed by local job hooks.
  - Choose the prominent activity-card metric and supporting counts for each role.

- [x] **Phase 2 — Profile interface and account settings**
  - Build the identity header and live activity card using design-system primitives.
  - Build grouped, accessible rows for profile information, informational Language, and app version.
  - Wire Log out from the session feature. Do not render Switch role; changing role requires logout and choosing a role again.

- [x] **Phase 3 — Device settings handoff**
  - Implement accessible `Linking.openSettings()` action.
  - Add user-visible failure feedback if the settings app cannot open.

- [x] **Phase 4 — Tests and handoff**
  - Test both role variants, the identity header, live summaries, settings rows, logout, and settings success/failure.
  - Verify Language and app version are informational only, no Switch role action appears, and update documentation.

## Acceptance criteria

- Profile metrics update after local job changes.
- Logout preserves the shared job database and returns to the role selector.
- Language and app version are informational, not editable preferences.
- The settings action is accessible and failure-safe.

## References

- `.sdd/specs/S-003-profile-and-device-settings.md`
- `.sdd/rfcs/003-profile-device-settings.md`
