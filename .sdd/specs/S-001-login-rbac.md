# S-001 — Persisted local login and RBAC

**RFC:** [001 — Login and RBAC](../rfcs/001-login-rbac.md)
**Status:** Implemented

## User outcome

A first-time user chooses Client or Pro. On later launches, the app restores that role before showing authenticated navigation. Either role can log out or switch roles without losing local jobs.

## Data and state

- Persist one `session` record: `identityId` (UUID), `role`, `dummyJsonUserId` for Client seed mapping, and `createdAt`.
- `restoreSession()` resolves before the root navigation chooses public or authenticated routes.
- `selectRole(role)` creates/reuses a stable local role identity; `clearSession()` removes only the session record.
- The session repository is the only storage access point; screens consume `useSession`.

## User flows

1. No session → role selector → select Client/Pro → authenticated tabs.
2. Stored session → startup state → authenticated tabs for its role.
3. Profile → Switch role/Log out → role selector; jobs remain unchanged.

## Acceptance criteria

- Public and authenticated routes cannot render concurrently.
- The active role is restored after restarting the app.
- UUID identity, not DummyJSON's numeric ID, governs permissions.
- Clearing a session never clears local job rows.

## Test plan

- Provider tests for restore, role selection, and clear-session behavior.
- Screen tests for both role actions, identity presentation, switching, and logout.
- Route-layout tests for loading, unauthenticated, and authenticated guard states.
