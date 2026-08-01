# RFC 002 — Home and repair jobs

**Status:** Proposed
**Owner:** Reparo mobile
**Scope:** Role-controlled job feeds, details, creation, claim, completion, and DummyJSON adaptation.

## Decision

Home is one route whose feature screen is selected by the active role:

- **Client home:** list only jobs created by the active client, create a job, and open a job detail view.
- **Pro home:** list only `open` jobs, claim a job, and open a claimed job detail view to mark it done.

On first database initialization, the seed source is `GET https://dummyjson.com/todos?limit=0`. The adapter maps `id` to `jobId`, `todo` to the initial title, and `completed` to a starting status before inserting the job into SQLite. The app owns the remaining repair-domain information: description, a UUID client identity, pro assignment, and the intermediate `claimed` state. A fixed `dummyJsonUserId: 1` identifies which remote rows seed the demo Client's feed; it is an adapter concern only.

## State model

| Domain status | Eligible action | Result |
| --- | --- | --- |
| `open` | Active Pro claims | `claimed`, assigned to that Pro |
| `claimed` | Assigned Pro completes | `done` |
| `done` | None | terminal |

Initial DummyJSON rows should be deterministic: `completed: false` becomes `open`; `completed: true` becomes `done`. No remote todo is initially claimed.

## Persistence and consistency

SQLite is the source of truth. The initial seed is imported exactly once and stored in a local `jobs` table. A small `app_metadata` table records the seed version, so a future development-only reset can deliberately clear and re-import fixtures without overwriting normal use.

Logout clears only session data. Jobs, assignments, and seed metadata remain intact so the other role can sign in on the same device; the local database deliberately simulates the shared backend that would coordinate the Client and Pro in production.

Create, claim, and complete run as local database transactions. TanStack Query reads through the repository and updates/invalidate its cache after each transaction, so every screen reflects the change without a restart. DummyJSON `POST` and `PUT` endpoints are deliberately not called: their non-persistent responses would make the app less consistent.

The first implementation keeps raw SQL and migrations behind `jobsRepository`; no ORM is needed for this small, well-bounded schema. A future backend can replace the repository implementation while preserving the hooks and screen contracts.

## Screen states

Each list and detail view represents loading, refreshing, empty, error/retry, and pending-action states. Mutation controls are disabled while their specific job is pending.

## Non-goals

- Payments, proximity sorting, job search, upload/photos, multi-Pro collaboration, and a real backend assignment model.

## Acceptance criteria

- Client home never shows another client's jobs.
- Pro home never shows claimed or done jobs.
- A Client-created job appears open immediately.
- Claiming removes a job from the Pro feed and adds it to that Pro's work.
- Only the claiming Pro can complete the job; completing is reflected immediately.
- Detail shows status and the assigned Pro where applicable.

## Open questions for the spec

1. What display name should represent the fake Pro assignee in details?
