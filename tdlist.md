# 项目工作进展与下一步计划

> 本文档用于记录“山东电力交易辅助决策系统”的当前开发进展、待办事项和后续实施计划。每完成一个阶段或页面，应同步更新本文档。

## 1. 当前总体状态

项目已完成开发前期准备、首批 P0 页面开发、5.1 优先接口契约与首轮前端联调，并已完成数据库表结构、迁移方案、Alembic 基础配置、SQLAlchemy 模型、迁移脚本、PostgreSQL 迁移验证和基础数据 seed 落库。当前后端已提供策略管理、结算审核、系统用户/角色/菜单管理的内存态接口；前端相关页面已优先读取接口数据，并在接口不可用时保留页面 seed 数据用于离线展示与测试。

## 2. 已完成事项

### 2.1 项目文档与规范

- 已整理 PRD、功能清单、菜单规划等基础文档。
- 已建立前端开发规范、后端开发规范、AI 执行总纲和 `AGENTS.md`。
- 已在 `docs/pages` 下按菜单规划创建页面目录。
- 已新增接口契约文档：`docs/api/priority-api-contracts.md`。
- 已新增数据库设计文档：
  - `docs/database/database-table-design.md`
  - `docs/database/migration-plan.md`

### 2.2 工程基础

- 前端：Vue 3、Vite、TypeScript、Pinia、Element Plus、ECharts。
- 后端：FastAPI、Pydantic v2、SQLAlchemy Async 依赖、asyncpg、Redis 依赖。
- 已建立前端和后端测试验证流程。

### 2.3 首批页面完成清单

| 序号 | 模块 | 页面 | 路由 | 状态 |
|---:|---|---|---|---|
| 1 | 工作台 | 工作台首页 | `/dashboard` | 已完成 |
| 2 | 市场监测 | 市场行情总览 | `/market-monitoring/overview` | 已完成 |
| 3 | 市场监测 | 价格监测 | `/market-monitoring/prices` | 已完成 |
| 4 | 市场监测 | 价格预测 | `/market-monitoring/price-forecast` | 已完成 |
| 5 | 交易管理 | 交易总览 | `/trading/overview` | 已完成 |
| 6 | 交易管理 | 现货交易申报 | `/trading/spot-bid` | 已完成 |
| 7 | 交易管理 | D1 曲线申报 | `/trading/d1-curve` | 已完成 |
| 8 | 合同管理 | 合同列表 | `/contracts/list` | 已完成 |
| 9 | 结算管理 | 结算总览 | `/settlement/overview` | 已完成 |
| 10 | 结算管理 | 结算审核 | `/settlement/review` | 已完成 |
| 11 | 机组与发电 | 发电侧总览 | `/generation/overview` | 已完成 |
| 12 | 负荷与用电 | 用电侧总览 | `/load/overview` | 已完成 |
| 13 | 分析与报表 | 分析中心 | `/reports/analysis-center` | 已完成 |
| 14 | 策略管理 | 策略列表 | `/strategy/list` | 已完成 |
| 15 | 系统管理 | 用户管理 | `/system-admin/users` | 已完成 |
| 16 | 系统管理 | 角色管理 | `/system-admin/roles` | 已完成 |
| 17 | 系统管理 | 菜单管理 | `/system-admin/menus` | 已完成 |

### 2.4 第二批页面完成清单

| 序号 | 模块 | 页面 | 路由 | 状态 |
|---:|---|---|---|---|
| 1 | 系统管理 | 权限节点 | `/system-admin/permission-nodes` | 已完成 |
| 2 | 结算管理 | 结算单明细 | `/settlement/bills` | 已完成 |
| 3 | 结算管理 | DA 费用审核 | `/settlement/da-fee-check` | 已完成 |
| 4 | 结算管理 | RT 费用审核 | `/settlement/rt-fee-check` | 已完成 |
| 5 | 交易管理 | 中长期交易 | `/trading/long-term` | 已完成 |
| 6 | 交易管理 | 交易待办 | `/trading/todo` | 已完成 |
| 7 | 交易管理 | 交易已办 | `/trading/done` | 已完成 |
| 8 | 市场监测 | 交易日历 | `/market-monitoring/trading-calendar` | 已完成 |
| 9 | 交易管理 | 交易约束 | `/trading/constraints` | 已完成 |
| 10 | 系统管理 | 字典管理 | `/system-admin/dictionaries` | 已完成 |
| 11 | 系统管理 | 配置管理 | `/system-admin/configurations` | 已完成 |
| 12 | 市场监测 | 供需分析 | `/market-monitoring/supply-demand` | 已完成 |
| 13 | 系统管理 | 消息通知 | `/system-admin/messages` | 已完成 |
| 14 | 市场监测 | 跨省联络线 | `/market-monitoring/tie-line` | 已完成 |
| 15 | 合同管理 | 合同模板 | `/contracts/templates` | 已完成 |
| 16 | 系统管理 | 模板管理 | `/system-admin/templates` | 已完成 |
| 17 | 市场监测 | 气象监测 | `/market-monitoring/weather` | 已完成 |
| 18 | 合同管理 | 新建合同 | `/contracts/create` | 已完成 |
| 19 | 系统管理 | 数据导入 | `/system-admin/imports` | 已完成 |
| 20 | 系统管理 | 基础信息 | `/system-admin/basic-info` | 已完成 |
| 21 | 市场监测 | 市场参数 | `/market-monitoring/market-params` | 已完成 |
| 22 | 合同管理 | 到期提醒 | `/contracts/expiry-alerts` | 已完成 |
| 23 | 系统管理 | 访问分析 | `/system-admin/visit-analysis` | 已完成 |
| 24 | 分析与报表 | 盈亏分析 | `/reports/profit-loss` | 已完成 |
| 25 | 分析与报表 | 月度报告 | `/reports/monthly-report` | 已完成 |
| 26 | 分析与报表 | 数据导出 | `/reports/export` | 已完成 |
| 27 | 分析与报表 | 统计分析 | `/reports/statistics` | 已完成 |
| 28 | 分析与报表 | 对比分析 | `/reports/contrast` | 已完成 |
| 29 | 分析与报表 | 站点分析 | `/reports/site-analysis` | 已完成 |
| 30 | 分析与报表 | 图表管理 | `/reports/charts` | 已完成 |
| 31 | 机组与发电 | 发电监测 | `/generation/monitoring` | 已完成 |
| 32 | 机组与发电 | 火电运行 | `/generation/thermal` | 已完成 |
| 33 | 机组与发电 | 新能源监测 | `/generation/new-energy` | 已完成 |
| 34 | 负荷与用电 | 负荷监测 | `/load/monitoring` | 已完成 |
| 35 | 负荷与用电 | 本地负荷 | `/load/local` | 已完成 |
| 36 | 机组与发电 | 启停机管理 | `/generation/start-stop` | 已完成 |
| 37 | 负荷与用电 | 自用电管理 | `/load/self-use` | 已完成 |
| 38 | 负荷与用电 | 净负荷 | `/load/net-load` | 已完成 |
| 39 | 负荷与用电 | 弃电管理 | `/load/curtailment` | 已完成 |
| 40 | 机组与发电 | 机组管理 | `/generation/units` | 已完成 |
| 41 | 负荷与用电 | 省间负荷 | `/load/province-load` | 已完成 |
| 42 | 机组与发电 | 发电目标 | `/generation/targets` | 已完成 |
| 43 | 机组与发电 | 绿电目标 | `/generation/green-energy-targets` | 已完成 |
| 44 | 机组与发电 | 设备检测 | `/generation/equipment-check` | 已完成 |
| 45 | 售电管理 | 售电总览 | `/retail/overview` | 已完成 |
| 46 | 售电管理 | 售电产品结构 | `/retail/product-structure` | 已完成 |
| 47 | 售电管理 | 套餐管理 | `/retail/packages` | 已完成 |
| 48 | 考核管理 | 双考核分析 | `/assessment/two-assessment-analysis` | 已完成 |
| 49 | 考核管理 | 双准则检查 | `/assessment/two-criteria-check` | 已完成 |
| 50 | 考核管理 | 准则信息查询 | `/assessment/criteria-info` | 已完成 |
| 51 | 考核管理 | 其他审核 | `/assessment/other-check` | 已完成 |
| 52 | 考核管理 | 考核参数配置 | `/assessment/criteria-config` | 已完成 |
| 53 | 考核管理 | 恢复审核 | `/assessment/recover-check` | 已完成 |
| 54 | 策略管理 | 新增策略 | `/strategy/create` | 已完成 |
| 55 | 第三方集成 | 实时通信监控 | `/integrations/realtime` | 已完成 |
| 56 | 第三方集成 | 山东数据 API | `/integrations/shandong-api` | 已完成 |
| 57 | 第三方集成 | 市场大屏 | `/integrations/market-board` | 已完成 |
| 58 | 第三方集成 | Token 登录配置 | `/integrations/token-login` | 已完成 |
| 59 | 第三方集成 | 文件在线预览 | `/integrations/file-preview` | 已完成 |
| 60 | 工作台 | 快捷导航配置 | `/dashboard/quick-nav` | 已完成 |
| 61 | 工作台 | 通知中心 | `/dashboard/notices` | 已完成 |
| 62 | 交易管理 | 滚动撮合 | `/trading/rolling-matching` | 已完成 |
| 63 | 交易管理 | 限价管理 | `/trading/price-limits` | 已完成 |
| 64 | 结算管理 | 月度交易审核 | `/settlement/monthly-deal-check` | 已完成 |
| 65 | 结算管理 | 结算均价分析 | `/settlement/average-price` | 已完成 |
| 66 | 结算管理 | 修正统计 | `/settlement/corrections` | 已完成 |
| 67 | 分析与报表 | 相似分析 | `/reports/similar-analysis` | 已完成 |
| 68 | 策略管理 | 经济策略 | `/strategy/economic` | 已完成 |
| 69 | 策略管理 | 策略介绍 | `/strategy/intro` | 已完成 |
| 70 | 策略管理 | 月度模型 | `/strategy/monthly-model` | 已完成 |
| 71 | 策略管理 | 权重管理 | `/strategy/weights` | 已完成 |

## 3. 接口与数据库任务完成情况

| 任务 | 完成情况 |
|---|---|
| 建立首批页面后端接口清单 | 已完成，见 `docs/api/priority-api-contracts.md` |
| 策略列表与现货交易申报打通策略持久化接口 | 已完成内存态接口，新增 `/api/v1/strategies` 系列接口 |
| 系统管理用户/角色/菜单 CRUD 与权限控制基础 | 已完成基础 CRUD 内存态接口，权限控制待后续深化 |
| 结算审核通过、退回重算、异常标记接口 | 已完成 `/api/v1/settlement-review/tasks` 系列接口 |
| 数据库表结构设计 | 已完成，见 `docs/database/database-table-design.md` |
| 数据库迁移方案设计 | 已完成，见 `docs/database/migration-plan.md` |
| Alembic 基础配置 | 已完成，新增 `backend/alembic.ini` 与 `backend/alembic/` |
| SQLAlchemy 模型 | 已完成，覆盖策略、结算审核、用户、角色、菜单、权限、审计日志 |
| 首个迁移脚本 | 已完成，新增 `20260706_0001_create_core_business_tables.py` |
| 菜单路径约束调整迁移 | 已完成，新增 `20260706_0002_allow_duplicate_menu_paths.py`，允许目录与默认页复用路由 |
| Seed 幂等 upsert 服务 | 已完成，新增 `backend/app/services/database_seed.py` 与 `backend/app/cli/seed_database.py` |
| PostgreSQL 连接配置 | 已完成，`backend/.env` 指向 `192.168.50.167:5432/etrm` |
| Alembic upgrade/downgrade 验证 | 已完成，当前版本 `20260706_0002` |
| 核心业务表创建 | 已完成，已创建 11 张业务表和 `alembic_version` |
| 基础数据 seed 执行 | 已完成，已写入 4 个用户、4 个角色、101 个菜单、125 个权限及角色授权关系 |
| 策略管理数据库 repository | 已完成，`/api/v1/strategies` 已从内存 store 切换为 PostgreSQL repository，并补充 SQLite 隔离集成测试 |
| 结算审核数据库 repository | 已完成，`/api/v1/settlement-review/tasks` 已从内存 store 切换为 PostgreSQL repository，支持审核、退回、重算、异常标记和操作日志 |
| 系统管理数据库 repository | 已完成，`/api/v1/system/users`、`/roles`、`/menus` 已从内存 store 切换为 PostgreSQL repository，支持用户角色关系、角色成员数和权限数聚合 |
| 登录态与接口鉴权 | 已完成，新增 `/api/v1/auth/login`、`/auth/me`，策略、结算审核、系统管理接口已接入 Bearer token 与权限码校验 |
| 结算审核轨迹接口 | 已完成，新增 `/api/v1/settlement-review/tasks/{task_id}/logs`，前端 API 已补充日志查询入口 |
| 结算审核轨迹前端展示 | 已完成，`/settlement/review` 已新增审核轨迹面板，支持按结算单切换查看状态流转和操作说明 |
| 系统管理角色授权 | 已完成，新增 `/api/v1/system/roles/{role_id}/authorization` 查询与更新接口，支持角色菜单和权限点调整 |
| 关键动作审计与规则 | 已完成，结算审核动作和策略提交已写入 `audit_logs`，结算审核重复审批等非法状态流转返回 409 |
| 权限节点前端页面 | 已完成，新增 `/system-admin/permission-nodes`，支持角色授权查询、菜单权限勾选、按钮权限勾选和授权保存 |
| 第二批结算页面 | 已完成，新增 `/settlement/bills`、`/settlement/da-fee-check`、`/settlement/rt-fee-check`、`/settlement/monthly-deal-check`、`/settlement/average-price`、`/settlement/corrections`，当前使用前端 mock 数据并预留后端接口接入 |
| 第二批交易页面 | 已完成，新增 `/trading/long-term`、`/trading/todo`、`/trading/done`、`/trading/constraints`、`/trading/rolling-matching`、`/trading/price-limits`，覆盖中长期台账、交易待办、交易已办查询、交易约束复核、滚动撮合和限价管理 |
| 第二批市场监测页面 | 已完成，新增 `/market-monitoring/trading-calendar`、`/market-monitoring/supply-demand`、`/market-monitoring/tie-line`、`/market-monitoring/market-params`，覆盖交易节点时间轴、供需裕度、风险时段、联络线通道利用率、阻塞风险和市场规则参数 |
| 第二批合同页面 | 已完成，新增 `/contracts/templates`、`/contracts/create`、`/contracts/expiry-alerts`，覆盖合同模板、新建合同和到期续签提醒 |
| 第二批系统管理页面 | 已完成，新增 `/system-admin/dictionaries`、`/system-admin/configurations`、`/system-admin/messages`、`/system-admin/visit-analysis`，覆盖基础字典、系统参数、交易阈值、集成配置、消息通知和访问分析 |
| 第二批分析报表页面 | 已完成，新增 `/reports/profit-loss`、`/reports/monthly-report`、`/reports/export`、`/reports/statistics`、`/reports/contrast`、`/reports/site-analysis`、`/reports/charts`、`/reports/similar-analysis`，覆盖交易收益、偏差成本、结算损益、收益归因、经营月报章节汇总、报表导出任务管理、统计分析、对比分析、站点分析、图表管理和相似分析 |
| 第二批发电侧页面 | 进行中，新增 `/generation/monitoring`、`/generation/thermal`、`/generation/new-energy`、`/generation/start-stop`、`/generation/units`、`/generation/targets`、`/generation/green-energy-targets`、`/generation/equipment-check`，覆盖机组出力、计划完成率、偏差、异常状态、火电运行状态、爬坡、启停、约束信息、风光出力、预测偏差、消纳风险、启停计划、执行跟踪、装机容量、可用容量、在运机组、检修计划、运行风险、计划电量、实际电量、目标偏差、执行预警、绿电目标电量、绿电缺口、绿证支撑、合约支撑、设备健康度、异常设备、待检修任务和缺陷风险；独立光伏发电页已删除，光伏场站分析合并到新能源监测，支持起止时间选择，光伏展示出力与辐照度，风电及风光互补展示出力与风速 |
| 第二批负荷侧页面 | 进行中，新增 `/load/monitoring`、`/load/local`、`/load/self-use`、`/load/net-load`、`/load/curtailment`、`/load/province-load`，覆盖全省负荷、区域负荷、峰谷、预测偏差、告警、本地用电负荷、分区负荷、交易申报口径、发电厂自用电、自用电率、厂用负荷、异常偏差、系统净负荷、弃电电量、弃电率、限发原因、消纳风险、弃电趋势、场站排行、原因分布、跨省交换、输入负荷、输出负荷和偏差风险 |
| 第二批售电页面 | 已完成，新增 `/retail/overview`、`/retail/product-structure`、`/retail/packages`，覆盖售电客户、签约电量、套餐结构、实际用电、偏差率、预估收益、风险客户、产品类型、收益贡献、毛利率、风险暴露、套餐配置、定价方式、收益目标和调价风险 |
| 第二批考核页面 | 已完成，新增 `/assessment/two-assessment-analysis`、`/assessment/two-criteria-check`、`/assessment/criteria-info`、`/assessment/other-check`、`/assessment/criteria-config`、`/assessment/recover-check`，覆盖考核费用、指标偏差、风险主体、高风险主体、整改建议、准则覆盖率、异常检查项、扣分风险、整改状态、有效准则、高风险条款、计算口径、适用主体、其他考核项审核、争议金额、超时提醒、启用参数、待审批变更、高风险阈值、恢复申请、待恢复金额、证据完整率和审批超时风险 |
| 第二批策略页面 | 已完成，新增 `/strategy/economic`、`/strategy/intro`、`/strategy/monthly-model`、`/strategy/weights`，覆盖经济策略、策略介绍、月度模型和权重管理 |

## 4. 当前未完成事项

- 登录态目前采用开发期 Bearer token 方案，token 暂以账号标识，后续需替换为正式密码校验、JWT 签发和刷新机制。
- 导出、报表订阅等动作仍需补齐业务规则和审计日志。
- 菜单规划中的页面级路由已完成真实组件绑定；后续重点从占位页补齐转为接口联调、业务规则、审计日志和数据持久化。

## 5. 下一步工作计划

### 5.1 推荐优先任务

1. 菜单规划页面已完成真实组件绑定，下一步建议按业务优先级开展接口联调和数据持久化。
2. 将开发期 Bearer token 替换为正式认证方案，补充密码哈希、JWT、刷新 token 和退出登录。
3. 将权限节点页面与正式登录态、细粒度按钮权限进一步联动。
4. 补齐导出、报表订阅等动作的业务规则与审计日志。
5. 规划结算审核日志在前端页面中的展示组件和交互。

### 5.2 后续页面建议

- 结算管理：DA 费用审核、RT 费用审核、月度交易审核、结算均价分析、修正统计已完成；后续可补齐台账导出和后端接口
- 交易管理：中长期交易、交易待办、交易已办、滚动撮合、交易约束、限价管理已完成；后续可接入后端规则校验和审计日志
- 市场监测：交易日历、供需分析、跨省联络线、气象监测、市场参数已完成；后续可接入后端市场参数接口和变更审计
- 系统管理：权限节点、字典管理、配置管理、消息通知、模板管理、数据导入、基础信息、访问分析已完成；后续可接入访问统计接口和审计日志联动

### 5.3 验证命令

- 后端：`cd backend; python -m pytest -q`
- 前端测试：`cd frontend; npm run test`
- 前端构建：`cd frontend; npm run build`

## 6. 更新规则

- 每完成一个页面，在页面完成清单中更新状态。
- 每完成接口联调或数据库迁移阶段，在任务清单中更新完成情况。
- 每次新增页面、接口或迁移需同步补充方案、测试、文档和路由/接口绑定。
