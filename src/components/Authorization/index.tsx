import React from 'react';
import { connect, SessionModelState } from 'umi';

interface IProp {
    // this.props.children 被本组件保护的目标组件.
    children: any;
    session: SessionModelState;
    /**
     * 访问此组件包含的组件(按钮,链接等)需要的权限的code.
     */
    permission: string;
}

/**
 * 根据授权决定是否可以看到子组件.
 */
function Authorization(props: IProp) {
    const apis = props.session.userInfo.profile.permissions.apis

    let isAuthorized = false
    if (apis.includes(props.permission)) {
        isAuthorized = true
    }
    return (<>
        {isAuthorized && props.children}
    </>)
}

const mapStateToProps = (state: any, ownProps: any) => {
    const session: SessionModelState = state.session;
    return {
        session,
        loading: state.loading.models.session, // dvaJs自带的loading(每个model共用一个)
    };
};

export default connect(mapStateToProps)(Authorization)
