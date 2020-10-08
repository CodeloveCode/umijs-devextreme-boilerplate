import React from 'react';
import Diagram from 'devextreme-react/diagram';
import "./index.less";

class App extends React.Component {
    constructor(props: any) {
        super(props);
    }


    render() {
        return (
            <Diagram id="diagram" />
        );
    }
}

export default App;