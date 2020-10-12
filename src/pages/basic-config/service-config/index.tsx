import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React from 'react';
import styles from './index.less';

export default () => {
  return (
    <>
      <PageHeaderWrapper title={false}>
        <div className={'dx-card'}>
          <h2 className={styles.title}>Page service-config</h2>
        </div>
      </PageHeaderWrapper>
    </>
  );
};
