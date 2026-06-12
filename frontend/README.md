# Frontend

Vue 3 + TypeScript + Vite frontend workspace for the electricity trading decision support system.

## Stack

- Vue 3 Composition API
- TypeScript
- Vite
- Element Plus
- Pinia
- Apache ECharts
- AntV X6

## Commands

```bash
npm install
npm run dev
npm run build
npm run test
```

## Structure

- `src/api/`: API client modules.
- `src/assets/`: static assets.
- `src/components/`: reusable UI components.
- `src/layouts/`: page layouts.
- `src/router/`: route definitions aligned with `docs/山东电力交易辅助决策系统-菜单规划.md`.
- `src/stores/`: Pinia stores.
- `src/types/`: shared and generated TypeScript types.
- `src/views/`: business pages grouped by domain.
- `tests/`: Vitest tests.

## Menu Routing

Menu and route data is defined in `src/router/menu-items.ts` and generated into Vue Router records through `src/router/build-routes.ts`. Keep menu codes and paths aligned with `docs/山东电力交易辅助决策系统-菜单规划.md`.
