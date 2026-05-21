# E2E Testing

Use this reference after lightweight test design identifies critical user journeys that cannot be proven sufficiently by unit or API/integration tests. E2E tests provide confidence that the product works across UI, routing, service, auth, and data boundaries.

## Goal

E2E testing verifies user-visible behavior across the running system:

```text
critical scenario
-> persona and preconditions
-> user path
-> business assertions
-> evidence on failure
-> coverage artifact updated
```

E2E is scenario-first. Define the user role, data setup, operation path, assertions, cleanup, and evidence before script generation. Do not force strict Red-Green when the UI or service cannot be run yet.

## When To Use E2E Tests

Use E2E for high-value journeys where cross-boundary confidence matters:

| Target | Examples |
| --- | --- |
| Critical user flow | Login, create, edit, submit, approve, search, checkout, export. |
| Cross-page behavior | Wizard, multi-step form, navigation state, deep link, redirect. |
| Role-specific path | Admin versus regular user, reviewer versus submitter, owner versus non-owner. |
| End-to-end integration | UI action triggers API write, DB state change, notification, generated file, or visible result. |
| Regression of escaped defect | A user journey that failed in production or review. |
| Deployment confidence | A small smoke path after high-risk environment or routing changes. |

Do not use E2E to cover every validation rule, branch, or API contract detail. Prefer unit and API/integration tests when they can prove the behavior reliably.

## Required Inputs

Before writing an E2E test, collect:

- The lightweight test design row for the scenario.
- Persona, role, permission, tenant, or account state.
- Environment URL, service readiness command, and required configuration.
- Test data setup and cleanup strategy.
- Stable selectors and accessibility names.
- Expected visible result and any durable side effect that must be checked.
- Existing E2E framework, helpers, fixtures, auth setup, and naming conventions.

If an account, permission, seed, plugin, browser, service, or environment is missing, report the exact blocker and resume only after the human confirms it is resolved.

## Scenario-First Workflow

Use this order before writing Playwright or other E2E code:

1. Select one in-scope critical scenario from lightweight test design.
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

- API setup over slow UI setup when it does not skip the behavior under test.
- Unique names, IDs, or prefixes.
- Dedicated test roles and tenants.
- Isolated fixtures or seed data.
- Cleanup through API or database helper when project conventions allow it.
- Storage state or login helper for authentication when login is not the behavior under test.

Avoid:

- Production data.
- Real secrets in test code.
- Shared mutable records without cleanup.
- Test ordering dependencies.
- Hidden dependency on a previous test.
- Manual preconditions that are not reported as blockers.

When cleanup is impossible, make the created data unique and document the residual data risk.

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

Include E2E negative cases only when they protect a critical journey or user-visible contract:

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
5. List uncovered E2E scenarios and unresolved prerequisite blockers.

Examples:

```text
frontend/tests/e2e/supplier-create.spec.ts#creates supplier as purchasing manager
tests/e2e/approval-workflow.spec.ts#approver rejects submitted request
```

Runtime QA validation is not E2E coverage. A manual browser smoke or health check can prove availability, but it does not replace an automated user journey with assertions.

## Review Checklist

Before accepting E2E tests, verify:

- The scenario traces to a lightweight test design row.
- The journey is critical enough for E2E.
- Lower-layer coverage is used for detailed rules where possible.
- Persona, preconditions, data setup, assertions, and cleanup are clear.
- Selectors are stable and user-oriented.
- Assertions verify business-visible results.
- The test avoids fixed sleeps and hidden ordering dependencies.
- Evidence is captured or available for failure diagnosis.
- New, modified, and directly affected E2E tests were executed.
- Coverage artifacts were updated after execution.
- Remaining uncovered scenarios and unresolved prerequisite blockers are explicit.
