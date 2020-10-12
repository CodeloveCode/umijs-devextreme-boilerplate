import { menusForBreadcrumbs } from '@/common/oldMenus';
import { Breadcrumb } from 'antd';
import { Link, withRouter } from 'umi';

export default () => <Home />;

// const breadcrumbNameMap = {
//   '/': '主页',
//   '/protal': '主页',
//   '/demo': 'demo',
//   '/system-mgmt': '系统管理',
//   '/user-mgmt': '用户管理',
// };
const Home = withRouter(props => {
  const { location } = props;
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const text = menusForBreadcrumbs.find(item => item.path === url)?.text;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{text}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/portal">主页</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return (
    <div className="demo">
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    </div>
  );
});
