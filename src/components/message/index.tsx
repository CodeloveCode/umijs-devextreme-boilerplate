import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Button, DataGrid, List } from 'devextreme-react';
import Toolbar, { Item as ToolBarItem } from 'devextreme-react/toolbar';
import ScrollView from 'devextreme-react/scroll-view';
import { BarGauge, Label } from 'devextreme-react/bar-gauge';
import { CheckBox } from 'devextreme-react/check-box';
import './index.less';
import { Link, withRouter } from 'umi';
import { tasks } from './todos';
import { Column } from 'devextreme-react/data-grid';

/**
 * portal页--布局--左侧的todolist
 */

const pressureLabelFormat = {
  type: 'decimal',
};

const products = [
  {
    name: 'Hummers',
    count: 41,
    active: true,
  },
];
const styles = {
  appTile: {
    display: 'flex',
    alignItems: 'begin',
    justifyContent: 'space-evenly',
    // overflowY:"scroll",
    height: '49vh',
    background: '#fff',
    marginBottom: '2%',
  },
};
class Message extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      productsActivity: products,
      values: ['50'],
    };
  }

  render() {
    return (
      <div>
        <ScrollView style={styles.appTile}>
          <h4
            className={'dx-theme-text-color'}
            style={{ padding: '30px 20px 10px 20px', fontWeight: '700' }}
          >
            已办事项
          </h4>
          <div id="gauge-demo" style={{ width: '100%' }}>
            <BarGauge
              id="gauge"
              startValue={0}
              endValue={100}
              values={this.state.values}
            ></BarGauge>
          </div>
        </ScrollView>
      </div>
    );
  }
  item = () => {};
}

export default withRouter(Message);
