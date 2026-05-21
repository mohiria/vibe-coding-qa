# Regression Impact Analysis

## Change Summary

- Requirement / change ID:
- Change type: requirement / code / test / config / environment
- Changed behavior:
- Impacted modules / APIs / pages:
- Author / owner:

Example:

- Requirement / change ID: `SUP-2026-014`
- Change type: requirement + API
- Changed behavior: 供应商名称从“可选”调整为“必填”，无删除权限用户不能看到删除入口
- Impacted modules / APIs / pages: `SupplierValidator`, `DELETE /api/suppliers/{id}`, 供应商列表页

## Requirement-Driven Test Changes

| Existing / new test | Action | Requirement source | Reason | Remaining coverage |
| --- | --- | --- | --- | --- |
| `SupplierValidatorTest#allowsEmptySupplierName` | Modify | `SUP-2026-014` 字段规则 | 旧预期已被需求替换 | 新增 `shouldRejectEmptySupplierName` 覆盖必填规则 |
| `SupplierPermissionApiTest#shouldRejectDeleteWithoutPermission` | Add | 权限规则 | 需要覆盖无权限删除 API 拒绝 | API 层覆盖 HTTP 403 和数据未删除 |
| `supplier-permission.spec.ts` | Add focused E2E smoke | 权限规则 | 需要确认页面入口不可用 | E2E 只覆盖关键路径，不覆盖所有权限组合 |

## Impact Analysis

| Changed item | Impacted behavior | Existing tests to run | New / modified tests needed | Notes |
| --- | --- | --- | --- | --- |
| `SupplierValidator` | 创建、编辑供应商时名称校验 | `SupplierValidatorTest` | 新增空名称拒绝测试 | Unit 是最低有效层 |
| `DELETE /api/suppliers/{id}` | 删除权限和数据一致性 | `SupplierPermissionApiTest` | 新增无权限删除 API 测试 | 断言 HTTP 403 且数据未删除 |
| 供应商列表页 | 删除按钮显示/禁用 | `supplier-list.spec.ts` | 新增 focused E2E smoke | 只覆盖无权限关键路径 |

## Risk Level

- Risk: Low / Medium / High
- Rationale:

Example:

- Risk: Medium
- Rationale: 涉及字段校验、权限规则和页面入口，但不涉及迁移、资金、跨租户边界；需要 Unit + API/integration + focused E2E smoke。

## Selected Regression Tests

| Test / suite | Layer | Why selected | Command | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| `SupplierValidatorTest` | Unit | 覆盖变更字段规则和相关旧校验 | `mvn test -Dtest=SupplierValidatorTest` | PASS / FAIL / BLOCKED | command output / report path |
| `SupplierPermissionApiTest` | API/integration | 覆盖删除权限和数据未变更 | `mvn test -Dtest=SupplierPermissionApiTest` | PASS / FAIL / BLOCKED | command output / report path |
| `supplier-permission.spec.ts` | E2E | 覆盖无权限用户关键 UI 路径 | `pnpm playwright test supplier-permission.spec.ts` | PASS / FAIL / BLOCKED | trace / screenshot |

## Tests Not Run / Blockers

| Test / scope | Reason not run | Exact blocker | Owner action | Residual risk |
| --- | --- | --- | --- | --- |
| `supplier-permission.spec.ts` | BLOCKED | 缺少无删除权限测试账号 | 提供或创建对应账号 | 页面权限入口未自动化验证 |

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
