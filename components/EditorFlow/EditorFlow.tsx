'use client'
import React, {useCallback, memo, useMemo, useEffect, useState} from 'react';
import {
    ReactFlow,
    addEdge,
    Background,
    Controls,
    Connection,
    Edge,
    Panel,
    useNodes,
    useReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    useOnSelectionChange,
    ConnectionMode,
} from 'reactflow';
import dynamic from 'next/dynamic';
import {cn} from "@/lib/utils";
import FlowSidebarWrapper from "@/components/EditorFlow/ui/FlowSidebarWrapper";
import EditorSidebar from "@/components/EditorFlow/ui/left-sidebar/EditorSidebar";
import FolderNode from "@/components/EditorFlow/Monoco/FolderNode";
import Loader from "@/components/Loader";
import {useEditorState} from "@/context/EditorContext";
import FlowNavbar from "@/components/EditorFlow/ui/FlowNavbar";
import LeftSidebarRenderer from "@/components/EditorFlow/ui/left-sidebar/LeftSidebarRenderer";
import {LeftBottomPanel, RightBottomPanel} from "@/components/EditorFlow/ui/bottom-tabs/BottomPanel";
import RightSidebarRenderer, {RightEditorSidebar} from "@/components/EditorFlow/ui/right-sidebar/RightSidebarRenderer";
import ModelWrapper from "@/components/EditorFlow/Global search/ModelWrapper";
import HttpNode from "@/components/EditorFlow/nodes/HttpNode";
import CodeEditor from "@/components/EditorFlow/Monoco/Editor";
import {useFileState} from "@/context/FileContext";
import {useForceGraphLayout} from "@/hooks/FlowGraph/useForceGraphLayout";
import {initializeBuildProcess} from "@/lib/podman_actions/init";
import PanContextMenu from "@/components/EditorFlow/ui/pan/PanContextMenu";
import CustomStepEdge from "@/components/EditorFlow/Edge/CustomStepEdge";

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
    customEdge: CustomStepEdge
}

// Initial edges data
const initialEdges: Edge[] = [];

const ProjectFlow = ({workSpaceId, projectId: id}) => {
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
        loadFiles,
        projectId,
        setProjectId,
        setSelectedFileNode,
        handleNodeDelete,
        handleEdgeDelete,
        resetNodeState,
        setCurrentEditorNode,
        setSelectedNode,
        handlePanClick,
        setPanContextMenuOpen,
        getLayoutedElements,
        highlightSubChildrenEdgesAndNodes,
    } = useFileState();

    useOnSelectionChange({
        onChange: ({nodes: selectedNodes}) => {
            if (!selectedNodes || selectedNodes.length === 0) {
                setSelectedFileNode({});
                setCurrentEditorNode({});
                setSelectedNode({})
                return;
            }
            setSelectedNode(selectedNodes[0]);
            if (selectedNodes[0].type === 'codeEditor'){
                setSelectedFileNode(selectedNodes[0]);
                setCurrentEditorNode(selectedNodes[0]);
                setSelectedNode(selectedNodes[0])
                return;
            }
            setCurrentEditorNode({});
            setSelectedFileNode({});
        }
    });

    useEffect(() => {
        // loadFiles(id)
        // setProjectId(id);
        // const wss = new WebSocket('ws://localhost:8080/')
        //
        // wss.onopen = () => {
        //     console.log('socket connected.')
        //     wss.send(JSON.stringify({message: "i'm successfully connected on client side."}))
        // }
        //
        // wss.onmessage = (data) => {
        //     console.log("message from socket:",data)
        // }
        //
        // wss.onclose = () => {
        //     console.log('socket disconnected.')
        // }
        //
        // wss.onerror = (err) => {
        //     console.error(err)
        // }

    }, [])

    const onNodesChange = useCallback((changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)), [nodes]);

    const onEdgesChange = useCallback((changes: any) => setEdges((edg) => applyNodeChanges(changes, edg)), [edges])

    const onNodesDelete = (no) => {
       handleNodeDelete(no)
    }

    const onEdgesDelete = (ed) => {
        handleEdgeDelete(ed)
    }

    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => addEdge(params, eds))
        // updateEdge(params)
    }, []);

    const onLayout = useCallback((direction: any) => {
        const layouted = getLayoutedElements(nodes, edges, { direction })
        setNodes([...layouted.nodes]);
        setEdges([...layouted.edges]);
    }, [nodes, edges])

    if (!isLoaded) return (<div
        className={'container-full center'}>
        <Loader size={20} className={'animate-spin text-white'}/>
        {/*<SpiralLoader/>*/}
    </div>);

    return (
        <div className={cn(`between bg-zinc-900 flex-col gap-[3px]`)} style={{ width: '100vw', height: '100vh' }}>
            <FlowNavbar id={id}/>

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
                            onNodeDoubleClick={highlightSubChildrenEdgesAndNodes}
                            onEdgeClick={() => console.log('edge clicked') }
                            onNodeContextMenu={(e) => {
                                e.preventDefault()
                                alert('node content')
                            }}
                            onPaneClick={handlePanClick}
                            onPaneContextMenu={(e) => {
                                e.preventDefault()
                                resetNodeState()
                                setPanContextMenuOpen(true)
                            }}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            // @ts-ignore
                            // edgeTypes={edgeType}
                            connectOnClick={true}
                            // TODO: implement edges and nodes delete functions
                            onNodesDelete={onNodesDelete}
                            onEdgesDelete={onEdgesDelete}
                            // edgeTypes={edgeType}
                            minZoom={.28}
                            //TODO: implement drag and drop functions.
                            // onDrop={onDrop}
                            // onDragOver={onDragOver}
                            // snapToGrid={true}
                            // snapGrid={[15, 15]}
                            fitView
                            elevateEdgesOnSelect={true}
                            reconnectRadius={20}
                            onError={(err) => console.log('react flow error', err)}
                            connectionMode={ConnectionMode.Loose}
                        >
                            <LeftSidebarRenderer/>
                            <RightSidebarRenderer/>
                            <EventListener/>
                            <CodeEditor/>
                            <ModelWrapper/>
                            {nodes.length === 0 && <PanContextMenu/>}
                            {/*//@ts-ignore*/}
                            <Background variant="dots" gap={20} size={2} color="#444" />


                            <LeftBottomPanel/>
                            <RightBottomPanel id={projectId}/>
                        </ReactFlow>
                </div>
                <FlowSidebarWrapper className={"!h-full center pt-[6px] rounded-sm bg-black"}>
                    <RightEditorSidebar/>
                </FlowSidebarWrapper>
            </div>
        </div>
    );
};

export default ProjectFlow;

const EventListener = () => {
    const { fitView } = useReactFlow()
    const {
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
        setNodes,
        setEdges,
        nodes,
        edges,
        setSearchResults,
        selectedNode,
        getLayoutedElements,
        resetNodeState,
    } = useFileState()

    useEffect(() => {
        setIsOnQuery(true)
        const timer = setTimeout(() => {
            if (query){
                const searches = results.map((search) => nodes.filter((node) => node.data.label.startsWith(search['obj'].path))[0])
                setSearchResults(searches)
                fitView({
                    nodes: [{ id: searches[0]?.id }],
                    duration: 800,
                    padding: 0.10,
                    maxZoom: 1,
                    minZoom: .5
                })
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
            if ((e.ctrlKey || e.metaKey) && e.key === 'k'){
                e.preventDefault()
                resetNodeState()
                setOpen(prev => !prev);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'e' && selectedNode){
                e.preventDefault()
                resetNodeState()
                setOpenEditor(prev => !prev)
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'l'){
                e.preventDefault()
                setTimeout(() => {
                    const layoutedNodes = getLayoutedElements(nodes, edges, { direction: 'TB' });
                    setNodes([...layoutedNodes.nodes])
                    setEdges([...layoutedNodes.edges])

                    fitView({
                        nodes: [],
                        duration: 800,
                        padding: 0.05,
                        maxZoom: 1.1,
                        minZoom: .28
                    })
                }, 100)
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
        fitView({
            nodes: [],
            duration: 800,
            padding: 0.05,
            maxZoom: 1.1,
            minZoom: .28
        })
        setIsOnFitView(false)
    }, [isOnFitView]);

    return null
}