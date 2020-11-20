import React, { RefObject } from 'react';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';
import dxTreeView from 'devextreme/ui/tree_view';

interface IProps {
  initialDataSource: any[],
  /**
   * 指定当前选中的条目
   */
  initialValue?: string[];
  valueExpr?: string | ((item: any) => string | number | boolean),
  displayExpr?: string | ((item: any) => string),
  placeholder?: string,
  /**
   * 选中 option，或 input 的 value 变化时，调用此函数
   */
  onChange: (value: string[]) => void;
  width?: number;
}
interface IState {
  selectedItemKeys: string[];
  dataSource: any[];
}
/**
 * 树形选择框.
 * dev没有直接的TreeSelect.只能使用DropDownBox+TreeView模拟.
 * @version 0.1
 */
class TreeSelect extends React.Component<IProps, IState> {
  private treeViewRef: RefObject<TreeView>;

  constructor(props: IProps) {
    super(props);
    this.treeViewRef = React.createRef();

    this.state = {
      selectedItemKeys: this.props.initialValue ? this.props.initialValue : [],
      dataSource: this.props.initialDataSource ?? [],
    };
  }

  componentDidMount() {
  }

  render() {
    const { valueExpr, displayExpr, placeholder, width } = this.props
    const { selectedItemKeys, dataSource } = this.state;

    return (
      <DropDownBox
        dataSource={dataSource}
        value={selectedItemKeys}
        valueExpr={valueExpr ?? 'value'}
        displayExpr={displayExpr ?? 'text'}
        placeholder={placeholder ?? "Select a value..."}
        showClearButton={true}
        onValueChanged={this.syncSelectionDatas}
        contentRender={this.treeViewRender}
        width={width ?? 208}
      />
    );
  }

  treeViewRender = () => {
    const { dataSource, selectedItemKeys } = this.state;
    return (
      <TreeView
        dataSource={dataSource}
        ref={this.treeViewRef}
        dataStructure={'plain'}
        keyExpr={'id'}
        parentIdExpr={'parent_id'}
        rootValue={'0'}
        selectionMode={'single'}
        showCheckBoxesMode={'normal'}
        selectNodesRecursive={false}
        displayExpr={'description'}
        selectByClick={true}
        selectedItemKeys={selectedItemKeys}
        onContentReady={this.syncSelectionDatas}
        onItemSelectionChanged={this.treeView_itemSelectionChanged}
      />
    );
  };

  syncSelectionDatas = (e: any) => {
    let selectedItemKeys = e.value ?? this.state.selectedItemKeys;
    this.setState({ selectedItemKeys: selectedItemKeys });
  };

  treeView_itemSelectionChanged = (e: any) => {
    this.props.onChange(e.itemData.id);
    this.setState({ selectedItemKeys: [e.itemData.id] });
  };

  get treeView(): dxTreeView {
    return this.treeViewRef.current?.instance!;
  }
}

export default TreeSelect;
