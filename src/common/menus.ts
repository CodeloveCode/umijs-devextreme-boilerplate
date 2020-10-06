import { getUUID } from '@/utils/uuid';

interface IMenu {
  id?: string;
  text: string;
  path?: string;
  icon: string;
  items?: IMenu[];
  expanded?: boolean;
}

function handleMenus(menus: Array<IMenu>): Array<IMenu> {
  return menus.map(menu => {
    // @ts-ignore
    if (menu.items?.length > 0) {
      // @ts-ignore
      menu.items = handleMenus(menu.items);
    }
    return {
      ...menu,
      expanded: false,
      id: getUUID(),
    };
  });
}

const menus: IMenu[] = [
  {
    text: 'Protal',
    path: '/portal',
    icon: 'home',
  },
  {
    text: 'User',
    path: '/system-mgmt/user-mgmt',
    icon: 'group',
  },
  {
    text: 'Org',
    path: '/system-mgmt/org-mgmt',
    icon: 'user',
  },
  {
    text: 'other',
    icon: 'folder',
    items: [
      {
        text: 'User',
        path: '/system-mgmt/user-mgmt',
        icon: 'product',
      },
      {
        text: 'Org',
        path: '/system-mgmt/org-mgmt',
        icon: 'preferences',
      },
      {
        text: '外部网站',
        path: '/demo/link-other-site',
        icon: 'preferences',
      },
      {
        text: '引用其他系统',
        path: '/demo/link-other-inner-system',
        icon: 'preferences',
      },
      {
        text: '嵌入html-iframe',
        path: '/demo/nested-jqueryhtml-by-iframe',
        icon: 'preferences',
      },
      {
        text: '嵌入html-iframe-2',
        path: '/demo/nested-html-by-iframe-srcdoc',
        icon: 'preferences',
      },
      {
        text: '嵌入html-react',
        path: '/demo/nested-html-by-react',
        icon: 'preferences',
      },
    ],
  },
];

const menusForBreadcrumbs: IMenu[] = [
  {
    text: '主页',
    path: '/portal',
    icon: 'home',
  },
  {
    text: '系统管理',
    path: '/system-mgmt',
    icon: 'folder',
  },
  {
    text: '服务管理',
    path: '/service-mgmt',
    icon: 'folder',
  },
  {
    text: '用户',
    path: '/system-mgmt/user-mgmt',
    icon: 'product',
  },
  {
    text: '部门',
    path: '/system-mgmt/department-mgmt',
    icon: 'preferences',
  },
  {
    text: '角色',
    path: '/system-mgmt/role-mgmt',
    icon: 'preferences',
  },
  {
    text: '用户组',
    path: '/system-mgmt/class-mgmt',
    icon: 'preferences',
  },
  {
    text: '权限',
    path: '/system-mgmt/permission-mgmt',
    icon: 'preferences',
  },
  {
    text: '系统设置',
    path: '/system-mgmt/system-config',
    icon: 'preferences',
  },
  {
    text: 'demo',
    path: '/demo',
    icon: 'coffee',
  },
  {
    text: '外部网站',
    path: '/demo/link-other-site',
    icon: 'link',
  },
  {
    text: '引用其他系统',
    path: '/demo/link-other-inner-system',
    icon: 'map',
  },
  {
    text: '嵌入html-iframe',
    path: '/demo/nested-jqueryhtml-by-iframe',
    icon: 'mention',
  },
  {
    text: '嵌入html-iframe2',
    path: '/demo/nested-html-by-iframe-srcdoc',
    icon: 'overflow',
  },
  {
    text: '嵌入html-React',
    path: '/demo/nested-html-by-react',
    icon: 'palette',
  },
];

const menuItems = handleMenus(menus);

function getBreadcrumbsFromMenus() {
  //TODO:
}

export { menuItems, menusForBreadcrumbs };
