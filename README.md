# Reparo

An Expo React Native test app for a two-role repair marketplace: clients post repair requests and pros take and complete them.

## Stack

- Expo SDK 57 / React Native 0.86 with the New Architecture
- Expo Router tabs and stack navigation
- TanStack Query with feature-owned data hooks
- FlashList for job feeds
- React Native Unistyles 3 with adaptive light and dark design tokens
- Jest, Expo, and React Native Testing Library

## Project layout

`src/app` contains routes only. Screen bodies, data access, and custom hooks stay in `src/features`, while the reusable atomic primitives and tokens live in `src/design-system`.

The current job repository is local seeded data so both RBAC flows work without a backend. Replace `src/features/jobs/data/jobs-repository.ts` with the real API implementation when the service is ready; UI screens should continue to call only the hooks in `src/features/jobs/hooks`.

## Run

Unistyles includes native code, so use a development build rather than Expo Go:

```sh
npx expo prebuild
npx expo run:ios
# or: npx expo run:android
```

Then start Metro with `npm start`. For web, use `npm run web`.

## Checks

```sh
npm test
npx tsc --noEmit
npx expo-doctor
```
