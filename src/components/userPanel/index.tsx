import React from 'react';
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import './index.less';
import { withRouter } from 'umi';
import { connect } from 'react-redux';

class UserPanel extends React.Component<any, any> {
  // constructor(props) {
  //   super(props)
  // }

  /**
   * 登出流程:用户点击登出>>向服务器发送请求>>收到响应后清空Redux中的user数据>>清空浏览器的sessionStorage的数据.
   * 此时由于没有权限,axios中的配置会自动跳回登录页.
   */
  toLogout = () => {
    this.props.dispatch({ type: 'session/logout' });
  };

  render() {
    const {
      session: { user },
      menuMode,
    } = this.props;

    const menuItems: any = [
      {
        text: '配置',
        icon: 'user',
      },
      {
        text: '登出',
        icon: 'runner',
        onClick: this.toLogout,
      },
    ];

    const PositionNowarn: any = Position;
    return (
      <div className={'user-panel'}>
        <div className={'user-info'}>
          <div className={'image-container'}>
            <div
              style={{
                background: `url(${user.staffPhoto}) no-repeat #fff`,
                backgroundSize: 'cover',
              }}
              className={'user-image'}
            />
          </div>
          <div className={'user-name'}>{user.userName}</div>
        </div>

        {menuMode === 'context' && (
          <ContextMenu
            items={menuItems}
            target={'.user-button'}
            showEvent={'dxclick'}
            width={210}
            cssClass={'user-menu'}
          >
            <PositionNowarn my={'top center'} at={'bottom center'} />
          </ContextMenu>
        )}
        {menuMode === 'list' && (
          <List className={'dx-toolbar-menu-action'} items={menuItems} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    session: state.session,
  };
};

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     signOut: () => {
//       dispatch(logout())
//     },
//     dispatch,
//   };
// };

export default withRouter(connect(mapStateToProps)(UserPanel));
