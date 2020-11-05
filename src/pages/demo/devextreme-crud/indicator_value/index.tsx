import React from 'react';
import styles from './index.less';
import Form, { ButtonItem, SimpleItem } from 'devextreme-react/form';
import DataGrid, {
  Column,
  IPagerProps,
  IPagingProps,
  Pager,
  Paging,
} from 'devextreme-react/data-grid';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Button from 'devextreme-react/button';
import { notifyError, notifyWarning } from '@/utils/devExtremeUtils';
import {
  delById,
  edit,
  getList,
  save,
  IndicatorValue,
} from './service';
import dxForm from 'devextreme/ui/form';
import { LoadPanel } from 'devextreme-react';

interface IProps {
}
interface IState {
  list: any[];
  loading: boolean;
}

class ListView extends React.Component<IProps, IState> {
  formRef: React.RefObject<Form>;
  private paging: IPagingProps;
  private pager: IPagerProps;

  constructor(props: IProps) {
    super(props);

    this.state = {
      list: [],
      loading: false,
    };

    this.formRef = React.createRef();

    this.paging = {
      defaultPageSize: 10,
    };
    this.pager = {
      showPageSizeSelector: true,
      allowedPageSizes: [5, 10, 20],
      showInfo: true,
    };
  }

  get form(): dxForm {
    return this.formRef.current?.instance!;
  }

  componentDidMount() {
    this.queryList();
  }

  render() {
    const {
      list,
      loading,
    } = this.state;
    return (
      <>
        <div className={'dx-card'}>
          <LoadPanel
            shadingColor="rgba(0,0,0,0.4)"
            position={{ of: 'table' }}
            visible={loading}
            showIndicator={true}
            shading={true}
            showPane={true}
          />
          <DataGrid
            id="table"
            dataSource={list}
            showRowLines={true}
            columnAutoWidth={true}
            keyExpr={'id'}
            showBorders={true}
            height="calc(100vh - 208px)"
            searchPanel={{ visible: true }}
            filterRow={{ visible: true }}
            summary={{ totalItems: [{ column: 'name', summaryType: 'count' },], }}
            pager={this.pager}
            paging={this.paging}
            editing={{
              mode: 'form',
              useIcons: true,
              allowUpdating: true,
              allowDeleting: true,
              allowAdding: true,
              selectTextOnEditStart: true,
              startEditAction: 'click',
            }}
            // selection={{ mode: 'single', }}
            // onSelectionChanged={this.onSelectionChanged}
            onRowInserted={this.onRowInserted}
            onRowUpdated={this.onRowUpdated}
            onRowRemoved={this.onRowRemoved}
            onToolbarPreparing={this.onToolbarPreparing}
          >
            <Column
              caption={'name'}
              dataField={'name'}
              alignment={'center'}
            />
            <Column
              caption={'value'}
              dataField={'value'}
              alignment={'center'}
              dataType={'number'}
            />
          </DataGrid>
        </div>
      </>
    );
  }

  onToolbarPreparing = (e: any) => {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          hint: '刷新',
          icon: 'refresh',
          onClick: this.queryList,
        },
      },
    );
  };

  queryList = () => {
    this.setState({ loading: true });
    return getList()
      .then(terminalList => {
        this.setState({ list: terminalList });
      })
      .catch((error: any) => {
        console.log(error.message);
        notifyError(error.message);
      })
      .finally(() => this.setState({ loading: false }));
  };

  onRowInserted = (e: any) => {
    const { name, value } = e.data;

    const param: IndicatorValue = {
      name,
      value,
    };

    return save(param)
      .then(isSuccess => {
        if (isSuccess) {
          this.queryList();
        }
      })
      .catch((error: any) => {
        console.log(error.message);
        notifyError(error.message);
      });
  };

  onRowUpdated = (e: any) => {
    const { id, name, value } = e.data;

    const param: IndicatorValue = {
      name,
      value,
    };

    return edit(id, param)
      .then(isSuccess => {
        if (isSuccess) {
          this.queryList();
        }
      })
      .catch((error: any) => {
        console.log(error.message);
        notifyError(error.message);
      });
  };

  onRowRemoved = (e: any) => {
    return delById(e.key)
      .then(isSuccess => {
        if (isSuccess) {
          this.queryList();
        }
      })
      .catch((error: any) => {
        console.log(error.message);
        notifyError(error.message);
      });
  };
}

export default ListView;
