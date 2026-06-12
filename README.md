# 山东电力交易辅助决策系统

面向山东电力市场参与主体的交易辅助决策系统，覆盖市场监测、交易管理、合同管理、结算管理、策略分析、系统管理和第三方集成等模块。

## 目录结构

```text
frontend/   Vue 3 + TypeScript + Vite 前端工程
backend/    FastAPI 后端工程
docs/       PRD、功能清单、菜单规划、开发规范和页面规划
deploy/     部署配置预留目录
scripts/    开发和运维脚本预留目录
tests/      跨端或集成测试预留目录
```

## 文档入口

- `docs/山东电力交易辅助决策系统-PRD文档.md`
- `docs/山东电力交易辅助决策系统-功能清单.md`
- `docs/山东电力交易辅助决策系统-菜单规划.md`
- `docs/standards/frontend-development-guidelines.md`
- `docs/standards/backend-development-guidelines.md`
- `docs/standards/AI执行总纲.md`

## 本地开发

前端：

```bash
cd frontend
npm install
npm run dev
```

后端：

```bash
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt
.venv/Scripts/uvicorn app.main:app --reload
```

## 验证命令

```bash
cd frontend && npm run build
cd frontend && npm run test
cd backend && pytest
cd backend && python -m py_compile app/main.py
```

当前仓库只提供基础工程骨架；依赖安装、数据库、Redis 和部署配置需按实际环境落地。
