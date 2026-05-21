# QA Constitution

This document defines the mandatory QA rules for Vibe Coding work. Other QA references may add detail, but they must not weaken these rules.

## Position

Testing in Vibe Coding is not a final manual check after AI writes code. Testing is the control system for AI-generated software:

1. Spec defines the expected behavior.
2. TDD constrains implementation.
3. Layered tests provide repeatable verification.
4. Regression protects existing behavior.
5. Runtime QA validation proves the current environment is available when that risk matters.

The default sequence is:

```text
Test analysis and lightweight design
-> unit tests
-> API/integration tests
-> E2E scenarios and tests
-> coverage closure
-> regression impact analysis
-> runtime QA validation when needed
-> failure analysis and test reinforcement
```

## Mandatory TDD Rule

TDD is the organizing principle for QA work in this skill.

Use strict Red-Green-Refactor for behavior that can be tested before implementation:

```text
Red: create or select a test that should fail before the behavior exists
Green: implement the minimum behavior needed to pass
Refactor: improve the implementation while keeping the tests passing
```

Apply strict TDD to:

- Core business rules.
- Field validation.
- Permission and role checks.
- State transitions.
- API contracts.
- Data consistency logic.
- Error handling.
- Historical defect fixes.

Use TDD when practical for:

- Frontend component logic.
- Form interaction rules.
- Complex query/filter/sort logic.
- Import/export rules.
- Approval or workflow transitions.

Do not force strict TDD for:

- Pure style changes.
- Static copy changes.
- Low-risk display-only pages.
- One-time migration or maintenance scripts.
- E2E flows when the UI or service cannot be run yet.

For E2E work, use scenario-first design instead of mandatory Red-Green. Define the user role, preconditions, operation path, assertions, data setup, and cleanup before implementation or script generation.

## Test Design Before Scripts

AI must perform lightweight test design before generating test scripts.

A test script is invalid if it does not have:

- A clear test purpose.
- An input or precondition.
- An expected result.
- A meaningful assertion target.
- A traceable source such as Spec, test point, code path, API contract, risk, or historical defect.

Do not generate tests directly from implementation code alone. Use implementation code to find missing branches and risks, but use the Spec to decide expected behavior.

## Mixed Testing Method

Vibe Coding QA is not pure black-box testing. AI can inspect requirements, data models, API contracts, code, tests, and change history.

Use a mixed method:

| Method | Use |
| --- | --- |
| Black-box testing | Derive scenarios from Spec, acceptance criteria, user roles, and user flows. |
| White-box testing | Derive unit tests from code branches, conditions, paths, exceptions, and state transitions. |
| Gray-box testing | Derive API/integration tests from API contracts, database constraints, permissions, and service interactions. |
| Risk-based testing | Decide regression scope from code diff, impacted modules, dependencies, critical paths, and historical defects. |
| Evidence-based validation | Confirm runtime behavior with command output, logs, responses, screenshots, traces, and reports. |

Code visibility must improve coverage, not replace user-oriented validation. Do not write tests that only preserve the current implementation if the implementation conflicts with the Spec.

## Layered Testing

Prefer the lowest effective test layer.

```text
Unit -> API/Integration -> E2E
```

| Layer | Primary purpose | Typical target |
| --- | --- | --- |
| Unit | Verify local rules and logic quickly. | Functions, methods, services, validators, reducers, component logic. |
| API/Integration | Verify service contracts and connected behavior. | Controllers, endpoints, auth, DB writes, service integration, external-service boundaries. |
| E2E | Verify critical user journeys. | Login, create/edit/search/approve/submit flows, cross-page behavior, role-specific paths. |
Do not push every scenario into E2E. If a rule can be verified reliably with a unit or API/integration test, prefer that lower layer.

## Required Execution Rules

Before submitting or declaring work complete:

- Run all newly added tests.
- Run all modified tests.
- Run directly affected existing tests.
- Run additional regression tests based on impact and risk.
- Close coverage for in-scope executable test points by recording coverage artifacts. If prerequisites are missing, report the exact blocker to the human owner, resume after the human confirms it is resolved, then execute.
- Report any tests that could not be run and explain why.

If an existing test is modified, state the reason:

1. The Spec changed.
2. The expected behavior intentionally changed.
3. The old test was incorrect.
4. The old test was flaky and is being fixed.
5. Test data or environment changed.

Changing a test is never enough by itself. The agent must also confirm the updated test still has a clear purpose, meaningful assertions, and traceability.

Deleting or retiring a test is allowed only when the Spec explicitly removes or replaces the behavior, or when equal or better coverage remains elsewhere. The agent must document the requirement source and remaining coverage.

## Regression Rule

Regression testing asks whether this change broke existing behavior.

Use this default selection:

| Risk | Required regression |
| --- | --- |
| Low | Related unit tests and local API/integration tests. |
| Medium | Related unit tests, API/integration tests, and critical E2E path. |
| High | Module-level regression, core E2E paths, and runtime QA validation if environment risk exists. |

Always include historical defect tests when the change touches the same behavior, field, endpoint, state, or user flow.

Scheduled full regression may cover unrelated old behavior, but directly impacted old behavior must be validated before completion.

## Runtime QA Validation Rule

Runtime QA validation is not business test coverage and is not a replacement for unit, API, or E2E tests.

Use it when a real environment must prove current usability:

- Before merge or release for high-risk changes.
- After deployment or environment changes.
- When service startup, configuration, authentication, routing, or integration is risky.
- When automated tests pass but real availability is uncertain.

Runtime validation should be a minimal evidence-based smoke check:

```text
Prerequisites
-> start service
-> wait for ready signal
-> perform real API, CLI, or browser operation
-> capture evidence
-> decide PASS / FAIL / BLOCKED
-> cleanup
```

## Anti-Fake-Test Policy

The following are forbidden:

- Tests that only assert that code "does not throw" when specific behavior should be checked.
- API tests that only assert HTTP 200 without validating response body, error shape, or data state.
- E2E tests that only check that a page loads when a business result should be verified.
- Removing assertions to make tests pass.
- Skipping or deleting failing tests without documented justification.
- Replacing deterministic assertions with snapshots only.
- Testing mocks instead of the behavior under test.
- Over-mocking the unit so the test no longer validates real logic.
- Changing expected behavior to match a buggy implementation.
- Claiming tests passed without execution evidence.

## Failure Handling

When a test fails, classify the failure before changing anything:

| Failure type | Action |
| --- | --- |
| Code implementation problem | Fix code, rerun affected tests, and add missing coverage if needed. |
| Test design problem | Fix the test and explain why the old test was wrong. |
| Test data problem | Fix setup, isolation, cleanup, or seed data. |
| Environment problem | Fix or report configuration, dependency, service, port, credential, or deployment issue. |
| Spec ambiguity | Stop and request clarification or update the Spec before changing expected behavior. |
| Flaky test | Diagnose root cause; quarantine only with explicit tracking and repair plan. |

Do not blindly retry CI. A retry is acceptable only after classifying why retry is reasonable, such as known infrastructure interruption.

## Quality Gate

A change is not ready if:

- Required tests were not run.
- New or modified tests fail.
- Directly impacted old tests fail.
- Any in-scope executable test point has no coverage artifact after required prerequisites are available.
- A failing test was skipped without documented justification.
- A test was weakened to match the implementation.
- The implementation has no test for a core business rule, API contract, permission rule, state transition, or historical defect.
- Runtime validation was required but no evidence was captured.

The final QA statement must include:

- Tests run.
- Tests not run and why.
- Failure analysis if anything failed.
- Regression scope.
- Uncovered test points and unresolved prerequisite blockers.
- Remaining risks.
- Evidence links or command/log snippets when available.
