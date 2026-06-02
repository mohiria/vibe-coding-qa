# E2E Testing

Use this reference after lightweight test design identifies user workflows that must be proven across UI, routing, service, auth, and data boundaries. E2E tests provide confidence that the product works from the user's point of view.

Use the project's existing E2E runner, fixtures, selectors, and CI convention first. If no convention exists, consult `references/test-tooling.md`.

## Goal

E2E testing verifies user-visible behavior across the running system:

```text
user workflow scenario
-> persona and preconditions
-> user path
-> business assertions
-> evidence on failure
-> coverage artifact updated
```

E2E is scenario-first. Define the user role, data setup, operation path, assertions, cleanup, and evidence before script generation. Do not force strict Red-Green when the UI or service cannot be run yet.

## When To Use E2E Tests

Use E2E for in-scope user workflows where cross-boundary confidence matters:

| Target | Examples |
| --- | --- |
| User workflow | Login, create, edit, submit, approve, search, checkout, export. |
| Cross-page behavior | Wizard, multi-step form, navigation state, deep link, redirect. |
| Role-specific path | Admin versus regular user, reviewer versus submitter, owner versus non-owner. |
| End-to-end integration | UI action triggers API write, DB state change, notification, generated file, or visible result. |
| Regression of escaped defect | A user journey that failed in production or review. |
| Deployment confidence | A small smoke path after high-risk environment or routing changes. |

Do not use E2E to cover every validation rule, branch, or API contract detail. Prefer unit and API/integration tests when they can prove the behavior reliably.

## Scenario Coverage Standard

E2E coverage is user workflow coverage. For the product area touched by the change, enumerate every in-scope workflow before selecting or writing tests.

Cover workflows across these dimensions when they apply:

- Role, permission, tenant, ownership, or account state.
- Entry point, deep link, navigation path, modal, wizard, or cross-page flow.
- Data state: empty, existing, duplicate, archived, disabled, deleted, submitted, approved, rejected, expired, or locked.
- Operation: create, view, edit, delete, disable, archive, restore, search, filter, sort, import, export, submit, approve, reject, assign, or notify.
- Outcome: success, user-facing validation stop, permission denial, conflict, empty state, retry, recovery, or audit-visible result.

Do not collapse distinct user workflows into one E2E test just to reduce count. Do combine detailed input variants into lower-layer tests when they share the same user workflow and UI outcome.

## Required Inputs

Before writing an E2E test, collect:

- The lightweight test design row for the scenario.
- Persona, role, permission, tenant, or account state.
- Environment URL, service readiness command, and required configuration.
- Test data setup and cleanup strategy.
- Stable selectors and accessibility names.
- Expected visible result and any durable side effect that must be checked.
- Existing E2E framework, helpers, fixtures, auth setup, and naming conventions.

If an account, permission, plugin, browser, service, or environment is missing, report the exact blocker and resume only after the human confirms it is resolved. Missing ready-made data is not enough to block execution when the data can be created through a fixture, backend API, seed script, or safe test database helper.

## Scenario-First Workflow

Use this order before writing browser E2E code:

1. Select one in-scope user workflow from the lightweight test design and user scenario matrix.
2. Define persona or role.
3. Define starting data and environment state.
4. Define the shortest realistic user path.
5. Define critical assertions.
6. Define cleanup and isolation.
7. Define evidence to capture on failure.
8. Map the scenario to an existing E2E file or create one following project conventions.
9. Generate the test script.
10. Execute the new or modified test.
11. Update `Coverage artifact` with the project-root relative test path and optional `#testName`.

Scenario-first design may exist before an executable test file when the UI or service is not runnable. It does not count as automated coverage until the test exists and has been executed.

## Assertions

E2E assertions must verify business-visible outcomes, not only page availability.

Good assertion targets:

- Visible success, error, empty, loading, or disabled state.
- Created or updated record appears with expected values.
- Deleted or unauthorized record is absent.
- Route or modal state changes as expected.
- File download, generated report, notification, or submitted payload is produced.
- API or DB side effect when the project has an established helper for checking it.
- Role-specific UI availability or denial message.

Weak assertions are not enough:

- Only checking that a page loads.
- Only checking that a button exists when the result matters.
- Only waiting with a fixed sleep.
- Only taking a screenshot without asserting behavior.
- Repeating unit/API coverage in a slower UI test.

## Selector Rules

Prefer selectors that reflect user-visible semantics and are stable:

1. Role and accessible name.
2. Label text for inputs.
3. Placeholder only when it is stable and user-visible.
4. Test ID when the product already uses stable test IDs.
5. CSS selectors only as a last resort.

Avoid selectors based on generated classes, DOM depth, animation wrappers, translated incidental copy, or unstable indexes. If no stable selector exists, report the selector blocker or add a project-approved test ID as part of the implementation.

## Test Data And Isolation

E2E tests need deterministic setup and cleanup.

Prefer:

- Existing project fixtures, factories, seed helpers, storage-state helpers, or test data builders.
- API setup over slow UI setup when it does not skip the behavior under test.
- Safe test database setup when API setup cannot create the required lifecycle, permission, or relationship state.
- Realistic synthetic business data that a real user could recognize in the product context. The unit-test minimal-data exception does not apply to E2E tests.
- Record why the data is business-realistic for this E2E workflow: persona, entry point, workflow, lifecycle state, permission, tenant or ownership context, and visible business result.
- Coherent personas, tenant ownership, lifecycle states, dates, amounts, permissions, and related records.
- Unique names, IDs, or prefixes.
- Dedicated test roles and tenants.
- Isolated fixtures or seed data.
- Cleanup through API or database helper when project conventions allow it.
- Storage state or login helper for authentication when login is not the behavior under test.

Avoid:

- Production data.
- Real secrets in test code.
- Obvious placeholder records such as `foo`, `bar`, `test123`, `asdf`, `张三`, `Acme Inc.`, or meaningless lorem text.
- Shared mutable records without cleanup.
- Test ordering dependencies.
- Hidden dependency on a previous test.
- Manual preconditions that are not reported as blockers.

When cleanup is impossible, make the created data unique and document the residual data risk.

Use this setup order by default:

1. Reuse existing E2E fixture, factory, auth helper, or storage state.
2. Create prerequisite records through backend APIs.
3. Run a project-approved seed script.
4. Use a safe test database helper or direct test database setup.
5. Report a blocker only if none of the above can create the required state safely.

Do not use UI steps to create prerequisites unless the creation workflow itself is under test or the project has no safer setup path.

## Flakiness Controls

E2E tests are expensive and prone to environmental noise. Keep them deterministic:

- Wait for meaningful UI or network state, not fixed time.
- Use framework auto-waiting and web-first assertions.
- Avoid arbitrary sleeps.
- Disable or control animation only when the project convention allows it.
- Keep each test focused on one journey.
- Use retries only as a runner-level safety net, not as a substitute for diagnosis.
- Capture trace, screenshot, video, console logs, or network logs when failures need evidence.

If a test is flaky, classify the root cause before changing assertions or adding waits.

## Negative And Role Scenarios

Include E2E negative cases when they are distinct user workflows or protect a user-visible contract:

- User lacks permission and cannot complete the action.
- Invalid state blocks a workflow transition.
- Cross-tenant or cross-owner access is denied in the UI.
- Required user-facing error message appears.
- Recovery path works after a failed submit.

Detailed field validation should usually stay in unit or component tests, with API/integration coverage for server enforcement.

## Coverage Closure

After creating or modifying E2E tests:

1. Run the new or modified E2E test.
2. Run directly affected E2E tests when the change touches shared navigation, auth, fixtures, or helpers.
3. Record command, result, and evidence location.
4. Update the lightweight design `Coverage artifact` with the project-root relative test path and optional `#testName`.
5. List uncovered E2E workflow scenarios and unresolved prerequisite blockers.
6. Ensure the final `qa-test-report` records E2E data setup evidence, business realism evidence, cleanup, and execution evidence.

Examples:

```text
frontend/tests/e2e/entity-create.spec.ts#creates entity as authorized user
tests/e2e/approval-workflow.spec.ts#approver rejects submitted request
```

Runtime QA validation is not E2E coverage. A manual browser smoke or health check can prove availability, but it does not replace an automated user journey with assertions.

## Review Checklist

Before accepting E2E tests, verify:

- The scenario traces to a lightweight test design row.
- The in-scope user workflows were enumerated before selecting tests.
- Lower-layer coverage is used for detailed rules where possible.
- Persona, preconditions, data setup, assertions, and cleanup are clear.
- Test data is realistic synthetic business data and matches the user workflow being tested.
- QA report evidence records the E2E data setup, business realism basis, isolation or cleanup, and command/report/trace evidence.
- Data setup tries fixture, API, seed, or safe test database paths before reporting blockers.
- Selectors are stable and user-oriented.
- Assertions verify business-visible results.
- The test avoids fixed sleeps and hidden ordering dependencies.
- Evidence is captured or available for failure diagnosis.
- New, modified, and directly affected E2E tests were executed.
- Coverage artifacts were updated after execution.
- Remaining uncovered scenarios and unresolved prerequisite blockers are explicit.
