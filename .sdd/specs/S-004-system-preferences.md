# S-004 — System-owned appearance and English copy

**RFC:** [004 — Platform theme and language](../rfcs/004-platform-preferences.md)
**Status:** Ready

## User outcome

Reparo follows the phone’s light/dark appearance without an in-app override. The take-home ships English-only copy and does not introduce localization state.

## Requirements

- Configure Unistyles light and dark themes with matching semantic tokens.
- Use adaptive system theme selection; no stored color-scheme preference.
- Ensure app background, cards, text, controls, status chips, navigation, and loading/error states use semantic tokens.
- Keep all current copy in English; do not install an i18n library or render a language selector.

## Acceptance criteria

- System appearance changes update the rendered theme.
- Both themes meet readable contrast for text and interactive states.
- The Profile tab explains device-owned preferences without toggles.
- No session or database schema field stores language or appearance.

## Test plan

- Render representative design-system/feature screens against each theme.
- Assert semantic content and accessibility labels; do not snapshot raw style implementation details.
