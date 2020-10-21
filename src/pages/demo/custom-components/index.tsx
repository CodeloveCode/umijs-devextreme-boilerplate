import React from 'react';
import MultipleSelect from '@/components/MultipleSelect';
import { products } from './listData';
import { DataGrid, LoadPanel } from 'devextreme-react';
import TreeSelect from '@/components/TreeSelect';



export default () => (
    <React.Fragment>
        {/* <MultipleSelect
            initialDataSource={products}
            valueExpr={'ID'}
            displayExpr={'Name'}
            onChange={onChange}
        /> */}
        <TreeSelect
            initialDataSource={products}
            valueExpr={'ID'}
            displayExpr={'Name'}
            onChange={onChange}
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
        <DataGrid
            id="table"
        />
    </React.Fragment>
)

function onChange(value: string[]) {
    console.log('value:', value)
}