## Goal

Implement S-002: a SQLite-backed repair-job workflow seeded once from DummyJSON, shared across locally selected Client and Pro sessions.

## Phases

- [ ] **Phase 1 — Database and seed foundation**
  - Install and initialize `expo-sqlite` with a migration for `jobs` and `app_metadata`.
  - Implement one-time DummyJSON todo import and retryable initial-seed failure state.
  - Keep all storage behind feature repositories.

- [ ] **Phase 2 — Job domain and query hooks**
  - Define job model, status transition guards, and authorization checks.
  - Implement repository methods for list, detail, create, claim, and complete.
  - Replace in-memory data with TanStack Query hooks backed by SQLite.

- [ ] **Phase 3 — Client workflow**
  - Build Client home: owned-job list, empty/loading/error states, and create form for title/description.
  - Add Client job detail with status and Pro assignment.

- [ ] **Phase 4 — Pro workflow**
  - Build open-job feed, claim flow, assigned-job detail, and completion flow.
  - Disable/reject invalid claim and complete operations.

- [ ] **Phase 5 — Tests and handoff**
  - Test migrations, seed behavior, repository transitions, hooks, and role-specific screens.
  - Verify persistence across logout/role switch and refresh README/SDD documentation.

## Acceptance criteria

- Jobs persist locally across app restarts, logout, and role switching.
- Client-created jobs are available for the Pro to claim.
- The app never relies on non-persistent DummyJSON mutation responses.
- Loading, empty, error, and pending states are covered.

## References

- `.sdd/specs/S-002-local-jobs-and-dummyjson-seed.md`
- `.sdd/rfcs/002-home-repair-jobs.md`
