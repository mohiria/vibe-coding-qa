# QA Test Report

## Conclusion

- Overall result: PASS / FAIL / BLOCKED
- Requirement / change ID:
- QA owner:
- Date:
- Summary:

Example:

- Overall result: BLOCKED
- Requirement / change ID: `SUP-2026-014`
- Summary: Unit 和 API/integration 已通过；E2E 因缺少无删除权限测试账号被阻塞；runtime validation 仅完成服务可用性 smoke。

## Scope

| Area | In scope? | Notes |
| --- | --- | --- |
| Unit | Yes / No | 核心字段校验、权限判断 |
| API/integration | Yes / No | `POST /api/suppliers`、`DELETE /api/suppliers/{id}` |
| E2E | Yes / No | 无权限用户删除供应商关键路径 |
| Regression | Yes / No | 供应商创建、编辑、删除相关旧行为 |
| Runtime QA validation | Yes / No | 仅验证服务启动和关键页面可达 |

## Tests Run

| Layer | Test / suite | Command | Result | Evidence |
| --- | --- | --- | --- | --- |
| Unit | `SupplierValidatorTest` | `mvn test -Dtest=SupplierValidatorTest` | PASS | command output / report path |
| API/integration | `SupplierPermissionApiTest` | `mvn test -Dtest=SupplierPermissionApiTest` | PASS | command output / report path |
| E2E | `supplier-permission.spec.ts` | `pnpm playwright test supplier-permission.spec.ts` | BLOCKED | 缺少无删除权限测试账号 |
| Regression | supplier related tests | `mvn test -Dtest=Supplier*Test` | PASS | command output / report path |

## Tests Not Run / Blockers

| Test / scope | Reason not run | Exact blocker | Required owner action | Residual risk |
| --- | --- | --- | --- | --- |
| `supplier-permission.spec.ts` | BLOCKED | 缺少无删除权限测试账号 | 提供或创建对应测试账号 | 页面权限入口未自动化验证 |

## Coverage Summary

| Test point | Layer | Coverage artifact | Status |
| --- | --- | --- | --- |
| 供应商名称不能为空 | Unit + API/integration | `backend/src/test/java/.../SupplierValidatorTest.java#shouldRejectEmptySupplierName` | COVERED |
| 无权限用户不能删除供应商 | API/integration | `backend/src/test/java/.../SupplierPermissionApiTest.java#shouldRejectDeleteWithoutPermission` | COVERED |
| 无权限用户页面不能删除供应商 | E2E | `frontend/tests/e2e/supplier-permission.spec.ts#rejects delete without permission` | BLOCKED |

## Regression Scope

- Changed behavior:
- Directly impacted old behavior:
- Historical defects considered:
- Requirement-driven test additions / modifications / deletions:
- Regression risk level: Low / Medium / High

Example:

- Changed behavior: 供应商名称必填；删除权限收紧。
- Directly impacted old behavior: 供应商创建、编辑、删除。
- Requirement-driven test changes: 修改空名称旧预期，新增无权限删除 API 测试。
- Regression risk level: Medium。

## Runtime QA Validation

Runtime QA validation is availability smoke evidence only. It does not count as Unit/API/E2E business coverage.

| Target | Operation | Result | Evidence | Cleanup |
| --- | --- | --- | --- | --- |
| local service | 启动服务并访问 `/health` | PASS | health response / log line | 停止本地服务 |
| supplier page | 打开供应商列表页 | PASS | screenshot / trace | 关闭 browser context |

## Failure Analysis

| Failure / issue | Failure type | Root cause | Action taken | Follow-up coverage |
| --- | --- | --- | --- | --- |
| E2E 未执行 | Environment problem / BLOCKED | 缺少无删除权限测试账号 | 报告 blocker，等待账号准备 | 账号准备后执行 `supplier-permission.spec.ts` |

## Failure Learning

- Learning recorded or recommended: Yes / No
- Knowledge location:
- Summary:

Example:

- Learning recorded or recommended: Yes
- Summary: 权限类缺陷需同时断言拒绝状态和数据未变更；后续涉及删除、审批、归档操作时优先检查权限矩阵。

## Remaining Risks

- Uncovered test points:
- Unresolved prerequisite blockers:
- Known flaky areas:
- Manual follow-up:

## Final Statement

Example:

Unit、API/integration 和相关回归测试已通过。E2E 权限路径因缺少无删除权限测试账号被阻塞，已记录 blocker 和剩余风险。Runtime QA validation 仅证明本地服务和供应商列表页可用，不计入 Unit/API/E2E 业务覆盖。当前结论为 BLOCKED，待测试账号准备后执行 E2E 并更新 coverage artifact。
