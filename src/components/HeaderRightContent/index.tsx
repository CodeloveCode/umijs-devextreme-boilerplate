
import { Button, ContextMenu } from 'devextreme-react';
import { Position } from 'devextreme-react/context-menu';
import React from 'react';
import './index.less';
import defaultImg from '@/assets/logo.png';
import { UserProfile } from '@/pages/login/DTO';
import { connect } from 'umi';

interface IProps {
  userProfile: UserProfile;
  logout: () => void;
}
function AppComponent(props: IProps) {
  const menuItems = [
    {
      text: 'Profile',
      icon: 'user',
    },
    {
      text: 'Logout',
      icon: 'runner',
      onClick: props.logout,
    },
  ];

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

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch,
    logout: () => {
      dispatch({ type: 'session/logout' })
    }
  };
};

export const HeaderRightContent = connect(null, mapDispatchToProps)(AppComponent)
export default HeaderRightContent 