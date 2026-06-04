# Agent And OpenSpec Orchestration

Use this reference when generating project-level coding-agent instructions for a repository that uses OpenSpec together with `vibe-coding-qa`.

This skill does not implement or modify OpenSpec commands. OpenSpec owns requirement/change artifacts. `vibe-coding-qa` owns pre-code TDD gates, test design, Red evidence, test execution, regression, and QA reporting. Project-level agent instructions own the execution order between them.

Apply this contract to the instruction surface used by the current coding agent, such as `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, OpenCode project instructions, or another repository-local agent guide. This skill should not create those tool-specific files unless the user explicitly asks for that integration.

## Required Two-Stage Flow

Behavior-changing work must not write production code directly.

Stage 1: OpenSpec turns requirements into behavior contracts.

| Command | Required meaning in project instructions |
| --- | --- |
| `/opsx:explore <topic>` | Research and clarify only; do not implement or change production code. |
| `/opsx:propose <change>` | Create `proposal.md`, `design.md`, `tasks.md`, and `specs/<capability>/spec.md`. |
| `/opsx:apply <change>` | Execute tasks one by one: before any production code change, pass the `vibe-coding-qa` Pre-Code TDD Gate; then implement the minimum behavior needed for Green. |
| `/opsx:archive <change>` | After implementation, tests, regression, and QA report are complete, archive the delta spec into `openspec/specs/`. |

`spec.md` should contain Given-When-Then behavior contracts only. DB schema, class names, file paths, implementation steps, and task sequencing belong in `design.md` or `tasks.md`.

Stage 2: `vibe-coding-qa` implements through TDD.

For every task that changes production code, the coding agent must stop before writing code and confirm one of:

- Valid Red evidence: an executed test failed for the expected behavior reason.
- Existing reusable failing test: a current failing test already proves the behavior gap.
- Documented non-TDD exception: reason, alternative validation, and residual risk are recorded.
- Exact blocker: the missing dependency, account, service, permission, environment variable, test framework, or unsafe setup path is recorded.

Compile errors, missing methods/classes/endpoints, import errors, fixture failures, environment failures, and DB connection failures are not Red evidence.

## Artifact Placement

Use these defaults unless the project explicitly overrides them:

- QA design/report artifacts: `openspec/changes/<change>/qa/`.
- Lightweight design: `openspec/changes/<change>/qa/lightweight-test-design.md`.
- QA report: `openspec/changes/<change>/qa/qa-test-report.md`.
- Regression or bug artifacts: same `qa/` folder when needed.
- Automated test code: project test directories such as `backend/src/test/...`, `frontend/src/**/*.test.ts`, or `frontend/tests/e2e/...`; never place executable test code in `qa/`.

## Apply-Time Gate Text

Project-level agent instructions should not describe `/opsx:apply <change>` as only "implement tasks". Use wording equivalent to:

```text
/opsx:apply <change> executes tasks one by one. Before each task that changes production code, create or update the QA lightweight test design, produce valid Red evidence or record an allowed exception/blocker, and only then implement the minimum production change needed for Green.
```

If production code was written before the lightweight design and Red/exception/blocker evidence, record this as a TDD violation or non-TDD exception in the QA report. Do not present after-the-fact tests as normal TDD.
