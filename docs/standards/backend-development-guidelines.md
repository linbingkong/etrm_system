# 后端开发规范

## 1. 技术栈与基本原则

本项目后端采用 Python、FastAPI、Uvicorn、Pydantic v2、PostgreSQL、TimescaleDB 和 Redis。系统需要支撑电力现货行情、交易申报、合同管理、结算对账、考核分析和实时预警等业务。

开发原则：

- 新接口优先使用 FastAPI async 路由和异步服务函数。
- 所有请求和响应必须使用 Pydantic Schema 明确定义。
- 业务逻辑放在 service 层，路由层只负责参数接收、权限校验、调用服务和返回结果。
- 核心业务数据使用 PostgreSQL；高频价格、负荷、曲线和 Tick 数据使用 TimescaleDB；缓存、限流、实时消息分发使用 Redis。
- 涉及量、价、费、曲线、结算和考核的计算必须保持可测试、可追溯。

## 2. 目录结构

后端代码统一放在 `backend/` 下：

```text
backend/
├── app/
│   ├── api/       # HTTP 路由
│   ├── core/      # 配置、安全、日志、权限
│   ├── models/    # 数据库模型和领域模型
│   ├── schemas/   # Pydantic Schema
│   ├── services/  # 业务服务
│   └── main.py    # FastAPI 应用入口
└── tests/         # 后端测试
```

`services/` 按业务域组织，例如 `market_monitoring`、`trading`、`contracts`、`settlement`、`strategy`、`system_admin`。路由模块应与服务模块保持同名或一一对应，避免跨域直接调用内部实现。

## 3. 命名与代码风格

- Python 文件、函数、变量使用 `snake_case`。
- Pydantic Schema 使用 `PascalCase`，例如 `SettlementBillResponse`。
- 数据库模型使用业务名词命名，例如 `Contract`、`MarketPricePoint`。
- 路由函数使用动宾结构，例如 `create_contract`、`review_settlement_bill`。
- 常量使用 `UPPER_SNAKE_CASE`。

函数应短小明确。复杂计算逻辑必须拆成纯函数，便于单元测试。禁止在路由函数中直接写 SQL、复杂循环计算或第三方接口适配逻辑。

## 4. API 设计规范

API 路径按业务域组织，建议格式：

```text
/api/v1/market-monitoring/...
/api/v1/trading/...
/api/v1/contracts/...
/api/v1/settlement/...
```

列表接口必须支持分页；大数据量曲线接口必须支持时间范围、交易日或市场类型过滤。关键操作接口应返回明确业务状态，例如提交成功、进入审核、规则校验失败。

统一响应应包含业务数据和可追踪错误信息。异常不得直接暴露数据库错误、堆栈或内部服务地址。接口字段命名应与前端 TypeScript 类型保持一致，避免同一字段在前后端使用不同含义。

## 5. Schema 与数据校验

请求 Schema 负责基础类型、必填项、枚举值和范围校验。涉及业务规则的校验放在 service 层，例如申报曲线是否满足出力上下限、结算单是否允许审核、合同是否可续签。

电力业务字段必须表达单位和精度。推荐命名：

- `energy_mwh`：电量，单位 MWh。
- `price_yuan_per_mwh`：电价，单位 元/MWh。
- `fee_yuan`：费用，单位 元。
- `deviation_rate`：偏差率。
- `trade_date`：交易日。
- `time_slot`：交易时段。

金额和电价计算不得使用二进制浮点数承载最终结果，优先使用 `Decimal`。

## 6. 数据库、缓存与实时推送

PostgreSQL 保存合同、结算、权限、规则、审核记录等关系型数据。TimescaleDB 保存现货价格、负荷曲线、出清曲线和高频 Tick 数据。Redis 用于缓存市场规则、交易日参数、热点行情和 WebSocket/SSE 消息分发。

数据库访问应封装在 repository 或 service 内部，避免散落在路由层。事务边界必须清晰：合同保存、结算审核、交易申报等关键操作要么全部成功，要么全部回滚。

实时推送消息应定义稳定的消息类型和 payload schema。发布前应确认用户权限和订阅范围，避免跨用户、跨市场泄露数据。

## 7. 错误处理、日志与安全

业务异常使用统一异常类型，包含错误码、用户可读信息和追踪 ID。系统异常写入日志，对外返回通用错误信息。

日志必须记录关键业务动作，例如登录、申报、撤单、合同变更、结算审核和权限调整。日志中不得输出密码、Token、密钥、完整身份证号或生产数据库连接串。

配置通过环境变量或本地配置文件注入。生产密钥、账号和外部系统地址不得提交到仓库。

## 8. 测试规范

后端测试使用 `pytest`。测试文件命名为 `test_*.py`，放在 `backend/tests/` 或对应模块测试目录。

重点测试：

- Pydantic Schema 的输入校验。
- 交易申报、结算审核、合同状态流转等核心 service。
- 电量、电价、费用、偏差率和曲线聚合计算。
- 权限不足、数据不存在、状态不允许等异常路径。
- Redis 缓存命中、失效和实时消息解析逻辑。

测试应使用确定性 fixture，不依赖真实生产接口和生产数据库。

## 9. 提交前检查清单

提交前确认：

- 新接口已定义请求和响应 Schema。
- 路由层没有承载复杂业务逻辑。
- 关键计算使用可测试函数，并覆盖正常和异常场景。
- 数据库事务、缓存失效和实时推送边界清晰。
- 日志不包含敏感信息。
- 新增接口能够通过 OpenAPI 被前端生成或引用类型。
