import React, { RefObject } from 'react';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';
import dxTreeView from 'devextreme/ui/tree_view';

interface IProps {
  initialDataSource: [],
  /**
   * 指定当前选中的条目
   */
  initialValue?: string[];
  onValueChange: (id: string) => void;
}
interface IState {
  selectedIds: string[];
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
      selectedIds: this.props.initialValue ? this.props.initialValue : [],
      dataSource: this.props.initialDataSource ?? [],
    };
  }

  componentDidMount() {
  }

  render() {
    const { selectedIds, dataSource } = this.state;

    return (
      <DropDownBox
        value={selectedIds}
        valueExpr="id"
        displayExpr="description"
        placeholder="Select a value..."
        showClearButton={true}
        dataSource={dataSource}
        onValueChanged={this.syncTreeViewSelection}
        contentRender={this.treeViewRender}
      />
    );
  }

  treeViewRender = () => {
    const { dataSource, selectedIds } = this.state;
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
        selectedItemKeys={selectedIds}
        onContentReady={this.syncTreeViewSelection}
        onItemSelectionChanged={this.treeView_itemSelectionChanged}
      />
    );
  };

  syncTreeViewSelection = (e: any) => {
    let selectedIds = e.value ?? this.state.selectedIds;
    this.setState({ selectedIds: selectedIds });
  };

  treeView_itemSelectionChanged = (e: any) => {
    this.props.onValueChange(e.itemData.id);
    this.setState({ selectedIds: [e.itemData.id] });
  };

  get treeView(): dxTreeView {
    return this.treeViewRef.current?.instance!;
  }
}

export default TreeSelect;
