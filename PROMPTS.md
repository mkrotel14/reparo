# Product-to-delivery prompts

These prompts are reusable starting points for turning a mobile product brief into a documented, issue-driven implementation plan. Replace bracketed text with the product-specific details.

## 1. Product brief intake

```text
Read the attached product brief for [app name]. Do not implement the app yet.

Create an SDD-style documentation area in `.sdd` that is lightweight and repository-native (not spec-kit). Capture:
- the product goal and constraints;
- roles, permissions, and core user flows;
- local-versus-remote data assumptions;
- platform, navigation, testing, and design-system decisions;
- unresolved questions and explicit non-goals.

Use concise Markdown. If a decision materially affects scope, ask a focused question before assuming it.
```

## 2. RFC decomposition

```text
Using the product brief and `.sdd/constitution.md`, propose a small set of independently deliverable RFCs.

For each RFC, write a document under `.sdd/rfcs` containing:
- decision and rationale;
- in-scope behavior;
- role/permission rules;
- data ownership and persistence rules;
- acceptance criteria;
- non-goals and open questions.

Keep each RFC focused on one user-facing module. Do not create implementation tasks yet.
```

## 3. Implementation specification

```text
Turn RFC [number] into a buildable specification under `.sdd/specs`.

Specify the user outcome, state model, route behavior, feature boundaries, persistence/API contracts, accessibility requirements, and test plan. Prefer feature-owned hooks for data access and keep route files thin.

Call out platform-specific behavior separately from product behavior. Avoid prescribing implementation details that are not needed to satisfy acceptance criteria.
```

## 4. GitHub issue with phases

```text
Create one GitHub issue for specification [number]. Use a single issue body with phases represented as checkboxes, each phase containing concrete subtasks and verification criteria.

Phases should be small enough to develop and review independently, for example:
1. data/domain foundation;
2. primary UI and navigation;
3. secondary workflow or profile actions;
4. automated tests;
5. quality, documentation, and handoff.

Assign the issue to [owner], add the appropriate label, and add it to [project board] with an accurate status. Mirror the task outline under `.sdd/issues`.
```

## 5. Expo feature implementation

```text
Implement GitHub issue #[number] in an Expo React Native app.

Use Expo Router with route files limited to route composition; keep screens, hooks, repositories, and components inside feature folders. Use the existing design system and device-driven light/dark theme. For remote data, add feature-owned TanStack Query hooks. For local shared demo data, use the established persistence adapter.

Create a feature branch from main and a small branch per phase. For every phase: run the relevant tests and typecheck, open a PR into the feature branch, wait for GitHub checks, obtain an independent React Native review, and merge only when green. Preserve unrelated workspace changes.
```

## 6. Specification reconciliation

```text
The product behavior has changed: [describe change]. Implement the change and audit all related `.sdd` RFCs, specs, task files, README content, tests, and navigation rules.

Update documentation only where it is affected. State which documents were changed and why. Add or adjust tests for the changed acceptance criteria, then run the project's verification commands.
```

## 7. Final handoff

```text
Before merging [feature branch] into main, perform a handoff review:
- verify the implementation satisfies its RFC and spec;
- ensure route files do not contain feature components or tests;
- confirm role-based navigation cannot expose unauthorized screens;
- run tests, typecheck, and platform-appropriate build checks;
- update documentation status and README instructions;
- summarize remaining known limitations without expanding scope.

Open the final PR with a concise summary, verification results, issue linkage, assignee, and labels. Merge only after required checks and review are complete.
```
