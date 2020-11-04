import React from 'react';
import { Redirect, Link, withRouter, SessionModelState } from 'umi';
import { connect } from 'react-redux';

import LoadIndicator from 'devextreme-react/load-indicator';
import './index.less';
import { LOGINED_USER_SESSION } from '@/configs/constants';
import Store from '@/utils/store';
import { LoadPanel } from 'devextreme-react';
import { getUrlByName } from '@/utils/configsReader';

const portal_system_url = getUrlByName('portal_system_url');

class LoginView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    let token = this.props.location.query.token as string;
    if (token) {
      token = token.replace('Bearer ', '');
      Store.set(LOGINED_USER_SESSION, { token });
      this.getUserProfile(token);
    }
  }

  render() {
    const {
      loading,
      session: { userInfo },
    } = this.props;


    console.log('userInfo?.profile', userInfo?.profile);

    if (userInfo?.profile) {
      // 进入首页
      return <Redirect to="/" />;
    }

    // TODO:三秒后,重定向到Portal
    return (
      <>
        <LoadIndicator visible={this.props.loading} />
        <h1>尚未登录,5秒后即将转到Portal登录...</h1>
        <a href={portal_system_url}>http://118.31.184.21:6543/portal</a>
      </>
    );
  }

  /**
   * 用户已在Portal门户网站登录,现在带着token过来.需要获取用户权限.
   */
  getUserProfile = (token: string) => {
    this.props.dispatch({ type: 'session/getUserProfile', payload: { token } });
  };

  redirectToPortal = () => {
    this.props.history.push(portal_system_url);
  };
}

const mapStateToProps = (state: any, ownProps: any) => {
  const session: SessionModelState = state.session;
  return {
    session,
    loading: state.loading.models.session, // dvaJs自带的loading(每个model共用一个)
  };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginView),
);
