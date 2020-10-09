import React, { useState } from 'react';
import { Link, Redirect, withRouter, connect } from 'umi';
import LeftSider from '@/components/leftSider';
import Header from '@/components/header';
import { Drawer } from 'devextreme-react';
import { SessionModelState } from '@/models/session';
import Store from '@/utils/store';
import { LOGINED_USER_SESSION } from '@/common/constants';
import './index.less';

interface tabConfig {
  id: number;
  text: string;
  icon: string;
  path: string;
}

/**
 *   非登陆的路由需要鉴权.
    1.从store中取数据
    2.取不到,从sessionStorage取,并存入store.session.state
    3.取不到,跳转登陆页.
 * @param props 
 */
function BasicLayout(props: any) {
  const pathname: string = props.location.pathname;

  // 登陆页不使用BasicLayout,返回登陆页本身.

  // TODO:暂时不使用登录模块.
  if (pathname === '/login') { // 登录页面不适用此布局.
    return props.children;
  } else {

    // const sessionState = props.sessionState;
    // let isLogined = sessionState.user?.token ?? false;
    // if (!isLogined) {
    //   const userInfo = Store.get(LOGINED_USER_SESSION);

    //   isLogined = userInfo?.token ?? false;
    //   if (isLogined) {
    //     props.dispatch({
    //       type: 'session/saveUserInfo',
    //       payload: { user: userInfo },
    //     });
    //   } else {
    //     return <Redirect to="/login" />;
    //   }
    // }
  }

  // 如果是子系统,则不予嵌套.直接显示子系统Layout.后续如果有多个子系统布局,则抽取成配置,自动读取.
  if (
    // pathname.includes('system-mgmt') ||
    pathname.includes('demo')
    //|| pathname.includes('application-mgmt') ||
    // pathname.includes('service-mgmt')
  ) {
    return props.children;
  }

  // const [menuStatus, setMenuStatus] = useState(2)
  const [collapse, setCollapse] = useState(true);

  function toggleMenu(e: any) {
    setCollapse(preState => !preState);

    e.event.stopPropagation();
  }

  return (
    <div>
      <Drawer
        className={'drawer'}
        position={'before'}
        closeOnOutsideClick={true}
        openedStateMode={'shrink'} // overlap:不好用,shrink:抽屉关闭时里面的内容会尝试响应式变化,push:抽屉关闭时,里面内容不变化.
        revealMode={'expand'} // slide, expand
        minSize={40}
        maxSize={272}
        shading={false}
        opened={collapse}
        component={() => <LeftSider toggleMenu={toggleMenu} />}
      >
        <Header />
        <div style={{ width: '100%', minWidth: '200px' }}>
          <div className={'content-block dx-card responsive-paddings wrap'}>
            {props.children}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default connect(
  (state: { session: SessionModelState }) => ({ sessionState: state.session }),
  (dispatch: any) => ({ dispatch }),
)(BasicLayout);
