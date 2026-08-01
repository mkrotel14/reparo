# RFC 001 — Login and RBAC selection

**Status:** Proposed
**Owner:** Reparo mobile
**Scope:** Login, persisted identity, role switching, and role guards.

## Decision

The launch route is a fake-login screen with two equally visible actions: **Continue as Client** and **Continue as Pro**. Selecting a role creates a local session containing a stable UUID identity. The session is persisted in the local SQLite database and restored before the authenticated tabs render.

Profile exposes **Switch role** and **Log out**. Switching returns to the selector after clearing the current session; logging out does the same. Neither action clears the shared local job database, so a Client can post work, log out, and a Pro can later sign in on the same device to claim it. There are no credentials, remote tokens, or claims in this take-home slice.

## Rationale

The PRD needs a shared app whose behavior changes by user type. A selector demonstrates the role boundary without introducing an authentication backend the brief explicitly does not require.

## Rules

- Client identity is a locally generated UUID. It is paired with `dummyJsonUserId: 1` only to load deterministic seed todos; the numeric DummyJSON value is never used for Reparo authorization.
- Pro identity is also a local UUID because DummyJSON todos have no assignee.
- Restoring a session must not briefly expose the other role's UI.
- Navigation is gated by session presence, not merely hidden controls.
- Every job action receives the active identity and validates permission before mutation.

## Non-goals

- Real authentication, account creation, multi-user switching, token refresh, and server-side authorization.

## Acceptance criteria

- A first launch presents both role actions.
- Relaunch restores the selected role.
- Switching and logging out return to the selector and update the available routes.
- Tests cover session restoration and role-gated action availability.

## Open questions for the spec

None.
