import React, { useRef } from 'react';
import { products, tasks } from './listData';
import { LoadPanel } from 'devextreme-react';
import DataGrid, { Column, Editing, Form as DgForm } from 'devextreme-react/data-grid';
import Form, { ButtonItem, Item, SimpleItem } from 'devextreme-react/form';
import TreeSelect from '@/components/TreeSelect';
import DataSource from 'devextreme/data/data_source';
import dxTextBox from 'devextreme/ui/text_box';

export default class App extends React.Component {
    private formRef: React.RefObject<Form> = React.createRef();
    private tableRef: React.RefObject<DataGrid> = React.createRef();

    setValue = () => {
        const table = this.tableRef.current?.instance!
        table.option('')
    }

    render() {
        return (<React.Fragment>
            {/* 
        // old TreeSelect
        <TreeSelect
            initialDataSource={products}
            valueExpr={'ID'}
            displayExpr={'Name'}
            onChange={onChange}
        /> */}
            <Form
                ref={this.formRef}
            >
                <Item
                    label={{ text: '任务选择' }}
                    dataField={'task'}
                    render={(e: any) => {
                        // console.log('form-task-params: ', e.editorOptions)
                        const target = {
                            setValue: (value: any) => {
                                // console.log('treeselect value:', value)
                                this.formRef.current?.instance!.option('formData', { task: value.join(',') })
                                // this.formRef.current?.instance!.getEditor('task')?.option('value', value.join(','))
                                // const taskItem = param.component.getEditor('task')
                                // e.editorOptions.value = value.join(',')
                                // taskItem.option('value', value.join(','))
                            }
                        }

                        return (<TreeSelect
                            dataSource={tasks}
                            keyExpr={'Task_ID'}
                            parentIdExpr={'Task_Parent_ID'}
                            displayExpr={'Task_Subject'}
                            value={[2]}
                            selectionMode={'single'}
                            target={target}
                            // onValueChanged={this.handleValueChange}
                            rootValue={0}
                        />)
                    }}></Item>
                <SimpleItem
                    label={{ text: '处理人' }}
                    dataField={'operator'}
                />
                <ButtonItem
                    buttonOptions={{
                        text: 'save',
                        onClick: this.onSave
                    }}
                />
            </Form>

            <DataGrid
                id="table"
                ref={this.tableRef}
                dataSource={products}
                key={'ID'}
                onRowUpdating={this.onRowUpdating}
            >
                <Editing
                    allowUpdating={true}
                    allowAdding={true}
                    mode={'popup'}
                />
                {/* <DgForm ></DgForm> */}
                <Column
                    dataField={'Name'}
                />
                <Column
                    dataField={'Manufacturing'}
                    editCellRender={(cell: any) => {
                        // console.log('cell:', cell)
                        // cell.setValue(12345) cell有setValue方法.
                        return (<TreeSelect
                            dataSource={tasks}
                            keyExpr={'Task_ID'}
                            parentIdExpr={'Task_Parent_ID'}
                            displayExpr={'Task_Subject'}
                            value={[2]}
                            selectionMode={'single'}
                            target={cell}
                            rootValue={0}
                        />)
                    }}
                />
                <LoadPanel
                    shadingColor="rgba(0,0,0,0.4)"
                    position={{ of: 'table' }}
                    visible={true}
                    showIndicator={true}
                    showPane={true}
                    shading={true}
                    closeOnOutsideClick={false}
                />
            </DataGrid>
        </React.Fragment>)
    }

    onSave = (e: any) => {
        e.event.preventDefault()
        const form = this.formRef.current?.instance!
        console.log(`form.option('formData')`, form.option('formData'))
    }

    onRowUpdating = (e: { oldData?: any, newData?: any }) => {
        console.log('row data', e.oldData, e.newData)
    }

    handleValueChange = (value: string[]) => {
        console.log('value:', value)
    }

}
