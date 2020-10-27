import { LOGINED_USER_SESSION } from '@/configs/constants';
import Store from '@/utils/store';
import { Button, ContextMenu, List, Toolbar } from 'devextreme-react';
import { Position } from 'devextreme-react/context-menu';
import { Item } from 'devextreme-react/toolbar';
import React from 'react';
import './index.less';
import defaultImg from '@/assets/logo.png';

const signOut = () => { };

const menuItems = [
  {
    text: 'Profile',
    icon: 'user',
  },
  {
    text: 'Logout',
    icon: 'runner',
    onClick: signOut,
  },
];

interface IProps {
  userProfile: any; // TODO:跟tucci要数据结构.
}
export default (props: IProps) => {
  const userProfile = props.userProfile ?? {
    userName: 'admin',
    staffPhoto: defaultImg,
  };


  return (
    <header>
      {/* <i className="dx-icon-user" style={{ fontSize: '36px' }}></i> */}
      {/* <Avatar shape="square" size="small" icon={<UserOutlined />} /> */}
      <Button
        className={'user-button authorization'}
        width={210}
        height={'100%'}
        stylingMode={'text'}
      >
        <div className={'user-panel'}>
          <div className={'user-info'}>
            <div className={'image-container'}>
              <div
                style={{
                  background: `url(${userProfile.staffPhoto}) no-repeat #fff`,
                  backgroundSize: 'cover',
                }}
                className={'user-image'}
              />
            </div>
            <div className={'user-name'}>{userProfile.userName}</div>
          </div>
          <ContextMenu
            items={menuItems}
            target={'.user-button'}
            showEvent={'dxclick'}
            width={210}
            cssClass={'user-menu'}
          >
            {/* @ts-ignore */}
            <Position my={'top center'} at={'bottom center'} />
          </ContextMenu>
        </div>
      </Button>
    </header>
  );
};
