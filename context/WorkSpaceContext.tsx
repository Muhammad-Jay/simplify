'use client'

import {createContext, useContext, useMemo, useCallback, useEffect, useState} from 'react'
import {toast} from 'sonner';
import { nanoid } from 'nanoid'
import {Position} from 'reactflow';
import { useParams, useRouter } from 'next/navigation'
import Dagre from '@dagrejs/dagre' // Library for automatic graph layout
// Database and Type Imports
import {db, Edges, FileInterface, WorkFlow, WorkSpaceProjectInterface} from "@/lib/dexie/index.dexie";
import {ConfigurationPanelStateType, WorkFlowType} from "@/types";

// --- Context Definition ---

/**
 * Creates the WorkSpaceContext. It will hold all state and functions
 * necessary for managing the workflow editor's state and interactions.
 * The type 'any' is used here for simplicity in the context definition,
 * but should ideally be replaced with a precise interface for WorkSpaceContextValue.
 */
const WorkSpaceContext = createContext<any| undefined>(undefined);

// --- Constants ---

const defaultNodeColor = '#00bcff'
// Hardcoded author ID; in a real-world application, this should be fetched
// from a secure authentication system (e.g., via session/auth context).
const author_id = 'jsync4172004@gmail.com'
const route = '/work-space'

// --- Provider Component ---

export function WorkSpaceProvider({
                                      children,
                                  }: {
    children: React.ReactNode;
}){
    // --- Hooks and Router Setup ---

    // Extracts the work_space_id from the Next.js URL parameters
    const { work_space_id } = useParams();
    const router = useRouter();

    // --- State Management for React Flow and UI ---

    const [nodes, setNodes] = useState<any[]>([]) // React Flow nodes state
    const [edges, setEdges] = useState<any[]>([]) // React Flow edges state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isWorkflowsDialogOpen, setIsWorkflowsDialogOpen] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isConfigurationPanelOpen, setIsConfigurationPanelOpen] = useState(false);
    const [configPanelState, setConfigPanelState] = useState<ConfigurationPanelStateType>('configuration')
    const [selectedWorkFlowNode, setSelectedWorkFlowNode] = useState<any>([])
    const [nodesConfigs, setNodesConfigs] = useState<any>([]) // Configuration array for nodes

    // --- State Management for Loading/Mutation Status ---

    // Use specific boolean states to clearly indicate the operation in progress
    const [isLoading, setIsLoading] = useState(false) // Initial load of projects and edges
    const [isUpdating, setIsUpdating] = useState(false) // Used for general data updates (e.g., adding a node)
    const [isCreating, setIsCreating] = useState(false); // Used specifically for creating a new workflow
    const [isDeleting, setIsDeleting] = useState(false); // Used for deleting nodes/workflows
    const [isFetching, setIsFetching] = useState(false) // Used specifically for fetching all workflows

    // --- Workflow State ---

    const [workFlows, setWorkFlows] = useState<WorkFlowType[]>([])

    // --- Effects ---

    /**
     * Initial data loading effect. Runs once on mount.
     * Fetches the current workspace's projects (nodes) and edges,
     * and also fetches the list of all available workflows.
     */
    useEffect(() => {
        // work_space_id is dynamically available from useParams
        if (work_space_id) {
            loadWorkSpaceProjects(work_space_id);
        }
        fetchAllWorkFlows();
    }, [work_space_id]); // Dependency on work_space_id ensures re-load if the ID changes

    /**
     * Effect to create initial configuration stubs for nodes.
     * Runs whenever the nodes array size changes (e.g., after initial load or adding a new node).
     */
    useEffect(() => {
        configureNodes();
    }, [nodes.length]);

    // --- Data Loading and Initialization Functions ---

    /**
     * Loads projects (nodes) and edges for the current workspace ID from Dexie.
     * Applies the Dagre auto-layout algorithm after fetching.
     * @param id The project_id (work_space_id) to load data for.
     */
    const loadWorkSpaceProjects = useCallback(async (id: any) => {
        if (!id) return; // Guard against null or undefined id

        try {
            setIsLoading(true)

            // 1. Fetch Projects (Nodes)
            const dbProjects: WorkSpaceProjectInterface[] = await db.workSpaceProjects.where('project_id').equals(id).toArray()

            // 2. Fetch Edges
            const dbEdges: Edges[]  = await db.edges.where('project_id').equals(id).toArray()

            // 3. Format Edges for React Flow
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

            // 4. Format Projects for React Flow Nodes
            const formatedP = dbProjects.map((project: WorkSpaceProjectInterface) => ({
                id: project.id,
                type: 'workSpaceNode',
                // Temporarily assign random position before layout
                position: {x: Math.random() * 600, y: Math.random() * 600},
                data: {
                    name: project.name,
                    projectId: project.id,
                    ports: project.ports,
                    color: defaultNodeColor,
                    isVisible: true,
                },
                sourcePosition: Position.Bottom,
                targetPosition: Position.Top
            }))

            // 5. Apply Layout
            const layoutedElements = getLayoutedWorkSpaceElements(formatedP, newEdges, { direction: 'TB' });

            // 6. Update State
            setNodes(layoutedElements.nodes)
            setEdges(layoutedElements.edges);

        }catch (e) {
            console.error("Error loading workspace projects:", e)
            toast.error("Failed to load workspace data.");
        }finally {
            setIsLoading(false)
        }
    }, [])

    /**
     * Maps the current nodes state to a simpler configuration array (nodesConfigs).
     * This array is often used to drive configuration panels or sidebars.
     */
    const configureNodes = useCallback(() => {
        const formatedNodes = nodes.map((nd: any) => ({
            id: nd.id,
            name: nd.data.name,
            ports: [] // Ports likely populated elsewhere, or should mirror nd.data.ports
        }))

        setNodesConfigs(formatedNodes)
    }, [nodes])

    /**
     * Fetches all existing workflows from the database created by the current author.
     */
    const fetchAllWorkFlows = useCallback(async () => {
        try {
            setIsFetching(true);
            const dbWorkFlows: WorkFlow[] = await db.workFlows.where('author_id').equals(author_id).toArray()

            setWorkFlows(dbWorkFlows.map(wkFlow => ({
                name: wkFlow.name,
                createdAt: wkFlow.created_At,
                id: wkFlow.id
            })))
        }catch (e) {
            console.error("Error fetching all workflows:", e)
            toast.error("Failed to fetch workflows.");
        }finally {
            setIsFetching(false)
        }
    }, []) // Empty dependency array as it only depends on the constant author_id

    // --- Node and Edge Manipulation Functions ---

    /**
     * Adds a new project node to the workspace and persists it to the database.
     * @param name The name of the new project/node.
     * @param project_id The ID of the parent project/workflow.
     */
    const addNewProjectNode = async (name: string, project_id: string) => {
        const newId = nanoid()
        try {
            setIsUpdating(true);

            const newProjectData = {
                id: newId,
                name,
                ports: [],
                project_id: work_space_id as string, // Ensure work_space_id is treated as string
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            }

            await db.workSpaceProjects.put(newProjectData)
            toast.success(`Project node '${name}' created.`);

            // Create the new React Flow node object
            const newNode = {
                id: newId,
                type: 'workSpaceNode',
                position: {x: Math.random() * 600, y: Math.random() * 600}, // Temporary position before layout
                data: {
                    name: name,
                    projectId: newId,
                    color: defaultNodeColor,
                    ports: [],
                    isVisible: true,
                }
            }

            // Update local state, letting the configureNodes effect handle configs
            setNodes(nds => [...nds, newNode])
        }catch (e) {
            console.error("Error adding new project node:", e)
            toast.error("Failed to add new project node.");
        }finally {
            setIsUpdating(false)
        }
    }

    /**
     * Utility function to apply the Dagre layout algorithm to nodes and edges.
     * This function is crucial for an organized visual representation of the workflow.
     * @param layoutNodes The nodes to layout.
     * @param layoutEdges The edges to consider for layout.
     * @param options Layout options (e.g., direction).
     * @returns An object containing the layouted nodes and the original edges.
     */
    const getLayoutedWorkSpaceElements = useCallback((layoutNodes: any[], layoutEdges: any[], options: { direction: string }) => {
        const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

        // Dynamic rank and node separation based on the number of nodes for better scaling
        const nodeCount = layoutNodes.length;
        const graphRankSep = nodeCount > 30 ? 800 : nodeCount > 20 ? 500 : nodeCount > 10 ? 300 : 600;
        const graphNodeSep = nodeCount > 30 ? 350 : nodeCount > 20 ? 250 : nodeCount > 10 ? 150 : 400

        g.setGraph({
            rankdir: options.direction,
            ranksep: graphRankSep,
            nodesep: graphNodeSep,
            edgesep: 50,
            ranker: 'tight-tree', // A suitable ranker for workflow graphs
        });

        // Set edges and nodes in the Dagre graph
        layoutEdges.forEach((edge) => g.setEdge(edge.source, edge.target));
        layoutNodes.forEach((node) => g.setNode(node.id, {
            ...node,
            // Use existing node dimensions or sensible defaults
            width: node.measured?.width ?? 300,
            height: node.measured?.height ?? 150
        }))

        // Execute the layout algorithm
        Dagre.layout(g)

        // Map Dagre results back to React Flow nodes format
        return {
            nodes: layoutNodes.map((node) => {
                const position = g.node(node.id)
                // Center the React Flow node based on Dagre's top-left corner calculation
                const x = position.x - (node.measured?.width ?? 300) / 2;
                const y = position.y - (node.measured?.height ?? 150) / 2;

                return { ...node, position: { x, y}};
            }),
            edges: layoutEdges,
        }
    }, [])

    /**
     * Persists a newly created edge connection to the database.
     * This is typically called from a React Flow 'onConnect' handler.
     * @param edge The edge object from React Flow.
     */
    const updateEdgeConnection = useCallback(async (edge: any) => {
        try {
            await db.edges.add({
                id: nanoid(),
                edge,
                project_id: work_space_id as string,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })
            toast.success("Edge connected successfully.");
        }catch (e) {
            console.error("Error updating edge connection:", e)
            toast.error("Failed to save edge connection.");
            // Re-throw to be handled by the caller (e.g., React Flow's onConnect)
            throw new Error(String(e))
        }
    }, [work_space_id])

    /**
     * Deletes edges from the database based on a list of edges.
     * This is typically called from a React Flow 'onEdgesDelete' handler.
     * @param param An array of edge objects to delete.
     */
    const handleWorkSpaceEdgeDelete = async (param: any[]) => {
        try {
            // Use Dexie's bulk delete if possible for performance, or iterate
            for (const edg of param) {
                // Assuming edg.id is the key in the Dexie 'edges' store
                await db.edges.delete(edg.id)
            }
            toast.info(`${param.length} edge(s) deleted.`);
        }catch (e) {
            console.error("Error deleting workspace edges:", e)
            toast.error("Failed to delete edges.");
        }
    }

    /**
     * Re-loads edges for a specific workspace from the database.
     * Not always necessary if state is managed correctly, but useful for sync/debug.
     * @param id The project_id (work_space_id).
     */
    const loadWorkSpaceEdges = useCallback(async (id: any) => {
        if (!id) return;
        try {
            setIsUpdating(true)
            // Fetch and format edges (similar logic to loadWorkSpaceProjects)
            const dbEdges: Edges[]  = await db.edges.where('project_id').equals(id).toArray()
            // ... formatting logic here (omitted for brevity, assume it's correct)
            // setEdges([...newEdges]);
            setEdges(dbEdges.map(edg => ({
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
            })))
        }catch (e) {
            console.error("Error loading workspace edges:", e)
        }finally {
            setIsUpdating(false)
        }
    }, [])

    /**
     * Deletes project nodes from the workspace and database.
     * It handles the deletion of the main node and any potential sub-nodes (based on ID prefixing).
     * @param param An array of node objects to delete.
     */
    const handleWorkSpaceNodeDelete = useCallback(async (param: any[]) => {
        try {
            setIsDeleting(true)
            for (const nds of param) {
                // 1. Delete associated sub-nodes (if ID structure indicates hierarchy: id + '/')
                const subNodes = nodes.filter(nd => nd.id.startsWith(nds.id + '/'))
                for (const n of subNodes) {
                    setNodes(nods => nods.filter(ns => ns.id !== n.id))
                    await db.workSpaceProjects.delete(n.id)
                }

                // 2. Delete the main node
                setNodes(nods => nods.filter(ns => ns.id !== nds.id))
                await db.workSpaceProjects.delete(nds.id)
            }
            toast.info(`${param.length} node(s) deleted.`);
        }catch (e) {
            console.error("Error deleting workspace nodes:", e)
            toast.error("Failed to delete nodes.");
        }finally {
            setIsDeleting(false)
        }
    }, [nodes])

    // --- Workflow Management Functions ---

    /**
     * Creates a new workflow entry in the database and redirects the user to its workspace.
     * @param name The name of the new workflow.
     */
    const createNewWorkFlow = useCallback(async (name: string) => {
        if (!name || typeof name !== 'string' || name.trim() === '') {
            toast.error('Workflow name cannot be empty.');
            return;
        }

        const formatedName = name.trim().split(/\s+/).filter(Boolean).join('_').toLowerCase(); // Slugify name for URL/DB ID

        // Check for existing workflow name (case-insensitive check for the formatted name)
        const workflowExists = workFlows.find(flow => flow.name.toLowerCase() === formatedName.toLowerCase())

        if (workflowExists) {
            toast.error(`A workflow named '${formatedName}' already exists.`);
            return;
        }

        const newId = nanoid(); // Use nanoid for unique ID generation
        try {
            setIsCreating(true);

            await db.workFlows.put({
                id: newId,
                name: formatedName,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })
            toast.success(`Workflow '${name}' created.`);
            router.push(`${route}/${formatedName}`); // Navigate using the formatted name

        }catch (e) {
            console.error("Error creating new workflow:", e);
            toast.error("Failed to create new workflow.");
        }finally {
            setIsCreating(false)
            setIsWorkflowsDialogOpen(false)
        }
    }, [workFlows])

    /**
     * Deletes a workflow entry from the database and updates the local state.
     * @param workflowId The ID of the workflow to delete.
     */
    const deleteWorkFlow = useCallback(async (workflowId: string) => {
        if (!workflowId) return;

        try {
            setIsDeleting(true);
            await db.workFlows.delete(workflowId);
            setWorkFlows(flows => flows.filter(flow => flow.id !== workflowId));
            toast.info("Workflow deleted successfully.");
        }catch (e) {
            console.error("Error deleting workflow:", e);
            toast.error("Failed to delete workflow.");
        }finally {
            setIsDeleting(false)
        }
    }, [workFlows])

    /**
     * Fetches all project nodes associated with a given workflow ID.
     * @param id The workflow ID.
     * @returns An array of WorkSpaceProjectInterface objects.
     */
    const getWorkflowProjects = useCallback(async (id: string) => {
        if (!id) return [];
        try {
            const dbProjects: WorkSpaceProjectInterface[] = await db.workSpaceProjects.where('project_id').equals(id).toArray()
            return dbProjects || []
        } catch (e) {
            console.error("Error fetching workflow projects:", e);
            return []; // Return an empty array on failure
        }
    }, [])

    // --- Node Configuration Functions (Ports) ---

    /**
     * Adds a new port to a specific node and persists the change.
     * @param newNode The node object to update.
     * @param port The port number to add.
     * @param setErrorMessage A state setter for displaying a local error message.
     */
    const addNodePort = useCallback(async (newNode: any, port: number, setErrorMessage: (value: string) => void) => {
        if (typeof port !== 'number' || isNaN(port) || port <= 0){
            setErrorMessage('Port must be a valid positive number.');
            return;
        }

        // Find the node and check for port existence locally first
        const currentNode = nodes.find(nd => nd.id === newNode.id);
        const portExists = currentNode?.data.ports.some((p: { port: number }) => p.port === port);

        if (portExists) {
            setErrorMessage(`Port ${port} already exists on this node.`);
            return;
        }

        // Optimistic UI update
        const updatedNodes = nodes.map(nd => {
            if (nd.id === newNode.id) {
                return {
                    ...nd,
                    data: {
                        ...nd.data,
                        // Ensure ports is an array before spreading
                        ports: [...(nd.data.ports || []), { port }]
                    }
                }
            }
            return nd
        })
        setNodes(updatedNodes);

        try {
            // Persist to database
            const newPortsList = [...(newNode.data.ports || []), { port }];
            await db.workSpaceProjects.put({
                id: newNode.id,
                name: newNode.data.name,
                ports: newPortsList, // Use the new list
                project_id: work_space_id as string,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })
            setErrorMessage(''); // Clear error on success
            toast.success(`Port ${port} added to ${newNode.data.name}.`);
        } catch (e) {
            console.error("Error adding node port:", e);
            toast.error("Failed to add port to node.");
            // NOTE: A real-world app would need to revert the optimistic state update here.
        }

    }, [nodes, work_space_id])

    /**
     * Removes a port from a specific node and persists the change.
     * @param nd The node object to update.
     * @param port The port object to remove.
     */
    const removePort  = useCallback(async (nd: any, port: any) => {
        const portValue = port.port; // Assuming port is an object { port: number }

        // Filter out the specific port object from the node's ports array
        const updatedPorts = nd.data.ports.filter((p: any) => p.port !== portValue);

        // Optimistic UI update
        setNodes(nodes.map(n => {
            if (n.id === nd.id) {
                return {
                    ...n,
                    data: {
                        ...n.data,
                        ports: updatedPorts
                    }
                }
            }
            return n;
        }))

        try {
            // Persist to database
            await db.workSpaceProjects.put({
                id: nd.id,
                name: nd.data.name,
                ports: updatedPorts,
                project_id: work_space_id as string,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })
            toast.info(`Port ${portValue} removed from ${nd.data.name}.`);
        } catch (e) {
            console.error("Error removing port:", e);
            toast.error("Failed to remove port.");
            // NOTE: A real-world app would need to revert the optimistic state update here.
        }
    }, [nodes, work_space_id])

    // --- Navigation Functions ---

    /**
     * Handles client-side navigation to a specific workspace ID.
     * @param id The ID of the workspace/workflow to navigate to.
     */
    const handleNavigate = useCallback((id: string) => {
        if (id) {
            router.push(`${route}/${id}`)
        }
    }, [router])


    // --- Context Value Memoization ---

    // Memoize the context value to prevent unnecessary re-renders of consumers
    const contextValue = useMemo(() => ({
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
        isConfigurationPanelOpen,
        setIsConfigurationPanelOpen,
        configPanelState,
        setConfigPanelState,
        nodesConfigs,
        setNodesConfigs,
        addNodePort,
        removePort,
    }), [
        nodes, edges, isUpdating, isLoading, isDialogOpen, handleNavigate, loadWorkSpaceProjects,
        addNewProjectNode, selectedWorkFlowNode, getLayoutedWorkSpaceElements, updateEdgeConnection,
        handleWorkSpaceEdgeDelete, loadWorkSpaceEdges, handleWorkSpaceNodeDelete, createNewWorkFlow,
        fetchAllWorkFlows, workFlows, isWorkflowsDialogOpen, isSidebarOpen, isCreating, isDeleting,
        deleteWorkFlow, getWorkflowProjects, isConfigurationPanelOpen, configPanelState, nodesConfigs,
        addNodePort, removePort, // Include all state and functions
    ]);

    return (
        <WorkSpaceContext.Provider value={contextValue}>
            {children}
        </WorkSpaceContext.Provider>
    )
}

// --- Custom Hook for Consumption ---

/**
 * Custom hook to consume the workspace state.
 * Throws an error if used outside of the WorkSpaceProvider to ensure correct usage.
 * @returns The memoized context value.
 */
export const useWorkFlowState = ()=> {
    const context = useContext(WorkSpaceContext)
    if (context === undefined) {
        // Essential error for developers: context must be available
        throw new Error('useWorkFlowState() must be wrapped within the WorkSpaceProvider')
    }
    return context
}