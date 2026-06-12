export type MenuType = 'directory' | 'menu' | 'button';
export type MenuPriority = 'P0' | 'P1' | 'P2';

export interface MenuItem {
  id: string;
  parentId?: string;
  code: string;
  title: string;
  path: string;
  component?: string;
  icon?: string;
  type: MenuType;
  priority: MenuPriority;
  sort: number;
  visible: boolean;
  permission: string;
  metaTitle?: string;
  redirect?: string;
  children?: MenuItem[];
}
