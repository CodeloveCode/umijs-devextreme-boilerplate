// App.js
import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from 'gojs-react';
import React from 'react';
import './index.less'; // contains .diagram-component CSS



// ...

/**
 * Diagram initialization method, which is passed to the ReactDiagram component.
 * This method is responsible for making the diagram and initializing the model and any templates.
 * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
 */
function initDiagram() {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram =
        $(go.Diagram,
            {
                'grid.visible': true, //画布上面是否出现网格
                'allowZoom': false, // 是否允许缩放
                'commandHandler.deletesTree': true, // 允许使用delete键删除节点.默认true
                'undoManager.isEnabled': true,  // must be set to allow for model change listening
                // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
                'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' }, // 允许在画布上面双击的时候创建节点
                model: $(go.GraphLinksModel,
                    {
                        linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                    })
            });

    // define a simple Node template
    diagram.nodeTemplate =
        $(go.Node, 'Auto',  // the Shape will go around the TextBlock
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, 'Diamond',
                { fill: 'white', strokeWidth: 0 },
                // Shape.fill is bound to Node.data.color
                new go.Binding('fill', 'color'),
                new go.Binding('figure', 'figure'),
            ),
            $(go.TextBlock,
                "Default Text",  // 默认文本
                { margin: 8, editable: true },  // 样式
                new go.Binding('text').makeTwoWay() //双向绑定TextBlock.text 属性为Node.data.text的值，Model对象可以通过Node.data.text获取和设置TextBlock.text
            )
        );

    return diagram;
}

function initPalette() {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const palette = $(go.Palette);

    // define a simple Node template
    palette.nodeTemplate =
        $(go.Node, 'Horizontal',  // the Shape will go around the TextBlock
            // new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape,
                // 'RoundedRectangle',
                { width: 14, height: 14, fill: "white" },
                // Shape.fill is bound to Node.data.color
                new go.Binding('fill', 'color')),
            $(go.TextBlock,
                // { margin: 8, editable: true },  // some room around the text
                new go.Binding("text", "color").makeTwoWay()
            )
        );

    return palette;
}

/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is dicussed below.
 */
function handleModelChange(changes: any) {
    console.log('changes', changes)
    // alert('GoJS model changed!');
}

// render function...
function App() {
    return (
        <div className={'side-layout'}>
            <ReactDiagram
                initDiagram={initDiagram}
                divClassName='diagram-component'
                nodeDataArray={[
                    { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
                    { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
                    { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
                    { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
                ]}
                // linkDataArray={[
                //     { key: -1, from: 0, to: 1 },
                //     { key: -2, from: 0, to: 2 },
                //     { key: -3, from: 1, to: 1 },
                //     { key: -4, from: 2, to: 3 },
                //     { key: -5, from: 3, to: 0 }
                // ]}
                onModelChange={handleModelChange}
                skipsDiagramUpdate={false}
            />
            <ReactPalette
                initPalette={initPalette}
                divClassName={'palette-component'}
                nodeDataArray={[
                    { key: "C", color: "cyan" },
                    { key: "LC", color: "lightcyan" },
                    { key: "A", color: "aquamarine" },
                    { key: "T", color: "turquoise" },
                    { key: "PB", color: "powderblue" },
                    { key: "LB", color: "lightblue" },
                    { key: "LSB", color: "lightskyblue" },
                    { key: "DSB", color: "deepskyblue" }
                ]}
            />
        </div>
    );
}
export default App