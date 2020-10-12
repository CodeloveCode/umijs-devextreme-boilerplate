
import React from "react";
import ProLayout, { MenuDataItem } from "@ant-design/pro-layout";
import { Route } from '@ant-design/pro-layout/lib/typings';
import { menus, IconMap } from '@/common/menus';
import { smallLogo, bigLogo } from '@/components/logo';
import { Link, withRouter } from 'umi';
import "./index.less";


const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
    menus.map(({ icon, children, ...item }) => ({
        ...item,
        // @ts-ignore
        icon: icon && IconMap[icon as string],
        children: children && loopMenuItem(children),
    }));

const generateRoute = (menus: MenuDataItem[]): Route => {
    return menus.map(({ children, ...item }) => ({
        ...item,
        routes: children && generateRoute(children),
    }))
}

class DefaultLayout extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            logoComponent: bigLogo,
            // collapsed: false,
        }
    }

    render() {
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
                // 传入umijs自动生成的约定式路由.
                route={this.props.route}
                // 传入菜单项数据,可以从服务器获取并加工获得.便于控制权限.
                menuDataRender={() => loopMenuItem(menus)}
                menuItemRender={(menuItemProps, defaultDom) => {
                    if (menuItemProps.isUrl || menuItemProps.children) {
                        return defaultDom;
                    }
                    if (menuItemProps.path) {
                        // 顶层非目录菜单.不需要icon.defaultDom里似乎已经渲染了icon.
                        const iconComponent = menuItemProps.pro_layout_parentKeys.length > 0 ? menuItemProps.icon : null
                        return <Link to={menuItemProps.path}>{iconComponent}{defaultDom}</Link>;
                    }
                    return defaultDom;
                }}
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

    menuHeaderRender = (logo: any, title: any) => (
        <div>
            {logo}
            {/* {this.state.collapsed ? null : title} */}
        </div>
    )
}
export default withRouter(DefaultLayout)