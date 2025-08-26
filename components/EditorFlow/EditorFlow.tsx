'use client'
import React, {useCallback, memo, useMemo, useEffect, useState} from 'react';
import Dagre from '@dagrejs/dagre'
import {
    ReactFlow,
    addEdge,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Connection,
    Edge,
    Panel,
    useNodes,
    useReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    useOnSelectionChange
} from 'reactflow';
// import { useReactFlow } from '@xyflow/react'
import { SandpackProvider, SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'
import dynamic from 'next/dynamic';
import {cn} from "@/lib/utils";
import FlowSidebarWrapper from "@/components/EditorFlow/ui/FlowSidebarWrapper";
import EditorSidebar from "@/components/EditorFlow/ui/left-sidebar/EditorSidebar";
import Navbar from "@/components/navigations/Navbar";
import mockSandpackFiles, {mockFileData, mockFilesDataTypes, ToolNodes} from "@/constants";
import FolderNode from "@/components/EditorFlow/Monoco/FolderNode";
import Loader from "@/components/Loader";
import {useEditorState} from "@/context/EditorContext";
import {useFileTreeGraph} from "@/hooks/FlowGraph/useFileTreeGraph";
import CustomStepEdge from "@/components/EditorFlow/Edge/CustomStepEdge";
import {useForceGraphLayout} from "@/hooks/FlowGraph/useForceGraphLayout";
import {Button} from "@/components/ui/button";
import FlowNavbar from "@/components/EditorFlow/ui/FlowNavbar";
import LeftSidebarRenderer from "@/components/EditorFlow/ui/left-sidebar/LeftSidebarRenderer";
import {LeftBottomPanel, RightBottomPanel} from "@/components/EditorFlow/ui/bottom-tabs/BottomPanel";
import RightSidebarRenderer, {RightEditorSidebar} from "@/components/EditorFlow/ui/right-sidebar/RightSidebarRenderer";
import selectedNode from "@/components/EditorFlow/ui/right-sidebar/SelectedNode";
import ModelWrapper from "@/components/EditorFlow/Global search/ModelWrapper";
import TopMiddleTap from "@/components/EditorFlow/ui/top middle tab/TopMiddleTap";
import {get} from "@/lib/github.test";
import HttpNode from "@/components/EditorFlow/nodes/HttpNode";
import CodeEditor from "@/components/EditorFlow/Monoco/Editor";
import SpiralLoader from '../ui/PageLoader';
import {useUserState} from "@/context/UserContext";
import {useFileState} from "@/context/FileContext";
import {generateEdges} from "@/utils/flow/edge";

const CodeEditorNode = dynamic(() => import('@/components/EditorFlow/Monoco/CodeEditorNode'), {
    ssr: false
})

// Define node types
const nodeTypes = {
    codeEditor: CodeEditorNode,
    folderNode: FolderNode,
    httpRequest: HttpNode,
};

const edgeType = {
    customStep: CustomStepEdge
}

export const getLayoutedElements = (nodes, edges, options: any) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
    g.setGraph({
        rankdir: options.direction,
        ranksep: 200,
        nodesep: 50,
    });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) => g.setNode(node.id, {
        ...node,
        width: node.measured?.width ?? 300,
        height: node.measured?.height ?? 150
    }))

    Dagre.layout(g)

    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id)
            const x = position.x + (node.measured?.width ?? 100) / 2;
            const y = position.y + (node.measured?.height ?? 200) / 2;

            return { ...node, position: { x, y}};
        }),
        edges,
    }
}

// Initial edges data
const initialEdges: Edge[] = [];

const FlowWithCodeEditor = () => {
    // const { fitView } = useReactFlow()
    // const { files, loadFiles, selectedNode, highlightSubChildrenEdges, handleEdgeDelete, handleNodeDelete, setNodes: setHookNodes, fold, toggleFolder, loaded, updateNode } = useEditorState()
    // const { updateEdge, loadEdges } = useUserState()
    // // const { nodes: hookNodes, edges: hookEdges } = useFileTreeGraph(files)
    // const { nodes: fileNode , formatFiles } = useFileState()
    //
    // const [nodes, setNodes, onNodesChange] = useNodesState([]);
    // const [ edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    //
    // useEffect(() => {
    //     formatFiles()
    //     setHookNodes(fileNode);
    //     loadEdges().then(r => {
    //         setEdges(prev => ([...prev, ...r]))
    //     })
    // }, []);
    //
    // useEffect(() => {
    //     const layoutedNodes = getLayoutedElements(fileNode, edges, { direction: 'TB' })
    //     loadFiles();
    //     setNodes([...layoutedNodes.nodes]);
    //     setEdges(prev => ([...prev,...layoutedNodes.edges]));
    // }, []);
    //
    // useEffect(() => {
    //     if (selectedNode){
    //         if (selectedNode.type === 'folderNode'){
    //             highlightSubChildrenEdges(setEdges)
    //         }
    //     }
    // }, [selectedNode]);
    //
    // useEffect(() => {
    //     const layoutedNodes = getLayoutedElements(fileNode, edges, { direction: 'TB' })
    //     const timeout = setTimeout(() => {
    //         setNodes([...layoutedNodes.nodes])
    //         setEdges([...layoutedNodes.edges])
    //     }, 400)
    //     return() => clearTimeout(timeout)
    // }, [files]);
    //
    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         setHookNodes(nodes)
    //     }, 400)
    //     return () => clearTimeout(timeout)
    // }, [nodes, files]);
    //
    // useEffect(() => {
    //     if (fold.path){
    //         toggleFolder(nodes, setNodes, setEdges)
    //     }
    // }, [fold.fold]);
    //
    // const onLayout = useCallback((direction: any) => {
    //     const layouted = getLayoutedElements(nodes, edges, { direction })
    //
    //     setNodes([...layouted.nodes]);
    //     setEdges([...layouted.edges]);
    // }, [nodes, edges, files])
    //
    // // Connection handler
    // const onConnect = useCallback((params: Connection) => {
    //     console.log(params)
    //     setEdges((eds) => addEdge(params, eds))
    //     updateEdge(params)
    // }, []);
    //
    // const onDrop = (event: React.DragEvent) => {
    //     event.preventDefault();
    //     const toolId = event.dataTransfer.getData('application/reactflow')
    //     // @ts-ignore
    //     const tool = ToolNodes.find((t) => t.id === toolId)
    //
    //     if (!tool) return;
    //     const newNode = {
    //         id: tool.id,
    //         type: tool.id,
    //         position: { x: Math.random() * 600, y: Math.random() * 600},
    //         data: {
    //             label: tool.name,
    //             name: tool.name,
    //             method: 'Get',
    //             url: '',
    //             code:  undefined,
    //             ...tool.defaultData,
    //             onChange: (changes) =>
    //                 setNodes(nds => nds.map(nod => nod.id === tool.id ? {...nod, data: { ...nod.data, changes }} : nod))
    //         }
    //     }
    //     updateNode(newNode, 'c15acf41-1bd7-4899-be74-7f70551e644c')
    //     setNodes(nds => nds.concat(newNode))
    // }
    //
    // const onNodesDelete = (no) => {
    //    handleNodeDelete(no)
    // }
    //
    // const onEdgesDelete = (ed) => {
    //     handleEdgeDelete(ed)
    // }
    //
    // const onDragOver = (event: React.DragEvent) => {
    //     event.preventDefault()
    //     event.dataTransfer.dropEffect = 'move'
    // }
    //
    const {
        nodes,
        setNodes,
        edges,
        setEdges,
        isLoaded,
        projectDir,
        setSelectedFileNode,
        changedDir,
        setCurrentEditorNode,
    } = useFileState();

    useOnSelectionChange({
        onChange: ({nodes: selectedNodes}) => {
            if (!selectedNodes || selectedNodes.length === 0) {
                setSelectedFileNode({});
                setCurrentEditorNode({});
                return;
            }
            else if (selectedNodes[0].type === 'codeEditor'){
                setSelectedFileNode(selectedNodes[0]);
                setCurrentEditorNode(selectedNodes[0]);
                return;
            }
            setCurrentEditorNode({});
            setSelectedFileNode({});
        }
    });

    useEffect(() => {
        // const layoutedNodes = getLayoutedElements(nodes, edges, { direction: 'TB' });
        // const timeout = setTimeout(() => {
        //     setNodes([...layoutedNodes.nodes])
        //     setEdges([...layoutedNodes.edges])
        // }, 400);
        //
        // return () => clearTimeout(timeout);
        get()
    }, []);

    // useEffect(() => {
    //    let timeout = setTimeout(() => {
    //        setNodes((nod: any) => projectDir.map((file: mockFilesDataTypes) => {
    //            if (nod.type === 'codeEditor'){
    //                return {
    //                    ...nod,
    //                    data: {
    //                        ...nod.data,
    //                        code: file.content
    //                    }
    //                };
    //            }
    //            return nod
    //        }))
    //        // setNodes(nod => ({...nod}))
    //        console.log(nodes)
    //        setFileStateNodes(nodes)
    //    }, 50);
    //
    //     return () => clearTimeout(timeout);
    // }, [projectDir]);

    // useEffect(() => {
    //     const layoutedNodes = getLayoutedElements(nodes, edges, { direction: 'TB' })
    //         setNodes([...layoutedNodes.nodes])
    //         setEdges([...layoutedNodes.edges])
    // }, [projectDir]);

    const onNodesChange = useCallback((changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)), [nodes]);

    const onEdgesChange = useCallback((changes: any) => setEdges((edg) => applyNodeChanges(changes, edg)), [edges])

    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => addEdge(params, eds))
        // updateEdge(params)
    }, []);

    const onLayout = useCallback((direction: any) => {
        const layouted = getLayoutedElements(nodes, edges, { direction })
        setNodes([...layouted.nodes]);
        setEdges([...layouted.edges]);
    }, [nodes, edges])

    if (!isLoaded) return (<div className={'container-full center bg-neutral-900'}>
        <Loader size={20} className={'animate-spin text-white'}/>
        {/*<SpiralLoader/>*/}
    </div>);

    return (
        <div className={cn(`between bg-zinc-900 flex-col gap-[3px]`)} style={{ width: '100vw', height: '100vh' }}>
            <FlowNavbar onLayout={onLayout}/>

            <div className={"container-full relative between p-[3px] gap-[3px]"}>
                <FlowSidebarWrapper className={"h-full center pt-[6px] rounded-sm bg-black"}>
                    <EditorSidebar/>
                </FlowSidebarWrapper>
                <div className={"container-full center overflow-hidden rounded-lg bg-black"}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            // TODO: implement edges and nodes delete functions
                            // onNodesDelete={onNodesDelete}
                            // onEdgesDelete={onEdgesDelete}
                            // edgeTypes={edgeType}
                            minZoom={.28}
                            //TODO: implement drag and drop functions.
                            // onDrop={onDrop}
                            // onDragOver={onDragOver}
                            // snapToGrid={true}
                            // snapGrid={[15, 15]}
                            fitView
                        >
                            <LeftSidebarRenderer/>
                            <RightSidebarRenderer/>
                            <EventListener/>
                            <CodeEditor/>
                            <ModelWrapper/>
                            {/*//@ts-ignore*/}
                            <Background variant="dots" gap={12} size={1} color="#444" />
                            <Controls className={'rounded-sm bg-black text-white mb-[50px]'}
                                      style={{
                                          borderRadius: 10
                                      }}
                            />
                            <LeftBottomPanel/>
                            <RightBottomPanel/>
                        </ReactFlow>
                </div>
                <FlowSidebarWrapper className={"!h-full center pt-[6px] rounded-sm bg-black"}>
                    <RightEditorSidebar/>
                </FlowSidebarWrapper>
            </div>
        </div>
    );
};

export default FlowWithCodeEditor;

const EventListener = () => {
    const { fitView } = useReactFlow()
    const {
        selectedNode,
        getRecentNodes,
        setIsOnFitView,
        isOnFitView,
        setOpenModel,
        setOpen,
        setOpenEditor,
    } = useEditorState()
    const {
        query,
        isOnQuery,
        results,
        setIsOnQuery,
        nodes,
        setSearchResults,
    } = useFileState()

    useEffect(() => {
        setIsOnQuery(true)
        const timer = setTimeout(() => {
            if (query){
                const searches = results.map((search) => nodes.filter((node) => node.data.label.startsWith(search['obj'].path))[0])
                console.log(searches)
                setSearchResults(searches)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [query]);

    useEffect(() => {
        getRecentNodes()

        const handleKeyDown = (e: any) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f'){
                e.preventDefault()
                if (selectedNode){
                    setIsOnFitView(true)
                    setTimeout(() => {
                        fitView({
                            nodes: [{ id: selectedNode.id }],
                            duration: 800,
                            padding: 0.05,
                            maxZoom: 1.1,
                            minZoom: .5
                        })
                    }, 100)
                }
            }
            else if ((e.ctrlKey || e.metaKey) && e.key === 'k'){
                e.preventDefault()
                setOpen(true)
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'e' && selectedNode){
                e.preventDefault()
                setOpenEditor(true)
            }
        }

        if (typeof window !== "undefined"){
            window.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            if (typeof window !== "undefined"){
                window.removeEventListener('keydown', handleKeyDown)
            }
        }
    }, []);

    useEffect(() => {
        if (query && isOnQuery && selectedNode){
            setTimeout(() => {
                fitView({
                    nodes: [{ id: selectedNode.id }],
                    duration: 800,
                    padding: 0.05,
                    maxZoom: 1.1,
                    minZoom: .5
                })
            }, 100)
            setIsOnQuery(false)
        }
        setIsOnQuery(false)
    }, [selectedNode]);

    useEffect(() => {
        if (isOnFitView && selectedNode){
            console.log('Is On FitView')
            setTimeout(() => {
                fitView({
                    nodes: [{ id: selectedNode.id }],
                    duration: 800,
                    padding: 0.05,
                    maxZoom: 1.1,
                    minZoom: .5
                })
            }, 100)
            setIsOnFitView(false)
        }
        setIsOnFitView(false)
    }, [isOnFitView]);

    return null
}