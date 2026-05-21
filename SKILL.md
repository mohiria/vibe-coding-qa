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
3. Read `references/test-analysis-and-design.md` and create a lightweight test design before generating test scripts.
4. Classify each test point into the right coverage layer: unit, API/integration, or E2E.
5. Generate or review unit tests first for core logic and business rules.
6. Generate or review API/integration tests for service contracts, authorization, data consistency, and integration behavior.
7. Generate or review E2E scenarios for critical user flows. E2E uses scenario-first design, but does not require strict Red-Green TDD.
8. Perform coverage closure: update coverage artifacts, list uncovered test points, and report unresolved prerequisite blockers.
9. Analyze regression impact for any changed code or changed tests.
10. Run or plan runtime QA validation only when the environment or deployment must prove basic availability.
11. If tests fail, classify the failure before changing code or tests.

## TDD Position

TDD is the default organizing principle for this skill.

- Use strict Red-Green-Refactor for unit tests and API/integration tests whenever the behavior can be tested before implementation.
- Use scenario-first E2E design for user flows: define the persona, preconditions, path, assertions, data setup, and cleanup before implementation, but do not force E2E Red-Green when the UI or service is not runnable yet.
- Every generated test must trace back to a Spec item, test point, risk, code path, API contract, or historical defect.
- A test without a clear purpose, input or precondition, expected result, and assertion target is invalid.

## Reference Selection

Load only the reference needed for the current task.

| Task | Read |
| --- | --- |
| Establish mandatory rules, quality gates, or anti-fake-test policy | `references/qa-constitution.md` |
| Extract test points or decide test layers | `references/test-analysis-and-design.md` |
| Generate or review unit tests | `references/unit-testing.md` |
| Generate or review API/integration tests | `references/api-and-integration-testing.md` |
| Generate or review E2E scenarios or Playwright tests | `references/e2e-testing.md` |
| Decide what old tests to run after a change | `references/regression-testing.md` |
| Verify a real running service or app before merge/release | `references/runtime-qa-validation.md` |
| Analyze local or CI test failures | `references/failure-analysis.md` |
| Explain how this skill uses the local reference projects | `references/source-mapping.md` |

## Mandatory Rules

- Always perform lightweight test design before generating test scripts.
- Every in-scope executable test point must be attempted in the current testing cycle. If prerequisites are missing, report the exact blocker to the human owner, resume after the human confirms it is resolved, then execute and record the coverage artifact.
- Always run or require execution of newly added tests and modified tests.
- Always explain why an existing test was modified.
- Never weaken assertions, delete negative cases, skip tests, or change expected behavior only to make a suite pass.
- Prefer the lowest effective test layer: unit before API/integration, API/integration before E2E.
- Do not use E2E to cover every detail; reserve E2E for critical user journeys and integration confidence.
- Treat regression as impact-based: directly affected old behavior must be tested; unrelated old behavior can be left to scheduled full regression.
- Runtime QA validation is execution support and final availability smoke validation. It does not count as business test coverage and must not replace unit, API, or E2E testing.
- Test conclusions must cite evidence: command output, response body, logs, screenshots, traces, reports, or CI output.

## Deliverables

Use the templates only when they help the task:

- `templates/lightweight-test-design.md` for test design before script generation.
- `templates/regression-impact-analysis.md` for change impact and regression scope.
- `templates/bug-report.md` for defects found during testing, review, or validation.
- `templates/qa-test-report.md` for runtime QA validation evidence and conclusion.

When a template file is needed, copy or adapt its structure into the project artifact requested by the user. Do not create unnecessary documents.

## Script

Use `scripts/qa_artifacts.mjs` only for deterministic template generation. It must not decide test scope, evaluate quality, or replace engineering judgment.
