import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Menu } from 'antd';
import Box, { Item } from 'devextreme-react/box';
import { Button, TreeView } from 'devextreme-react';
import Toolbar, { Item as ToolBarItem } from 'devextreme-react/toolbar';
import './index.less';
import { Link, withRouter } from 'umi';
import { menuItems } from '../oldMenus';

class LeftSider extends React.Component<any, any> {
  // 把selectedItemChanged替换掉,换成<Link>
  treeItemRender = (itemData: any) => {
    return <Link to={`${itemData.path}`}>{itemData.text}</Link>;
  };

  render() {
    const { toggleMenu } = this.props;
    return (
      <div>
        <Toolbar>
          <ToolBarItem
            visible={true}
            location={'before'}
            widget={'dxButton'}
            cssClass={'menu-button'}
          >
            <Button icon="menu" stylingMode="text" onClick={toggleMenu} />
          </ToolBarItem>
          <ToolBarItem
            visible={true}
            location={'after'}
            text={'vskySoft'}
          ></ToolBarItem>
        </Toolbar>
        <TreeView
          dataStructure={'tree'}
          dataSource={menuItems}
          keyExpr={'id'}
          selectionMode={'single'}
          focusStateEnabled={false}
          //TODO:这里报错??
          expandEvent={'click'}
          // onItemClick={this.selectedItemChanged}
          itemRender={this.treeItemRender}
          width={'100%'}
        />
      </div>
    );
  }
}

export default withRouter(LeftSider);
