import * as go from 'gojs';

// gojs diagram需要的各种模板.

const objGo = go.GraphObject.make;

// 图表:节点选择框的装饰模板
export const nodeSelectionAdornmentTemplate =
    objGo(go.Adornment, "Auto",
        objGo(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
        objGo(go.Placeholder)
    );

// 图表:节点缩放框的装饰模板
export const nodeResizeAdornmentTemplate =
    objGo(go.Adornment, "Spot",
        { locationSpot: go.Spot.Right },
        objGo(go.Placeholder),
        objGo(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        objGo(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        objGo(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

        objGo(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        objGo(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

        objGo(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        objGo(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        objGo(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
    );

// 图表:节点旋转框的装饰模板
export const nodeRotateAdornmentTemplate =
    objGo(go.Adornment,
        { locationSpot: go.Spot.Center, locationObjectName: "CIRCLE" },
        objGo(go.Shape, "Circle", { name: "CIRCLE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
        objGo(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
    );

// 图表:连接线选择时的装饰模板.
export const linkSelectionAdornmentTemplate =
    objGo(go.Adornment, "Link",
        objGo(go.Shape,
            // isPanelMain declares that this Shape shares the Link.geometry
            { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // use selection object's strokeWidth
    );
// 图表:节点模板.
export const diagramNodeTemplate: go.Part = objGo(go.Node, 'Spot',
    { locationSpot: go.Spot.Center },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate }, // 配置节点选择时的模板
    { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },// 配置节点缩放时的模板
    { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },// 配置节点旋转时的模板
    new go.Binding("angle").makeTwoWay(),
    // the main object is a Panel that surrounds a TextBlock with a Shape
    objGo(go.Panel, "Auto",
        { name: "PANEL" },
        // 双向绑定PANEL.desiredSize 属性为Node.data.size的值，Model对象可以通过Node.data.size获取和设置TextBlock.desiredSize 
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        objGo(go.Shape, "Rectangle",  // default figure
            {
                portId: "", // the default port: if no spot on link data, use closest side
                fromLinkable: true, toLinkable: true, cursor: "pointer",
                fill: "white",  // default color
                strokeWidth: 2
            },
            new go.Binding("figure"),
            new go.Binding("fill")),
        objGo(go.TextBlock,
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
        mouseEnter: function (e, node) { showSmallPorts(node, true) },
        mouseLeave: function (e, node) { showSmallPorts(node, false) }
    }
)

// Define a function for creating a "port" that is normally transparent.
// The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
// and where the port is positioned on the node, and the boolean "output" and "input" arguments
// control whether the user can draw links from or to the port.
function makePort(name: string, spot: go.Spot, output: boolean, input: boolean) {
    const objGo = go.GraphObject.make;
    // the port is basically just a small transparent square
    return objGo(go.Shape, "Circle",
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

function showSmallPorts(node: any, show: boolean) {
    node.ports.each(function (port: any) {
        if (port.portId !== "") {  // don't change the default port, which is the big shape
            port.fill = show ? "rgba(0,0,0,.3)" : null;
        }
    });
}
