## Goal

Implement RFC 001: a persisted local Client/Pro session that gates navigation and supports switching role or logout without deleting the shared local job database.

## Scope

- Fake login with **Continue as Client** and **Continue as Pro**.
- Stable local UUID identities and persisted session restoration.
- Navigation guard that prevents tabs from rendering before session restoration resolves.
- Profile actions for switching role and logout.
- Role actions clear only the session; local jobs and seed metadata remain intact.

## Phases

- [x] **Phase 1 — Session domain and persistence**
  - Define `Session`, `Role`, stable UUID identities, and repository contracts.
  - Add SQLite migration/storage for the active session.
  - Add restore, select-role, and clear-session operations.

- [x] **Phase 2 — Login and route protection**
  - Build the role-selection screen with two accessible actions.
  - Replace the temporary role context with a restoring session provider.
  - Gate authenticated routes and render a startup/loading state while restoring.

- [x] **Phase 3 — Profile account actions**
  - Display the active local identity and role.
  - Implement Switch role and Log out.
  - Verify these clear only session data, preserving local jobs for the next role.

- [x] **Phase 4 — Tests**
  - Unit-test session repository and hook behavior.
  - Screen-test initial login, restored session, role selection, switching, and logout.
  - Cover the no-session/loading/authenticated route states.

- [x] **Phase 5 — Quality and handoff**
  - Run TypeScript, tests, Expo Doctor, and a platform build/export check.
  - Update README and SDD references with the implemented behavior and any assumptions.

## Acceptance criteria

- First launch shows the role selector.
- Selecting a role creates and persists a local UUID session.
- Relaunch restores the selected role without showing another role's UI.
- Logout and switching return to the selector while preserving local jobs.
- Session state, route guard behavior, and profile actions have tests.

## References

- `.sdd/specs/S-001-login-rbac.md`
- `.sdd/rfcs/001-login-rbac.md`
- `.sdd/constitution.md`
