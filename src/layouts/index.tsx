
import React from "react";
import ProLayout, { MenuDataItem } from "@ant-design/pro-layout";
import { Route } from '@ant-design/pro-layout/lib/typings';
import { menus, IconMap } from '@/configs/menus';
import { smallLogo, bigLogo } from '@/components/Logo';
import { connect, Link, Redirect, SessionModelState, withRouter } from 'umi';
import "./index.less";
import HeaderRightContent from '@/components/HeaderRightContent';
import { LOGINED_USER_SESSION } from '@/configs/constants';
import Store from '@/utils/store';
import { UserProfile, UserSession } from '@/pages/login/DTO';
import { TabPanel, Sortable } from 'devextreme-react';

/**
 * 菜单数据预处理.
 * 加工从服务器端获得的menu数据,替换icon为Icon组件.添加权限等.
 * @param menus 本地菜单配置
 * @param userProfile 从服务器获取的权限数据.
 */
const loopMenuItem = (menus: MenuDataItem[], userProfile?: UserProfile): MenuDataItem[] => {
    const remoteMenuPaths = userProfile?.permissions.menus

    return menus.map(({ icon, children, ...item }) => {
        if (remoteMenuPaths && remoteMenuPaths.length > 0 && item.path && !remoteMenuPaths.includes(item.path)) {
            item.hideInMenu = true
        } else {
            item.hideInMenu = false
        }
        let handledMenu = {
            ...item,
            // @ts-ignore
            icon: icon && IconMap[icon as string],
            children: children && loopMenuItem(children, userProfile),
        }
        return handledMenu
    });
}


/**
 * @deprecated 路由由umijs约定式管理.不需要Layout处理.
 * @param menus
 */
const generateRoute = (menus: MenuDataItem[]): Route => {
    return menus.map(({ children, ...item }) => ({
        ...item,
        routes: children && generateRoute(children),
    }));
};

interface IState {
    logoComponent: () => JSX.Element;
    tabList: any[];
    tabSelected: any;
    tabVisible: boolean;
}

class DefaultLayout extends React.Component<any, IState> {
    private allMenus: any;
    constructor(props: any) {
        super(props)
        this.state = {
            logoComponent: bigLogo,
            tabList: [],
            tabSelected: {},
            tabVisible: false,
        }
        this.allMenus = [];
    }

    componentDidMount() {
        if (this.props.location.pathname != '/') {
            this.mapMenus(menus);
            let cMenu = this.allMenus.find((item: any) => {
                return item.path === this.props.location.pathname;
            });
            if (!cMenu) {
                let splits = this.props.location.pathname.split('/');
                splits.pop();
                let path = splits.join('/');
                cMenu = this.allMenus.find((item: any) => {
                    return item.path === path;
                });
            }
            if (cMenu) {
                this.setState({ tabVisible: true });
                let tab = { tab: cMenu.name, path: cMenu.path };
                const tabs = [...this.state.tabList];
                tabs.push(tab);
                this.setState({ tabList: tabs, tabSelected: tab });
            }
        }
    }

    mapMenus = (menus: any) => {
        for (let i in menus) {
            this.allMenus.push(menus[i]);
            if (menus[i].children) {
                this.mapMenus(menus[i].children);
            }
        }
    };

    addButtonHandler = (item: any) => {
        const tabs = [...this.state.tabList];
        let newItem = tabs.find((e: any) => {
            return e.tab == item.name;
        });
        if (!newItem) {
            if (tabs.length === 0) {
                this.setState({ tabVisible: true });
            }
            newItem = { tab: item.name, path: item.path };
            tabs.push(newItem);
            this.setState({ tabList: tabs });
        }
        this.setState({ tabSelected: newItem });
    };

    closeButtonHandler = (item: any) => {
        const newTabs = [...this.state.tabList];
        const index = newTabs.indexOf(item);

        newTabs.splice(index, 1);
        this.setState({ tabList: newTabs });
        if (index >= newTabs.length && index > 0) {
            this.setState({ tabSelected: newTabs[index - 1] });
            this.props.history.push(newTabs[index - 1].path);
        } else {
            this.setState({ tabSelected: newTabs[0] });
            this.props.history.push(newTabs[0].path);
        }
    };

    renderTitle = (data: any) => {
        return (
            <React.Fragment>
                <div>
                    <span>{data.tab}</span>
                    {this.state.tabList.length >= 2 && (
                        <i
                            className="dx-icon dx-icon-close"
                            onClick={() => {
                                this.closeButtonHandler(data);
                            }}
                        />
                    )}
                </div>
            </React.Fragment>
        );
    };

    onTabDragStart = (e: any) => {
        e.itemData = e.fromData[e.fromIndex];
    };

    onTabDrop = (e: any) => {
        const newTabs = [...this.state.tabList];
        newTabs.splice(e.fromIndex, 1);
        newTabs.splice(e.toIndex, 0, e.itemData);
        this.setState({ tabList: newTabs });
    };

    onSelectionChanged = (args: any) => {
        if (
            this.state.tabSelected &&
            this.state.tabSelected.path === args.addedItems[0].path
        ) {
            return;
        }
        this.setState({ tabSelected: args.addedItems[0] });
        this.props.history.push(args.addedItems[0].path);
    };

    render() {
        const { location, sessionState, children, dispatch } = this.props;
        const pathname: string = location.pathname;

        if ('production' === process.env.NODE_ENV) {
            // 登陆页不使用此布局,而是返回登陆页本身组件.
            if (pathname === '/login') {
                return children;
            } else {
                // 非登陆的路由需要鉴权.
                // 从store中取数据
                // 取不到,从sessionStorage取,并存入store.session.state
                // 取不到,跳转登陆页.
                // const sessionState = useSelector((state: any) => state.session)
                let isLogined = sessionState.userSession?.token ?? false;
                if (!isLogined) {
                    const userSession: UserSession = Store.get(LOGINED_USER_SESSION);

                    isLogined = userSession?.profile ?? false;
                    if (isLogined) {
                        dispatch({
                            type: 'session/saveUserInfo',
                            payload: { userSession },
                        });
                    } else {
                        return <Redirect to="/login" />;
                    }
                }
                // TODO:把用户的api权限,菜单权限等存入Context,传给子组件.方便Authorization子组件调用进行鉴权.
            }
        }

        const userProfile = Store.get(LOGINED_USER_SESSION)?.profile;

        const { logoComponent,
            tabList, tabSelected, tabVisible,
        } = this.state;

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
                menuDataRender={() => loopMenuItem(menus, userProfile)}
                menuItemRender={this.menuItemRender}
                rightContentRender={() => (
                    <HeaderRightContent userProfile={userProfile} />
                )}
            >
                <Sortable
                    filter=".dx-tab"
                    data={tabList}
                    itemOrientation="horizontal"
                    dragDirection="horizontal"
                    onDragStart={this.onTabDragStart}
                    onReorder={this.onTabDrop}
                >
                    <TabPanel
                        dataSource={tabList}
                        itemTitleRender={this.renderTitle}
                        deferRendering={false}
                        showNavButtons={true}
                        selectedItem={tabSelected}
                        repaintChangesOnly={true}
                        onSelectionChanged={this.onSelectionChanged}
                        itemComponent={() => <></>}
                        visible={tabVisible}
                    />
                </Sortable>
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
            return (
                <Link to={menuItemProps.path} onClick={() => this.addButtonHandler(menuItemProps)}
                >
                    {iconComponent}
                    {defaultDom}
                </Link>
            );
        }
        return defaultDom;
    }

    /**
     * 给所有面包屑的最前面加上一个主页.这样顶层的非目录菜单项的页面就至少有一个面包屑.
     * @param routes
     */
    breadcrumbRender = (routes: any) => {
        const newRoutes = routes.map((route: any) => {
            delete route.path
            return route
        })
        return [
            {
                // path: '/', // 让面包屑不可点击.
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
