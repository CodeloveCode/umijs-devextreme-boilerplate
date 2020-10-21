import React from 'react';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';
import UserPanel from '../userPanel';
import './index.less';
import { Template } from 'devextreme-react/core/template';
import { menusForBreadcrumbs } from '../oldMenus';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'umi';

export default function Header({ title, handleSearch }: any) {
  // 面包屑初始化.
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const text = menusForBreadcrumbs.find(item => item.path === url)?.text;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{text}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/portal">主页</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <header className={'header-component'}>
      <Toolbar className={'header-toolbar'} style={{ paddingLeft: '20px' }}>
        <Item
          location={'before'}
          cssClass={'header-title'}
          text={title}
          visible={!!title}
        />
        <Item location="before">
          <Breadcrumb>{breadcrumbItems}</Breadcrumb>
        </Item>
        <Item location="after">
          <Button icon="search" onClick={handleSearch} />
        </Item>
        <Item
          location={'after'}
          locateInMenu={'auto'}
          menuItemTemplate={'userPanelTemplate'}
        >
          <Button
            className={'user-button authorization'}
            width={210}
            height={'100%'}
            stylingMode={'text'}
          >
            <UserPanel menuMode={'context'} />
          </Button>
        </Item>
        <Template name={'userPanelTemplate'}>
          <UserPanel menuMode={'list'} />
        </Template>
      </Toolbar>
    </header>
  );
}
