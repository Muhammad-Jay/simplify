'use client'

import {createContext, useContext, useMemo, useCallback, useEffect, useState} from 'react'
import {toast} from 'sonner';
import { nanoid } from 'nanoid'
import {Position} from 'reactflow';
import { useParams, useRouter } from 'next/navigation'
import Dagre from '@dagrejs/dagre'
import {db, Edges, FileInterface, WorkFlow, WorkSpaceProjectInterface} from "@/lib/dexie/index.dexie";
import {WorkFlowType} from "@/types";

const WorkSpaceContext = createContext<any| undefined>(undefined);

const defaultNodeColor = '#00bcff'
const author_id = 'jsync4172004@gmail.com'
const route = '/work-space'

export function WorkSpaceProvider({
                                      children,
                                  }: {
    children: React.ReactNode;
}){
    const { work_space_id } = useParams();
    const router = useRouter();

    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isWorkflowsDialogOpen, setIsWorkflowsDialogOpen] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [workFlows, setWorkFlows] = useState<WorkFlowType[]>([])
    const [isFetching, setIsFetching] = useState(false)
    const [selectedWorkFlowNode, setSelectedWorkFlowNode] = useState([])

    useEffect(() => {
        // mockWorkSpaceProjects.map(async mp => {
        //     await db.workSpaceProjects.put({
        //         id: mp.id,
        //         name: mp.projectName,
        //         project_id: 'project_simplify',
        //         author_id,
        //         created_At: Date.now(),
        //         updated_At: Date.now()
        //     })
        // })
        loadWorkSpaceProjects(work_space_id);
        fetchAllWorkFlows()
    }, []);

    const loadWorkSpaceProjects = useCallback(async (id: any) => {
        try {
            setIsLoading(true)
            const dbProjects: WorkSpaceProjectInterface[] = await db.workSpaceProjects.where('project_id').equals(id).toArray()
            if (!dbProjects) return;

            const dbEdges: Edges[]  = await db.edges.where('project_id').equals(id).toArray()
            if (!dbEdges) return;
            const newEdges = dbEdges.map(edg => ({
                id: edg.id,
                source: edg.edge.source,
                target: edg.edge.target,
                type: 'simplebezier',
                targetHandle: 'target-handle',
                sourceHandle: 'source-handle',
                style: {
                    stroke: '#ffffff',
                    opacity: 2,
                    strokeWidth: 3
                },
                data: {
                    isVisible: false,
                }
            }))
            setEdges([...newEdges]);

            const formatedP = dbProjects.map((project: WorkSpaceProjectInterface) => ({
                id: project.id,
                type: 'workSpaceNode',
                position: {x: Math.random() * 600, y: Math.random() * 600},
                data: {
                    name: project.name,
                    projectId: project.id,
                    color: defaultNodeColor,
                    isVisible: true,
                },
                sourcePosition: Position.Bottom,
                targetPosition: Position.Top
            }))

            const layoutedNodes = getLayoutedWorkSpaceElements(formatedP, newEdges, { direction: 'TB' });
            setNodes([...layoutedNodes.nodes])
            setEdges([...layoutedNodes.edges]);

        }catch (e) {
            console.log(e)
        }finally {
            setIsLoading(false)
        }
    }, [nodes.length])

    const fetchAllWorkFlows = useCallback(async () => {

        const newId = nanoid();

        // await db.workFlows.put({
        //     id: newId,
        //     name: 'project_simplify',
        //     author_id,
        //     created_At: Date.now(),
        //     updated_At: Date.now()
        // })
        try {
            setIsFetching(true);
            const dbWorkFlows: WorkFlow[] = await db.workFlows.where('author_id').equals(author_id).toArray()
            if (!dbWorkFlows) return;

            setWorkFlows(dbWorkFlows.map(wkFlow => ({
                name: wkFlow.name,
                createdAt: wkFlow.created_At,
                id: wkFlow.id
            })))
        }catch (e) {
            console.log(e)
        }finally {
            setIsFetching(false)
        }
    }, [])

    const addNewProjectNode = async (name: string, project_id: string) => {
        const newId = nanoid()
        try {
            setIsUpdating(true);

            await db.workSpaceProjects.put({
                id: newId,
                name,
                project_id: work_space_id,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })

            setNodes(nds => [...nds, {
                id: newId,
                type: 'workSpaceNode',
                position: {x: Math.random() * 600, y: Math.random() * 600},
                data: {
                    name: name,
                    projectId: newId,
                    color: defaultNodeColor,
                    isVisible: true,
                }
            }])
        }catch (e) {

        }finally {
            setIsUpdating(false)
        }
    }

    const getLayoutedWorkSpaceElements = useCallback((layoutNodes: any, layoutEdges: any, options: any) => {
        const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

        const graphRankSep = layoutNodes.length > 30 ? 800 : layoutNodes.length > 20 ? 500 : layoutNodes.length > 10 ? 300 : 600;
        const graphNodeSep = layoutNodes.length > 30 ? 350 : layoutNodes.length > 20 ? 250 : layoutNodes.length > 10 ? 150 : 400
        const calc = graphRankSep
        g.setGraph({
            rankdir: options.direction,
            ranksep: graphRankSep,
            nodesep: graphNodeSep,
            edgesep: 50,
            ranker: 'tight-tree',
        });

        layoutEdges.forEach((edge) => g.setEdge(edge.source, edge.target));
        layoutNodes.forEach((node) => g.setNode(node.id, {
            ...node,
            width: node.measured?.width ?? 300,
            height: node.measured?.height ?? 150
        }))

        Dagre.layout(g)

        return {
            nodes: layoutNodes.map((node) => {
                const position = g.node(node.id)
                const x = position.x + (node.measured?.width ?? 100) / 2;
                const y = position.y + (node.measured?.height ?? 200) / 2;

                return { ...node, position: { x, y}};
            }),
            edges: layoutEdges,
        }
    }, [nodes, edges])

    const handleNavigate = (id) => {
        router.push(`${route}/${id}`)
    }

    const updateEdgeConnection = useCallback(async (edge) => {
        console.log(edge)
        try {
            await db.edges.add({
                id: nanoid(),
                edge,
                project_id: work_space_id,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })

        }catch (e) {
            throw new Error(e)
        }
    }, [edges])

    const handleWorkSpaceEdgeDelete = async (param: any[]) => {
        try {
            for (const edg of param) {
                console.log(edg)
                await db.edges.delete(edg.id)
            }
        }catch (e) {
            console.log(e)
        }
    }

    const loadWorkSpaceEdges = useCallback(async (id) => {
        try {
            const dbEdges: Edges[]  = await db.edges.where('project_id').equals(id).toArray()
            if (!dbEdges) return;
            const newEdges = dbEdges.map(edg => ({
                id: edg.id,
                source: edg.edge.source,
                target: edg.edge.target,
                type: 'simplebezier',
                style: {
                    stroke: '#ffffff',
                    opacity: 2,
                    strokeWidth: 3
                },
                data: {
                    isVisible: false,
                }
            }))
            setEdges([...newEdges]);

        }catch (e) {
            console.log(e)
        }finally {
            setIsUpdating(false)
        }
    }, [])

    const handleWorkSpaceNodeDelete = useCallback(async (param: any[]) => {
        try {
            // setIsDeleting(true)
            for (const nds of param) {
                nodes.filter(nd => nd.id.startsWith(nds.id + '/')).map(async n => {
                    setNodes(nods => nods.filter(ns => ns.id !== n.id))
                    await db.workSpaceProjects.delete(n.id)
                })
                await db.workSpaceProjects.delete(nds.id)
            }
        }catch (e) {
            console.log(e)
        }finally {
            // setIsDeleting(false)
        }
    }, [nodes])

    const createNewWorkFlow = useCallback(async (name: string) => {
        const newId = nanoid();

        if (!name) return;

        const formatedName = name.split(' ').filter(Boolean).join('_');
        console.log('formated name', formatedName)

        const workflowExists = workFlows.find(flow => flow.name === formatedName)

        if (workflowExists) {
            console.log('workflow with the same name already exists.')
            return;
        }
        try {
            setIsCreating(true);
            await db.workFlows.put({
                id: newId,
                name: formatedName,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })

            router.push(`/work-space/${formatedName}`);
        }catch (e) {
            console.log(e);
        }finally {
            setIsCreating(false)
            setIsWorkflowsDialogOpen(false)
        }
    }, [workFlows])

    const deleteWorkFlow = useCallback(async (workflowId: string) => {
        if (!workflowId) return;

        try {
            setIsDeleting(true);

            await db.workFlows.delete(workflowId);
            setWorkFlows(flows => flows.filter(flow => flow.id !== workflowId)
            )
        }catch (e) {
            console.log(e);
        }finally {
            setIsDeleting(false)
        }
    }, [workFlows])

    const getWorkflowProjects = useCallback(async (id: string) => {
        const dbProjects: WorkSpaceProjectInterface[] = await db.workSpaceProjects.where('project_id').equals(id).toArray()

        return dbProjects || []
    }, [workFlows])

    return (
        <WorkSpaceContext.Provider value={{
            nodes,
            setNodes,
            edges,
            setEdges,
            isUpdating,
            isLoading,
            setIsLoading,
            setIsUpdating,
            isDialogOpen,
            setIsDialogOpen,
            handleNavigate,
            loadWorkSpaceProjects,
            addNewProjectNode,
            defaultNodeColor,
            selectedWorkFlowNode,
            setSelectedWorkFlowNode,
            getLayoutedWorkSpaceElements,
            updateEdgeConnection,
            handleWorkSpaceEdgeDelete,
            loadWorkSpaceEdges,
            handleWorkSpaceNodeDelete,
            createNewWorkFlow,
            fetchAllWorkFlows,
            workFlows,
            isWorkflowsDialogOpen,
            setIsWorkflowsDialogOpen,
            isSidebarOpen,
            setIsSidebarOpen,
            isCreating,
            setIsCreating,
            isDeleting,
            setIsDeleting,
            deleteWorkFlow,
            getWorkflowProjects,
        }}>
            {children}
        </WorkSpaceContext.Provider>
    )
}

export const useWorkFlowState = ()=> {
    const context = useContext(WorkSpaceContext)
    if (!context) {
        throw new Error('useEditorState() must be wrapped within the provider')
    }
    return context
}