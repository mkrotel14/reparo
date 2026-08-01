# Reparo

An Expo React Native test app for a two-role repair marketplace: clients post repair requests and pros take and complete them.

## Stack

| Library | Why it is used |
| --- | --- |
| [Expo](https://expo.dev/) / React Native | Provides a single modern native app codebase and the development-build workflow required by the app’s native modules. |
| [Expo Router](https://docs.expo.dev/router/introduction/) | Supplies file-based routes, native stacks, tabs, sheets, and iOS large-title navigation without custom navigation glue. |
| [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) | Keeps the demo’s sessions, identities, and repair jobs durable on-device, including across logout. |
| [TanStack Query](https://tanstack.com/query/latest) | Owns async job data, caching, mutations, pending states, and invalidation behind feature-level hooks. |
| [FlashList](https://shopify.github.io/flash-list/) | Renders the Jobs and My Jobs feeds efficiently as the local job list grows. |
| [React Native Unistyles](https://www.unistyl.es/) | Centralizes semantic design tokens and keeps shared UI responsive to the system light/dark appearance. |
| [React Native Screens](https://github.com/software-mansion/react-native-screens) and Safe Area Context | Back the native navigation presentation and safe-area handling needed for edge-to-edge iOS layouts. |
| [Jest](https://jestjs.io/) and [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) | Test data rules, navigation guards, and accessible user-visible behavior without requiring a device for every check. |

## Project layout

`src/app` contains routes only. Screen bodies, data access, and custom hooks stay in `src/features`, while the reusable atomic primitives and tokens live in `src/design-system`.

Repair jobs are stored locally in SQLite and seeded once from DummyJSON's read-only todo endpoint. Login creates a stable local UUID identity for each role; logout removes only the active session, so identities and local jobs remain available when signing in as Client or Pro. Replace `src/features/jobs/data/jobs-repository.ts` with the real API implementation when the service is ready; UI screens should continue to call only the hooks in `src/features/jobs/hooks`.

The Profile tab presents a friendly local identity, role-aware live job metrics, informational language and app-version rows, a device-settings handoff, and logout. Language is display-only and changing roles always happens by logging out and selecting a role again.

## Run

Unistyles includes native code, so use a development build rather than Expo Go:

```sh
npx expo prebuild
npx expo run:ios
# or: npx expo run:android
```

Then start Metro with `npm start`. For web, use `npx expo start --web`.

## Checks

```sh
npm test
npx tsc --noEmit
npx expo-doctor
```
