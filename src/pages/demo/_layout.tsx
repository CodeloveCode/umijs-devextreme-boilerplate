import React, { useEffect, useState } from 'react';
import LeftSider from './devLayout/leftSider';
import Header from './devLayout/header';
import { Link, Redirect, withRouter } from 'umi';
import { connect } from 'react-redux';
import { Drawer } from 'devextreme-react';
import { SessionModelState } from '@/models/session';
import ScrollView from 'devextreme-react/scroll-view';
import { Tabs } from 'devextreme-react/tabs';
import './_layout.less';

interface tabConfig {
  id: number;
  text: string;
  icon: string;
  path: string;
}

export default (props: any) => {
  const [collapse, setCollapse] = useState(true);

  function toggleMenu(e: any) {
    setCollapse(preState => !preState);
    e.event.stopPropagation();
  }

  if (true) {
    return (props.children)
  }

  return (
    <div>
      <Drawer
        className={'drawer'}
        position={'before'}
        closeOnOutsideClick={true}
        openedStateMode={'shrink'} // overlap:不好用,shrink:抽屉关闭时里面的内容会尝试响应式变化,push:抽屉关闭时,里面内容不变化.
        revealMode={'expand'} // slide, expand
        minSize={40}
        maxSize={272}
        shading={false}
        opened={collapse}
        component={() => <LeftSider toggleMenu={toggleMenu} />}
      >
        <Header />
        <div style={{ width: '100%', minWidth: '200px' }}>
          <div className={'content-block dx-card responsive-paddings wrap'}>
            {props.children}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

// export default withRouter(SystemMGMTLayout);
