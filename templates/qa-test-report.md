# QA Test Report

## Conclusion

- Overall result: PASS / FAIL / BLOCKED
- Requirement / change ID:
- QA owner:
- Date:
- Summary:

## Evidence Guide

Use structured summaries instead of pasting long raw logs.

| Evidence type | What to record | Example |
| --- | --- | --- |
| Execution evidence | Command, result, report path, CI URL, trace, screenshot, log, or response. | `pnpm test -- user-form.test.ts` PASS, report path |
| Behavioral evidence | The specific behavior proved by assertions. | Empty required field returns validation error code |
| Coverage evidence | Project-relative test file and optional test name that covers a test point. | `src/user/user-form.test.ts#rejects empty name` |

## Scope

| Area | In scope? | Notes |
| --- | --- | --- |
| Unit | Yes / No | |
| API/integration | Yes / No | |
| E2E | Yes / No | |
| Regression | Yes / No | |
| Runtime QA validation | Yes / No | Availability smoke only; not business coverage |

## Requirement Authority / Conflict Review

Use this section when a requirement touches existing behavior, existing tests, old Specs, API contracts, data models, or current implementation.

| Behavior | Existing baseline | New requirement source | Relationship | Decision authority | Test action | Code action |
| --- | --- | --- | --- | --- | --- | --- |
| | Existing tests / code / API contract / old Spec | Active Spec / PRD / issue / user confirmation | extends / amends / supersedes / conflicts | Source or decision owner | Add / keep / modify / delete / blocked | Implement / keep / blocked |

Relationship meanings:

- `extends`: Adds new behavior without changing existing behavior. Keep existing tests and add new coverage.
- `amends`: Partially changes existing behavior. Modify affected tests only with authority recorded.
- `supersedes`: Explicitly replaces existing behavior. Retire or replace old tests only with authority and remaining coverage recorded.
- `conflicts`: Sources disagree without clear authority. Do not change expected behavior, tests, or production code until clarified.

## TDD Summary

Use this section for strict TDD candidates. Red evidence is valid only when the test fails for the expected behavior reason, not because of syntax, import, fixture, setup, or environment failure.

| Test point | Source / authority | Red evidence | Red failure reason | Green evidence | Refactor / regression evidence | Coverage artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | Command/result/report | Expected behavior gap, not setup failure | Command/result/report | Command/result/report | `path/to/test#name` | RED / GREEN / PASS / BLOCKED |

## Non-TDD Exceptions

Use this section when strict Red-Green-Refactor is not applied.

| Scope | Reason strict TDD does not apply | Alternative validation | Residual risk |
| --- | --- | --- | --- |
| | Pure style / copy / low-risk display / one-time script / unrunnable UI or service | Review / snapshot / smoke / manual check / runtime validation | |

## Tests Run

| Layer | Test / suite | Command | Result | Evidence |
| --- | --- | --- | --- | --- |
| Unit | | | PASS / FAIL / BLOCKED | |
| API/integration | | | PASS / FAIL / BLOCKED | |
| E2E | | | PASS / FAIL / BLOCKED | |
| Regression | | | PASS / FAIL / BLOCKED | |

## Tests Not Run / Blockers

| Test / scope | Reason not run | Exact blocker | Required owner action | Residual risk |
| --- | --- | --- | --- | --- |
| | BLOCKED / Not applicable | Missing account / service / permission / env var / seed / browser / dependency | | |

## Coverage Summary

| Test point | Layer | Behavioral evidence | Coverage artifact | Status |
| --- | --- | --- | --- | --- |
| | Unit / API/integration / E2E | | `path/to/test#name` | COVERED / BLOCKED / UNCOVERED |

## Regression Scope

- Changed behavior:
- Directly impacted old behavior:
- Historical defects considered:
- Requirement-driven test additions / modifications / deletions:
- Regression risk level: Low / Medium / High
- Selected regression tests and why:

## Runtime QA Validation

Runtime QA validation is availability smoke evidence only. It does not count as Unit/API/E2E business coverage.

| Target | Operation | Result | Evidence | Cleanup |
| --- | --- | --- | --- | --- |
| | | PASS / FAIL / BLOCKED | | |

## Failure Analysis

| Failure / issue | Failure type | Root cause | Action taken | Follow-up coverage |
| --- | --- | --- | --- | --- |
| | Code / test design / requirement change / data / environment / dependency / flaky / ambiguity | | | |

## Failure Learning

- Learning recorded or recommended: Yes / No
- Knowledge location:
- Summary:

## Remaining Risks

- Uncovered test points:
- Unresolved prerequisite blockers:
- Requirement authority conflicts:
- Known flaky areas:
- Manual follow-up:

## Final Statement

Summarize the final QA result, tests run and not run, TDD evidence status, regression scope, runtime validation boundary, unresolved blockers, and remaining risks.

## Example Snippets

These examples are illustrative only. Replace them with project-specific behavior.

TDD summary row:

| Test point | Source / authority | Red evidence | Red failure reason | Green evidence | Refactor / regression evidence | Coverage artifact | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Required name is rejected | Active field rule | `pnpm test -- form.test.ts -t "rejects empty name"` FAIL | Validation rule missing; assertion expected required-field error | Same command PASS | `pnpm test -- form.test.ts api.test.ts` PASS | `src/form.test.ts#rejects empty name` | PASS |

Conflict review row:

| Behavior | Existing baseline | New requirement source | Relationship | Decision authority | Test action | Code action |
| --- | --- | --- | --- | --- | --- | --- |
| Deletion permission | Existing API test denies role A; current service enforces role A denial | Spec-B says role A may delete but does not mention old rule | conflicts | Pending owner confirmation | BLOCKED: do not modify old test | BLOCKED: do not change permission logic |
