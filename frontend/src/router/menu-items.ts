import type { MenuItem, MenuPriority } from '@/types/menu';

const visibleByPriority = (priority: MenuPriority) => priority !== 'P2';

const directory = (id: string, title: string, path: string, sort: number, children: MenuItem[]): MenuItem => ({
  id,
  code: id,
  title,
  path,
  type: 'directory',
  priority: 'P0',
  sort,
  visible: true,
  permission: id,
  redirect: children[0]?.path,
  children,
});

const page = (
  module: string,
  slug: string,
  title: string,
  path: string,
  priority: MenuPriority,
  sort: number,
): MenuItem => ({
  id: `${module}-${slug}`,
  parentId: module,
  code: `${module}:${slug}`,
  title,
  path,
  type: 'menu',
  priority,
  sort,
  visible: visibleByPriority(priority),
  permission: `${module}:${slug}`,
  metaTitle: title,
});

export const menuItems: MenuItem[] = [
  directory('dashboard', '工作台', '/dashboard', 1, [
    page('dashboard', 'home', '工作台首页', '/dashboard', 'P0', 1),
    page('dashboard', 'quick-nav', '快捷导航配置', '/dashboard/quick-nav', 'P1', 2),
    page('dashboard', 'notices', '通知中心', '/dashboard/notices', 'P1', 3),
  ]),
  directory('market-monitoring', '市场监测', '/market-monitoring', 2, [
    page('market-monitoring', 'overview', '市场行情总览', '/market-monitoring/overview', 'P0', 1),
    page('market-monitoring', 'prices', '价格监测', '/market-monitoring/prices', 'P0', 2),
    page('market-monitoring', 'supply-demand', '供需分析', '/market-monitoring/supply-demand', 'P1', 3),
    page('market-monitoring', 'tie-line', '跨省联络线', '/market-monitoring/tie-line', 'P1', 4),
    page('market-monitoring', 'weather', '气象监测', '/market-monitoring/weather', 'P1', 5),
    page('market-monitoring', 'trading-calendar', '交易日历', '/market-monitoring/trading-calendar', 'P1', 6),
    page('market-monitoring', 'market-params', '市场参数', '/market-monitoring/market-params', 'P2', 7),
  ]),
  directory('trading', '交易管理', '/trading', 3, [
    page('trading', 'overview', '交易总览', '/trading/overview', 'P0', 1),
    page('trading', 'long-term', '中长期交易', '/trading/long-term', 'P0', 2),
    page('trading', 'spot-bid', '现货交易申报', '/trading/spot-bid', 'P0', 3),
    page('trading', 'd1-curve', 'D1 曲线申报', '/trading/d1-curve', 'P0', 4),
    page('trading', 'todo', '交易待办', '/trading/todo', 'P0', 5),
    page('trading', 'done', '交易已办', '/trading/done', 'P1', 6),
    page('trading', 'rolling-matching', '滚动撮合', '/trading/rolling-matching', 'P1', 7),
    page('trading', 'constraints', '交易约束', '/trading/constraints', 'P1', 8),
    page('trading', 'price-limits', '限价管理', '/trading/price-limits', 'P2', 9),
  ]),
  directory('contracts', '合同管理', '/contracts', 4, [
    page('contracts', 'list', '合同列表', '/contracts/list', 'P0', 1),
    page('contracts', 'create', '新建合同', '/contracts/create', 'P0', 2),
    page('contracts', 'templates', '合同模板', '/contracts/templates', 'P1', 3),
    page('contracts', 'expiry-alerts', '到期提醒', '/contracts/expiry-alerts', 'P2', 4),
  ]),
  directory('settlement', '结算管理', '/settlement', 5, [
    page('settlement', 'overview', '结算总览', '/settlement/overview', 'P0', 1),
    page('settlement', 'bills', '结算单明细', '/settlement/bills', 'P0', 2),
    page('settlement', 'review', '结算审核', '/settlement/review', 'P0', 3),
    page('settlement', 'da-fee-check', 'DA 费用审核', '/settlement/da-fee-check', 'P0', 4),
    page('settlement', 'rt-fee-check', 'RT 费用审核', '/settlement/rt-fee-check', 'P0', 5),
    page('settlement', 'monthly-deal-check', '月度交易审核', '/settlement/monthly-deal-check', 'P1', 6),
    page('settlement', 'average-price', '结算均价分析', '/settlement/average-price', 'P1', 7),
    page('settlement', 'corrections', '修正统计', '/settlement/corrections', 'P1', 8),
  ]),
  directory('generation', '机组与发电', '/generation', 6, [
    page('generation', 'overview', '发电侧总览', '/generation/overview', 'P0', 1),
    page('generation', 'monitoring', '发电监测', '/generation/monitoring', 'P0', 2),
    page('generation', 'thermal', '火电运行', '/generation/thermal', 'P0', 3),
    page('generation', 'new-energy', '新能源监测', '/generation/new-energy', 'P0', 4),
    page('generation', 'targets', '发电目标', '/generation/targets', 'P1', 5),
    page('generation', 'units', '机组管理', '/generation/units', 'P1', 6),
    page('generation', 'green-energy-targets', '绿电目标', '/generation/green-energy-targets', 'P1', 7),
    page('generation', 'pv', '光伏发电', '/generation/pv', 'P1', 8),
    page('generation', 'start-stop', '启停机管理', '/generation/start-stop', 'P1', 9),
    page('generation', 'equipment-check', '设备检测', '/generation/equipment-check', 'P2', 10),
  ]),
  directory('load', '负荷与用电', '/load', 7, [
    page('load', 'overview', '用电侧总览', '/load/overview', 'P0', 1),
    page('load', 'monitoring', '负荷监测', '/load/monitoring', 'P0', 2),
    page('load', 'local', '本地负荷', '/load/local', 'P0', 3),
    page('load', 'self-use', '自用电管理', '/load/self-use', 'P1', 4),
    page('load', 'net-load', '净负荷', '/load/net-load', 'P1', 5),
    page('load', 'curtailment', '弃电管理', '/load/curtailment', 'P1', 6),
    page('load', 'province-load', '省间负荷', '/load/province-load', 'P2', 7),
  ]),
  directory('reports', '分析与报表', '/reports', 8, [
    page('reports', 'analysis-center', '分析中心', '/reports/analysis-center', 'P0', 1),
    page('reports', 'profit-loss', '盈亏分析', '/reports/profit-loss', 'P0', 2),
    page('reports', 'monthly-report', '月度报告', '/reports/monthly-report', 'P0', 3),
    page('reports', 'statistics', '统计分析', '/reports/statistics', 'P1', 4),
    page('reports', 'contrast', '对比分析', '/reports/contrast', 'P1', 5),
    page('reports', 'site-analysis', '站点分析', '/reports/site-analysis', 'P1', 6),
    page('reports', 'charts', '图表管理', '/reports/charts', 'P1', 7),
    page('reports', 'export', '数据导出', '/reports/export', 'P0', 8),
    page('reports', 'similar-analysis', '相似分析', '/reports/similar-analysis', 'P2', 9),
  ]),
  directory('assessment', '考核管理', '/assessment', 9, [
    page('assessment', 'two-assessment-analysis', '双考核分析', '/assessment/two-assessment-analysis', 'P0', 1),
    page('assessment', 'two-criteria-check', '双准则检查', '/assessment/two-criteria-check', 'P1', 2),
    page('assessment', 'criteria-info', '准则信息查询', '/assessment/criteria-info', 'P1', 3),
    page('assessment', 'other-check', '其他审核', '/assessment/other-check', 'P1', 4),
    page('assessment', 'criteria-config', '考核参数配置', '/assessment/criteria-config', 'P2', 5),
    page('assessment', 'recover-check', '恢复审核', '/assessment/recover-check', 'P2', 6),
  ]),
  directory('strategy', '策略管理', '/strategy', 10, [
    page('strategy', 'list', '策略列表', '/strategy/list', 'P0', 1),
    page('strategy', 'create', '新增策略', '/strategy/create', 'P0', 2),
    page('strategy', 'economic', '经济策略', '/strategy/economic', 'P1', 3),
    page('strategy', 'intro', '策略介绍', '/strategy/intro', 'P1', 4),
    page('strategy', 'monthly-model', '月度模型', '/strategy/monthly-model', 'P1', 5),
    page('strategy', 'weights', '权重管理', '/strategy/weights', 'P2', 6),
  ]),
  directory('retail', '售电管理', '/retail', 11, [
    page('retail', 'overview', '售电总览', '/retail/overview', 'P0', 1),
    page('retail', 'product-structure', '售电产品结构', '/retail/product-structure', 'P1', 2),
    page('retail', 'packages', '套餐管理', '/retail/packages', 'P1', 3),
  ]),
  directory('system-admin', '系统管理', '/system-admin', 12, [
    page('system-admin', 'users', '用户管理', '/system-admin/users', 'P0', 1),
    page('system-admin', 'roles', '角色管理', '/system-admin/roles', 'P0', 2),
    page('system-admin', 'menus', '菜单管理', '/system-admin/menus', 'P0', 3),
    page('system-admin', 'permission-nodes', '权限节点', '/system-admin/permission-nodes', 'P0', 4),
    page('system-admin', 'dictionaries', '字典管理', '/system-admin/dictionaries', 'P1', 5),
    page('system-admin', 'messages', '消息通知', '/system-admin/messages', 'P1', 6),
    page('system-admin', 'configurations', '配置管理', '/system-admin/configurations', 'P1', 7),
    page('system-admin', 'templates', '模板管理', '/system-admin/templates', 'P1', 8),
    page('system-admin', 'imports', '数据导入', '/system-admin/imports', 'P1', 9),
    page('system-admin', 'basic-info', '基础信息', '/system-admin/basic-info', 'P1', 10),
    page('system-admin', 'visit-analysis', '访问分析', '/system-admin/visit-analysis', 'P2', 11),
  ]),
  directory('integrations', '第三方集成', '/integrations', 13, [
    page('integrations', 'realtime', '实时通信监控', '/integrations/realtime', 'P0', 1),
    page('integrations', 'shandong-api', '山东数据 API', '/integrations/shandong-api', 'P0', 2),
    page('integrations', 'market-board', '市场大屏', '/integrations/market-board', 'P1', 3),
    page('integrations', 'token-login', 'Token 登录配置', '/integrations/token-login', 'P1', 4),
    page('integrations', 'file-preview', '文件在线预览', '/integrations/file-preview', 'P2', 5),
  ]),
];

export function flattenMenuItems(items: MenuItem[]): MenuItem[] {
  return items.flatMap((item) => [item, ...flattenMenuItems(item.children ?? [])]);
}

export function visibleMenuItems(items: MenuItem[]): MenuItem[] {
  return items
    .filter((item) => item.visible)
    .map((item) => ({
      ...item,
      children: item.children ? visibleMenuItems(item.children) : undefined,
    }));
}
