import React from 'react';
import { withRouter } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { notifyError, notifySuccess } from '@/utils/devExtremeUtils';
import DataGrid, { Column, Export, FilterRow, LoadPanel, Pager, Paging, SearchPanel } from 'devextreme-react/data-grid';
import { add, edit, getList, remove } from './service';
import dxDataGrid from 'devextreme/ui/data_grid';
import { Form } from 'devextreme-react';
import { ButtonItem, GroupItem, SimpleItem } from 'devextreme-react/form';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentDidMount() {
    this.queryList()
  }

  render() {
    return (
      <React.Fragment>
        <PageHeaderWrapper title={false}>
          <main className={'dx-card'} style={{ height: 'calc(100vh - 208px)' }}>
            <Form
              labelLocation={'left'} style={{marginTop:"20px"}}
              colCount={3}
              showValidationSummary={true}
              defaultFormData={{
              }}
            >
              <SimpleItem
                dataField={'name'}
                label={{ text: '机器人名称' }}
                editorOptions={{
                  placeHolder: '请输入名称',
                }}
              />
              <SimpleItem
                dataField={'ip'}
                label={{ text: 'IP' }}
                editorOptions={{
                  placeHolder: '请输入IP',
                }}
              />
              <SimpleItem
                dataField={'work_area'}
                label={{ text: '所属工作区' }}
                editorType="dxSelectBox"
                editorOptions={{
                  dataSource: [],
                  valueExpr: '',
                  displayExpr: '',
                }}
              />
              <SimpleItem
                dataField={'disconnected'}
                label={{ text: '离线' }}
                editorType="dxSelectBox"
                editorOptions={{
                  dataSource: [],
                  valueExpr: '',
                  displayExpr: '',
                }}
              />
              <ButtonItem
                horizontalAlignment={'left'}
                buttonOptions={{
                   text: '查询',
                 // icon: 'search',
                  type: 'default',
                  useSubmitBehavior: false,
                  onClick: this.queryList,
                }}
              />
            </Form>
            <DataGrid
              dataSource={this.state.list}
              keyExpr={'id'}
              showRowLines={true}
              columnAutoWidth={true}
              showBorders={true}
              // height="calc(100vh - 1096px)"
              height="100%"
              editing={{
                mode: 'form',
                useIcons: true,
                // allowUpdating: true,
                // allowDeleting: true,
                // allowAdding: true,
                selectTextOnEditStart: true,
                startEditAction: 'click',
              }}
              onRowInserting={this.onRowInserting}
              onRowUpdating={this.onRowUpdating}
              onRowRemoving={this.onRowRemoving}
              onExporting={this.onExporting}
              onToolbarPreparing={(e: any) => {
                const items: any[] = e.toolbarOptions.items;
                items.unshift({
                  location: 'after',
                  widget: 'dxButton',
                  options: {
                    hint: 'refresh',
                    icon: 'refresh',
                    onClick: this.queryList,
                  },
                });
              }}
            >
              <SearchPanel visible={true} />
              <FilterRow visible={true} />
              <LoadPanel enabled={true} />
              <Pager
                showPageSizeSelector={true}
                allowedPageSizes={[50, 100]}
                showInfo={true}
              />
              <Paging defaultPageSize={50} />
              <Export enabled={true} />
              <Column
                caption={'工作区'}
                dataField={'work_area'}
                alignment={'center'}
                validationRules={[{ type: 'required' }]}
              />
              <Column
                caption={'名称'}
                dataField={'name'}
                alignment={'center'}
                validationRules={[{ type: 'required' }]}
              />
              <Column
                caption={'IP'}
                dataField={'time'}
                alignment={'center'}
              />
              <Column
                caption={'状态'}
                dataField={'status'}
                alignment={'center'}
              />
              <Column
                caption={'RMS状态'}
                dataField={'rms_status'}
                alignment={'center'}
              />
              <Column
                caption={'电量'}
                dataField={'battery_quantity'}
                alignment={'center'}
              />
              <Column
                caption={'信息'}
                dataField={'info'}
                alignment={'center'}
              />
              <Column
                caption={'更新时间'}
                dataField={'update_time'}
                alignment={'center'}
                dataType='datetime'
              />
              <Column
                caption={'占用资源'}
                dataField={'resource_occupied'}
                alignment={'center'}
              />
              <Column
                alignment={'center'}
                caption={'操作'}
                type="buttons"
                width={80}
                buttons={[
                  {
                    // icon: 'edit',
                    text: '释放',
                    onClick: () => {
                      alert('释放中...')
                    },
                  },
                ]}
              />
            </DataGrid>
          </main>
        </PageHeaderWrapper>
      </React.Fragment>
    );
  }

  onExporting = (e: { component?: dxDataGrid, model?: any, fileName?: string, cancel?: boolean }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');

    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      autoFilterEnabled: true
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer: any) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
      });
    });
    e.cancel = true;
  }

  onRowInserting = (e: { component?: dxDataGrid; data?: any; cancel?: boolean | Promise<void> | JQueryPromise<void>; }) => {
    const param = {
      ...e.data
    }

    e.cancel = add(param)
      .then(isSuccess => {
        if (isSuccess) {
          notifySuccess('提交成功');
          this.queryList()
        } else {
          throw new Error('提交失败')
        }
      }).catch((error: any) => {
        console.log(error.message);
        notifyError(error.message);
        return Promise.reject(error.message);
      });
  };

  onRowRemoving = (e: {
    data?: any;
    cancel?: boolean | Promise<void> | JQueryPromise<void>;
  }) => {
    const id = e.data!.id

    e.cancel = remove(id)
      .then(isSuccess => {
        if (isSuccess) {
          notifySuccess('提交成功');
          this.queryList()
        } else {
          throw new Error('提交失败')
        }
      })
      .catch((error: any) => {
        console.log(error.message);
        notifyError(error.message);
        return Promise.reject(error.message);
      });
  };

  onRowUpdating = (e: {
    oldData?: any;
    newData?: any;
    cancel?: boolean | Promise<void> | JQueryPromise<void>;
  }) => {
    const { } = e.newData!;
    const { id } = e.oldData!;

    const param: any = {

    };

    e.cancel = edit(id, param).then(isSuccess => {
      if (isSuccess) {
        notifySuccess('提交成功')
        this.queryList()
      } else {
        throw new Error('提交失败')
      }
    })
      .catch((error: any) => {
        console.error(error.message);
        notifyError(error.message);
        return Promise.reject(error.message);
      });
  };

  queryList = () => {
    return getList()
      .then(list => {
        this.setState({ list });
      })
      .catch((error: any) => {
        console.log(error.message);
        notifyError(error.message);
      });
  };
}

export default withRouter(App);
