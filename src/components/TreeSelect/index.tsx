import React, { RefObject } from 'react';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeList, {
  Column,
  Selection,
  Scrolling,
  FilterRow,
  SearchPanel,
} from 'devextreme-react/tree-list';
import styles from './index.less';
import dxTreeList from 'devextreme/ui/tree_list';
// import { createStore } from 'devextreme-aspnet-data-nojquery';

interface IProps<T> {
  /**
   * dataSource中每个元素的唯一标示字段.
   */
  keyExpr?: string;
  /**
   * dataSource的元素是自组成的,因此有父id字段.
   */
  parentIdExpr?: string;
  /**
   * 最顶层元素的父id
   */
  rootValue?: any;
  /**
   * dataSource中每个item用来显示的字段.
   */
  displayExpr?: string;
  /**
   * 单选或多选.默认多选.
   */
  selectionMode?: 'single' | 'multiple';

  /**
   * 初始已选择项的id数组.
   */
  value?: any[];
  /**
   * 数据源目前只支持plain object array格式.
   */
  dataSource: any[];
  // onValueChanged: (items: any[]) => void;
  width?: number | string;
  /**
   * 把当前组件TreeSelect作为Form的Item或者DataGrid.Column的editCellComponent时,DevExtreme会传入data对象,可用于保存当前组件TreeSelect的值.
   * 当本组件作为DataGrid.Column的editCellRender时,从editCellRender可以得到入参target,其有setValue方法,可用于保存当前组件的值.
   */
  target?: any;
}

interface IState<T> {
  /**
   * 已选择项的id数组.
   */
  currentValue: any[];
}

// const tasks = createStore({
//   key: 'ID',
// });


/**
 * TreeSelect.
 */
class TreeSelect<T> extends React.PureComponent<IProps<T>, IState<T>> {
  private dropDownBoxRef: RefObject<DropDownBox>;
  private treeListRef: RefObject<TreeList>;

  constructor(props: IProps<T>) {
    super(props);
    this.dropDownBoxRef = React.createRef();
    this.treeListRef = React.createRef();

    this.state = {
      currentValue: props.value ?? [],
    };
  }
  componentDidMount() {
    // console.log('this.props.data', this.props.data)
  }

  onValueChanged = (e: any) => {
    // this.props.data.setValue(e.value);
    // console.log('props', this.props)
    this.props.target.setValue(e.value)
  }

  render() {
    const { currentValue } = this.state;
    const { keyExpr, displayExpr, dataSource, width } = this.props;
    return (
      <DropDownBox
        ref={this.dropDownBoxRef}
        width={width ?? 552}
        // dropDownOptions={dropDownOptions}
        dataSource={dataSource}
        value={currentValue}
        valueExpr={keyExpr ?? 'id'}
        displayExpr={displayExpr ?? 'description'}
        // placeholder="Select a value..."
        // showClearButton={true}
        // onValueChanged={this.onValueChanged}
        contentRender={this.treeViewRender}
      />
    );
  }

  treeViewRender = () => {
    const {
      dataSource,
      keyExpr,
      parentIdExpr,
      rootValue,
      displayExpr,
      selectionMode,
    } = this.props;
    return (
      <TreeList
        className={styles['nav-tree']}
        ref={this.treeListRef}
        // width={width}
        height={'336px'}
        dataSource={dataSource}
        dataStructure="plain"
        keyExpr={keyExpr ?? 'id'}
        parentIdExpr={parentIdExpr ?? 'parent_id'}
        rootValue={rootValue ?? '0'} // 必填.根节点的父级id.要么删掉,要么在这里配置.
        showRowLines={false}
        showBorders={false}
        columnAutoWidth={false}
        showColumnHeaders={false}
        selectedRowKeys={this.state.currentValue}
        onSelectionChanged={this.onItemSelectionChanged}
        rowAlternationEnabled={false}
        autoExpandAll={false}
        loadPanel={{ enabled: true }}
        onToolbarPreparing={this.onToolbarPreparing}
      >
        <Selection mode={selectionMode ?? 'multiple'} />
        <Scrolling mode="infinite" />
        <SearchPanel visible={true} />
        {/* <Paging enabled={true} pageSize={10} /> */}
        <Column
          dataField={displayExpr ?? 'description'}
          caption={displayExpr ?? 'description'}
          alignment={'left'}
        />
      </TreeList>
    );
  };

  onToolbarPreparing = (e: any) => {
    const items: any[] = e.toolbarOptions.items;
    items.unshift({
      location: 'after',
      widget: 'dxButton',
      options: {
        hint: '确定',
        icon: 'todo',
        onClick: this.onSave,
      },
    });
  };

  onSave = () => {
    this.dropDownBoxRef.current?.instance!.close();
  };

  onItemSelectionChanged = (e: {
    component?: dxTreeList;
    currentDeselectedRowKeys?: any[];
  }) => {
    // 多选时, 如果选择的是已分配的组,则不允许取消选择.
    if (
      this.props.selectionMode !== 'single' &&
      e.currentDeselectedRowKeys &&
      e.currentDeselectedRowKeys.length > 0
    ) {
      const currDeselectedKey = e.currentDeselectedRowKeys[0];
      const initValues = this.props.value;

      if (initValues?.includes(currDeselectedKey)) {
        e.component?.selectRows([currDeselectedKey], true);
        return;
      }
    }
    // this.props.onValueChanged(e.component?.getSelectedRowsData()!);  
    this.onValueChanged({ value: this.treeList.getSelectedRowKeys() })
    this.setState({ currentValue: this.treeList.getSelectedRowKeys() });
  };

  get treeList(): dxTreeList {
    return this.treeListRef.current?.instance!;
  }
}

export default TreeSelect;
