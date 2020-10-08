import React from 'react';
import Diagram, { AutoLayout, Edges, Group, Nodes, Toolbox } from 'devextreme-react/diagram';
import ArrayStore from 'devextreme/data/array_store';
import "./index.less";
import { getEmployees } from './data';


class App extends React.Component {
    diagramRef: React.RefObject<Diagram>;
    dataSource: ArrayStore;

    constructor(props: any) {
        super(props);

        this.diagramRef = React.createRef();

        this.dataSource = new ArrayStore({
            key: 'this',
            data: getEmployees()
        });
    }

    componentDidMount() {
    }
    render() {
        return (
            <>
                <Diagram id="diagram">
                    <Nodes dataSource={this.dataSource} keyExpr="ID" textExpr="Title" parentKeyExpr="Head_ID">
                        <AutoLayout type="tree" />
                    </Nodes>
                    <Toolbox>
                        <Group category="general" title="General" />
                    </Toolbox>
                </Diagram>
            </>
        );
    }
}

export default App;