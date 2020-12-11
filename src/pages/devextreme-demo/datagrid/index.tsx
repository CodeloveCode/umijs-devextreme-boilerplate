import React from 'react';
import styles from './index.less';
import Form, { ButtonItem, SimpleItem } from 'devextreme-react/form';
import DataGrid, {
  Column,
  FilterRow,
  IPagerProps,
  IPagingProps,
  Pager,
  Paging,
  SearchPanel,
  Summary,
  TotalItem,
} from 'devextreme-react/data-grid';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Button from 'devextreme-react/button';
import { notifyError, notifyWarning } from '@/utils/devExtremeUtils';
import {
  delById,
  edit,
  getList,
  add,
} from './service';
import dxForm from 'devextreme/ui/form';
import { LoadPanel } from 'devextreme-react';
import { SysPermissionSaveVO } from './API';

interface IProps {
}
interface IState {
  list: any[];
  loading: boolean;
}

class ListView extends React.Component<IProps, IState> {
  formRef: React.RefObject<Form>;

  constructor(props: IProps) {
    super(props);

    this.state = {
      list: [],
      loading: false,
    };

    this.formRef = React.createRef();
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
        <PageHeaderWrapper title={false}>
          <div className={'dx-card'}>
            <LoadPanel
              // shadingColor="rgba(0,0,0,0.4)"
              position={{ of: 'table' }}
              visible={loading}
            // showIndicator={true}
            // shading={true}
            // showPane={true}
            />
            <DataGrid
              id="table"
              dataSource={list}
              showRowLines={true}
              columnAutoWidth={true}
              keyExpr={'permId'}
              showBorders={true}
              height="calc(100vh - 208px)"
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
              <SearchPanel visible={true} />
              <FilterRow visible={true} />
              <Pager showPageSizeSelector={true} allowedPageSizes={[50, 100]} showInfo={true} />
              <Paging defaultPageSize={50} />
              <Column
                caption={'code'}
                dataField={'code'}
                alignment={'center'}
                validationRules={[{ type: 'required' }]}
              />
              <Column
                caption={'name'}
                dataField={'name'}
                alignment={'center'}
                validationRules={[{ type: 'required' }]}
              />
              <Column
                caption={'description'}
                dataField={'description'}
                alignment={'center'}
              />
              <Column
                caption={'parentId'}
                dataField={'parentId'}
                alignment={'center'}
              />
              <Column
                caption={'type'}
                dataField={'type'}
                alignment={'center'}
              />
              <Column
                caption={'url'}
                dataField={'url'}
                alignment={'center'}
              />
              <Summary>
                <TotalItem column={'name'} summaryType={'count'} />
              </Summary>
            </DataGrid>
          </div>
        </PageHeaderWrapper>
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
      .then(list => {
        this.setState({ list });
      })
      .catch((error: any) => {
        console.log(error.message);
        notifyError(error.message);
      })
      .finally(() => this.setState({ loading: false }));
  };

  onRowInserted = (e: any) => {
    const {
      code,
      name,
      description,
      parentId,
      type,
      url,
    } = e.data;

    const param: SysPermissionSaveVO = {
      code,
      name,
      description,
      parentId,
      type,
      url,
    };

    return add(param)
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
    const {
      permId,
      code,
      name,
      description,
      parentId,
      type,
      url,
    } = e.data;

    const param: SysPermissionSaveVO = {
      code,
      name,
      description,
      parentId,
      type,
      url,
    };

    return edit(permId, param)
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
