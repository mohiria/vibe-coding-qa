# QA Test Report

Purpose: summarize what was actually executed, what behavior was proven, what data was prepared, and what risk remains. Do not repeat the full pre-code test design.

## Conclusion

- Overall result: PASS / FAIL / BLOCKED
- Requirement / change ID:
- QA owner:
- Date:
- Summary:

## Scope

| Area | In scope? | Notes |
| --- | --- | --- |
| Unit | Yes / No | |
| API/integration | Yes / No | |
| E2E | Yes / No | |
| Regression | Yes / No | |
| Runtime QA validation | Yes / No | Availability smoke only; not business coverage |

## Requirement Authority / Conflict Review

Use only when a requirement decision affected existing behavior or test expectations.

| Behavior | Existing baseline | New requirement source | Relationship | Decision authority | Test action | Code action |
| --- | --- | --- | --- | --- | --- | --- |
| | Existing tests / code / API contract / old Spec | Active Spec / PRD / issue / user confirmation | extends / amends / supersedes / conflicts | Source or decision owner | Add / keep / modify / delete / blocked | Implement / keep / blocked |

## TDD Summary

Use for strict TDD candidates. Red evidence must be an expected behavior failure, not setup failure.

| Test point | Source / authority | Red evidence | Red failure reason | Green evidence | Refactor / regression evidence | Coverage artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | Command/result/report | Expected behavior gap, not setup failure | Command/result/report | Command/result/report | `path/to/test#name` | RED / GREEN / PASS / BLOCKED |

## Non-TDD Exceptions

Use when strict Red-Green-Refactor was intentionally not applied.

| Scope | Reason strict TDD does not apply | Alternative validation | Residual risk |
| --- | --- | --- | --- |
| | Pure style / copy / low-risk display / one-time script / unrunnable UI or service | Review / snapshot / smoke / manual check / runtime validation | |

## Tests Run

| Source | Layer | Test / suite | Command | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| Design / Regression / Both | Unit | | | PASS / FAIL / BLOCKED | |
| Design / Regression / Both | API/integration | | | PASS / FAIL / BLOCKED | |
| Design / Regression / Both | E2E | | | PASS / FAIL / BLOCKED | |
| Regression | Regression | | | PASS / FAIL / BLOCKED | |

## User Scenario Coverage

Use when E2E is in scope. Record workflow coverage, not every field or API variant.

| Scenario | Persona / role | Workflow covered | E2E artifact | Result | Notes |
| --- | --- | --- | --- | --- | --- |
| | | Entry point -> operation -> visible outcome | `path/to/e2e.spec.ts#test name` | COVERED / BLOCKED / LOWER-LAYER-ONLY | |

## Test Data Setup Evidence

Record how required data was created, why it is business-realistic, and how it was isolated or cleaned up.

| Test / scenario | Required data | Business realism evidence | Setup method | Cleanup | Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| | | Domain rule / persona / lifecycle / tenant / permission / workflow evidence | Fixture / factory / API / seed / safe test DB / realistic synthetic data | API cleanup / DB cleanup / rollback / unique residual data | Command / response / log / test helper | READY / BLOCKED |

## Tests Not Run / Blockers

| Source | Test / scope | Reason not run | Exact blocker | Required owner action | Residual risk |
| --- | --- | --- | --- | --- | --- |
| Design / Regression / Both | | BLOCKED / Not applicable | Missing account / service / permission / env var / unsafe data setup path / browser / dependency | | |

## Coverage Summary

| Source | Test point / regression item | Layer | Behavioral evidence | Coverage artifact | Status |
| --- | --- | --- | --- | --- | --- |
| Design / Regression / Both | | Unit / API/integration / E2E | | `path/to/test#name` | COVERED / BLOCKED / UNCOVERED |

## Regression Scope

- Changed behavior:
- Directly impacted old behavior:
- Regression impact source: Lightweight design / Separate regression analysis / Both
- Historical defects considered:
- Requirement-driven test additions / modifications / deletions:
- Regression risk level: Low / Medium / High
- Selected regression tests and why:

## Runtime QA Validation

Availability smoke only. It does not count as Unit/API/E2E business coverage.

| Target | Operation | Result | Evidence | Cleanup |
| --- | --- | --- | --- | --- |
| | | PASS / FAIL / BLOCKED | | |

## Failure Analysis

| Failure / issue | Failure type | Root cause | Action taken | Follow-up coverage |
| --- | --- | --- | --- | --- |
| | Code / test design / requirement change / data / environment / dependency / flaky / ambiguity | | | |

## Failure Learning

Use only when the failure reveals a reusable testing, requirement, fixture, or environment lesson.

- Learning recorded or recommended:
- Knowledge location:
- Summary:

## Remaining Risks

- Uncovered test points:
- Uncovered user workflow scenarios:
- Unresolved prerequisite blockers:
- Requirement authority conflicts:
- Known flaky areas:
- Manual follow-up:

## Final Statement

Summarize the final QA result, tests run and not run, TDD evidence status, regression scope, runtime validation boundary, unresolved blockers, and remaining risks.

## Short Examples

| Test point | Source / authority | Red evidence | Red failure reason | Green evidence | Refactor / regression evidence | Coverage artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Approve submitted renewal discount | PRD discount workflow | `pnpm test -- discount-approval.spec.ts` FAIL | Approval transition missing | Same command PASS | Related discount tests PASS | `tests/discount-approval.spec.ts#approvesSubmittedRenewalDiscount` | PASS |

| Source | Layer | Test / suite | Command | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| Both | API/integration | Discount approval API | `pnpm test -- discount-approval.spec.ts` | PASS | report path |

| Test / scenario | Required data | Business realism evidence | Setup method | Cleanup | Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Approve renewal discount | Submitted annual renewal discount for owned enterprise account | Matches regional manager approval workflow and lifecycle state | API setup | API cleanup | setup helper log | READY |
