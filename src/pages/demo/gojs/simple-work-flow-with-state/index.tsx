// App.js
import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from 'gojs-react';
import React from 'react';
import './index.less'; // 必须包含 .diagram-component 的样式
import { diagramNodeTemplate, linkSelectionAdornmentTemplate, nodeResizeAdornmentTemplate, nodeRotateAdornmentTemplate, nodeSelectionAdornmentTemplate } from './templates';
import Form, { ButtonItem, EmptyItem, SimpleItem } from 'devextreme-react/form';
import { produce } from 'immer';

class TopRotatingTool extends go.RotatingTool {
    /** @override */
    updateAdornments(part: go.Part) {
        go.RotatingTool.prototype.updateAdornments.call(this, part);
        var adornment = part.findAdornment("Rotating");
        if (adornment !== null) {
            adornment.location = part.rotateObject.getDocumentPoint(new go.Spot(0.5, 0, 0, -30));  // above middle top
        }
    }

    /** @override */
    rotate(newangle: number) {
        go.RotatingTool.prototype.rotate.call(this, newangle + 90);
    }
}


// interface DiagramProps {
//     nodeDataArray: Array<go.ObjectData>;
//     linkDataArray: Array<go.ObjectData>;
//     modelData: go.ObjectData;
//     skipsDiagramUpdate: boolean;
//     onDiagramEvent: (e: go.DiagramEvent) => void;
//     onModelChange: (e: go.IncrementalData) => void;
// }

/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */
interface AppState {
    // 画板
    paletteNodeDataArray: Array<go.ObjectData>;
    paletteLinkDataArray: Array<go.ObjectData>;
    // 图表
    savedModel: string;

    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    selectedData: go.ObjectData | null;
    skipsDiagramUpdate: boolean;
}

/**
 * gojs流程图.非受控版.
 */
class App extends React.Component<any, AppState>{
    // Maps to store key -> arr index for quick lookups
    private mapNodeKeyIdx: Map<go.Key, number>;
    private mapLinkKeyIdx: Map<go.Key, number>;

    private diagramRef: React.RefObject<ReactDiagram>;

    constructor(props: any) {
        super(props);

        this.state = {
            paletteNodeDataArray: [  // 指定画板的内容.
                { key: 0, text: "开始", size: '104 40', figure: "RoundedRectangle", fill: "#00AD5F" },
                { key: 1, text: "流程", size: '104 64' },
                // { text: "数据库", figure: "Database", fill: "lightgray" },
                { key: 2, text: "判定", figure: "Diamond", fill: "lightskyblue" },
                { key: 3, text: "结束", size: '104 40', figure: "RoundedRectangle", fill: "#CE0620" },
                { key: 4, text: "文档", figure: "RoundedRectangle", fill: "lightyellow" }
            ],
            paletteLinkDataArray: [ // 给画板加一个独立的链接,可以让用户拖放.
                { points: new go.List<go.Point>().addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
            ],
            savedModel: '', // diagram的model对象的json字符串
            nodeDataArray: [], // diagram的node数据
            linkDataArray: [], // diagram的连接线数据
            modelData: {
                // canRelink: true
            },
            selectedData: null,
            skipsDiagramUpdate: false
        }

        this.diagramRef = React.createRef();
        const objGo = go.GraphObject.make;

        // init maps
        this.mapNodeKeyIdx = new Map<go.Key, number>();
        this.mapLinkKeyIdx = new Map<go.Key, number>();
        this.refreshNodeIndex(this.state.nodeDataArray);
        this.refreshLinkIndex(this.state.linkDataArray);
        // bind handler methods
        this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
        this.handleModelChange = this.handleModelChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        // this.handleRelinkChange = this.handleRelinkChange.bind(this);
    }

    componentDidMount() {
        // if (!this.diagramRef.current) return;
        // const diagram = this.diagramRef.current.getDiagram();
        // if (diagram instanceof go.Diagram) {
        //     diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
        // }
    }

    componentWillUnmount() {
        // if (!this.diagramRef.current) return;
        // const diagram = this.diagramRef.current.getDiagram();
        // if (diagram instanceof go.Diagram) {
        //     diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
        // }
    }

    render() {

        const { paletteNodeDataArray,
            paletteLinkDataArray,
            savedModel,
            selectedData,
        } = this.state

        // let inspector;
        // if (selectedData !== null) {
        //     inspector = <SelectionInspector
        //         selectedData={this.state.selectedData}
        //         onInputChange={this.handleInputChange}
        //     />;
        // }


        return (
            <>
                <div className={'side-layout'}>
                    <ReactDiagram
                        ref={this.diagramRef}
                        initDiagram={this.initDiagram}
                        divClassName='diagram-component'

                        nodeDataArray={this.state.nodeDataArray}
                        linkDataArray={this.state.linkDataArray}
                        modelData={this.state.modelData}
                        skipsDiagramUpdate={this.state.skipsDiagramUpdate}
                        // @ts-ignore
                        onDiagramEvent={this.handleDiagramEvent}
                        onModelChange={this.handleModelChange}
                    />
                    <ReactPalette
                        initPalette={this.initPalette}
                        divClassName={'palette-component'}
                        nodeDataArray={paletteNodeDataArray}
                    // linkDataArray={paletteLinkDataArray}
                    />
                </div>
                <section>
                    <Form
                        // ref={this.formRef} 
                        colCount={2}
                        labelLocation={'left'}
                        formData={{ savedModel }}
                    >
                        <ButtonItem
                            horizontalAlignment={'left'}
                            buttonOptions={{
                                type: 'default',
                                text: 'save',
                                onClick: this.save,
                            }}
                        />
                        <ButtonItem
                            horizontalAlignment={'right'}
                            buttonOptions={{
                                type: 'normal',
                                text: 'load',
                                onClick: this.load,
                            }}
                        />
                        <SimpleItem
                            colSpan={2}
                            label={{ text: '流程图模型数据' }}
                            dataField={'savedModel'}
                            editorType={'dxTextArea'}
                            editorOptions={{
                                height: 104,
                                onValueChanged: (e: any) => {
                                    return { savedModel: e.value };
                                },
                            }}
                        />
                    </Form>
                </section>
            </>
        );
    }

    /**
     * diagram的初始化方法,传给ReactDiagram组件.
     * 此方法负责创建diagram、初始化model和模板。
     * model的数据不要再这设置，ReactDiagram使用一些props来接收和处理model。
     */
    initDiagram = () => {
        const objGo = go.GraphObject.make;
        // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
        const diagram =
            objGo(go.Diagram,
                {
                    'grid.visible': true, //画布上面是否出现网格
                    'allowZoom': false, // 是否允许缩放
                    'commandHandler.deletesTree': true, // 允许使用delete键删除节点.默认true
                    'undoManager.isEnabled': true,  // 允许撤销和重做.
                    // 'undoManager.maxHistoryLength': 0,  // 设置为0时相当于禁用撤销/重做功能.
                    // 'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' }, // 允许在画布上面双击的时候创建节点
                    model: objGo(go.GraphLinksModel,
                        {
                            linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                        }),
                    grid: objGo(go.Panel, "Grid",
                        objGo(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
                        objGo(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
                        objGo(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
                        objGo(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
                    ),
                    allowDrop: true,  // 想要接收画板拖放的元素,必须设置为true
                    "draggingTool.dragsLink": true,
                    "draggingTool.isGridSnapEnabled": true,
                    "linkingTool.isUnconnectedLinkValid": true,
                    "linkingTool.portGravity": 20,
                    "relinkingTool.isUnconnectedLinkValid": true,
                    "relinkingTool.portGravity": 20,
                    "relinkingTool.fromHandleArchetype":
                        objGo(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
                    "relinkingTool.toHandleArchetype":
                        objGo(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
                    "linkReshapingTool.handleArchetype":
                        objGo(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
                    rotatingTool: objGo(TopRotatingTool),
                    "rotatingTool.snapAngleMultiple": 15,
                    "rotatingTool.snapAngleEpsilon": 15,
                });

        diagram.nodeTemplate = diagramNodeTemplate

        diagram.linkTemplate =
            objGo(go.Link,  // the whole link panel
                { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
                { relinkableFrom: true, relinkableTo: true, reshapable: true },
                {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpOver,
                    corner: 5,
                    toShortLength: 4
                },
                new go.Binding("points").makeTwoWay(),
                objGo(go.Shape,  // the link path shape
                    { isPanelMain: true, strokeWidth: 2 }),
                objGo(go.Shape,  // the arrowhead
                    { toArrow: "Standard", stroke: null }),
                objGo(go.Panel, "Auto",
                    new go.Binding("visible", "isSelected").ofObject(),
                    objGo(go.Shape, "RoundedRectangle",  // the link shape
                        { fill: "#F8F8F8", stroke: null }),
                    objGo(go.TextBlock,
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

    initPalette = () => {
        const objGo = go.GraphObject.make;
        const palette = objGo(go.Palette,
            {
                maxSelectionCount: 1,
                nodeTemplate: diagramNodeTemplate, // share the templates used by myDiagram
                // nodeTemplateMap: this.initDiagram().nodeTemplateMap,  // share the templates used by myDiagram
                linkTemplate: // simplify the link template, just in this Palette
                    objGo(go.Link,
                        { // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
                            // to line up the Link in the same manner we have to pretend the Link has the same location spot
                            locationSpot: go.Spot.Center,
                            selectionAdornmentTemplate:
                                objGo(go.Adornment, "Link",
                                    { locationSpot: go.Spot.Center },
                                    objGo(go.Shape,
                                        { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 }),
                                    objGo(go.Shape,  // the arrowhead
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
                        objGo(go.Shape,  // the link path shape
                            { isPanelMain: true, strokeWidth: 2 }),
                        objGo(go.Shape,  // the arrowhead
                            { toArrow: "Standard", stroke: null })
                    ),
                // model: new go.GraphLinksModel([  // specify the contents of the Palette
                //     { text: "开始", figure: "Circle", fill: "#00AD5F" },
                //     { text: "流程" },
                //     // { text: "数据库", figure: "Database", fill: "lightgray" },
                //     { text: "判定", figure: "Diamond", fill: "lightskyblue" },
                //     { text: "结束", figure: "Circle", fill: "#CE0620" },
                //     { text: "文档", figure: "RoundedRectangle", fill: "lightyellow" }
                // ],
                //     [
                //         // the Palette also has a disconnected Link, which the user can drag-and-drop
                //         { points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
                //     ])
            });

        return palette;
    }

    /**
 * Update map of node keys to their index in the array.
 */
    private refreshNodeIndex(nodeArr: Array<go.ObjectData>) {
        this.mapNodeKeyIdx.clear();
        nodeArr.forEach((n: go.ObjectData, idx: number) => {
            this.mapNodeKeyIdx.set(n.key, idx);
        });
    }

    /**
     * Update map of link keys to their index in the array.
     */
    private refreshLinkIndex(linkArr: Array<go.ObjectData>) {
        this.mapLinkKeyIdx.clear();
        linkArr.forEach((l: go.ObjectData, idx: number) => {
            this.mapLinkKeyIdx.set(l.key, idx);
        });
    }

    /**
   * Handle any relevant DiagramEvents, in this case just selection changes.
   * On ChangedSelection, find the corresponding data and set the selectedData state.
   * @param e a GoJS DiagramEvent
   */
    public handleDiagramEvent(e: go.DiagramEvent) {
        const name = e.name;
        switch (name) {
            case 'ChangedSelection': {
                const sel = e.subject.first();
                this.setState(
                    produce((draft: AppState) => {
                        if (sel) {
                            if (sel instanceof go.Node) {
                                const idx = this.mapNodeKeyIdx.get(sel.key);
                                if (idx !== undefined && idx >= 0) {
                                    const nd = draft.nodeDataArray[idx];
                                    draft.selectedData = nd;
                                }
                            } else if (sel instanceof go.Link) {
                                const idx = this.mapLinkKeyIdx.get(sel.key);
                                if (idx !== undefined && idx >= 0) {
                                    const ld = draft.linkDataArray[idx];
                                    draft.selectedData = ld;
                                }
                            }
                        } else {
                            draft.selectedData = null;
                        }
                    })
                );
                break;
            }
            default: break;
        }
    }

    /**
     * 这个函数处理对GoJS model所做的任何改动.
    * 可以在这里更新React state
    * 
     * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
     * This method iterates over those changes and updates state to keep in sync with the GoJS model.
     * @param obj a JSON-formatted string
     */
    public handleModelChange(obj: go.IncrementalData) {
        const insertedNodeKeys = obj.insertedNodeKeys;
        const modifiedNodeData = obj.modifiedNodeData;
        const removedNodeKeys = obj.removedNodeKeys;
        const insertedLinkKeys = obj.insertedLinkKeys;
        const modifiedLinkData = obj.modifiedLinkData;
        const removedLinkKeys = obj.removedLinkKeys;
        const modifiedModelData = obj.modelData;

        // maintain maps of modified data so insertions don't need slow lookups
        const modifiedNodeMap = new Map<go.Key, go.ObjectData>();
        const modifiedLinkMap = new Map<go.Key, go.ObjectData>();
        this.setState(
            produce((draft: AppState) => {
                let narr = draft.nodeDataArray;
                if (modifiedNodeData) {
                    modifiedNodeData.forEach((nd: go.ObjectData) => {
                        modifiedNodeMap.set(nd.key, nd);
                        const idx = this.mapNodeKeyIdx.get(nd.key);
                        if (idx !== undefined && idx >= 0) {
                            narr[idx] = nd;
                            if (draft.selectedData && draft.selectedData.key === nd.key) {
                                draft.selectedData = nd;
                            }
                        }
                    });
                }
                if (insertedNodeKeys) {
                    insertedNodeKeys.forEach((key: go.Key) => {
                        const nd = modifiedNodeMap.get(key);
                        const idx = this.mapNodeKeyIdx.get(key);
                        if (nd && idx === undefined) {  // nodes won't be added if they already exist
                            this.mapNodeKeyIdx.set(nd.key, narr.length);
                            narr.push(nd);
                        }
                    });
                }
                if (removedNodeKeys) {
                    narr = narr.filter((nd: go.ObjectData) => {
                        if (removedNodeKeys.includes(nd.key)) {
                            return false;
                        }
                        return true;
                    });
                    draft.nodeDataArray = narr;
                    this.refreshNodeIndex(narr);
                }

                let larr = draft.linkDataArray;
                if (modifiedLinkData) {
                    modifiedLinkData.forEach((ld: go.ObjectData) => {
                        modifiedLinkMap.set(ld.key, ld);
                        const idx = this.mapLinkKeyIdx.get(ld.key);
                        if (idx !== undefined && idx >= 0) {
                            larr[idx] = ld;
                            if (draft.selectedData && draft.selectedData.key === ld.key) {
                                draft.selectedData = ld;
                            }
                        }
                    });
                }
                if (insertedLinkKeys) {
                    insertedLinkKeys.forEach((key: go.Key) => {
                        const ld = modifiedLinkMap.get(key);
                        const idx = this.mapLinkKeyIdx.get(key);
                        if (ld && idx === undefined) {  // links won't be added if they already exist
                            this.mapLinkKeyIdx.set(ld.key, larr.length);
                            larr.push(ld);
                        }
                    });
                }
                if (removedLinkKeys) {
                    larr = larr.filter((ld: go.ObjectData) => {
                        if (removedLinkKeys.includes(ld.key)) {
                            return false;
                        }
                        return true;
                    });
                    draft.linkDataArray = larr;
                    this.refreshLinkIndex(larr);
                }
                // handle model data changes, for now just replacing with the supplied object
                if (modifiedModelData) {
                    draft.modelData = modifiedModelData;
                }
                draft.skipsDiagramUpdate = true;  // the GoJS model already knows about these updates
            })
        );
    }

    /**
     * Handle inspector changes, and on input field blurs, update node/link data state.
     * @param path the path to the property being modified
     * @param value the new value of that property
     * @param isBlur whether the input event was a blur, indicating the edit is complete
     */
    public handleInputChange(path: string, value: string, isBlur: boolean) {
        this.setState(
            produce((draft: AppState) => {
                const data = draft.selectedData as go.ObjectData;  // only reached if selectedData isn't null
                data[path] = value;
                if (isBlur) {
                    const key = data.key;
                    if (key < 0) {  // negative keys are links
                        const idx = this.mapLinkKeyIdx.get(key);
                        if (idx !== undefined && idx >= 0) {
                            draft.linkDataArray[idx] = data;
                            draft.skipsDiagramUpdate = false;
                        }
                    } else {
                        const idx = this.mapNodeKeyIdx.get(key);
                        if (idx !== undefined && idx >= 0) {
                            draft.nodeDataArray[idx] = data;
                            draft.skipsDiagramUpdate = false;
                        }
                    }
                }
            })
        );
    }

    /**
     * Handle changes to the checkbox on whether to allow relinking.
     * @param e a change event from the checkbox
     */
    // public handleRelinkChange(e: any) {
    //     const target = e.target;
    //     const value = target.checked;
    //     this.setState({ modelData: { canRelink: value }, skipsDiagramUpdate: false });
    // }

    /**
     * 将diagram的模型数据以JS字面量对象方式保存.
     */
    save = () => {
        this.saveDiagramProperties()  // do this first, before writing to JSON
        this.setState({ savedModel: this.diagram.model.toJson() })
        this.diagram.isModified = false
    }

    /**
     * 从JS字面量对象中读取diagram的模型数据.
     */
    load = () => {
        this.diagram.model = go.Model.fromJson(this.state.savedModel);
        this.loadDiagramProperties();  // do this after the Model.modelData has been brought into memory
    }

    saveDiagramProperties = () => {
        this.diagram.model.modelData.position = go.Point.stringify(this.diagram.position);
    }
    loadDiagramProperties = () => {
        // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
        var pos = this.diagram.model.modelData.position;
        if (pos) {
            this.diagram.initialPosition = go.Point.parse(pos);
        }
    }

    get diagram(): go.Diagram {
        return this.diagramRef.current?.getDiagram()!
    }
}

export default App