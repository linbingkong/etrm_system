# 前端开发规范

## 1. 技术栈与基本原则

本项目前端采用 Vue 3、TypeScript、Vite、Element Plus、Pinia、Apache ECharts、AntV X6，并通过 WebSocket 或 SSE 接入实时行情、预警和交易状态数据。

开发原则：

- 使用 Vue 3 Composition API，不使用 Options API 编写新页面。
- 所有业务代码使用 TypeScript，禁止新增隐式 `any`。
- 中后台页面优先使用 Element Plus 组件，避免重复造基础表单、表格、弹窗和分页组件。
- 图表类需求优先使用 ECharts；交易流程、拓扑、闭环流转图优先使用 AntV X6。
- 页面实现应服务于电力交易高频操作场景，优先保证信息密度、可读性、响应速度和错误提示清晰。

## 2. 目录结构

前端代码统一放在 `frontend/` 下：

```text
frontend/
├── src/
│   ├── api/          # API 请求封装
│   ├── assets/       # 静态资源
│   ├── components/   # 通用组件
│   ├── layouts/      # 页面布局
│   ├── router/       # 路由配置
│   ├── stores/       # Pinia 状态
│   ├── types/        # TypeScript 类型
│   └── views/        # 业务页面
└── tests/            # 前端测试
```

`views/` 按业务域组织，目录名与现有骨架保持一致，例如 `market-monitoring`、`trading`、`contracts`、`settlement`、`strategy`、`system-admin`。跨模块复用组件放入 `components/`；只服务单个页面的组件放在对应业务目录内部。

## 3. 命名规范

- Vue 组件文件使用 `PascalCase.vue`，例如 `SettlementBillTable.vue`。
- Composable 使用 `useXxx.ts`，例如 `useRealtimePrice.ts`。
- Pinia Store 使用 `useXxxStore`，文件名使用 `xxx.store.ts`。
- API 文件按业务域命名，例如 `market-monitoring.api.ts`。
- 类型文件按业务域命名，例如 `settlement.types.ts`。
- 常量使用 `UPPER_SNAKE_CASE`，普通变量和函数使用 `camelCase`。

## 4. 组件开发规范

组件应职责单一，避免一个组件同时处理接口请求、复杂计算、表格渲染和弹窗状态。推荐分层：

- 页面组件负责路由参数、页面布局和业务流程编排。
- 业务组件负责单一业务区域，例如报价曲线、结算明细表、合同编辑表单。
- 通用组件只承载与业务无关的 UI 能力，例如筛选栏、数据卡片、导出按钮。

组件 Props 和 Emits 必须声明类型。涉及电量、电价、费用、偏差率等字段时，应通过明确字段名表达单位，例如 `priceYuanPerMwh`、`energyMwh`、`feeYuan`。

## 5. API 与类型管理

所有 HTTP 请求统一封装在 `src/api/`，页面组件不得直接调用底层请求库。API 方法按业务动作命名，例如 `getSpotPriceCurve`、`submitDayAheadBid`、`reviewSettlementBill`。

接口响应类型优先来自后端 OpenAPI 生成结果；手写类型必须放在 `src/types/`，并与后端 Pydantic Schema 保持字段一致。禁止在页面中临时拼接不透明对象。

接口错误必须转化为用户可理解的信息。交易申报、结算审核、合同保存等关键操作失败时，应显示服务端返回的业务原因，并保留用户已填写数据。

## 6. 状态管理与实时数据

Pinia 仅保存跨页面、跨组件共享的状态，例如当前市场、交易日、用户权限、实时行情缓存和仓位上下文。单页面临时筛选条件优先使用组件本地状态。

WebSocket/SSE 接入应封装为 composable 或 store action，统一处理连接、重连、心跳、消息解析和释放。组件卸载时必须取消订阅，避免重复推送。实时曲线数据要限制缓存长度，避免长时间运行导致内存增长。

## 7. 表单、表格与图表规范

- 表单必须包含必填校验、范围校验和业务单位提示。
- 金额、电量、电价、比例展示必须统一格式化，不在模板中直接写复杂格式化逻辑。
- 表格列较多时应固定关键列，并提供排序、筛选或导出能力。
- ECharts 配置应拆分为可测试的纯函数，避免在组件模板附近堆积大段 option。
- 图表和表格必须处理空数据、加载中、接口失败和无权限状态。

## 8. 测试规范

前端测试使用 Vitest 和 Vue Test Utils。测试文件命名为 `*.spec.ts`，放在 `frontend/tests/` 或业务目录附近。

重点测试：

- 电价、电量、费用和偏差率格式化。
- Pinia Store 的状态变更和实时消息处理。
- 表单校验和提交失败回显。
- 图表 option 生成函数。
- 权限控制下的按钮、菜单和页面可见性。

## 9. 提交前检查清单

提交前确认：

- 页面目录、组件命名和 API 文件命名符合规范。
- 没有新增隐式 `any`、硬编码接口地址或生产密钥。
- 关键表单、表格、图表包含加载、空数据和错误状态。
- 交易、结算、合同等关键操作失败时不会丢失用户输入。
- 新增逻辑已补充对应测试或说明无法测试的原因。
