import React from 'react';
import Diagram, { AutoLayout, Edges, Group, Nodes, Toolbox } from 'devextreme-react/diagram';
import ArrayStore from 'devextreme/data/array_store';
import "./index.less";
import { getOrgItems, getOrgLinks } from './data';
import dxDiagram from 'devextreme/ui/diagram';
import Form, { ButtonItem, EmptyItem, SimpleItem } from 'devextreme-react/form';

interface IState {
    orgItemsDataSource: ArrayStore
    orgLinksDataSource: ArrayStore
    diagramModelData: string
}

class App extends React.Component<any, IState> {
    private diagramRef: React.RefObject<Diagram>;

    constructor(props: any) {
        super(props);

        this.diagramRef = React.createRef()

        this.state = {
            orgItemsDataSource: new ArrayStore({
                key: 'this',
                data: getOrgItems()
            }),
            orgLinksDataSource: new ArrayStore({
                key: 'this',
                data: getOrgLinks()
            }),
            diagramModelData: '',
        }
    }

    get diagram(): dxDiagram {
        return this.diagramRef.current?.instance!
    }

    componentDidMount() {
    }

    render() {
        const { orgItemsDataSource, orgLinksDataSource, diagramModelData } = this.state
        return (
            <>
                <Diagram id="diagram" ref={this.diagramRef}>
                    <Nodes dataSource={orgItemsDataSource} typeExpr={this.itemTypeExpr} textExpr="name"
                        widthExpr={this.itemWidthExpr} heightExpr={this.itemHeightExpr} textStyleExpr={this.itemTextStyleExpr} styleExpr={this.itemStyleExpr}>
                        <AutoLayout type="tree" orientation="horizontal" />
                    </Nodes>
                    <Edges dataSource={orgLinksDataSource} styleExpr={this.linkStyleExpr}
                        fromLineEndExpr={this.linkFromLineEndExpr} toLineEndExpr={this.linkToLineEndExpr} />
                    <Toolbox>
                        <Group category="general" title="流程图" />
                    </Toolbox>
                </Diagram>
                <section>
                    <Form
                        // ref={this.formRef} 
                        colCount={2}
                        labelLocation={'left'}
                        formData={{ diagramModelData }}
                    >
                        <ButtonItem
                            horizontalAlignment={'left'}
                            buttonOptions={{
                                type: 'default',
                                text: 'save',
                                onClick: this.onSave,
                            }}
                        />
                        <ButtonItem
                            horizontalAlignment={'right'}
                            buttonOptions={{
                                type: 'normal',
                                text: 'load',
                                onClick: this.onLoad,
                            }}
                        />
                        <SimpleItem
                            colSpan={2}
                            label={{ text: '流程图模型数据' }}
                            dataField={'diagramModelData'}
                            editorType={'dxTextArea'}
                            editorOptions={{
                                height: 104,
                                onValueChanged: (e: any) => {
                                    this.setState({ diagramModelData: e.value })
                                    return { diagramModelData: e.value };
                                },
                            }}
                        />
                    </Form>
                </section>
            </>
        );
    }

    onSave = () => {
        const diagramModelData = this.diagram.export()
        if (diagramModelData) {
            this.setState({ diagramModelData })
        }
    }

    onLoad = () => {
        const diagramModelData = this.state.diagramModelData
        if (diagramModelData) {
            this.diagram.import(diagramModelData)
        }
    }

    itemTypeExpr(obj: any, value: string) {
        if (value) {
            obj.type = (value === 'rectangle') ? undefined : 'group';
        } else {
            return obj.type === 'group' ? 'ellipse' : 'rectangle';
        }
    }
    itemWidthExpr(obj: any, value: string) {
        if (value) {
            obj.width = value;
        } else {
            return obj.width || (obj.type === 'group' && 1.5) || 1;
        }
    }
    itemHeightExpr(obj: any, value: string) {
        if (value) {
            obj.height = value;
        } else {
            return obj.height || (obj.type === 'group' && 1) || 0.75;
        }
    }
    itemTextStyleExpr(obj: any) {
        if (obj.level === 'senior') {
            return { 'font-weight': 'bold', 'text-decoration': 'underline' };
        }
        return {};
    }
    itemStyleExpr(obj: any) {
        let style: any = { 'stroke': '#444444' };
        if (obj.type === 'group') {
            style['fill'] = '#f3f3f3';
        }
        return style;
    }
    linkStyleExpr() {
        return { 'stroke': '#444444' };
    }
    linkFromLineEndExpr() {
        return 'none';
    }
    linkToLineEndExpr() {
        return 'none';
    }
}

export default App;