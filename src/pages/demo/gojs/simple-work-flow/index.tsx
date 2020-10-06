// App.js
import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from 'gojs-react';
import React from 'react';
import './index.less'; // contains .diagram-component CSS



// ...

/**
 * diagram的初始化方法,传给ReactDiagram组件.
 * 此方法负责创建diagram、初始化model和模板。
 * model的数据不要再这设置，ReactDiagram使用一些props来接收和处理model。
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
                'undoManager.isEnabled': true,  // 允许撤销和重做.
                // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
                'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' }, // 允许在画布上面双击的时候创建节点
                model: $(go.GraphLinksModel,
                    {
                        linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                    }),
                grid: $(go.Panel, "Grid",
                    $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
                    $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
                    $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
                    $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
                ),
                allowDrop: true,  // must be true to accept drops from the Palette
                "draggingTool.dragsLink": true,
                "draggingTool.isGridSnapEnabled": true,
                "linkingTool.isUnconnectedLinkValid": true,
                "linkingTool.portGravity": 20,
                "relinkingTool.isUnconnectedLinkValid": true,
                "relinkingTool.portGravity": 20,
                "relinkingTool.fromHandleArchetype":
                    $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
                "relinkingTool.toHandleArchetype":
                    $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
                "linkReshapingTool.handleArchetype":
                    $(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
                rotatingTool: $(TopRotatingTool),  // defined below
                "rotatingTool.snapAngleMultiple": 15,
                "rotatingTool.snapAngleEpsilon": 15,
            });

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
    function makePort(name, spot, output, input) {
        // the port is basically just a small transparent square
        return $(go.Shape, "Circle",
            {
                fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
                stroke: null,
                desiredSize: new go.Size(7, 7),
                alignment: spot,  // align the port on the main Shape
                alignmentFocus: spot,  // just inside the Shape
                portId: name,  // declare this object to be a "port"
                fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                cursor: "pointer"  // show a different cursor to indicate potential link point
            });
    }

    const nodeSelectionAdornmentTemplate =
        $(go.Adornment, "Auto",
            $(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
            $(go.Placeholder)
        );

    const nodeResizeAdornmentTemplate =
        $(go.Adornment, "Spot",
            { locationSpot: go.Spot.Right },
            $(go.Placeholder),
            $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
            $(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
            $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

            $(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
            $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

            $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
            $(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
            $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
        );

    const nodeRotateAdornmentTemplate =
        $(go.Adornment,
            { locationSpot: go.Spot.Center, locationObjectName: "CIRCLE" },
            $(go.Shape, "Circle", { name: "CIRCLE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
            $(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
        );

    diagram.nodeTemplate =
        $(go.Node, 'Spot',
            { locationSpot: go.Spot.Center },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
            { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
            { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
            new go.Binding("angle").makeTwoWay(),
            // the main object is a Panel that surrounds a TextBlock with a Shape
            $(go.Panel, "Auto",
                { name: "PANEL" },
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                $(go.Shape, "Rectangle",  // default figure
                    {
                        portId: "", // the default port: if no spot on link data, use closest side
                        fromLinkable: true, toLinkable: true, cursor: "pointer",
                        fill: "white",  // default color
                        strokeWidth: 2
                    },
                    new go.Binding("figure"),
                    new go.Binding("fill")),
                $(go.TextBlock,
                    {
                        font: "bold 11pt Helvetica, Arial, sans-serif",
                        margin: 8,
                        maxSize: new go.Size(160, NaN),
                        wrap: go.TextBlock.WrapFit,
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            ),
            // four small named ports, one on each side:
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, false),
            { // handle mouse enter/leave events to show/hide the ports
                mouseEnter: function (e, node) { showSmallPorts(node, true); },
                mouseLeave: function (e, node) { showSmallPorts(node, false); }
            }
        )

    var linkSelectionAdornmentTemplate =
        $(go.Adornment, "Link",
            $(go.Shape,
                // isPanelMain declares that this Shape shares the Link.geometry
                { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // use selection object's strokeWidth
        );

    diagram.linkTemplate =
        $(go.Link,  // the whole link panel
            { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
            { relinkableFrom: true, relinkableTo: true, reshapable: true },
            {
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 5,
                toShortLength: 4
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape,  // the link path shape
                { isPanelMain: true, strokeWidth: 2 }),
            $(go.Shape,  // the arrowhead
                { toArrow: "Standard", stroke: null }),
            $(go.Panel, "Auto",
                new go.Binding("visible", "isSelected").ofObject(),
                $(go.Shape, "RoundedRectangle",  // the link shape
                    { fill: "#F8F8F8", stroke: null }),
                $(go.TextBlock,
                    {
                        textAlign: "center",
                        font: "10pt helvetica, arial, sans-serif",
                        stroke: "#919191",
                        margin: 2,
                        minSize: new go.Size(10, NaN),
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            )
        );

    // load();  // load an initial diagram from some JSON text

    return diagram;
}

function TopRotatingTool() {
    go.RotatingTool.call(this);
}
go.Diagram.inherit(TopRotatingTool, go.RotatingTool);

/** @override */
TopRotatingTool.prototype.updateAdornments = function (part) {
    go.RotatingTool.prototype.updateAdornments.call(this, part);
    var adornment = part.findAdornment("Rotating");
    if (adornment !== null) {
        adornment.location = part.rotateObject.getDocumentPoint(new go.Spot(0.5, 0, 0, -30));  // above middle top
    }
};

/** @override */
TopRotatingTool.prototype.rotate = function (newangle) {
    go.RotatingTool.prototype.rotate.call(this, newangle + 90);
};
// end of TopRotatingTool class

function initPalette() {
    const $ = go.GraphObject.make;
    const palette = $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
        {
            maxSelectionCount: 1,
            nodeTemplateMap: initDiagram().nodeTemplateMap,  // share the templates used by myDiagram
            linkTemplate: // simplify the link template, just in this Palette
                $(go.Link,
                    { // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
                        // to line up the Link in the same manner we have to pretend the Link has the same location spot
                        locationSpot: go.Spot.Center,
                        selectionAdornmentTemplate:
                            $(go.Adornment, "Link",
                                { locationSpot: go.Spot.Center },
                                $(go.Shape,
                                    { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 }),
                                $(go.Shape,  // the arrowhead
                                    { toArrow: "Standard", stroke: null })
                            )
                    },
                    {
                        routing: go.Link.AvoidsNodes,
                        curve: go.Link.JumpOver,
                        corner: 5,
                        toShortLength: 4
                    },
                    new go.Binding("points"),
                    $(go.Shape,  // the link path shape
                        { isPanelMain: true, strokeWidth: 2 }),
                    $(go.Shape,  // the arrowhead
                        { toArrow: "Standard", stroke: null })
                ),
            model: new go.GraphLinksModel([  // specify the contents of the Palette
                { text: "Start", figure: "Circle", fill: "#00AD5F" },
                { text: "Step" },
                { text: "DB", figure: "Database", fill: "lightgray" },
                { text: "???", figure: "Diamond", fill: "lightskyblue" },
                { text: "End", figure: "Circle", fill: "#CE0620" },
                { text: "Comment", figure: "RoundedRectangle", fill: "lightyellow" }
            ], [
                // the Palette also has a disconnected Link, which the user can drag-and-drop
                { points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
            ])
        });



    // palette.nodeTemplate =
    //     $(go.Node, 'Horizontal',
    //         $(go.Shape,
    //             { width: 14, height: 14, fill: "white" },
    //             new go.Binding('fill', 'color')),
    //         $(go.TextBlock,
    //             new go.Binding("text", "color").makeTwoWay()
    //         )
    //     );

    return palette;
}

/**
 * 这个函数处理对GoJS model所做的任何改动.
 * 可以在这里更新React state
 */
function handleModelChange(changes: any) {
    console.log('changes', changes)
    // alert('GoJS model changed!');
}

// 渲染函数...
function App() {
    return (
        <div className={'side-layout'}>
            <ReactDiagram
                initDiagram={initDiagram}
                divClassName='diagram-component'
                nodeDataArray={[
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
            // nodeDataArray={[]}
            />
        </div>
    );
}
export default App