# Bug Report

## Summary

- Title:
- Severity: P0 / P1 / P2 / P3
- Status: New / Confirmed / Fixed / Blocked
- Found by: test / review / runtime validation / user report
- Related requirement / test point:

Example:

- Title: 无权限用户可以通过 API 删除供应商
- Severity: P1
- Found by: API/integration test
- Related requirement / test point: 权限规则：无删除权限用户不能删除供应商

## Environment

- Project / module:
- Branch / commit:
- Environment: local / CI / preview / staging / production-like
- Browser / OS / runtime:
- Test account / role:
- Relevant config:

Do not record secrets, real user data, credentials, or full sensitive logs.

## Reproduction Steps

1. 使用无删除权限的测试账号登录。
2. 调用 `DELETE /api/suppliers/{id}`。
3. 查询供应商详情或列表。

## Expected Result

- API 返回 HTTP 403。
- 响应体包含统一权限错误码和错误信息。
- 供应商数据未被删除。

## Actual Result

- API 返回 HTTP 200。
- 供应商记录被删除。

## Evidence

| Evidence type | Location / snippet | Notes |
| --- | --- | --- |
| Command output | `mvn test -Dtest=SupplierPermissionApiTest#shouldRejectDeleteWithoutPermission` | 测试失败，断言期望 403 实际 200 |
| API response | sanitized response body | 不包含 token 或真实用户数据 |
| Log / trace / screenshot | report path or CI URL | 仅保留必要片段 |

## Failure Classification

| Field | Value |
| --- | --- |
| Failure type | Code implementation problem / Test design problem / Requirement change / Test data problem / Environment problem / Flaky test / Spec ambiguity |
| Root cause | 删除接口只校验登录态，未校验 `supplier:delete` 权限 |
| Why not test-only | 测试断言符合权限规则，不能修改期望来通过 |

## Impact

- Affected users / roles: 无删除权限的普通采购用户
- Affected data / workflow: 供应商主数据删除
- Regression risk: Medium / High
- Related historical defects:

## Suggested Fix

- 在删除供应商服务或 API 层增加 `supplier:delete` 权限校验。
- 确保无权限请求不产生数据变更。
- 保持错误响应格式与现有权限错误一致。

## Test Reinforcement

| Layer | Required test | Coverage artifact |
| --- | --- | --- |
| Unit | 权限判断函数拒绝无删除权限角色 | `backend/src/test/java/.../SupplierPermissionTest.java#shouldRejectDeleteWithoutPermission` |
| API/integration | `DELETE /api/suppliers/{id}` 返回 403 且数据未删除 | `backend/src/test/java/.../SupplierPermissionApiTest.java#shouldRejectDeleteWithoutPermission` |
| E2E | 无权限用户页面无删除入口或删除失败 | `frontend/tests/e2e/supplier-permission.spec.ts#rejects delete without permission` |

## Failure Learning

Record or recommend a project learning if this issue is likely to recur.

- Symptom: 无权限用户调用删除 API 返回 200。
- Root cause: API 层遗漏权限校验。
- Fast diagnosis signal: 权限类失败通常表现为 HTTP 200/204 代替 403，且数据发生变更。
- Correct fix pattern: 在服务入口统一校验权限，并断言拒绝路径无数据变更。
- Future trigger: 涉及删除、审批、归档等高风险操作时检查权限矩阵。
- Knowledge location: project QA notes / issue / wiki / team knowledge base

## Resolution

- Fix commit / PR:
- Tests run:
- Remaining uncovered test points:
- Unresolved prerequisite blockers:
- Final status: Fixed / Won't fix / Duplicate / Blocked
