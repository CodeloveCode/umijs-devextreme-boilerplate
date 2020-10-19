import React, { RefObject } from 'react';
import DropDownBox from 'devextreme-react/drop-down-box';
import { List } from 'devextreme-react';
import dxList from 'devextreme/ui/list';

interface IProps {
  initialDataSource: any[],
  valueExpr?: string | ((item: any) => string | number | boolean),
  displayExpr?: string | ((item: any) => string),
  placeholder?: string,
  /**
   * 指定当前选中的条目
   */
  initialValue?: string[];
  /**
   * 选中 option，或 input 的 value 变化时，调用此函数
   */
  onChange?: (value: string[]) => void;
  width?: number;
}
interface IState {
  selectedItemKeys: string[];
  dataSource: any[];
}
/**
 * 多选下拉框.
 * dev没有直接的MultipleSelect.只能使用DropDownBox+List模拟.
 * @version 0.1
 */
class MultipleSelect extends React.Component<IProps, IState> {
  private listRef: RefObject<List>;

  constructor(props: IProps) {
    super(props);
    this.listRef = React.createRef();

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
        contentRender={this.listRender}
        width={width ?? 208}
      />
    );
  }

  listRender = () => {
    const { valueExpr, displayExpr, placeholder, width } = this.props
    const { dataSource, selectedItemKeys } = this.state;
    return (
      <List
        ref={this.listRef}
        items={dataSource}
        keyExpr={valueExpr ?? 'value'}
        displayExpr={displayExpr ?? 'text'}
        selectedItemKeys={selectedItemKeys}
        // showSelectionControls={true}
        // itemRender={ItemTemplate}
        searchEnabled={true}
        searchExpr={displayExpr ?? 'text'}
        showScrollbar={'onScroll'}
        // searchMode={this.state.searchMode} 
        onSelectionChanged={this.onListChanged}
        // onOptionChanged={this.onListChanged}
        height={400}
      // activeStateEnabled={false}
      // onItemClick={this.onListChanged}
      />
    );
  };

  syncSelectionDatas = (e: any) => {
    console.log('onListChanged-e', e)
    let selectedIds = e.value ?? this.state.selectedItemKeys;
    this.setState({ selectedItemKeys: selectedIds });
  };

  onListChanged = (e: { addedItems?: any[], removedItems?: any[] }) => {
    console.log('onListChanged-e', e)
    const ids = e.addedItems?.map(item => item.id) ?? []
    // @ts-ignore
    this.props?.onChange(ids)
    this.setState({ selectedItemKeys: ids });
  };

  get list(): dxList {
    return this.listRef.current?.instance!;
  }
}

export default MultipleSelect;
