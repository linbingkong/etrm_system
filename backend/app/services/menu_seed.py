from app.schemas.menu import ButtonPermission, MenuItem, MenuPriority, MenuType

PageDef = tuple[str, str, str, str, MenuPriority]
ModuleDef = tuple[str, str, str, list[PageDef]]


def _visible(priority: MenuPriority) -> bool:
    return priority != MenuPriority.P2


MODULES: list[ModuleDef] = [
    ("dashboard", "工作台", "/dashboard", [
        ("home", "工作台首页", "/dashboard", "dashboard:home", MenuPriority.P0),
        ("quick-nav", "快捷导航配置", "/dashboard/quick-nav", "dashboard:quick-nav", MenuPriority.P1),
        ("notices", "通知中心", "/dashboard/notices", "dashboard:notices", MenuPriority.P1),
    ]),
    ("market-monitoring", "市场监测", "/market-monitoring", [
        ("overview", "市场行情总览", "/market-monitoring/overview", "market-monitoring:overview", MenuPriority.P0),
        ("prices", "价格监测", "/market-monitoring/prices", "market-monitoring:prices", MenuPriority.P0),
        ("supply-demand", "供需分析", "/market-monitoring/supply-demand", "market-monitoring:supply-demand", MenuPriority.P1),
        ("tie-line", "跨省联络线", "/market-monitoring/tie-line", "market-monitoring:tie-line", MenuPriority.P1),
        ("weather", "气象监测", "/market-monitoring/weather", "market-monitoring:weather", MenuPriority.P1),
        ("trading-calendar", "交易日历", "/market-monitoring/trading-calendar", "market-monitoring:trading-calendar", MenuPriority.P1),
        ("market-params", "市场参数", "/market-monitoring/market-params", "market-monitoring:market-params", MenuPriority.P2),
    ]),
    ("trading", "交易管理", "/trading", [
        ("overview", "交易总览", "/trading/overview", "trading:overview", MenuPriority.P0),
        ("long-term", "中长期交易", "/trading/long-term", "trading:long-term", MenuPriority.P0),
        ("spot-bid", "现货交易申报", "/trading/spot-bid", "trading:spot-bid", MenuPriority.P0),
        ("d1-curve", "D1 曲线申报", "/trading/d1-curve", "trading:d1-curve", MenuPriority.P0),
        ("todo", "交易待办", "/trading/todo", "trading:todo", MenuPriority.P0),
        ("done", "交易已办", "/trading/done", "trading:done", MenuPriority.P1),
        ("rolling-matching", "滚动撮合", "/trading/rolling-matching", "trading:rolling-matching", MenuPriority.P1),
        ("constraints", "交易约束", "/trading/constraints", "trading:constraints", MenuPriority.P1),
        ("price-limits", "限价管理", "/trading/price-limits", "trading:price-limits", MenuPriority.P2),
    ]),
    ("contracts", "合同管理", "/contracts", [
        ("list", "合同列表", "/contracts/list", "contracts:list", MenuPriority.P0),
        ("create", "新建合同", "/contracts/create", "contracts:create", MenuPriority.P0),
        ("templates", "合同模板", "/contracts/templates", "contracts:templates", MenuPriority.P1),
        ("expiry-alerts", "到期提醒", "/contracts/expiry-alerts", "contracts:expiry-alerts", MenuPriority.P2),
    ]),
    ("settlement", "结算管理", "/settlement", [
        ("overview", "结算总览", "/settlement/overview", "settlement:overview", MenuPriority.P0),
        ("bills", "结算单明细", "/settlement/bills", "settlement:bills", MenuPriority.P0),
        ("review", "结算审核", "/settlement/review", "settlement:review", MenuPriority.P0),
        ("da-fee-check", "DA 费用审核", "/settlement/da-fee-check", "settlement:da-fee-check", MenuPriority.P0),
        ("rt-fee-check", "RT 费用审核", "/settlement/rt-fee-check", "settlement:rt-fee-check", MenuPriority.P0),
        ("monthly-deal-check", "月度交易审核", "/settlement/monthly-deal-check", "settlement:monthly-deal-check", MenuPriority.P1),
        ("average-price", "结算均价分析", "/settlement/average-price", "settlement:average-price", MenuPriority.P1),
        ("corrections", "修正统计", "/settlement/corrections", "settlement:corrections", MenuPriority.P1),
    ]),
    ("generation", "机组与发电", "/generation", [
        ("overview", "发电侧总览", "/generation/overview", "generation:overview", MenuPriority.P0),
        ("monitoring", "发电监测", "/generation/monitoring", "generation:monitoring", MenuPriority.P0),
        ("thermal", "火电运行", "/generation/thermal", "generation:thermal", MenuPriority.P0),
        ("new-energy", "新能源监测", "/generation/new-energy", "generation:new-energy", MenuPriority.P0),
        ("targets", "发电目标", "/generation/targets", "generation:targets", MenuPriority.P1),
        ("units", "机组管理", "/generation/units", "generation:units", MenuPriority.P1),
        ("green-energy-targets", "绿电目标", "/generation/green-energy-targets", "generation:green-energy-targets", MenuPriority.P1),
        ("pv", "光伏发电", "/generation/pv", "generation:pv", MenuPriority.P1),
        ("start-stop", "启停机管理", "/generation/start-stop", "generation:start-stop", MenuPriority.P1),
        ("equipment-check", "设备检测", "/generation/equipment-check", "generation:equipment-check", MenuPriority.P2),
    ]),
    ("load", "负荷与用电", "/load", [
        ("overview", "用电侧总览", "/load/overview", "load:overview", MenuPriority.P0),
        ("monitoring", "负荷监测", "/load/monitoring", "load:monitoring", MenuPriority.P0),
        ("local", "本地负荷", "/load/local", "load:local", MenuPriority.P0),
        ("self-use", "自用电管理", "/load/self-use", "load:self-use", MenuPriority.P1),
        ("net-load", "净负荷", "/load/net-load", "load:net-load", MenuPriority.P1),
        ("curtailment", "弃电管理", "/load/curtailment", "load:curtailment", MenuPriority.P1),
        ("province-load", "省间负荷", "/load/province-load", "load:province-load", MenuPriority.P2),
    ]),
    ("reports", "分析与报表", "/reports", [
        ("analysis-center", "分析中心", "/reports/analysis-center", "reports:analysis-center", MenuPriority.P0),
        ("profit-loss", "盈亏分析", "/reports/profit-loss", "reports:profit-loss", MenuPriority.P0),
        ("monthly-report", "月度报告", "/reports/monthly-report", "reports:monthly-report", MenuPriority.P0),
        ("statistics", "统计分析", "/reports/statistics", "reports:statistics", MenuPriority.P1),
        ("contrast", "对比分析", "/reports/contrast", "reports:contrast", MenuPriority.P1),
        ("site-analysis", "站点分析", "/reports/site-analysis", "reports:site-analysis", MenuPriority.P1),
        ("charts", "图表管理", "/reports/charts", "reports:charts", MenuPriority.P1),
        ("export", "数据导出", "/reports/export", "reports:export", MenuPriority.P0),
        ("similar-analysis", "相似分析", "/reports/similar-analysis", "reports:similar-analysis", MenuPriority.P2),
    ]),
    ("assessment", "考核管理", "/assessment", [
        ("two-assessment-analysis", "双考核分析", "/assessment/two-assessment-analysis", "assessment:two-assessment-analysis", MenuPriority.P0),
        ("two-criteria-check", "双准则检查", "/assessment/two-criteria-check", "assessment:two-criteria-check", MenuPriority.P1),
        ("criteria-info", "准则信息查询", "/assessment/criteria-info", "assessment:criteria-info", MenuPriority.P1),
        ("other-check", "其他审核", "/assessment/other-check", "assessment:other-check", MenuPriority.P1),
        ("criteria-config", "考核参数配置", "/assessment/criteria-config", "assessment:criteria-config", MenuPriority.P2),
        ("recover-check", "恢复审核", "/assessment/recover-check", "assessment:recover-check", MenuPriority.P2),
    ]),
    ("strategy", "策略管理", "/strategy", [
        ("list", "策略列表", "/strategy/list", "strategy:list", MenuPriority.P0),
        ("create", "新增策略", "/strategy/create", "strategy:create", MenuPriority.P0),
        ("economic", "经济策略", "/strategy/economic", "strategy:economic", MenuPriority.P1),
        ("intro", "策略介绍", "/strategy/intro", "strategy:intro", MenuPriority.P1),
        ("monthly-model", "月度模型", "/strategy/monthly-model", "strategy:monthly-model", MenuPriority.P1),
        ("weights", "权重管理", "/strategy/weights", "strategy:weights", MenuPriority.P2),
    ]),
    ("retail", "售电管理", "/retail", [
        ("overview", "售电总览", "/retail/overview", "retail:overview", MenuPriority.P0),
        ("product-structure", "售电产品结构", "/retail/product-structure", "retail:product-structure", MenuPriority.P1),
        ("packages", "套餐管理", "/retail/packages", "retail:packages", MenuPriority.P1),
    ]),
    ("system-admin", "系统管理", "/system-admin", [
        ("users", "用户管理", "/system-admin/users", "system-admin:users", MenuPriority.P0),
        ("roles", "角色管理", "/system-admin/roles", "system-admin:roles", MenuPriority.P0),
        ("menus", "菜单管理", "/system-admin/menus", "system-admin:menus", MenuPriority.P0),
        ("permission-nodes", "权限节点", "/system-admin/permission-nodes", "system-admin:permission-nodes", MenuPriority.P0),
        ("dictionaries", "字典管理", "/system-admin/dictionaries", "system-admin:dictionaries", MenuPriority.P1),
        ("messages", "消息通知", "/system-admin/messages", "system-admin:messages", MenuPriority.P1),
        ("configurations", "配置管理", "/system-admin/configurations", "system-admin:configurations", MenuPriority.P1),
        ("templates", "模板管理", "/system-admin/templates", "system-admin:templates", MenuPriority.P1),
        ("imports", "数据导入", "/system-admin/imports", "system-admin:imports", MenuPriority.P1),
        ("basic-info", "基础信息", "/system-admin/basic-info", "system-admin:basic-info", MenuPriority.P1),
        ("visit-analysis", "访问分析", "/system-admin/visit-analysis", "system-admin:visit-analysis", MenuPriority.P2),
    ]),
    ("integrations", "第三方集成", "/integrations", [
        ("realtime", "实时通信监控", "/integrations/realtime", "integrations:realtime", MenuPriority.P0),
        ("shandong-api", "山东数据 API", "/integrations/shandong-api", "integrations:shandong-api", MenuPriority.P0),
        ("market-board", "市场大屏", "/integrations/market-board", "integrations:market-board", MenuPriority.P1),
        ("token-login", "Token 登录配置", "/integrations/token-login", "integrations:token-login", MenuPriority.P1),
        ("file-preview", "文件在线预览", "/integrations/file-preview", "integrations:file-preview", MenuPriority.P2),
    ]),
]


BUTTON_PERMISSIONS: list[ButtonPermission] = [
    ButtonPermission(code="trading:spot-bid:submit", title="提交", page_code="trading:spot-bid"),
    ButtonPermission(code="trading:spot-bid:cancel", title="撤销", page_code="trading:spot-bid"),
    ButtonPermission(code="trading:spot-bid:export", title="导出", page_code="trading:spot-bid"),
    ButtonPermission(code="trading:d1-curve:save", title="保存", page_code="trading:d1-curve"),
    ButtonPermission(code="trading:d1-curve:submit", title="提交", page_code="trading:d1-curve"),
    ButtonPermission(code="contracts:list:create", title="新建", page_code="contracts:list"),
    ButtonPermission(code="contracts:list:edit", title="编辑", page_code="contracts:list"),
    ButtonPermission(code="contracts:list:archive", title="归档", page_code="contracts:list"),
    ButtonPermission(code="contracts:list:export", title="导出", page_code="contracts:list"),
    ButtonPermission(code="settlement:review:approve", title="通过", page_code="settlement:review"),
    ButtonPermission(code="settlement:review:reject", title="驳回", page_code="settlement:review"),
    ButtonPermission(code="settlement:review:recalculate", title="重算", page_code="settlement:review"),
    ButtonPermission(code="settlement:fee-check:approve", title="通过", page_code="settlement:da-fee-check"),
    ButtonPermission(code="settlement:fee-check:reject", title="驳回", page_code="settlement:da-fee-check"),
    ButtonPermission(code="strategy:list:create", title="新建", page_code="strategy:list"),
    ButtonPermission(code="strategy:list:edit", title="编辑", page_code="strategy:list"),
    ButtonPermission(code="strategy:list:enable", title="启用", page_code="strategy:list"),
    ButtonPermission(code="strategy:list:disable", title="停用", page_code="strategy:list"),
    ButtonPermission(code="system-admin:users:create", title="新建", page_code="system-admin:users"),
    ButtonPermission(code="system-admin:users:edit", title="编辑", page_code="system-admin:users"),
    ButtonPermission(code="system-admin:users:disable", title="禁用", page_code="system-admin:users"),
    ButtonPermission(code="system-admin:menus:create", title="新建", page_code="system-admin:menus"),
    ButtonPermission(code="system-admin:menus:edit", title="编辑", page_code="system-admin:menus"),
    ButtonPermission(code="system-admin:menus:delete", title="删除", page_code="system-admin:menus"),
]


def get_menu_tree() -> list[MenuItem]:
    tree: list[MenuItem] = []
    for module_sort, (module_id, title, path, pages) in enumerate(MODULES, start=1):
        children = [
            MenuItem(
                id=f"{module_id}-{slug}",
                parent_id=module_id,
                code=code,
                title=page_title,
                path=page_path,
                type=MenuType.MENU,
                priority=priority,
                sort=page_sort,
                visible=_visible(priority),
                permission=code,
                meta_title=page_title,
            )
            for page_sort, (slug, page_title, page_path, code, priority) in enumerate(pages, start=1)
        ]
        tree.append(
            MenuItem(
                id=module_id,
                code=module_id,
                title=title,
                path=path,
                type=MenuType.DIRECTORY,
                priority=MenuPriority.P0,
                sort=module_sort,
                visible=True,
                permission=module_id,
                redirect=children[0].path,
                children=children,
            )
        )
    return tree


def get_flat_menus() -> list[MenuItem]:
    flat: list[MenuItem] = []
    for item in get_menu_tree():
        flat.append(item.model_copy(update={"children": []}))
        flat.extend(item.children)
    return flat


def get_button_permissions() -> list[ButtonPermission]:
    return BUTTON_PERMISSIONS
