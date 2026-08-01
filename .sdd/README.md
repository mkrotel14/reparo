# Reparo SDD

This is a lightweight, repository-local specification-driven development workflow. It is intentionally independent of Spec Kit and of a specific AI tool.

## Lifecycle

1. Capture an outcome and constraints in an RFC.
2. Turn an accepted RFC into a single feature spec in `specs/`.
3. Break that spec into independently verifiable work in `tasks/`.
4. Link implementation pull requests and tests back to the task and spec.

RFCs explain **why** and set boundaries. Specs define **what must be true**. Tasks define **how work is sequenced**. Do not begin a task until its spec's open questions are resolved.

## Conventions

- Use zero-padded identifiers: `001-login-rbac`, `S-001-role-selection`, `T-001-persist-role`.
- Preserve non-goals and acceptance criteria; they prevent scope creep in a take-home-sized app.
- Record assumptions explicitly when DummyJSON differs from the domain.
- Keep RFCs stable after acceptance; refine implementation details in the spec instead.

## Current RFCs

- [001 — Login and RBAC](rfcs/001-login-rbac.md)
- [002 — Home and repair jobs](rfcs/002-home-repair-jobs.md)
- [003 — Profile and device settings](rfcs/003-profile-device-settings.md)
- [004 — Platform preferences](rfcs/004-platform-preferences.md)

## Ready specifications

- [S-001 — Persisted local login and RBAC](specs/S-001-login-rbac.md)
- [S-002 — Local repair jobs and DummyJSON seed](specs/S-002-local-jobs-and-dummyjson-seed.md)
- [S-003 — Profile and device settings handoff](specs/S-003-profile-and-device-settings.md)
- [S-004 — System-owned appearance and English copy](specs/S-004-system-preferences.md)
