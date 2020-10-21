import React from "react";
import { MenuDataItem } from '@ant-design/pro-layout';
import { SmileOutlined, HeartOutlined, PieChartOutlined, ShopOutlined, AppleOutlined } from '@ant-design/icons';

export const menus: MenuDataItem[] = [
  {
    path: '/basic-config',
    name: '基础配置',
    icon: "pieChart",
    children: [
      {
        path: '/basic-config/service-config',
        name: '业务配置',
        icon: "shop",
      },
      {
        path: '/basic-config/template-config',
        name: '模板配置',
        icon: "heart",
      },
    ]
  },
  {
    path: '/equipment-business',
    name: '设备业务',
    icon: "apple",
    children: [
      {
        path: '/equipment-business/equipment-repair-service',
        name: '设备报修',
        icon: "smile",
      },
      {
        path: '/equipment-business/repair-center',
        name: '维修中心',
        icon: "shop",
      },
      {
        path: '/equipment-business/joborder-dispatch',
        name: '工单派发',
        icon: "heart",
      },
    ]
  },
  {
    path: '/demo',
    name: 'demo',
    icon: "apple",
    children: [
      {
        path: '/demo/custom-components',
        name: '自定义dev组件',
        icon: "smile",
      },
      {
        path: '/demo/dev-file-manager',
        name: 'file-manager',
        icon: "smile",
      },
    ]
  },
];

// 图标缓存.
export const IconMap = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />,
  pieChart: <PieChartOutlined />,
  shop: <ShopOutlined />,
  apple: <AppleOutlined />,
};
