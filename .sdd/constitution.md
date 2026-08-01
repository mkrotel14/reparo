# Reparo product constitution

## Product slice

Reparo is one mobile app with two locally selected roles:

- **Client** posts repair jobs and tracks only jobs they created.
- **Pro** sees open jobs, claims jobs, and completes only jobs assigned to them.

The job state machine is `open → claimed → done`. Invalid transitions are not offered by the UI and must be rejected by the domain layer.

## Constraints

- Expo managed workflow and TypeScript.
- DummyJSON is a one-time example-data seed. Its todo data is adapted into the app's job model on first database initialization.
- SQLite is the local source of truth for jobs, assignments, status transitions, and the fake session. DummyJSON mutations are not used because they do not persist.
- Role selection persists across app restarts. It is fake authentication, not authorization security.
- Device color scheme is the only source of theme. The app is English-only for this take-home and has no in-app appearance or language selector.
- Settings opens the device settings app; it does not recreate operating-system settings in-app.

## Engineering principles

- Route files are navigation-only. Feature screens, hooks, data adapters, and tests are colocated under `src/features`.
- Screens do not call HTTP or SQLite directly. Feature hooks own query keys, mutations, cache updates, and view-model shaping; repositories own persistence and seeding.
- Use explicit loading, empty, error, and mutation-pending states.
- Enforce RBAC in the domain/data layer as well as the rendered controls.
- Reusable UI belongs in `src/design-system`; feature-private UI remains beside the feature.

## Acceptance bar

- Changes made through any mutation appear immediately without restarting the app.
- A Pro cannot claim non-open work or complete another Pro's work.
- A Client cannot see jobs belonging to another Client in their home feed.
- Unit tests cover feature hooks and representative screen states.
