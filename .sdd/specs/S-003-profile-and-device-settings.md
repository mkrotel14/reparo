# S-003 — Profile and device settings handoff

**RFC:** [003 — Profile and device settings](../rfcs/003-profile-device-settings.md)
**Status:** Ready
**Depends on:** S-001, S-002

## User outcome

The Profile tab feels like an account home: it identifies the demo account, shows a small live activity summary, presents useful account/settings information, provides logout, and lets the user open the operating system’s settings app.

## Requirements

- Show a friendly local display name and email, the role, and a stable local UUID in a safely shortened display form. These display fields are local demo presentation data, not remote profile records.
- Show a prominent activity metric card plus role-appropriate supporting counts: Client posted/open/claimed/done requests; Pro claimed/done work.
- Render grouped, accessible settings rows for profile information, Language (informational only), app version, and device settings.
- Reuse the S-001 logout action. Do not render Switch role: role changes happen only after logout through the login selector.
- Use `Linking.openSettings()` for an accessible **Open device settings** action.
- If `openSettings()` rejects, show a non-blocking error message with no crash.

## Acceptance criteria

- Counts and the prominent metric react to local job mutations.
- The profile header and identity display remain stable for the active local session.
- Language and app-version rows are informational; neither changes app preferences.
- Logout preserves job records and returns to the role selector; no role switch action appears.
- Device settings action has an accessible label and failure feedback.

## Test plan

- Profile rendering for both roles, the identity header, settings rows, and representative metrics/counts.
- Logout integration test and an assertion that no Switch role action is rendered.
- Mocked settings-link success and failure tests.
