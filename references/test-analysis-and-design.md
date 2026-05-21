# Test Analysis and Design

Use this reference before generating or reviewing any test script. Its purpose is to decide what to test, why to test it, which layer should test it, and what assertions prove correctness.

## Goal

Vibe Coding QA must not jump from Spec directly to test code. AI must first create a lightweight test design that connects:

```text
Spec / PRD / data model / API contract / code change
-> test points
-> test design method
-> test layer
-> expected result
-> assertion target
-> test script or validation action
```

This design can be brief, but it must exist. It replaces heavy traditional test-case management while preserving real testing discipline.

## Inputs

Collect or inspect the available inputs before designing tests:

- Spec, PRD, user story, or acceptance criteria.
- Data model, field rules, entity relationships, status definitions, and CRUD matrix.
- API contract, request/response schema, error code convention, auth rules, and integration boundaries.
- UI design, page states, component behavior, user roles, and user paths.
- Existing code, changed code, dependency graph, and configuration.
- Existing tests, historical defects, production incidents, and flaky areas.
- Test environment, test data, credentials, mocks, and CI constraints.

If a required input is missing and the missing information changes expected behavior, stop and ask for clarification. Do not invent business rules.

## Analysis Sources

Extract test points from multiple sources. Do not rely on only one source.

| Source         | What to extract                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| Spec / PRD     | Business rules, user goals, acceptance criteria, in-scope and out-of-scope behavior.                    |
| Data model     | Required fields, unique constraints, enum values, length/range limits, relationships, lifecycle states. |
| CRUD matrix    | Create, read, update, delete, disable, archive, restore, pagination, filtering, sorting, permissions.   |
| API contract   | Method, path, request schema, response schema, status codes, error shape, auth, idempotency.            |
| UI design      | Initial/loading/empty/success/error states, form rules, disabled states, modal behavior, navigation.    |
| Code structure | Branches, conditions, exceptions, state transitions, validators, side effects, integration calls.       |
| Change diff    | Directly changed behavior, dependent modules, shared utilities, impacted endpoints and pages.           |
| History        | Past bugs, flaky tests, high-risk modules, escaped defects, production incidents.                       |

## Mixed Design Method

Use black-box, white-box, gray-box, and risk-based methods together.

### Black-Box Design

Use when deriving behavior from Spec, user roles, or externally visible behavior.

Apply:

- Equivalence partitioning for valid and invalid input classes.
- Boundary value analysis for numeric, length, date, count, and range limits.
- Decision tables for combinations of rules, permissions, flags, or statuses.
- State transition testing for workflow status changes.
- Use-case and scenario testing for user journeys.
- Error guessing for common invalid, missing, duplicate, expired, or conflicting data.

### White-Box Design

Use when code is visible and the test layer is unit or component-level.

Apply:

- Branch and condition coverage.
- Path coverage for important paths, not every theoretical path.
- Exception path coverage.
- Loop and collection boundary coverage.
- State mutation coverage.
- Side-effect observation for events, persistence calls, or emitted outputs.

White-box analysis may reveal missing tests, but it must not redefine expected behavior. Spec owns expected behavior.

### Gray-Box Design

Use when testing APIs, services, databases, authorization, and integrations.

Apply:

- API contract validation.
- Database constraint validation.
- Permission matrix testing.
- Request/response schema checks.
- Data consistency checks before and after mutation.
- Integration boundary checks with mocks, stubs, containers, or test doubles.

### Risk-Based Design

Use when deciding priority and regression scope.

Increase priority when a test point involves:

- Revenue, compliance, security, or data loss.
- Authentication or authorization.
- Shared utilities or shared data model changes.
- State transitions and workflow approvals.
- Import/export, batch operations, async jobs, or external integrations.
- Historical defects.
- High user frequency.
- Hard-to-detect failures.

## Test Layer Decision

Choose the lowest effective layer.

| Test point                                                           | Default layer                   | Notes                                                                       |
| -------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------- |
| Pure calculation, formatting, validation, branching, status decision | Unit                            | Best TDD target.                                                            |
| Service rule with repository or collaborator boundary                | Unit or integration             | Unit if dependencies can be isolated; integration if DB behavior matters.   |
| API request validation, auth, response shape, error code             | API/integration                 | Verify contract and observable service behavior.                            |
| Data persistence, uniqueness, transaction, query behavior            | API/integration                 | Use real or isolated test database when correctness depends on persistence. |
| Frontend component state, form validation, disabled/enabled rules    | Unit/component                  | Do not use E2E for every UI rule.                                           |
| Critical user path across pages and services                         | E2E                             | Keep focused on P0/P1 paths.                                                |
| Cross-role or multi-user workflow                                    | E2E                             | Use isolated roles, profiles, and deterministic data.                       |
| Existing behavior affected by change                                 | Regression through Unit/API/E2E | Select old automated tests by impact and risk.                              |

If a test can be reliable at a lower layer, do not move it to E2E just because E2E is available.

## Lightweight Test Design Format

Create a compact design table before generating tests.

Required fields:

| Field                | Meaning                                                                                                                                                                                                                                                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test point           | What behavior, rule, risk, or path is being verified.                                                                                                                                                                                                                                                                                   |
| Source               | Spec item, data field, API contract, code path, risk, or historical defect.                                                                                                                                                                                                                                                             |
| Design method        | Equivalence class, boundary value, decision table, path coverage, state transition, etc.                                                                                                                                                                                                                                                |
| Test layer           | Unit, API/integration, or E2E. Regression reuses these layers based on impact.                                                                                                                                                                                                                                                          |
| Input / precondition | Input values, role, data state, environment state, or setup condition.                                                                                                                                                                                                                                                                  |
| Expected result      | Observable correct behavior.                                                                                                                                                                                                                                                                                                            |
| Assertion target     | Specific value, status, response field, DB state, UI state, log, or artifact to assert.                                                                                                                                                                                                                                                 |
| Priority             | P0, P1, P2, or P3.                                                                                                                                                                                                                                                                                                                      |
| Coverage artifact    | Project-root relative path to the automated test file that covers this test point. It may be empty during initial analysis. After a Red test or other automated test is created and executed, update it with the relative path and optional `#testName`. Commands are supporting evidence only, except when no stable file path exists. |

Example. Use Chinese for project-specific test design content when the team works in Chinese. Keep code identifiers, API paths, enum values, field names, and test file names in their original form.

| Test point               | Source        | Design method | Test layer                  | Input / precondition | Expected result              | Assertion target              | Priority | Coverage artifact                                          |
| ------------------------ | ------------- | ------------- | --------------------------- | -------------------- | ---------------------------- | ----------------------------- | -------- | ---------------------------------------------------------- |
| 供应商名称不能为空       | Spec 字段规则 | 等价类划分    | Unit + API/integration      | `supplierName` 为空  | 校验失败                     | 返回必填字段错误码和错误信息 | P0       | 初始为空；实现后回填，如 `backend/src/test/java/.../SupplierValidatorTest.java#shouldRejectEmptySupplierName` |
| 无权限用户不能删除供应商 | 权限规则      | 决策表        | API/integration + E2E smoke | 当前角色没有删除权限 | 删除请求被拒绝，页面不能删除 | HTTP 403；删除按钮隐藏或禁用 | P0       | 初始为空；实现后回填，如 `backend/src/test/java/.../SupplierPermissionApiTest.java#shouldRejectDeleteWithoutPermission` |

## From Analysis to TDD

After lightweight design, identify TDD candidates.

Use strict Red-Green-Refactor for:

- Unit-level rules.
- API contract behavior that can be expressed before implementation.
- Integration behavior with stable test environment or test containers.
- Historical defect reproduction.

For each TDD candidate, record:

- Initial failing test name.
- Why it should fail before implementation.
- Minimal behavior required to pass.
- Related Spec or rule.
- Regression tests that must remain passing.

Then close coverage for each in-scope executable TDD candidate:

1. Check whether an appropriate test file or test class already exists.
2. If it exists, add or update the smallest relevant test case.
3. If it does not exist, create the test file or class following the project's existing test layout and naming conventions.
4. Run the new or modified test before implementation and confirm it fails for the expected behavior reason, not because of syntax, environment, import, or setup errors.
5. If the test cannot be created or run because prerequisites are missing, report the blocker to the human owner with the exact missing dependency, environment variable, account, service, plugin, or permission. Resume only after the human confirms it is resolved, then create/run the test and continue coverage closure.
6. After the Red test exists and has been executed, update `Coverage artifact` with the project-root relative path and optional test class/method or test name. Record the command as supporting evidence when useful.
7. Continue with Green and Refactor, then keep `Coverage artifact` aligned with the final code.

Do not create arbitrary new test locations. Follow the current repository conventions first. If no convention exists, place the test near the target code or in the standard test root for the stack, and document the choice.

For E2E, record scenario-first design:

- Persona or role.
- Preconditions and test data.
- User path.
- Critical assertions.
- Cleanup strategy.
- Evidence to capture on failure.

For E2E, `Coverage artifact` may remain empty during scenario design. After a Playwright test exists, update it with the project-root relative path. Scenario-first design is valid even before the Playwright test file exists.

## Data Model and Test Data Design

Data model analysis supplements test-point extraction. It should not be skipped.

Check:

- Required and optional fields.
- Unique constraints.
- Enum values and invalid values.
- Length, numeric, date, and count boundaries.
- Entity relationships.
- Delete, disable, archive, restore, and lifecycle semantics.
- Data ownership and permission boundaries.
- Seed data requirements.

Define test data strategy:

- Use unique test data names or prefixes.
- Make data creation repeatable.
- Make cleanup explicit.
- Prefer API setup for E2E when possible.
- Use isolated database, transaction rollback, containers, or seed scripts when practical.
- Never use real credentials or production data.

## Execution Support

Most test points in a Vibe Coding requirement package should be covered by automated tests in the current testing cycle. The expected default is to check prerequisites before execution and ask a human to resolve missing environment, plugin, account, data, or permission issues.

Use execution support to make automated tests runnable; do not treat execution support as business coverage.

Runtime QA validation may be used before or after automated tests when environment availability is a risk. It verifies startup, health checks, page/API reachability, logs, screenshots, or traces. It is a smoke-level availability check, not a substitute for unit, API/integration, or E2E coverage.

Before execution, perform prerequisite checks:

- Required service, plugin, browser, database, or external dependency is available.
- Required environment variables and credentials are present.
- Required test role/account exists.
- Required seed data, fixture, or mock service is available.
- Required command and test framework are available.

If a prerequisite is missing, do not mark the test as optional or resolved without execution. Report the blocker to the human owner, include the exact requirement, and resume execution after the human confirms the blocker is resolved.

## Coverage Closure

Coverage closure connects test design to actual test coverage. Perform it after generating, updating, and executing automated tests.

`Coverage artifact` may be empty during initial analysis. Update it after the automated test is created and executed; keep it aligned after Green and Refactor.

For each test point:

1. Ensure the in-scope executable test point has a `Coverage artifact` after the automated test is created and executed.
2. If execution is blocked by prerequisites, report the missing prerequisite to the human owner and mark the item as blocked only until the human confirms the prerequisite is resolved.
3. List any test points that remain uncovered and any prerequisite blockers that remain unresolved.

`Coverage artifact` should use a project-root relative path and may include `#testName`, for example:

```text
backend/src/test/java/com/acme/supplier/SupplierValidatorTest.java#shouldRejectEmptySupplierName
backend/src/test/java/com/acme/supplier/SupplierApiTest.java#shouldRejectMissingSupplierName
frontend/tests/e2e/supplier-permission.spec.ts
```

Do not use absolute local machine paths. Commands are supporting evidence for execution. If no stable file path exists and only a command covers the test point, record the command and the relevant test selector, for example:

```text
pnpm test -- supplier-validator
mvn test -Dtest=SupplierApiTest#shouldRejectMissingSupplierName
```

Create automated tests when:

- It protects core business behavior.
- It guards an API contract.
- It covers a defect that already happened.
- It is likely to regress.
- It can be run deterministically in local or CI.
- Manual repetition would be costly.

If a scenario truly cannot be covered by an automated unit, API/integration, or E2E test, document why and do not count it as covered by this skill.

## Completeness Checklist

Before generating scripts, verify:

- The expected behavior comes from Spec or explicit user confirmation.
- Normal, invalid, boundary, permission, and state scenarios were considered.
- Data model and API contract were checked when relevant.
- Test points were mapped to appropriate layers.
- Unit/API tests were preferred before E2E when sufficient.
- TDD candidates were identified.
- E2E scenarios have persona, path, assertion, data, and cleanup.
- Regression risks were identified for changed behavior.
- Test data setup and cleanup are clear.
- No test point relies on real secrets or production data.

After creating or executing tests, verify:

- Each in-scope executable test point has a coverage artifact after prerequisites are available.
- New or modified tests were executed and results were recorded.
- Red tests failed for the expected behavior reason before implementation when strict TDD applies.
- Coverage artifacts use project-root relative paths, with optional `#testName`.
- Commands, logs, screenshots, traces, or reports are recorded as execution evidence when relevant.
- Uncovered test points and unresolved prerequisite blockers are listed explicitly.
- Runtime QA validation, if performed, is treated only as availability smoke evidence and not counted as Unit/API/E2E business coverage.
