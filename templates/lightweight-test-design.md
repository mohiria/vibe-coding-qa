# Lightweight Test Design

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

Use this section when the change touches behavior that already exists or is already covered by tests.

| Behavior | Existing baseline | New requirement source | Relationship | Decision authority | Result |
| --- | --- | --- | --- | --- | --- |
| | Existing tests / code / old Spec / API contract / data model | Active Spec / PRD / issue / user confirmation | extends / amends / supersedes / conflicts | Source or owner | Proceed / BLOCKED |

If the relationship is `conflicts`, do not change expected behavior, existing tests, or production code until clarified.

## Test Points

`Coverage artifact` may be empty during initial analysis. After a Red test or other automated test is created and executed, update it with the project-root relative path and optional `#testName`.

| Test point | Source / authority | Design method | Test layer | Input / precondition | Expected result | Assertion target | Priority | Coverage artifact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | Unit / API/integration / E2E | | | | P0 / P1 / P2 / P3 | |

## User Scenario Matrix

Use this section to enumerate user workflows before selecting or writing E2E tests. E2E covers user workflows, not every field combination or API contract variant.

| Scenario | Persona / role | Entry point | Data state | Operation path | Outcome type | E2E coverage decision |
| --- | --- | --- | --- | --- | --- | --- |
| | | Page / route / modal / deep link | Empty / existing / archived / submitted / approved / rejected / locked | Create / edit / delete / search / submit / approve / reject / export | Success / denial / validation stop / conflict / empty / recovery | Cover with E2E / Lower-layer only with reason / BLOCKED |

## Test Data Plan

Missing ready-made data is not a blocker when fixtures, factories, APIs, seed scripts, or a safe test database can create the required state. Use realistic synthetic business data; obvious placeholder data is invalid unless a pure technical assertion records a minimal-data exception.

| Test point / scenario | Required data state | Business realism basis | Setup method | Isolation strategy | Cleanup method | Data blocker status |
| --- | --- | --- | --- | --- | --- | --- |
| | | Domain rule / persona / lifecycle / tenant / permission / workflow basis | Fixture / factory / API / seed / safe test DB / realistic synthetic data | Unique prefix / tenant / transaction / container / storage state | API cleanup / DB cleanup / rollback / unique residual data | Ready / BLOCKED with exact reason |

## TDD Candidates

| Test point | Initial failing test | Why it should fail before implementation | Expected Red failure reason | Minimal behavior to pass | Related regression |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

Before production code changes, each strict TDD candidate must have one of:

- Valid Red evidence.
- A reusable existing failing test.
- A documented non-TDD exception.
- An exact prerequisite blocker.

## E2E Scenarios

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

- [ ] Each in-scope executable test point has a coverage artifact after prerequisites are available.
- [ ] In-scope user workflows were enumerated before selecting E2E tests.
- [ ] Test data uses realistic synthetic business records or records an explicit minimal-data exception.
- [ ] Missing ready-made data was not used as a blocker when fixture, API, seed, realistic synthetic data, or safe test DB setup was available.
- [ ] New or modified tests were executed and results were recorded.
- [ ] Red tests failed for the expected behavior reason when strict TDD applies.
- [ ] Syntax, import, fixture, setup, or environment failures were not counted as valid Red evidence.
- [ ] Commands, reports, CI links, logs, screenshots, traces, or responses are recorded as execution evidence when relevant.
- [ ] Behavioral evidence describes what assertion proved.
- [ ] Coverage evidence maps each covered test point to a project-relative test path and optional `#testName`.
- [ ] Uncovered test points and unresolved prerequisite blockers are listed explicitly.
- [ ] Requirement conflicts are resolved or explicitly listed as BLOCKED.
- [ ] Runtime QA validation, if performed, is treated only as availability smoke evidence and not counted as Unit/API/E2E business coverage.

## Notes

- Uncovered test points:
- Remaining risks:
- Execution evidence:
- Behavioral evidence:
- Coverage evidence:

## Example Rows

These examples are illustrative only. Replace them with project-specific behavior.

| Test point | Source / authority | Design method | Test layer | Input / precondition | Expected result | Assertion target | Priority | Coverage artifact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Required name is rejected | Active field rule | Equivalence partitioning | Unit + API/integration | `name` is empty | Validation fails | Required-field error code and message | P0 | `src/entity-validator.test.ts#rejectsEmptyName` |
| User without delete permission cannot delete an entity | Permission rule | Decision table | API/integration + E2E user workflow | Current role lacks delete permission | Delete is rejected and entity remains | HTTP 403; UI action unavailable or disabled | P0 | `tests/entity-permission.test.ts#rejectsDeleteWithoutPermission` |
