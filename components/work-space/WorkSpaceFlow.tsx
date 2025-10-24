'use client'
import React, {useState, useEffect, useCallback} from 'react';
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
import {useRouter, useParams} from 'next/navigation'
import {LeftBottomPanel, RightBottomPanel} from "@/components/EditorFlow/ui/bottom-tabs/BottomPanel";
import {cn} from "@/lib/utils";
import FlowNavbar from "@/components/EditorFlow/layout/FlowNavbar";
import RightSidebarRenderer, {RightEditorSidebar} from "@/components/EditorFlow/ui/right-sidebar/RightSidebarRenderer";
import PanContextMenu from "@/components/EditorFlow/ui/pan/PanContextMenu";
import ModelWrapper from "@/components/EditorFlow/Global search/ModelWrapper";
import CodeEditor from "@/components/EditorFlow/Monoco/Editor";
import LeftSidebarRenderer from "@/components/EditorFlow/ui/left-sidebar/LeftSidebarRenderer";
import EditorSidebar from "@/components/EditorFlow/ui/left-sidebar/EditorSidebar";
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import {useFileState} from "@/context/FileContext";
import WorkSpaceNode from "@/components/work-space/work_space_nodes/WorkSpaceNode";
import {generateEdges} from "@/utils/flow/edge";
import AddNewProjectModel from "@/components/work-space/work_space_nodes/AddNewProjectModel";
import {PanelWrapper} from "@/components/EditorFlow/ui/PanelWrapper";
import {ConfigurationPanel} from "@/components/work-space/ConfigurationPanel";

const nodeTypes = {
    workSpaceNode: WorkSpaceNode
}

const WorkSpaceFlow = ({workSpaceId, projectId}) => {
    const router = useRouter()
    const { work_space_id } = useParams()
    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        selectedWorkFlowNode,
        setSelectedWorkFlowNode,
        setIsDialogOpen,
        loadWorkSpaceProjects,
        updateEdgeConnection,
        handleWorkSpaceEdgeDelete,
        handleWorkSpaceNodeDelete,
        setIsConfigurationPanelOpen,
    } = useWorkFlowState()
    const {setCurrentProjectId, setIsLoaded, loadFiles, getLayoutedElements} = useFileState();

    useOnSelectionChange({
        onChange: ({nodes: selectedNodes}) => {
            if (!selectedNodes || selectedNodes.length === 0) {
                setSelectedWorkFlowNode([])
                return;
            }
            setSelectedWorkFlowNode(selectedNodes);
        }
    });

    const onNodesDelete = useCallback((no) => {
        handleWorkSpaceNodeDelete(no)
    },[nodes.length])

    const onNodesChange = useCallback((changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)), [nodes]);

    const onEdgesChange = useCallback((changes: any) => setEdges((edg) => applyNodeChanges(changes, edg)), [edges])

    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => addEdge(params, eds))
        updateEdgeConnection(params)
    }, []);

    return (
        <div className={cn(`between bg-transparent flex-col gap-[3px]`)} style={{ width: '100vw', height: '100vh' }}>
            <FlowNavbar id={projectId}/>
            <div className={"container-full relative between p-[3px] gap-[3px]"}>
                <AddNewProjectModel/>

                <PanelWrapper position={'Top Left'} className={'center !h-fit p-0 bg-transparent !justify-start !top-[5px] flex-col z-[2] border-none'}>
                    <EditorSidebar/>
                </PanelWrapper>

                <PanelWrapper position={'Top Right'} className={'center !h-fit p-0 bg-transparent !justify-start !top-[5px] flex-col z-[2] border-none'}>
                    <RightEditorSidebar/>
                </PanelWrapper>
                <div className={"container-full center overflow-hidden rounded-lg bg-black"}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeDoubleClick={() => {
                            if (selectedWorkFlowNode) {
                                setCurrentProjectId({
                                    id: selectedWorkFlowNode[0]?.id,
                                    name: selectedWorkFlowNode[0]?.data.name,
                                    workSpaceName: work_space_id
                                });
                                router.push(`/work-space/${work_space_id}/${selectedWorkFlowNode[0]?.id}`);
                                return;
                            }
                            return;
                        }}
                        onEdgeClick={() => console.log('edge clicked') }
                        onNodeContextMenu={(e) => {
                            e.preventDefault()
                            alert('node content')
                        }}
                        onPaneClick={() => {
                            setIsConfigurationPanelOpen(false);
                        }}
                        onPaneContextMenu={(e) => {
                            e.preventDefault()
                            setIsDialogOpen(true)
                        }}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        // @ts-ignore
                        // edgeTypes={edgeType}
                        connectOnClick={true}
                        // TODO: implement edges and nodes delete functions
                        onNodesDelete={onNodesDelete}
                        onEdgesDelete={handleWorkSpaceEdgeDelete}
                        // edgeTypes={edgeType}isConfigurationPanelOpen
                        minZoom={.20}
                        //TODO: implement drag and drop functions.
                        // onDrop={onDrop}
                        // onDragOver={onDragOver}
                        // snapToGrid={true}
                        // snapGrid={[15, 15]}
                        fitView
                        elevateEdgesOnSelect={true}
                        reconnectRadius={20}
                        onError={(err) => console.log('react flow error', err)}
                        // connectionMode={ConnectionMode.Loose}
                    >
                        <LeftSidebarRenderer/>
                        <RightSidebarRenderer/>
                        {/*<EventListener/>*/}
                        <CodeEditor/>
                        <ModelWrapper/>
                        {/*//@ts-ignore*/}
                        {/*<Background variant="dots" gap={20} size={2} color="#444" />*/}

                        <ConfigurationPanel/>

                        <LeftBottomPanel/>
                        {/* TODO pass real id! */}
                        <RightBottomPanel id={''}/>
                    </ReactFlow>
                </div>
                {/*<FlowSidebarWrapper className={"!h-full center pt-[6px] rounded-sm bg-black"}>*/}
                {/*    <RightEditorSidebar/>*/}
                {/*</FlowSidebarWrapper>*/}
            </div>
        </div>
    )
}
export default WorkSpaceFlow