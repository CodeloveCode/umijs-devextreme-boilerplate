
import React from "react";
import ProLayout, { MenuDataItem } from "@ant-design/pro-layout";
import { Route } from '@ant-design/pro-layout/lib/typings';
import { menus, IconMap } from '@/configs/menus';
import { smallLogo, bigLogo } from '@/components/logo';
import { connect, Link, SessionModelState, withRouter } from 'umi';
import "./index.less";
import HeaderRightContent from '@/components/HeaderRightContent';
import { LOGINED_USER_SESSION } from '@/configs/constants';
import Store from '@/utils/store';

/**
 * 菜单数据预处理.
 * 加工从服务器端获得的menu数据,替换icon为Icon组件.添加权限等.
 * @param menus 
 */
const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
    menus.map(({ icon, children, ...item }) => ({
        ...item,
        // @ts-ignore
        icon: icon && IconMap[icon as string],
        children: children && loopMenuItem(children),
    }));

/**
 * @deprecated 路由由umijs约定式管理.不需要Layout处理.
 */
class DefaultLayout extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            logoComponent: bigLogo,
        }
    }


    render() {
        const { location, sessionState, children, dispatch } = this.props;
        const pathname: string = location.pathname;

        // TODO:临时使用环境变量
        // if ('development' === process.env.NODE_ENV) {
        //   // 登陆页不使用此布局,而是返回登陆页本身组件.
        //   if (pathname === '/login') {
        //     return children;
        //   } else {
        //     // 非登陆的路由需要鉴权.
        //     // 从store中取数据
        //     // 取不到,从sessionStorage取,并存入store.session.state
        //     // 取不到,跳转登陆页.
        //     // const sessionState = useSelector((state: any) => state.session)
        //     let isLogined = sessionState.userInfo?.token ?? false;
        //     if (!isLogined) {
        //       const userInfo = Store.get(LOGINED_USER_SESSION);

        //       isLogined = userInfo?.token ?? false;
        //       if (isLogined) {
        //         dispatch({
        //           type: 'session/saveUserInfo',
        //           payload: { userInfo },
        //         });
        //       } else {
        //         return <Redirect to="/login" />;
        //       }
        //     }
        //   }
        // }

        const userProfile = Store.get(LOGINED_USER_SESSION)?.profile;
        const { logoComponent } = this.state

        return (<>
            <ProLayout
                logo={logoComponent}
                title={'vsky'}
                menuHeaderRender={this.menuHeaderRender}
                theme={'light'}
                navTheme={'light'}
                style={{
                    height: 500,
                }}
                contentWidth={'Fluid'}
                fixedHeader={true}
                fixSiderbar={true}
                onCollapse={this.onCollapse}
                breadcrumbRender={this.breadcrumbRender}
                // 传入umijs自动生成的约定式路由.
                route={this.props.route}
                menuDataRender={() => loopMenuItem(menus)}
                menuItemRender={this.menuItemRender}
                rightContentRender={() => (
                    <HeaderRightContent userProfile={userProfile} />
                )}
            >
                {this.props.children}
            </ProLayout>
        </>)
    }

    onCollapse = (collapsed: boolean) => {
        let logoComponent = bigLogo;
        if (collapsed) {
            logoComponent = smallLogo;
        }
        this.setState({ logoComponent })
    }

    menuItemRender = (menuItemProps: MenuDataItem & { isUrl: boolean }, defaultDom: React.ReactNode): React.ReactNode => {
        if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom;
        }
        if (menuItemProps.path) {
            // 顶层非目录菜单.不需要icon.
            const iconComponent = menuItemProps.pro_layout_parentKeys.length > 0 ? menuItemProps.icon : null
            return <Link to={menuItemProps.path}>{iconComponent}{defaultDom}</Link>;
        }
        return defaultDom;
    }

    /**
     * 给所有面包屑的最前面加上一个主页.这样顶层的非目录菜单项的页面就至少有一个面包屑.
     * @param routes
     */
    breadcrumbRender = (routes: any) => {
        // 许海燕:让面包屑不可点击.
        // 去掉path,这样点不了了.
        const newRoutes = routes.map((route: any) => {
            delete route.path
            return route
        })
        return [
            {
                // path: '/',
                breadcrumbName: '主页',
            },
            ...(newRoutes || []),
        ]
    };

    menuHeaderRender = (logo: any, title: any) => (
        <div>
            {logo}
            {/* {this.state.collapsed ? null : title} */}
        </div>
    )
}
export default withRouter(
    connect(
        (state: { session: SessionModelState }) => {
            return {
                sessionState: state.session,
            };
        },
        dispatch => {
            return {
                dispatch,
            };
        },
    )(DefaultLayout),
);
