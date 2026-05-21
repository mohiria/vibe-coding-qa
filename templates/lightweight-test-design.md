# Lightweight Test Design

## Context

- Requirement / Spec:
- Change summary:
- Target modules / APIs / pages:
- Test environment / constraints:

## Input Sources Checked

- [ ] Spec / PRD / acceptance criteria
- [ ] Data model / field rules / CRUD matrix
- [ ] API contract / auth rules / error shape
- [ ] UI states / user roles / user paths
- [ ] Code structure / changed code / dependency graph
- [ ] Existing tests / historical defects / flaky areas
- [ ] Test data / credentials / mocks / CI constraints

## Test Points

`Coverage artifact` may be empty during initial analysis. After a Red test or other automated test is created and executed, update it with the project-root relative path and optional `#testName`.

| Test point | Source | Design method | Test layer | Input / precondition | Expected result | Assertion target | Priority | Coverage artifact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 供应商名称不能为空 | Spec 字段规则 | 等价类划分 | Unit + API/integration | `supplierName` 为空 | 校验失败 | 返回必填字段错误码和错误信息 | P0 | 初始为空；执行后回填，如 `backend/src/test/java/.../SupplierValidatorTest.java#shouldRejectEmptySupplierName` |
| 无权限用户不能删除供应商 | 权限规则 | 决策表 | API/integration + E2E smoke | 当前角色没有删除权限 | 删除请求被拒绝，页面不能删除 | HTTP 403；删除按钮隐藏或禁用 | P0 | 初始为空；执行后回填，如 `backend/src/test/java/.../SupplierPermissionApiTest.java#shouldRejectDeleteWithoutPermission` |

## TDD Candidates

| Test point | Initial failing test | Why it should fail before implementation | Minimal behavior to pass | Related regression |
| --- | --- | --- | --- | --- |
| 供应商名称不能为空 | `shouldRejectEmptySupplierName` | 当前校验器未处理空名称 | 增加必填校验并返回统一错误码 | 供应商创建、编辑相关校验测试保持通过 |

## E2E Scenarios

| Scenario | Persona / role | Preconditions | User path | Critical assertions | Cleanup | Evidence on failure |
| --- | --- | --- | --- | --- | --- | --- |
| 无权限用户删除供应商失败 | 普通采购用户 | 已登录；存在一个供应商；用户无删除权限 | 打开供应商列表 -> 定位供应商 -> 尝试删除 | 删除入口不可用，或请求返回 403；供应商仍存在 | 无需清理，或删除测试供应商 | screenshot / trace / network log |

## Prerequisite Blockers

| Blocker | Affected test point | Required owner action | Status |
| --- | --- | --- | --- |
| 测试账号缺少无删除权限角色 | 无权限用户不能删除供应商 | 提供或创建对应测试账号 | BLOCKED |

## Coverage Closure

- [ ] Each in-scope executable test point has a coverage artifact after prerequisites are available.
- [ ] New or modified tests were executed and results were recorded.
- [ ] Red tests failed for the expected behavior reason when strict TDD applies.
- [ ] Commands, logs, screenshots, traces, or reports are recorded as execution evidence when relevant.
- [ ] Uncovered test points and unresolved prerequisite blockers are listed explicitly.
- [ ] Runtime QA validation, if performed, is treated only as availability smoke evidence and not counted as Unit/API/E2E business coverage.

## Notes

- Uncovered test points:
- Remaining risks:
- Execution evidence:
