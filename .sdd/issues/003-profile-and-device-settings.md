## Goal

Implement S-003: a Profile tab that reflects the active local identity and activity, offers account actions, and hands off to device settings.

## Phases

- [ ] **Phase 1 — Profile view model**
  - Define role-specific job-summary selectors backed by local job hooks.
  - Define a display-safe representation of the local UUID identity.

- [ ] **Phase 2 — Profile interface**
  - Build role, identity, and activity-summary sections using design-system primitives.
  - Wire Switch role and Log out from the session feature.

- [ ] **Phase 3 — Device settings handoff**
  - Implement accessible `Linking.openSettings()` action.
  - Add user-visible failure feedback if the settings app cannot open.

- [ ] **Phase 4 — Tests and handoff**
  - Test both role variants, live summaries, session actions, and settings success/failure.
  - Verify no theme/language controls appear and update documentation.

## Acceptance criteria

- Profile counts update after local job changes.
- Session actions preserve the shared job database.
- The settings action is accessible and failure-safe.

## References

- `.sdd/specs/S-003-profile-and-device-settings.md`
- `.sdd/rfcs/003-profile-device-settings.md`
