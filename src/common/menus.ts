import React from "react";
import { SmileOutlined, HeartOutlined, PieChartOutlined, ShopOutlined, AppleOutlined } from '@ant-design/icons';

export const menus = [
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
];

// export const IconMap = {
//   smile: <SmileOutlined />,
//   heart: <HeartOutlined />,
//   pieChart: <PieChartOutlined />,
//   shop: <ShopOutlined />,
//   apple: <AppleOutlined />,
// };
