# Lightweight Test Design

Purpose: decide what to test, which layer should cover it, what data is needed, and what must exist before production code changes. Keep final execution evidence in the QA test report.

## Context

- Requirement / Spec:
- Change summary:
- Target modules / APIs / pages:
- Test environment / constraints:

## Input Sources Checked

- [ ] Active Spec / PRD / acceptance criteria / issue
- [ ] Existing behavior baseline: tests / code / old Spec / API contract
- [ ] Data model / field rules / CRUD matrix
- [ ] API contract / auth rules / error shape
- [ ] UI states / user roles / user paths
- [ ] Code structure / changed code / dependency graph
- [ ] Existing tests / historical defects / flaky areas
- [ ] Test data / credentials / mocks / CI constraints

## Requirement Authority / Conflict Gate

Use only when the change touches existing behavior, tests, API contracts, data model behavior, or old Specs.

| Behavior | Existing baseline | New requirement source | Relationship | Decision authority | Result |
| --- | --- | --- | --- | --- | --- |
| | Existing tests / code / old Spec / API contract / data model | Active Spec / PRD / issue / user confirmation | extends / amends / supersedes / conflicts | Source or owner | Proceed / BLOCKED |

## Test Points

List the behavior to prove and the lowest effective layer. `Coverage artifact` may be empty until the test exists and has been executed.

| Test point | Source / authority | Design method | Test layer | Input / precondition | Expected result | Assertion target | Priority | Coverage artifact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | Unit / API/integration / E2E | | | | P0 / P1 / P2 / P3 | |

## User Scenario Matrix

Use when E2E is in scope. Enumerate user workflows before selecting browser tests.

| Scenario | Persona / role | Entry point | Data state | Operation path | Outcome type | E2E coverage decision |
| --- | --- | --- | --- | --- | --- | --- |
| | | Page / route / modal / deep link | Empty / existing / archived / submitted / approved / rejected / locked | Create / edit / delete / search / submit / approve / reject / export | Success / denial / validation stop / conflict / empty / recovery | Cover with E2E / Lower-layer only with reason / BLOCKED |

## Test Data Plan

Plan deterministic setup, isolation, cleanup, and realistic synthetic business data.

| Test point / scenario | Required data state | Business realism basis | Setup method | Isolation strategy | Cleanup method | Data blocker status |
| --- | --- | --- | --- | --- | --- | --- |
| | | Domain rule / persona / lifecycle / tenant / permission / workflow basis | Fixture / factory / API / seed / safe test DB / realistic synthetic data | Unique prefix / tenant / transaction / container / storage state | API cleanup / DB cleanup / rollback / unique residual data | Ready / BLOCKED with exact reason |

## TDD Candidates

Use for strict Red-Green-Refactor candidates at unit or API/integration layers.

| Test point | Initial failing test | Why it should fail before implementation | Expected Red failure reason | Minimal behavior to pass | Related regression |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## E2E Scenarios

Use for selected workflow-level E2E scenarios. Detailed field and API variants should stay in lower layers when possible.

| Scenario | Persona / role | Preconditions | User path | Critical assertions | Cleanup | Evidence on failure |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | screenshot / trace / network log |

## Non-TDD Exceptions

| Scope | Reason strict TDD does not apply | Alternative validation | Residual risk |
| --- | --- | --- | --- |
| | Pure style / copy / low-risk display / one-time script / unrunnable UI or service | | |

## Prerequisite Blockers

| Blocker | Affected test point | Required owner action | Status |
| --- | --- | --- | --- |
| | | | BLOCKED / RESOLVED |

## Coverage Closure

- Ready for code change: Yes / No / BLOCKED
- Red evidence, reusable failing test, non-TDD exception, or exact blocker exists for strict TDD candidates: Yes / No
- User workflows in scope for E2E are enumerated: Yes / No / Not applicable
- Test data plan includes business realism basis and setup path: Yes / No
- Uncovered planned test points or blockers:

## Short Examples

Example test point:

| Test point | Source / authority | Design method | Test layer | Input / precondition | Expected result | Assertion target | Priority | Coverage artifact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Regional sales manager approves submitted renewal discount | PRD discount workflow | State transition | API/integration + E2E | Submitted renewal discount for owned account | Request becomes approved and audit entry is visible | HTTP 200, persisted status, approval badge | P0 | `tests/discount-approval.spec.ts#approvesSubmittedRenewalDiscount` |

Example test data:

| Test point / scenario | Required data state | Business realism basis | Setup method | Isolation strategy | Cleanup method | Data blocker status |
| --- | --- | --- | --- | --- | --- | --- |
| Approve renewal discount | Customer account with submitted annual renewal discount request | Mirrors regional manager approval for owned enterprise accounts | API setup | Unique prefix and test tenant | API cleanup | Ready |
