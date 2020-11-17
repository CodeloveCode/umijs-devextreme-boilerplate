import { UserSession } from '@/pages/login/DTO';
import React from 'react';
import { connect, SessionModelState } from 'umi';
import { PERMISSIONS } from "@/configs/configs";

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


class AccessControl extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props)
    }

    render() {
        let apis = this.props.userSession?.profile?.permissions.apis

        // 为了方便,开发环境直接读取configs.ts中的配置.
        if (process.env.NODE_ENV === 'development') {
            apis = Object.values(PERMISSIONS);
        }

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

/**
 * 根据授权决定是否可以看到子组件.
 * 也可以使用指定的内容进行替换.
 * @example
 * <Access permission="canAdd">
 *  <button>add</button>
 * </Access>
 * <Access permission="canDelete" fallback={<button>没有权限</button>}>
 *  <button>delete</button>
 * </Access>
 */
export const Access = connect(mapStateToProps)(AccessControl)
