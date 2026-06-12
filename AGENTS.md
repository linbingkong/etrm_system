# Repository Guidelines

## 项目结构与模块组织

本仓库用于建设“山东电力交易辅助决策系统”。开发前必须先阅读 `docs/` 中的项目文档，尤其是：

- `docs/山东电力交易辅助决策系统-PRD文档.md`：产品定位、架构和技术栈。
- `docs/山东电力交易辅助决策系统-功能清单.md`：业务模块、功能项、优先级和组件证据。
- `docs/山东电力交易辅助决策系统-菜单规划.md`：菜单、路由、权限编码和首批建设建议。
- `docs/standards/frontend-development-guidelines.md`：前端开发规范。
- `docs/standards/backend-development-guidelines.md`：后端开发规范。
- `docs/standards/AI编程规则.md`：AI 辅助编码行为规则。

当前目录结构：

- `frontend/`：Vue 3 + TypeScript + Vite 前端工作区。
- `backend/`：FastAPI 后端工作区。
- `docs/`：PRD、功能清单、菜单规划和开发规范。
- `deploy/`：部署配置预留目录。
- `scripts/`：开发和运维脚本预留目录。
- `tests/`：跨端或集成测试预留目录。

业务模块必须与文档保持一致，包括工作台、市场监测、交易管理、合同管理、结算管理、机组与发电、负荷与用电、分析与报表、考核管理、策略管理、售电管理、系统管理和第三方集成。

## 构建、测试与本地开发命令

当前已提供基础前后端脚手架命令。依赖安装完成后，可使用以下命令：

```bash
cd frontend && npm install && npm run dev
cd frontend && npm run build
cd frontend && npm run test
cd backend && python -m venv .venv
cd backend && pip install -r requirements.txt
cd backend && uvicorn app.main:app --reload
cd backend && pytest
```

开发配置请使用本地环境文件，不要提交密钥、账号、机器路径、生产连接信息或第三方系统 Token。

## 编码风格与命名规范

前端代码遵循 `docs/standards/frontend-development-guidelines.md`。使用 TypeScript、Vue 3 Composition API、Pinia、Element Plus、ECharts 和 AntV X6。Vue 组件使用 `PascalCase.vue`；Composable 使用 `useXxx.ts`；Store 使用 `xxx.store.ts`；业务页面目录与菜单规划中的路由保持一致，例如 `market-monitoring`、`settlement`、`system-admin`。

后端代码遵循 `docs/standards/backend-development-guidelines.md`。使用 FastAPI、Pydantic v2、异步 I/O、PostgreSQL、TimescaleDB 和 Redis。Python 文件、函数和变量使用 `snake_case`；Schema 使用 `PascalCase`；涉及金额和电价的最终计算优先使用 `Decimal`。

菜单、路由和权限编码遵循 `docs/山东电力交易辅助决策系统-菜单规划.md`。页面级权限使用 `module:function`，按钮权限使用 `module:function:action`，例如 `trading:spot-bid:submit`。

## 测试规范

新增功能应同步补充测试。后端使用 `pytest` 编写单元测试和 API 测试；前端使用 Vitest 与 Vue Test Utils 测试组件和状态管理。后端测试文件命名为 `test_*.py`，前端测试文件命名为 `*.spec.ts`。

重点覆盖：

- 参数校验、权限控制和异常路径。
- 电量、电价、费用、偏差率、曲线聚合和结算计算。
- 交易申报、合同状态流转、结算审核和策略逻辑。
- Pinia 状态、实时消息处理、图表 option 生成和关键表单校验。

## 提交与 Pull Request 规范

当前检出目录没有 Git 历史，无法推断已有提交规范。建议使用简洁的 Conventional Commit 风格，例如 `feat: add market monitoring dashboard` 或 `fix: correct settlement fee validation`。

PR 应包含变更摘要、影响模块、测试结果、关联需求或 issue；涉及 UI 的变更应附截图。数据库迁移、配置变更、外部接口集成、菜单权限调整以及电力市场计算逻辑调整必须在 PR 中明确说明。

## Agent 专用说明

编辑前先检查当前目录结构，并保留用户已有改动。生成代码和文档时，应贴合本仓库已记录的系统架构、菜单规划和开发规范。项目结构、命令、测试工具、菜单路由或权限模型落地后，需要及时更新 `AGENTS.md`。

遵循 `docs/standards/AI编程规则.md`：不确定就先问，优先最小改动，不做无关重构，不大面积重写；修改前说明方案和风险，修改后说明改动、原因和建议验证场景。

🚨 中文编码保护规则（必须遵守）
基本原则
本项目包含中文，严禁出现乱码
所有文件必须保持原始编码（默认 UTF-8）
不得修改已有中文内容（注释 / 字符串）
文件修改策略
必须使用 diff / patch 方式修改文件

禁止整文件重写（特别是含中文文件）

禁止使用以下方式写文件：

echo > file
Set-Content
Out-File
重定向 >
中文处理规则
不得改变中文内容（包括标点）

不得将中文转义为 unicode（如 \u4e2d\u6587）

如果检测到中文：

只修改相关代码片段
避免触碰中文所在行
执行环境要求
必须使用 PowerShell 7（pwsh）
默认编码必须为 UTF-8（无 BOM）
异常处理（非常重要）
如果无法保证不会破坏中文：

停止修改
输出说明，而不是强行写入
