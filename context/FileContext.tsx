'use client'

import {createContext, useContext, useMemo, useCallback, useEffect, useState, JSX} from 'react'
import {toast} from 'sonner';
import Fuss from 'fuzzysort'
import {db, FileInterface} from "@/lib/dexie/index.dexie";
import {mockFileData, mockFilesDataTypes} from "@/constants";
import {generateEdges} from "@/utils/flow/edge";
import Dagre from '@dagrejs/dagre'
import {useRouter} from 'next/navigation'
import { useParams } from 'next/navigation'
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import {useSocket} from "@/context/SocketContext";
import {socketEvents} from "@/lib/socket/events";

// --- Type Definitions ---

/** Defines the possible views for the deployment panel. */
export type DeployPanelStateTypes = 'environmentVariable' | 'logs' | 'overview' | 'settings' | 'advance'

/** Defines the structure for global messages (toasts/notifications). */
export type GlobalMessageType = {
    type: 'error' | 'success' | 'warning' | 'info' | '',
    message: string
}

/** Defines the structure for project configuration settings. */
export type ConfigTypes = {
    useCurrentFlow: boolean;
    sourceURL?: string;
    environment: 'Production' | 'Development';
    ports?: any[];
    buildCommand: string;
    runTime: string;
}

/** Interface for React Flow node data used in this context. */
interface FileNodeData {
    label: string;
    name: string;
    isVisible: boolean;
    color: string;
    code?: string;
    language: string;
    isActive: boolean;
    onCodeChange: (nodeId: string, newCode: string) => void;
}

/** Interface for the React Flow node structure. */
interface FileNode {
    id: string;
    type: 'codeEditor' | 'folderNode' | string;
    position: { x: number; y: number };
    data: FileNodeData;
    selected?: boolean;
}

/** Interface for the current project state object. */
interface CurrentProjectState {
    id: string;
    name: string;
    workSpaceName: string;
}

/** Interface for the layout configuration. */
interface LayoutConfig {
    nodeSep: number;
    rankSep: number;
}

/** Interface for the fold state. */
interface FoldState {
    fold: boolean;
    path: string;
}

/** Interface for the current container details. */
interface CurrentContainer {
    Names?: string[];
    State?: string;
    [key: string]: any;
}

// --- Context Definition ---

const FileContext = createContext<any| undefined>(undefined)

// --- Constants ---

const author_id = 'jsync4172004@gmail.com'
const defaultNodeColor = '#00bcff'
const defaultFolderNodeColor = '#00bcff'

// --- Provider Component ---

export function GlobalFileProvider({
                                       children,
                                   }: {
    children: React.ReactNode;
}){
    // --- Hooks and Router Setup ---

    const { project_id, work_space_id } = useParams()
    const router = useRouter();

    // Context consumers
    const { selectedWorkFlowNode, workFlows, fetchAllWorkFlows } = useWorkFlowState();
    const {
        containers,
        socket,
        updateProjectFlow,
        setIsComplete,
        pushedFiles,
        setBuildProcess
    } = useSocket();

    // --- State Management: Core Data ---

    const [nodes, setNodes] = useState<FileNode[]>([]); // All file/folder nodes
    const [edges, setEdges] = useState<any[]>([]); // Edges for React Flow
    const [projectDir, setProjectDir] = useState<any[]>([]);
    const [changedDir, setChangedDir] = useState<any[]>([]);
    const [currentNodes, setCurrentNodes] = useState<FileNode[]>([]); // Nodes for the currently displayed directory
    const [editorContent, setEditorContent] = useState<string>(''); // Content of the active file editor

    // --- State Management: UI/Flags ---

    const [projectId, setProjectId] = useState<string>('')
    const [currentProjectId, setCurrentProjectId] = useState<CurrentProjectState>({
        id: '',
        name: '',
        workSpaceName: ''
    })
    const [rootFolder, setRootFolder] = useState<string>('simplify');
    const [isFileUpdating, setIsFileUpdating] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(true); // For initial file loading
    const [globalMessage, setGlobalMessage] = useState<GlobalMessageType>({ type: '', message: '' })
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [openBottomTabControlPanel, setOpenBottomTabControlPanel] = useState<boolean>(true)
    const [panContextMenuOpen, setPanContextMenuOpen] = useState<boolean>(false);

    // --- State Management: Searching ---

    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isOnQuery, setIsOnQuery] = useState<boolean>(false); // Flag for if a search is active

    // --- State Management: Node Selection/Focus ---

    const [currentFilePath, setCurrentFilePath] = useState<string>('') // Path of the currently focused folder/file
    const [selectedNode, setSelectedNode] = useState<any>({}); // The React Flow node currently clicked
    const [selectedFileNode, setSelectedFileNode] = useState<any>({}); // The file node selected in the editor panel
    const [currentEditorNode, setCurrentEditorNode] = useState<any>({}); // The node whose code is currently in the editor
    const [currentSelectedNode, setCurrentSelectedNode] = useState<any>({}) // Used in calculation logic
    const [fold, setFold] = useState<FoldState>({ // State for collapsing/unfolding folders
        fold: false,
        path: ''
    });

    // --- State Management: Deployment/Container ---

    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isDeployPanelOpen, setIsDeployPanelOpen] = useState<boolean>(false);
    const [deployState, setDeployState] = useState<DeployPanelStateTypes>('overview')
    const [containerName, setContainerName] = useState<string>('')
    const [currentContainer, setCurrentContainer] = useState<CurrentContainer>({})
    const [value, setValue] = useState<number>(8000); // Port value?
    const [config, setConfig] = useState<ConfigTypes>({
        useCurrentFlow: true,
        sourceURL: '' ,
        environment: 'Production',
        ports: [],
        buildCommand: '',
        runTime: ''
    })
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({ // Dagre layout configuration
        nodeSep: 150,
        rankSep: 300
    })

    // --- Effects ---

    /** Initial load effect based on URL param. */
    useEffect(() => {
        if (project_id) {
            setProjectId(currentProjectId.id);
            loadFiles(project_id);
        }
    }, [project_id]);


    /** Container and Workflow monitoring. Updates container info on changes. */
    useEffect(() => {
        try {
            fetchAllWorkFlows()
            if (currentProjectId.workSpaceName && containers && workFlows.length > 0){
                const currentWorkFlow = workFlows.find(wf => wf.name === currentProjectId.workSpaceName);

                if (!currentWorkFlow) {
                    return;
                }
                // Construct a unique container name based on workflow and project IDs
                const projectName = `${currentWorkFlow.name.toLowerCase()}-${currentWorkFlow.id.toLowerCase()}-${currentProjectId.id.toLowerCase()}`;
                setContainerName(projectName)

                const projectContainer = containers.find((container: any) => container?.Names?.includes(`/${projectName}`))

                if (projectContainer){
                    setCurrentContainer(projectContainer);
                }
            }
        }catch (e) {
            console.warn('Error monitoring container/workflow state:', e)
        }
    }, [currentProjectId, containers, workFlows]);

    /** Recalculates and updates `currentNodes` (the displayed directory view) when directory changes. */
    useEffect(() => {
        // Only run if a folder node is selected and we have a path
        if(!currentSelectedNode || currentSelectedNode?.type !== 'folderNode' || !currentFilePath) return;

        const calculatedNodes = calculateNodes(nodes, currentFilePath);
        const formatedFileData = calculatedNodes.map((nds) => ({
            type: nds.type === 'codeEditor' ? 'file' : 'folder',
            content: nds.type === 'codeEditor' ? nds.data.code : undefined,
            name: nds.data.name,
            fullPath: nds.data.label
        })) as mockFilesDataTypes[]

        const generatedEdges = generateEdges(formatedFileData)
        const layoutedNodes = getLayoutedElements(calculatedNodes, generatedEdges, { direction: 'TB' });

        setCurrentNodes(layoutedNodes.nodes)
        setEdges(layoutedNodes.edges)
    }, [currentFilePath, currentSelectedNode]);

    /** Updates the displayed directory view (`currentNodes`) when the full list of `nodes` changes. */
    useEffect(() => {
        const calculatedNodes = calculateNodes(nodes, currentFilePath);
        const formatedFileData = calculatedNodes.map((nds) => ({
            type: nds.type === 'codeEditor' ? 'file' : 'folder',
            content: nds.type === 'codeEditor' ? nds.data.code : undefined,
            name: nds.data.name,
            fullPath: nds.data.label
        })) as mockFilesDataTypes[]

        const generatedEdges = generateEdges(formatedFileData)
        const layoutedNodes = getLayoutedElements(calculatedNodes, generatedEdges, { direction: 'TB' });

        setCurrentNodes(layoutedNodes.nodes)
        setEdges(layoutedNodes.edges)
    }, [nodes]);

    /** Handles file changes pushed from the socket (e.g., from a deployment process). */
    useEffect(() => {
        if (pushedFiles && pushedFiles.length > 0){
            updateProjectFlow(pushedFiles) // Propagates changes back to the socket context
            loadFiles(currentProjectId.id) // Reload files to reflect changes
        }
    }, [pushedFiles]);

    /** Updates current container on `currentProjectId` or `containers` change. (Redundant with the earlier effect, but kept for adherence). */
    useEffect(() => {
        try {
            if (currentProjectId.name && containers){
                const projectContainer = containers.find((container: any) => container?.Names?.includes(currentProjectId.id.toLowerCase()))
                if (projectContainer){
                    setCurrentContainer(projectContainer);
                }
            }
        }catch (e) {
            console.warn('Error updating current container:', e)
        }
    }, [currentProjectId, containers]);

    /** Handles container logging/output when the container is running. */
    useEffect(() => {
        if (currentContainer && currentProjectId.id){
            if (currentContainer.State === 'running'){
                // Start listening for logs
                socket.emit(socketEvents.startContainerOutput, currentProjectId.id)
                socket.on(socketEvents.logsRun, (data: any) => {
                    setBuildProcess(prev => ({
                        ...prev,
                        container_outputs: {
                            ...prev.container_outputs,
                            logs: [...prev.container_outputs.logs, { message: data }]
                        }
                    }))
                })
            }
        }
        // Clean up socket listener on unmount or dependency change
        return () => {
            socket.off(socketEvents.logsRun);
        };
    }, [currentContainer]);

    /** Recalculates edges after node changes to maintain accurate connections. */
    useEffect(() => {
        const timeout = setTimeout(() => {
            const formatedFileData = nodes.map((nds) => {
                if (nds.type === 'codeEditor'){
                    return {
                        type: 'file',
                        content: nds.data.code,
                        name: nds.data.name,
                        fullPath: nds.data.label
                    }
                }
                return {
                    type: 'folder',
                    name: nds?.data?.name || '',
                    fullPath: nds.data.label
                }
            }) as mockFilesDataTypes[]
            const generatedEdges = generateEdges(formatedFileData)
            setEdges(generatedEdges)
        }, 1000)

        return () => clearTimeout(timeout);
    }, [nodes.length]);

    /** Global message (toast) handler. */
    useEffect(() => {
        if (!globalMessage.message.trim()) return;

        const style = 'center text-xs font-semibold p-[5px] container-full rounded-sm';
        let content: JSX.Element;

        if (globalMessage.type === 'success'){
            content = <p className={`${style} text-green-400`}>{globalMessage.message}</p>
            toast.success(content)
        }else if (globalMessage.type === 'warning'){
            content = <p className={`${style} text-yellow-400`}>{globalMessage.message}</p>
            toast.warning(content)
        }else if (globalMessage.type === 'info'){
            content = <p className={`${style} text-foreground/90`}>{globalMessage.message}</p>
            toast.info(content)
        }else {
            content = <p className={`${style} text-red-400`}>{globalMessage.message}</p>
            toast.error(content)
        }

        const timeout = setTimeout(() => setGlobalMessage({ type: '', message: '' }), 5000);
        return () => clearTimeout(timeout);
    }, [globalMessage]);

    const getLayoutedElements = useCallback((layoutNodes: any[], layoutEdges: any[], options: { direction: string }) => {
        const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

        // Dynamic spacing calculation based on node count
        const nodeCount = layoutNodes.length;
        const graphRankSep = nodeCount > 30 ? 800 : nodeCount > 20 ? 500 : nodeCount > 10 ? 300 : 400;
        const graphNodeSep = nodeCount > 30 ? 350 : nodeCount > 20 ? 250 : nodeCount > 10 ? 150 : 150

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
                // Adjust position to center the React Flow node
                const x = position.x - (node.measured?.width ?? 300) / 2;
                const y = position.y - (node.measured?.height ?? 150) / 2;

                return { ...node, position: { x, y}};
            }),
            edges: layoutEdges,
        }
    }, [])

    // --- Memoized Values and Search ---

    /** Memoized fuzzy search results using `Fuss` on file path and code content. */
    const results = useMemo(() => {
        try {
            if (!query) return [];
            setIsSearching(true)
            const formatedFiles = nodes.map(nds => ({ path: nds.data.label, code: nds.data.code }))
            // @ts-ignore
            return Fuss.go(query, formatedFiles, {
                keys: ['path', 'code'],
                includeMatches: true,
                threshold: 0,
            })
        }catch (e) {
            console.error('Fuss search error:', e)
            return []
        }finally {
            setIsSearching(false)
        }
    }, [nodes, query])

    /**
     * Calculates the nodes that are direct children of a given `selectedPath`.
     * This defines the view for the current directory level.
     * @param oldNodes The complete list of all nodes.
     * @param selectedPath The full path of the parent folder to display children for.
     * @returns An array of the parent node and its direct children.
     */
    const calculateNodes = useCallback((oldNodes: FileNode[], selectedPath: string): FileNode[] => {
        if (!selectedPath || typeof selectedPath !== 'string') {
            return [];
        }

        const parentPath = selectedPath.replace(/\/$/, ''); // Remove trailing slash
        const parentNode = oldNodes.find(node => node.data?.label === parentPath);

        if (!parentNode) {
            return [];
        }

        const resultNodes: FileNode[] = [parentNode];
        const pathSegments = parentPath.split('/').filter(s => s.length > 0);
        const parentDepth = pathSegments.length;
        const childrenPrefix = parentPath + '/';

        const directChildren = oldNodes.filter(node => {
            const childPath = node.data.label;

            if (childPath === parentPath) {
                return false;
            }

            if (!childPath.startsWith(childrenPrefix)) {
                return false;
            }

            const childDepth = childPath.split('/').filter(s => s.length > 0).length;

            return childDepth === parentDepth + 1;
        });

        // Sort folders before files, then alphabetically by name
        directChildren.sort((a, b) => {
            if (a.type === 'folderNode' && b.type === 'codeEditor') return -1;
            if (a.type === 'codeEditor' && b.type === 'folderNode') return 1;
            return a.data.name.localeCompare(b.data.name);
        });

        return resultNodes.concat(directChildren);
    }, [])

    // --- Core Data Logic Functions ---

    /**
     * Loads files from IndexedDB (Dexie) for the current project ID, formats them as React Flow nodes,
     * calculates initial layout, and sets the state.
     * @param id The project ID (work_space_id) to load files for.
     */
    const loadFiles = useCallback(async (id: string | string[] | undefined) => {
        if (!id || Array.isArray(id)) return;
        setIsLoaded(false)

        try {
            const dbFiles: FileInterface[] = await db.files.where('project_id').equals(id).toArray()
            if (dbFiles.length === 0) {
                console.log('No files found in local storage.')
                setNodes([]);
                setEdges([]);
                return;
            }

            // 1. Format DB data into React Flow nodes
            const formatedNodes: FileNode[] = dbFiles.map((file) => ({
                id: file.id,
                type: file.type, // 'codeEditor' or 'folderNode'
                position: {x: Math.random() * 600, y: Math.random() * 600},
                data: {
                    label: file.path,
                    name: file.name,
                    isVisible: true,
                    color: file.type === 'folderNode' ? defaultFolderNodeColor : defaultNodeColor,
                    code: file.type === 'codeEditor' ? file.code : undefined,
                    language: 'typescript',
                    isActive: true,
                    onCodeChange: (nodeId: string, newCode: string) =>
                        console.log(`${nodeId} updated:`, newCode)
                }
            }));

            // 2. Determine the root folder name from the first file/node path
            const projectName = formatedNodes[0]?.id.split('/').filter(Boolean)[0];
            if (projectName) setCurrentFilePath(projectName);

            // 3. Prepare data for edge generation
            const formatedFileData = formatedNodes.map((nds) => ({
                type: nds.type === 'codeEditor' ? 'file' : 'folder',
                content: nds.type === 'codeEditor' ? nds.data.code : undefined,
                name: nds.data.name,
                fullPath: nds.data.label
            })) as mockFilesDataTypes[]

            const generatedEdges = generateEdges(formatedFileData)

            // 4. Apply auto-layout
            const layoutedNodes = getLayoutedElements(formatedNodes, generatedEdges, { direction: 'TB' });

            // 5. Update state
            setNodes(layoutedNodes.nodes)

            // Calculate the initial displayed directory (root)
            const calc = calculateNodes(layoutedNodes.nodes, projectName);
            setCurrentNodes(calc)

            // Delay edge setting slightly for visual smoothness
            setTimeout(() => {
                setEdges(layoutedNodes.edges)
            }, 600);

        } catch (e) {
            console.error('Error in loadFiles:', e)
            setGlobalMessage({ type: 'error', message: 'Failed to load project files.'})
        } finally {
            setIsLoaded(true)
        }
    }, [getLayoutedElements, calculateNodes])



    // --- File/Folder Manipulation Functions ---

    /**
     * Updates the code content of a specific file node in IndexedDB.
     * @param filePath The full path ID of the file.
     * @param code The new content of the file.
     * @param type The node type ('codeEditor').
     * @param name The file name.
     */
    const updateFileContent = async (filePath: string, code: string, type: string, name: string)=> {
        setIsFileUpdating(true)
        try {
            await db.files.put({
                id: filePath,
                path: filePath,
                code,
                type,
                name,
                project_id: currentProjectId.id,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })
            // Update local nodes state if needed (often handled by React Flow's onCodeChange, but good for Dexie sync)
        }catch (e) {
            console.error('Error updating file content:', e)
            setGlobalMessage({ type: 'error', message: 'Failed to save file changes.'})
        }finally {
            setIsFileUpdating(false)
        }
    }

    /**
     * Adds a new file or folder to the workspace and persists it to IndexedDB.
     * Handles creation of multiple nested folders if necessary.
     * @param filePath The path of the parent folder.
     * @param pathName The name of the new file/folder.
     * @param isFile True if adding a file, false if adding a folder.
     * @param nestedFolders Array of intermediate nested folders to create (optional).
     */
    const addNewFile = async (filePath: string, pathName: string, isFile: boolean, nestedFolders: mockFilesDataTypes[] = []) => {
        setIsFileUpdating(true)
        try {
            if (nestedFolders.length > 0 && !isFile){
                // Handle creation of multiple intermediate folders
                const formatedNestedNodes: FileNode[] = nestedFolders.map(nsf => ({
                    id: nsf.fullPath,
                    type: 'folderNode',
                    position: {x: Math.random() * 600, y: Math.random() * 600},
                    data: {
                        label: nsf.fullPath,
                        name: nsf.name,
                        isVisible: true,
                        color: defaultNodeColor,
                        code: undefined,
                        language: 'typescript',
                        isActive: true,
                        onCodeChange: () => {}
                    }
                }))

                setNodes(prev => [...prev, ...formatedNestedNodes])

                // Persist all new nested folders
                for (const nsf of nestedFolders) {
                    await db.files.put({
                        id: nsf.fullPath,
                        path: nsf.fullPath,
                        code: '',
                        type: 'folderNode',
                        name: nsf.name,
                        project_id: currentProjectId.id,
                        author_id,
                        created_At: Date.now(),
                        updated_At: Date.now()
                    })
                }
                setGlobalMessage({ type: 'success', message: `Folders created: ${nestedFolders.map(n => n.name).join(', ')}`})
                return;
            }

            const fullPath = `${filePath.replace(/\/$/, '')}/${pathName}`

            // Handle single file or direct folder creation
            const newNode: FileNode = {
                id: fullPath,
                type: isFile ? 'codeEditor' : 'folderNode',
                position: {x: Math.random() * 600, y: Math.random() * 600},
                data: {
                    label: fullPath,
                    name: pathName,
                    isVisible: true,
                    color: defaultNodeColor,
                    code: isFile ? '' : undefined,
                    language: 'typescript',
                    isActive: true,
                    onCodeChange: () => {}
                }
            }

            setNodes(nds => [...nds, newNode])

            await db.files.put({
                id: fullPath,
                path: fullPath,
                code: isFile ? '' : undefined,
                type: isFile ? 'codeEditor' : 'folderNode',
                name: pathName,
                project_id: currentProjectId.id,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })
            setGlobalMessage({ type: 'success', message: `${isFile ? 'File' : 'Folder'} '${pathName}' added successfully.`})
        }catch (e) {
            console.error('Error adding new file:', e)
            setGlobalMessage({ type: 'error', message: 'Failed to add new file/folder.'})
        }finally {
            setIsFileUpdating(false)
        }
    }

    /**
     * Initializes the root folder for a new project.
     * @param name The name of the root folder.
     * @param id The project ID.
     */
    const addRootFolder = useCallback(async (name: string, id: string) => {
        setRootFolder(name)
        const rootNode: FileNode = {
            id: name,
            type: 'folderNode',
            position: {x: Math.random() * 600, y: Math.random() * 600},
            data: {
                label: name,
                name: name,
                isVisible: true,
                color: defaultNodeColor,
                code: undefined,
                language: 'typescript',
                isActive: true,
                onCodeChange: () => {}
            }
        }
        setNodes([rootNode])
        setCurrentNodes([rootNode]) // Set root as the initial view

        await db.files.put({
            id: name,
            path: name,
            code: undefined,
            type: 'folderNode',
            name: name,
            project_id: id,
            author_id,
            created_At: Date.now(),
            updated_At: Date.now()
        })
    }, [])

    /**
     * Deletes a node (file or folder) and all its nested children from state and IndexedDB.
     * @param param Array of nodes to delete.
     */
    const handleNodeDelete = useCallback(async (param: any[]) => {
        try {
            setIsDeleting(true)
            let deleteCount = 0;
            for (const nds of param) {
                // Find and delete all children nodes (recursive delete via path prefix)
                nodes.filter(nd => nd.id.startsWith(nds.id + '/')).map(async n => {
                    setNodes(nods => nods.filter(ns => ns.id !== n.id))
                    await db.files.delete(n.id)
                    deleteCount++;
                })
                // Delete the parent node itself
                setNodes(nods => nods.filter(ns => ns.id !== nds.id))
                await db.files.delete(nds.id)
                deleteCount++;
            }
            setGlobalMessage({ type: 'success', message: `${deleteCount} item(s) deleted.`})
        }catch (e) {
            console.error('Error deleting node:', e)
            setGlobalMessage({ type: 'error', message: 'Failed to delete file/folder.'})
        }finally {
            setIsDeleting(false)
        }
    }, [nodes])

    /**
     * Deletes edges from IndexedDB.
     * @param param Array of edges to delete.
     */
    const handleEdgeDelete = async (param: any[]) => {
        try {
            for (const edg of param) {
                await db.edges.delete(edg.id)
            }
            setGlobalMessage({ type: 'success', message: `${param.length} edge(s) deleted.`})
        }catch (e) {
            console.error('Error deleting edge:', e)
            setGlobalMessage({ type: 'error', message: 'Failed to delete edge.'})
        }
    }

    // --- UI/Interaction Functions ---

    /** Sets the current selected node and updates the file path to trigger a directory view change. */
    const handleCurrentNode = useCallback(() => {
        setCurrentSelectedNode(selectedNode);
        setCurrentFilePath(selectedNode?.id);
    }, [selectedNode])

    /** Highlights the edges and nodes that are sub-children of the currently selected folder node. */
    const highlightSubChildrenEdgesAndNodes = useCallback(() => {
        const folderPath = selectedNode?.data?.label || null;

        if (folderPath && selectedNode.type === 'folderNode'){
            // Highlight edges pointing to children
            setEdges(edgs => edgs.map((edg) => ({
                ...edg,
                animated: true,
                style: {
                    ...edg.style,
                    strokeWidth: edg.target.startsWith(folderPath + '/') ? 4 : 2,
                    strokeDasharray: edg.target.startsWith(folderPath + '/') ? '10 10' : '0',
                    stroke: edg.target.startsWith(folderPath + '/') ? '#00ff4e' : '#ffffff'
                }
            })))

            // Highlight sub-children nodes
            setNodes(nds => nds.map(nd => ({
                ...nd,
                data: {
                    ...nd.data,
                    // Highlight the selected node and all nodes starting with its path
                    color: nd.data.label.startsWith(folderPath) ? '#00ff4e' : defaultNodeColor
                }
            })))
        }
        // If not a folder or no node selected, reset styling is done via handlePanClick or state dependency
    }, [selectedNode])

    /** Resets the UI state when clicking on the canvas (pan). */
    const handlePanClick = useCallback(() => {
        setOpenBottomTabControlPanel(false);
        setIsDeployPanelOpen(false);

        // Reset all nodes to default color and unselected
        setCurrentNodes(nds => nds.map(nd => ({
            ...nd,
            data: {
                ...nd.data,
                color: nd.type === 'folderNode' ? defaultFolderNodeColor : defaultNodeColor,
            },
            selected: false
        })));

        // Reset all edges to default style and unselected
        setEdges(edgs => edgs.map(edg => ({
            ...edg,
            animated: false,
            style: {
                ...edg.style,
                stroke: '#ffffff',
                strokeWidth: 2,
                strokeDasharray: '0',
            },
            selected: false
        })));
        setSelectedNode({}); // Clear selected node
    }, [])

    /** Toggles the visibility of sub-nodes and associated edges based on the `fold` state. */
    const collapseSubFolder = () => {
        if (!fold.path) return;
        const prefix = fold.path + '/';

        setNodes(prevNodes => prevNodes.map((node) => {
            if (node.data.label.startsWith(prefix)){
                return {
                    ...node,
                    data: {
                        ...node.data,
                        isVisible: !fold.fold // Flip visibility
                    }
                }
            }
            return node
        }))

        setEdges(prevEdges => prevEdges.map((flowEdge) => ({
            ...flowEdge,
            style: {
                ...flowEdge.style,
                // Set opacity to 0 (hidden) or 1 (visible)
                opacity: flowEdge.target.startsWith(prefix) ? (fold.fold ? 0 : 1) : flowEdge.style.opacity
            }
        })))
    }

    /**
     * Applies the Dagre automatic graph layout algorithm.
     * @param layoutNodes The nodes to layout.
     * @param layoutEdges The edges to consider for layout
     * @param options Dagre layout options.
     * @returns An object containing the layouted nodes and the original edges.
     */

    /** Unselects all nodes in the state (used for cleanup). */
    const resetNodeState = useCallback(() => {
        setNodes(nds => nds.map(nd => ({...nd, selected: false })));
    }, [])

    // --- Context Value Memoization ---

    const contextValue = useMemo(() => ({
        nodes,
        setNodes,
        edges,
        currentProjectId,
        setCurrentProjectId,
        setEdges,
        isLoaded,
        projectDir,
        setProjectDir,
        changedDir,
        setChangedDir,
        selectedFileNode,
        selectedNode,
        setSelectedNode,
        setCurrentEditorNode,
        currentEditorNode,
        setSelectedFileNode,
        isFileUpdating,
        setIsFileUpdating,
        updateFileContent,
        addNewFile,
        loadFiles,
        editorContent,
        setEditorContent,
        projectId,
        setProjectId,
        query,
        setQuery,
        isSearching,
        setIsSearching,
        results,
        searchResults,
        setSearchResults,
        isOnQuery,
        setIsOnQuery,
        handleEdgeDelete,
        handleNodeDelete,
        highlightSubChildrenEdgesAndNodes,
        handlePanClick,
        collapseSubFolder,
        fold,
        setFold,
        layoutConfig,
        setLayoutConfig,
        rootFolder,
        setRootFolder,
        panContextMenuOpen,
        setPanContextMenuOpen,
        addRootFolder,
        globalMessage,
        isDeleting,
        getLayoutedElements,
        setGlobalMessage,
        openBottomTabControlPanel,
        setOpenBottomTabControlPanel,
        resetNodeState,
        isRunning,
        setIsRunning,
        value,
        setValue,
        setIsDeployPanelOpen,
        isDeployPanelOpen,
        currentContainer,
        setCurrentContainer,
        deployState,
        setDeployState,
        currentNodes,
        setCurrentNodes,
        currentFilePath,
        setCurrentFilePath,
        currentSelectedNode,
        setCurrentSelectedNode,
        calculateNodes,
        handleCurrentNode,
        config,
        setConfig,
        containerName
    }), [
        nodes, edges, currentProjectId, isLoaded, projectDir, changedDir, selectedFileNode, selectedNode,
        currentEditorNode, selectedFileNode, isFileUpdating, updateFileContent, addNewFile, loadFiles,
        editorContent, projectId, query, isSearching, results, searchResults, isOnQuery, handleEdgeDelete,
        handleNodeDelete, highlightSubChildrenEdgesAndNodes, handlePanClick, collapseSubFolder, fold,
        layoutConfig, rootFolder, panContextMenuOpen, addRootFolder, globalMessage, isDeleting,
        getLayoutedElements, openBottomTabControlPanel, resetNodeState, isRunning, value, isDeployPanelOpen,
        currentContainer, deployState, currentNodes, currentFilePath, currentSelectedNode, calculateNodes,
        handleCurrentNode, config, containerName
    ]);

    return (
        <FileContext.Provider value={contextValue}>
            {children}
        </FileContext.Provider>
    )

}

/**
 * Custom hook to consume the file context state.
 * @returns The file context value.
 */
export const useFileState = ()=> {
    const context = useContext(FileContext)
    if (!context) {
        throw new Error('useFileState() must be wrapped within the GlobalFileProvider')
    }
    return context
}