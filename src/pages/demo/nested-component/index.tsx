import React, { Fragment } from 'react';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

// 关键:将目标项目部署在文件服务器中,并确保每个html页面都有所有需要的依赖(把index.html中的依赖声明加进去)
// 然后使用iframe直接访问这些html即可.与直接访问index.html是同样的道理.
export default () => {
  return (
    <Fragment>
      <PageHeaderWrapper title={false}>
        <iframe
          title="component-ui"
          src="http://localhost:1235/materialChange.html"
          className={styles['iframe-style']}
          scrolling="auto"
        />
      </PageHeaderWrapper>
    </Fragment>
  );
};
