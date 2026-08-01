# S-002 — Local repair jobs and DummyJSON seed

**RFC:** [002 — Home and repair jobs](../rfcs/002-home-repair-jobs.md)
**Status:** Ready
**Depends on:** S-001

## User outcome

Clients create and track their own repair jobs. Pros see open jobs, claim one, and complete only work assigned to them. Every action remains visible after logout, a subsequent sign-in with either role, and app restart.

## Persistence model

- `jobs`: `id`, optional `sourceTodoId`, `clientId`, optional `proId`, `title`, `description`, `status`, `createdAt`, `updatedAt`.
- `app_metadata`: schema/seed version and `seedCompletedAt`.
- A migration creates both tables. First boot seeds data with `GET /todos?limit=0`; only rows with `userId: 1` are attributed to the demo Client.
- A failed initial seed renders a retryable error state; successful local writes never depend on DummyJSON mutation endpoints.

## Domain rules

- `open → claimed` only when the active Pro claims it.
- `claimed → done` only when the active Pro is the job's `proId`.
- Client lists filter by `clientId`; Pro availability filters `status = open`.
- Create writes the active Client UUID as `clientId` and returns an `open` job.

## UI states

- Client: loading, empty, populated, create pending, create error, job detail.
- Pro: loading, empty, populated, claim pending/error, assigned detail, complete pending/error.
- Lists use FlashList; mutations update TanStack Query immediately after a successful local transaction.

## Acceptance criteria

- Client-created work is visible to the Pro after Client logout and Pro login.
- A claimed/done job cannot be claimed again.
- A Pro cannot complete another Pro's job.
- Job details show title, description, status, and assigned Pro when applicable.
- Seed runs once per local database version and never overwrites user-created work.

## Test plan

- Migration/seed/repository transition tests.
- Query-hook tests for filters and cache refresh.
- Client and Pro screen tests for loading, empty, error, and permitted/forbidden actions.
