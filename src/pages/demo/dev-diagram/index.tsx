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
        const diagram = this.diagramRef.current?.instance;
        fetch('data/diagram-flow.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                diagram?.import(JSON.stringify(json));
            })
            .catch(function () {
                throw 'Data Loading Error';
            });
    }
    render() {
        return (
            <Diagram id="diagram" ref={this.diagramRef} />
            // <>
            //     <Diagram id="diagram">
            //         {/* <Nodes dataSource={this.orgItemsDataSource}>
            //             <AutoLayout type="tree" />
            //         </Nodes>
            //         <Edges dataSource={this.orgLinksDataSource} /> */}
            //         <Toolbox>
            //             <Group category="general" title="General" />
            //         </Toolbox>
            //     </Diagram>
            // </>
        );
    }
}

export default App;