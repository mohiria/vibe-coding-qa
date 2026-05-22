# Gemini CLI Project Instructions

These instructions currently cover only the TDD/QA workflow for this repository. They do not define broader project rules such as code style, branching, release, dependency, or architecture policy.

## TDD / QA Workflow

Use the installed `vibe-coding-qa` skill/reference for behavior-changing work, including feature work, bug fixes, API changes, validation changes, permission or state transition changes, and regression fixes.

Before modifying production code, one of the following must exist:

- Lightweight test design for the behavior being changed.
- Valid Red evidence from a test that fails for the expected behavior reason.
- A reusable existing failing test that already proves the behavior gap.
- A documented non-TDD exception with alternative validation and remaining risk.
- An exact blocker that prevents creating or running the Red test.

If requirement authority conflicts with existing tests, current implementation, old Specs, API contracts, or data model behavior, use the Requirement Conflict Gate from `vibe-coding-qa`. Do not guess expected behavior or change tests or production code for the disputed behavior until the conflict is resolved.

Never weaken assertions, skip tests, delete tests, or change expected behavior only to make a suite pass.

At completion, report TDD evidence, tests run, coverage artifacts, regression scope, blockers, and remaining risks. When a lightweight test design or QA report is produced, run `node scripts/qa_artifacts.mjs check <template-name> <artifact-path>` when practical and report any unresolved FAIL or WARN findings.
