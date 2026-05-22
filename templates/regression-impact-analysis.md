# Regression Impact Analysis

## Change Summary

- Requirement / change ID:
- Change type: requirement / code / test / config / environment
- Changed behavior:
- Impacted modules / APIs / pages:
- Author / owner:

Example only. Replace with project-specific behavior.

- Requirement / change ID: `REQ-2026-014`
- Change type: requirement + API
- Changed behavior: Entity name changes from optional to required; users without delete permission cannot see the delete entry.
- Impacted modules / APIs / pages: `EntityValidator`, `DELETE /api/entities/{id}`, entity list page

## Requirement-Driven Test Changes

| Existing / new test | Action | Requirement source | Reason | Remaining coverage |
| --- | --- | --- | --- | --- |
| `EntityValidatorTest#allowsEmptyName` | Modify | `REQ-2026-014` field rule | Old expectation is replaced by the active requirement | Add `shouldRejectEmptyName` to cover the required-field rule |
| `EntityPermissionApiTest#shouldRejectDeleteWithoutPermission` | Add | Permission rule | Cover API denial for users without delete permission | API layer covers HTTP 403 and unchanged data |
| `entity-permission.spec.ts` | Add focused E2E smoke | Permission rule | Confirm the page delete entry is unavailable | E2E covers only the critical path, not every permission combination |

## Impact Analysis

| Changed item | Impacted behavior | Existing tests to run | New / modified tests needed | Notes |
| --- | --- | --- | --- | --- |
| `EntityValidator` | Name validation during create and edit | `EntityValidatorTest` | Add empty-name rejection test | Unit is the lowest effective layer |
| `DELETE /api/entities/{id}` | Delete permission and data consistency | `EntityPermissionApiTest` | Add API test for delete denial | Assert HTTP 403 and unchanged data |
| Entity list page | Delete button visibility or disabled state | `entity-list.spec.ts` | Add focused E2E smoke | Cover only the critical no-permission path |

## Risk Level

- Risk: Low / Medium / High
- Rationale:

Example:

- Risk: Medium
- Rationale: Involves field validation, permission rules, and a page entry, but not migrations, money, or tenant boundaries; requires Unit + API/integration + focused E2E smoke.

## Selected Regression Tests

| Test / suite | Layer | Why selected | Command | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| `EntityValidatorTest` | Unit | Covers changed field rule and related old validation | `mvn test -Dtest=EntityValidatorTest` | PASS / FAIL / BLOCKED | command output / report path |
| `EntityPermissionApiTest` | API/integration | Covers delete permission and unchanged data | `mvn test -Dtest=EntityPermissionApiTest` | PASS / FAIL / BLOCKED | command output / report path |
| `entity-permission.spec.ts` | E2E | Covers critical no-permission UI path | `pnpm playwright test entity-permission.spec.ts` | PASS / FAIL / BLOCKED | trace / screenshot |

## Tests Not Run / Blockers

| Test / scope | Reason not run | Exact blocker | Owner action | Residual risk |
| --- | --- | --- | --- | --- |
| `entity-permission.spec.ts` | BLOCKED | Missing test account without delete permission | Provide or create the required account | Page permission entry is not automated yet |

## Runtime QA Validation

Runtime QA validation is availability smoke evidence only. It does not count as Unit/API/E2E business coverage.

| Needed? | Reason | Operation | Result | Evidence |
| --- | --- | --- | --- | --- |
| Yes / No | 配置或部署风险说明 | 启动服务并访问健康检查 / 打开关键页面 | PASS / FAIL / BLOCKED | log / screenshot / response |

## Regression Conclusion

- Overall result: PASS / FAIL / BLOCKED
- Changed behavior covered:
- Directly impacted old behavior covered:
- Historical defects considered:
- Uncovered test points:
- Unresolved prerequisite blockers:
- Remaining risks:
