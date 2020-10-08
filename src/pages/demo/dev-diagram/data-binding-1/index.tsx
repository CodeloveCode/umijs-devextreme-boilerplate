import React from 'react';
import Diagram, { AutoLayout, Edges, Group, Nodes, Toolbox } from 'devextreme-react/diagram';
import ArrayStore from 'devextreme/data/array_store';
import "./index.less";
import { getOrgItems, getOrgLinks } from './data';

class App extends React.Component {
    diagramRef: React.RefObject<Diagram>;
    orgItemsDataSource: ArrayStore;
    orgLinksDataSource: ArrayStore;

    constructor(props: any) {
        super(props);

        this.diagramRef = React.createRef();

        this.orgItemsDataSource = new ArrayStore({
            key: 'this',
            data: getOrgItems()
        });
        this.orgLinksDataSource = new ArrayStore({
            key: 'this',
            data: getOrgLinks()
        });
    }

    componentDidMount() {
    }
    render() {
        return (
            <>
                <Diagram id="diagram">
                    <Nodes dataSource={this.orgItemsDataSource}>
                        <AutoLayout type="tree" />
                    </Nodes>
                    <Edges dataSource={this.orgLinksDataSource} />
                    <Toolbox>
                        <Group category="general" title="General" />
                    </Toolbox>
                </Diagram>
            </>
        );
    }
}

export default App;