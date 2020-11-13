import { UserSession } from '@/pages/login/DTO';
import React from 'react';
import { connect, SessionModelState } from 'umi';
import __configs from "../../configs/configs";

interface IProps {
    /**
     * 有权限时的显示。.
     */
    children: React.ReactNode;
    /**
     * 访问此组件包含的组件(按钮,链接等)需要的权限的code.
     */
    permission: string;
    /**
     * 权限不足时替代children的组件或文本.
     */
    fallback?: React.ReactNode | string;

    userSession?: UserSession;
}

/**
 * 根据授权决定是否可以看到子组件.
 * @example 
 * <Access permission="canDelete" fallback={<div>没有删除权限</div>}>
 *  <button>delete</button>
 * </Access>
 */
class Access extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props)
    }

    render() {
        let apis = this.props.userSession?.profile?.permissions.apis

        // 为了方便,开发环境直接读取configs.ts中的配置.
        // if (process.env.NODE_ENV === 'development') {
        //     apis = Object.values(Object.values(__configs.permissions));
        // }

        if (apis && apis.includes(this.props.permission)) {
            return (<>
                {this.props.children}
            </>)
        } else {
            return (<>
                {this.props.fallback}
            </>)
        }
    }
}

const mapStateToProps = (state: any, ownProps: any) => {
    const session: SessionModelState = state.session;
    return {
        userSession: session.userInfo,
        loading: state.loading.models.session, // dvaJs自带的loading(每个model共用一个)
    };
};

export default connect(mapStateToProps)(Access)
