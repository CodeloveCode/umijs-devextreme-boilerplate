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
import { shallowEqual } from '@/utils/ImmutableUtils';

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
  rootValue?: string;
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
  value?: string[];
  /**
   * 数据源目前只支持plain object array格式.
   */
  dataSource: any[];
  /**
   * @deprecated 尽量使用target代替.
   */
  onValueChange?: (items: any[]) => void;
  /**
   * 把当前组件TreeSelect作为Form的Item或者DataGrid.Column的editCellComponent时,DevExtreme会传入data对象,可用于保存当前组件TreeSelect的值.
   * 当本组件作为DataGrid.Column的editCellRender时,从editCellRender可以得到入参target,其有setValue方法,可用于保存当前组件的值.
   * 如果目标组件没有setValue,可以自行实现.只要将本组件的值保存到目标组件中即可.
   * @example
   * const target = {
          setValue: (value: any) => {
              this.form.option('formData', { task: value })
          }
      }
   */
  target?: Setable;
  width?: number | string;
  disabled?: boolean;
}

type Setable = {
  setValue(value: any): void;
};

interface IState<T> {
  /**
   * 已选择项的id数组.
   */
  currentValue: string[];
}

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

  // onValueChanged = (e: { value: any }) => {
  //   const value: string[] = e.value;
  //   this.props.target?.setValue(value);
  // };

  render() {
    const { currentValue } = this.state;
    const { keyExpr, displayExpr, dataSource, width, disabled } = this.props;
    return (
      <DropDownBox
        ref={this.dropDownBoxRef}
        // width={width ?? 552}
        // dropDownOptions={dropDownOptions}
        dataSource={dataSource}
        value={currentValue}
        valueExpr={keyExpr ?? 'id'}
        displayExpr={displayExpr ?? 'description'}
        disabled={disabled ?? false}
        // placeholder="Select a value..."
        // showClearButton={true}
        // onValueChanged={this.syncTreeViewSelection}
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
        columnAutoWidth={true}
        showColumnHeaders={false}
        selectedRowKeys={this.state.currentValue}
        onSelectionChanged={this.onItemSelectionChanged}
        rowAlternationEnabled={false}
        autoExpandAll={false}
        loadPanel={{ enabled: true }}
        onToolbarPreparing={this.onToolbarPreparing}
        // onInitialized={this.initValueCanNotModify}
      >
        <Selection mode={selectionMode ?? 'multiple'} />
        {/* <Scrolling mode="infinite" /> */}
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

  // itemRender = (e: any) => {
  //   return (<>

  //   </>)
  // }
  // { component ?: dxTreeView, element ?: dxElement, model ?: any, itemData ?: any, itemElement ?: dxElement, itemIndex ?: number, node ?: dxTreeViewNode }
  /**
   * 初始已选择的项不允许修改.
   */
  // initValueCanNotModify = (e: { component?: dxTreeView, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement, itemIndex?: number, node?: dxTreeViewNode }) => {

  //   const initValues = this.props.value
  //   if (initValues && initValues.length > 0) {
  //     // const items = e.component?.option('items')
  //     const itemElem = e.itemElement! as HTMLElement

  //     if (initValues.includes(e.itemData.id)) {
  //       e.component?.option(`items[${e.itemIndex}].disable`, true);
  //       // itemElem.setAttribute('')
  //     }
  //     if (e.node) {
  //       e.node.disabled = true
  //       e.node.selected = true
  //     }
  //     // if (itemElem.parentElement) {
  //     //   const checkBox = itemElem.parentElement.querySelector('.dx-show-invalid-badge.dx-checkbox.dx-widget') as any
  //     //   if (checkBox) {
  //     //     // checkBox.setAttribute('readonly', 'readonly');
  //     //     // checkBox.setAttribute('disabled', 'disabled');
  //     //     // checkBox.setAttribute('checked', 'checked');
  //     //   }
  //     // }
  //   }
  // }
  // initValueCanNotModify = (e: { component?: dxTreeList, element?: dxElement }) => {
  //   const initValues = this.props.value;

  //   if (initValues && initValues.length > 0) {
  //     const ds: any[] = [...this.props.dataSource];

  // 过滤是不行的,父节点过滤了,子节点就显示不出来了.
  //     const newDs = ds.filter(item => {
  //       return !initValues.includes(item.id)
  //     })
  //     // const newDs = ds.map(item => {
  //     //   if (initValues.includes(item.id)) {
  //     //     item.selected = true;
  //     //     item.disabled = true;
  //     //     item.readOnly = true
  //     //   }
  //     //   return item;
  //     // });
  //     e.component?.option('dataSource', newDs);
  //   }
  // };
  // ((e: { currentSelectedRowKeys?: Array<any>, currentDeselectedRowKeys?: Array<any>, selectedRowKeys?: Array<any>, selectedRowsData?: Array<any> }) => any);
  onItemSelectionChanged = (e: {
    component?: dxTreeList;
    currentDeselectedRowKeys?: Array<string>;
  }) => {
    // 处理多选时的反选: 如果被取消选择的是初始值,则不允许取消选择.
    if (
      this.props.selectionMode !== 'single' &&
      e.currentDeselectedRowKeys &&
      e.currentDeselectedRowKeys.length > 0
    ) {
      const initValues = this.props.value;

      const currDeselectedKey = e.currentDeselectedRowKeys[0];

      if (initValues?.includes(currDeselectedKey)) {
        e.component?.selectRows([currDeselectedKey], true);
        return;
      }
    }

    // 使用props提供的方法把最新的SelectedRowKeys进行保存.
    const selectedRowKeys = this.treeList.getSelectedRowKeys();
    // 这里不能用浅比较,第一次选择时,DropDownBox默认会将其作为自己的value.因此浅比较结果会是true,就不会setValue.造成结果无法保存到target.
    // if (!shallowEqual(selectedRowKeys, this.state.currentValue)) {
    if (this.props.onValueChange) {
      this.props.onValueChange(this.treeList.getSelectedRowsData());
    }
    if (this.props.target) {
      this.props.target.setValue(selectedRowKeys);
      // this.onValueChanged({ value: this.treeList.getSelectedRowKeys() });
    }

    // 更新自身维护的数据.
    this.setState({ currentValue: selectedRowKeys });
    // }
  };

  get treeList(): dxTreeList {
    return this.treeListRef.current?.instance!;
  }
}

export default TreeSelect;
