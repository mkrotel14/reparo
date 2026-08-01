# S-003 — Profile and device settings handoff

**RFC:** [003 — Profile and device settings](../rfcs/003-profile-device-settings.md)
**Status:** Ready
**Depends on:** S-001, S-002

## User outcome

The Profile tab clearly identifies the demo account, summarizes relevant activity, provides role/session actions, and lets the user open the operating system’s settings app.

## Requirements

- Show role, local display name, and stable local UUID (or a safely shortened display form).
- Client summary: posted/open/claimed/done counts for owned jobs.
- Pro summary: claimed/done counts for assigned jobs.
- Reuse the S-001 switch-role/logout actions.
- Use `Linking.openSettings()` for an accessible **Open device settings** action.
- If `openSettings()` rejects, show a non-blocking error message with no crash.

## Acceptance criteria

- Counts react to local job mutations.
- Session actions preserve job records.
- Device settings action has an accessible label and failure feedback.
- No appearance or language controls are rendered.

## Test plan

- Profile rendering for both roles and representative counts.
- Session-action integration tests.
- Mocked settings-link success and failure tests.
