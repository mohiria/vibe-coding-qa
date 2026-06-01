---
name: vibe-coding-qa
description: Guide Vibe Coding QA work with TDD-driven layered testing. Use when Codex needs to analyze testability, design lightweight test cases, generate or review unit tests, API/integration tests, E2E scenarios, regression scope, runtime QA validation, test failure analysis, or quality gates for AI-generated code.
---

# Vibe Coding QA

Use this skill to organize QA work in Vibe Coding. The goal is not to create heavy traditional test documents. The goal is to use TDD, lightweight test design, layered test execution, regression analysis, runtime validation, and failure feedback to keep AI-generated code constrained by verifiable quality standards.

## Core Workflow

Follow this order by default:

1. Read `references/qa-constitution.md` for the mandatory testing principles.
2. Analyze the Spec, PRD, data model, API contract, code structure, and code changes.
3. Read `references/test-analysis-and-design.md` and create a lightweight test design, including requirement authority checks, representative test points, TDD candidates, E2E scenarios, test data plan, and initial regression impact for changed existing behavior. Small changes may use a minimal lightweight design, but it must still record the requirement source, test point, TDD Red evidence or exception/blocker, and regression impact.
4. Classify each test point into the right coverage layer: unit, API/integration, or E2E.
5. Before changing production code, confirm a valid Red test, reusable failing test, documented non-TDD exception, or exact prerequisite blocker.
6. Generate or review unit tests first for core logic and business rules.
7. Generate or review API/integration tests for service contracts, authorization, data consistency, and integration behavior.
8. Generate or review E2E scenarios for all in-scope user workflows. E2E uses scenario-first design, but does not require strict Red-Green TDD.
9. Recheck regression impact against the actual code and test diff, then merge new/modified test points and selected regression tests into one execution scope.
10. Perform coverage closure: update coverage artifacts, list uncovered test points, and report unresolved prerequisite blockers.
11. Run or plan runtime QA validation only when the environment or deployment must prove basic availability.
12. If tests fail, classify the failure before changing code or tests.
13. In the final QA report, include TDD evidence, execution source, regression evidence, and requirement authority or conflict review when relevant.

## TDD Position

TDD is the default organizing principle for this skill.

- Use strict Red-Green-Refactor for unit tests and API/integration tests whenever the behavior can be tested before implementation.
- Use scenario-first E2E design for user workflows: enumerate personas, entry points, data states, permissions, lifecycle states, normal paths, denial paths, and recovery paths before implementation. Do not force E2E Red-Green when the UI or service is not runnable yet.
- Every generated test must trace back to a Spec item, test point, risk, code path, API contract, or historical defect.
- A test without a clear purpose, input or precondition, expected result, and assertion target is invalid.

## Reference Selection

Load only the reference needed for the current task.

| Task | Read |
| --- | --- |
| Establish mandatory rules, quality gates, or anti-fake-test policy | `references/qa-constitution.md` |
| Extract test points or decide test layers | `references/test-analysis-and-design.md` |
| Choose test framework or runner when project convention is unclear | `references/test-tooling.md` |
| Generate or review unit tests | `references/unit-testing.md` |
| Generate or review API/integration tests | `references/api-and-integration-testing.md` |
| Generate or review E2E scenarios or browser E2E tests | `references/e2e-testing.md` |
| Decide what old tests to run after a change | `references/regression-testing.md` |
| Verify a real running service or app before merge/release | `references/runtime-qa-validation.md` |
| Analyze local or CI test failures | `references/failure-analysis.md` |

## Mandatory Rules

- Always perform lightweight test design before generating test scripts. Small behavior changes may use a minimal lightweight design, but it must still identify the requirement source, test point, TDD Red evidence or exception/blocker, and regression impact.
- Every in-scope executable test point must be attempted in the current testing cycle. Select representative test points through equivalence classes, boundary values, decision tables, state transitions, and risk analysis; do not create meaningless combination explosions. If prerequisites are missing, first try to create deterministic test data through existing fixtures, factories, backend APIs, seed scripts, or safe test database helpers. Report a blocker only when no safe setup path exists or an external prerequisite is genuinely unavailable.
- Always run or require execution of newly added tests and modified tests.
- Test execution scope must combine design coverage and regression coverage. Run or explicitly block every in-scope executable item from the lightweight test design, its regression impact section, and any separate regression impact analysis used for complex changes. A single command may cover multiple items, but the final report must map the source as `Design`, `Regression`, or `Both`.
- Always explain why an existing test was modified.
- Before modifying or deleting an existing test, state the requirement authority and whether the new requirement extends, amends, supersedes, or conflicts with the existing behavior baseline.
- Never weaken assertions, delete negative cases, skip tests, or change expected behavior only to make a suite pass.
- A Red test is valid only when it fails for the expected behavior reason. Syntax, import, test setup, fixture, or environment failures are blockers or setup failures, not Red evidence.
- If strict TDD does not apply, record the reason, alternative validation, and remaining risk.
- Prefer the lowest effective test layer: unit before API/integration, API/integration before E2E.
- Cover all in-scope user workflows at the E2E scenario level. Do not use E2E to exhaustively cover every field combination, branch, or API contract detail when a lower layer can prove it more reliably.
- Test data setup is part of test design and execution. Missing ready-made seed data is not a blocker when local services, APIs, or a safe test database setup path can create the required data.
- Test data must be realistic synthetic business data when the assertion depends on business meaning: plausible names, statuses, dates, amounts, ownership, permissions, and relationships that fit the product domain. Unit tests for pure technical boundaries, simple formatters, mappers, or non-business assertions may use minimal synthetic data when they record why business realism does not affect the assertion. API/integration and E2E tests must keep realistic synthetic business data. Obvious placeholder data is invalid for business-facing records.
- Treat regression as impact-based: directly affected old behavior must be tested; unrelated old behavior can be left to scheduled full regression.
- Runtime QA validation is execution support and final availability smoke validation. It does not count as business test coverage and must not replace unit, API, or E2E testing.
- Test conclusions must cite evidence: command output, response body, logs, screenshots, traces, reports, or CI output.

## Deliverables

Use the templates only when they help the task:

- `templates/lightweight-test-design.md` for test design before script generation, including initial regression impact.
- `templates/regression-impact-analysis.md` for expanded regression scope when the change is high-risk, cross-module, requirement-conflicting, heavily test-changing, or release-critical.
- `templates/bug-report.md` for defects found during testing, review, or validation.
- `templates/qa-test-report.md` for the final QA report, including runtime QA validation evidence when required.

Template artifacts are working documents for both AI execution and human review. Keep each artifact focused on its purpose: design templates decide what should be tested before code, regression templates justify what old behavior to rerun, and final reports summarize execution evidence and remaining risk. Use short realistic examples when they clarify how to fill a section, but do not turn templates into full rule manuals; detailed testing rules belong in `references/`.

When a template file is needed, copy or adapt its structure into the project artifact requested by the user. Do not create unnecessary documents.

Final QA reports should use structured evidence summaries instead of long raw logs. Record execution evidence, behavioral evidence, coverage evidence, TDD Red/Green/Regression evidence, and unresolved requirement conflicts in the relevant report sections.

## Script

Use `scripts/qa_artifacts.mjs` only for deterministic template generation. It must not decide test scope, evaluate quality, or replace engineering judgment.

Use `scripts/qa_artifacts.mjs check <template-name> <artifact-path>` for deterministic artifact structure checks. It supports `lightweight-test-design`, `qa-test-report`, `regression-impact-analysis`, and `bug-report`. It checks required sections, placeholder content, evidence fields, and obvious retained examples. It must not decide QA scope, evaluate test quality, execute tests, or replace engineering judgment.
