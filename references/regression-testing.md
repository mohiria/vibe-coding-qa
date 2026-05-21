# Regression Testing

Use this reference after code or test changes have been made, or when planning which existing tests must be rerun before declaring QA complete. Regression testing answers whether the change broke existing behavior.

## Goal

Regression testing connects change impact to targeted verification:

```text
change diff / changed tests / touched dependency
-> impacted behavior
-> risk level
-> selected existing tests
-> execution evidence
-> remaining risk
```

Regression is impact-based. Directly affected old behavior must be validated before completion. Unrelated old behavior can be left to scheduled full regression unless the risk analysis shows a dependency.

## Required Inputs

Before selecting regression tests, inspect:

- Code diff and changed files.
- Test diff and changed assertions, fixtures, helpers, or mocks.
- API contract, data model, schema, configuration, or dependency changes.
- Callers, imports, routes, consumers, and shared utilities affected by the change.
- Existing test inventory across unit, API/integration, and E2E layers.
- Historical defects, flaky areas, and critical user paths.
- CI constraints and local execution prerequisites.

If impact cannot be determined from available context, report the missing source and ask for clarification. Do not claim low regression risk without explaining why.

## Impact Analysis

Map each changed item to behavior and tests.

| Changed item | What to check |
| --- | --- |
| Business rule | Unit tests for the rule, API tests that expose it, critical E2E path if user-visible. |
| Validator or schema | Boundary and invalid cases, API error shape, form state if UI uses the rule. |
| API route or controller | Contract tests, auth matrix, persistence side effects, consumers. |
| Data model or migration | Constraints, defaults, queries, transactions, import/export, rollback risk. |
| Shared utility | Direct unit tests and representative callers. |
| Auth or permission logic | Denied and allowed paths across unit/API/E2E as appropriate. |
| UI component or route | Component tests, affected E2E path, accessibility or selector impact. |
| Test helper or fixture | Tests that depend on the helper, fixture setup, cleanup, and data isolation. |
| Configuration or environment | Startup, routing, external service boundary, runtime QA validation if availability risk exists. |

Use code visibility to find affected callers, but use the Spec and existing behavior to decide what must still hold.

## Risk Levels

Classify regression risk before choosing the suite.

| Risk | Signals | Required regression |
| --- | --- | --- |
| Low | Localized change, no shared dependency, no data/auth/API behavior, strong unit coverage. | New/modified tests, related unit tests, and directly affected old tests. |
| Medium | API, DB, UI workflow, shared helper, or multi-module behavior changed. | Related unit tests, API/integration tests, and the critical E2E path if user-visible. |
| High | Auth, money, compliance, data loss, migration, multi-tenant boundary, critical workflow, or historical defect area changed. | Module-level regression, core E2E paths, historical defect tests, and runtime QA validation if environment risk exists. |

Raise risk when:

- A test was changed to match implementation.
- Assertions were weakened.
- A shared fixture, factory, or test helper changed.
- The change touches flaky or historically fragile behavior.
- The change has missing lower-layer coverage.
- The same behavior is used by multiple roles, tenants, endpoints, or pages.

## Test Selection Rules

Select the lowest effective tests that prove old behavior still works:

1. Always run newly added and modified tests.
2. Run directly affected existing tests.
3. Run tests for callers and consumers of changed shared code.
4. Run historical defect tests for touched behavior.
5. Add representative API/integration tests when persistence, auth, or contract behavior is affected.
6. Add focused E2E only for critical user journeys and cross-boundary confidence.
7. Use runtime QA validation only when a real environment must prove availability.

Do not run a huge suite as a substitute for impact analysis when a targeted suite is available. Do not skip directly affected tests only because a broad suite passed elsewhere.

## Requirement Change Handling

When the change is a requirement change, update the test set deliberately:

| Requirement change | Test response |
| --- | --- |
| New behavior added | Add new test points and tests at the lowest effective layer. |
| Existing behavior changed | Modify old tests only when the Spec intentionally changes the expected result; state whether the old behavior remains supported. |
| Behavior removed | Delete or retire tests only when the Spec explicitly removes the behavior or equal or better coverage remains elsewhere. |
| Behavior split by role, flag, tenant, or state | Keep old-path tests where the old path remains supported, and add tests for the new variants. |

For requirement-driven test additions, modifications, or deletions, record the requirement source, the affected tests, the reason for the change, and the remaining coverage for old behavior that is still supported. Do not delete tests because implementation changed, setup is inconvenient, or the test is failing.

## Changed Tests

Changing a test increases regression responsibility.

When an existing test is modified, state the reason:

1. The Spec changed.
2. The expected behavior intentionally changed.
3. The old test was incorrect.
4. The old test was flaky and is being fixed.
5. Test data or environment changed.

Then verify:

- The updated test still has a clear purpose.
- Assertions remain meaningful.
- Negative and boundary cases were not silently removed.
- The change does not hide a production bug.
- Directly related old behavior still has coverage.

Never weaken assertions, delete negative cases, skip failures, or change expected behavior only to make a suite pass.

## Historical Defects

Historical defect coverage is mandatory when the change touches the same behavior, field, endpoint, state, user flow, or integration boundary.

For each relevant defect, check:

- Is there an existing regression test?
- Does the changed code affect the defect path?
- Does the defect need a unit, API/integration, or E2E test?
- Was the test executed in this cycle?

If no defect test exists and the issue is likely to recur, add one at the lowest effective layer.

## Runtime Validation Boundary

Runtime QA validation can be part of high-risk regression when environment availability matters, but it is not business test coverage.

Use runtime validation for:

- Service startup after configuration changes.
- Routing or deployment changes.
- Auth/session setup risk.
- External dependency wiring risk.
- High-risk release smoke.

Do not count a health check, manual browser smoke, or log inspection as covering unit, API/integration, or E2E business behavior.

## Execution Evidence

For each selected regression test or suite, record:

- Command.
- Test path or suite name.
- Result.
- Relevant failure output if failed.
- Evidence artifact when available: CI run, report, trace, screenshot, log, or coverage output.

If a selected regression test cannot run, report the exact blocker and resume only after the human confirms it is resolved. If it remains blocked, list it as an unresolved prerequisite blocker and include residual risk.

## Regression Output

A regression statement must include:

- Changed behavior and impacted existing behavior.
- Requirement-driven test additions, modifications, and deletions.
- Risk level and why.
- Tests selected and why.
- Tests run and results.
- Tests not run and exact blockers.
- Historical defect coverage considered.
- Remaining uncovered test points and unresolved prerequisite blockers.
- Runtime QA validation evidence if it was required.

## Review Checklist

Before accepting regression coverage, verify:

- The code diff and test diff were inspected.
- Impacted callers, API contracts, data models, permissions, and user flows were considered.
- Risk level is justified.
- Requirement changes are mapped to added, modified, kept, and deleted tests.
- Deleted tests have an explicit requirement or replacement-coverage justification.
- Newly added and modified tests were executed.
- Directly affected existing tests were executed.
- Historical defect tests were included when relevant.
- E2E selection is focused on critical paths, not broad duplication.
- Runtime validation is not counted as business coverage.
- Failures were classified before changing code or tests.
- Remaining risks and unresolved prerequisite blockers are explicit.
