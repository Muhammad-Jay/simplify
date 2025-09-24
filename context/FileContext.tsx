'use client'
import {createContext, useContext, useMemo, useCallback, useEffect, useState} from 'react'
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

export type DeployPanelStateTypes = 'environmentVariable' | 'logs' | 'configurations' | 'settings'

const FileContext = createContext<any| undefined>(undefined)

const author_id = 'jsync4172004@gmail.com'
// const project_id = 'c15acf41-1bd7-4899-be74-7f70551e644c'
const defaultNodeColor = '#00bcff'
const defaultFolderNodeColor = '#00bcff'

export type GlobalMessageType = {
    type: 'error' | 'success' | 'warning' | '',
    message: string
}

export function GlobalFileProvider({
                                       children,
                                   }: {
    children: React.ReactNode;
}){
    const { project_id } = useParams()
    const params = useParams()

    const { selectedWorkFlowNode } = useWorkFlowState();
    const {
        containers,
        buildStatus,
        setIsComplete,
        socket,
    } = useSocket()

    const [projectDir, setProjectDir] = useState([]);
    const [projectId, setProjectId] = useState('')
    const [currentProjectId, setCurrentProjectId] = useState({
        id: '',
        name: '',
        workSpaceName: ''
    })
    const [rootFolder, setRootFolder] = useState('simplify');
    const [changedDir, setChangedDir] = useState([]);
    const [value, setValue] = useState(8000);
    const [query, setQuery] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [openBottomTabControlPanel, setOpenBottomTabControlPanel] = useState(false)
    const [isFileUpdating, setIsFileUpdating] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOnQuery, setIsOnQuery] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);
    const [edges, setEdges] = useState([]);
    const [deployState, setDeployState] = useState<DeployPanelStateTypes>('configurations')
    const [nodes, setNodes] = useState([]);
    const [layoutConfig, setLayoutConfig] = useState({
        nodeSep: 150,
        rankSep: 300
    })
    const [selectedNode, setSelectedNode] = useState<any>({});
    const [selectedFileNode, setSelectedFileNode] = useState<any>({});
    const [currentEditorNode, setCurrentEditorNode] = useState<any>({});
    const [editorContent, setEditorContent] = useState('');
    const [globalMessage, setGlobalMessage] = useState<GlobalMessageType>({ type: '', message: '' })
    const [panContextMenuOpen, setPanContextMenuOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDeployPanelOpen, setIsDeployPanelOpen] = useState(false);
    const [currentContainer, setCurrentContainer] = useState<any>({})
    const [fold, setFold] = useState({
        fold: false,
        path: ''
    });

    const router = useRouter();

    useEffect(() => {
        setProjectId(currentProjectId.id);
        loadFiles(currentProjectId.id)
    }, [currentProjectId]);

    useEffect(() => {
        try {
            if (currentProjectId.name && containers){
                const projectContainer = containers.filter(container => container?.Names.includes(currentProjectId?.id.toLowerCase()))
                if (projectContainer){
                    setCurrentContainer({...projectContainer[0]});
                }
                console.log(projectContainer)
            }
        }catch (e) {
            console.warn(e)
        }
    }, [currentProjectId, containers]);

    useEffect(() => {
        if (currentContainer && currentProjectId){
            if (currentContainer?.State === 'running'){
                socket.emit(socketEvents.startContainerOutput, currentProjectId?.id)
                return;
            }
        }
    }, [currentContainer]);

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
            setEdges([...generatedEdges])
        }, 1000)

        return () => clearTimeout(timeout);
    }, [nodes.length]);

    useEffect(() => {
        if (!globalMessage.message.trim()) return;
        if (globalMessage.type === 'success'){
            toast.success(<p className={'center text-xs text-green-400 font-semibold p-[5px] container-full rounded-sm'}>{globalMessage.message}</p>)
        }else if (globalMessage.type === 'warning'){
            toast.warning(<p className={'center text-xs text-yellow-400 font-semibold p-[5px] container-full rounded-sm'}>{globalMessage.message}</p>)
        }else {
            toast.error(<p className={'center text-xs text-red-400 font-semibold p-[5px] container-full rounded-sm'}>{globalMessage.message}</p>)
        }

        let timeout = setTimeout(() => setGlobalMessage({ type: '', message: '' }), 5000);

        return () => clearTimeout(timeout);
    }, [globalMessage]);

    useEffect(() => {
        if (fold.path){
            console.log(fold)
            collapseSubFolder()
        }
    }, [fold]);

    // useEffect(() => {
    //     if (!selectedNode)return;
    //     let timeout = setTimeout(() => highlightSubChildrenEdgesAndNodes(), 200);
    //
    //     return () => clearTimeout(timeout);
    // }, [selectedNode]);

    const results = useMemo(() => {
        try {
            setIsSearching(true)
            const formatedFiles = nodes.map(nds => ({ path: nds.data.label, code: nds.data.code }))
            // @ts-ignore
            return Fuss.go(query, formatedFiles, {
                keys: ['path', 'code'],
                includeMatches: true,
                threshold: 0,
            })
        }catch (e) {
            console.log(e)
            return []
        }finally {
            setIsSearching(false)
        }
    }, [nodes, query])

    const loadFiles = useCallback(async (id) => {
        //TODO: Make actual request to database for files and save to indexDB
        // () => {}
        // setIsLoaded(false)
        try {
            const dbFiles: FileInterface[] = await db.files.where('project_id').equals(id).toArray()
            if (!dbFiles) {
                console.log('no files from local storage, fetching files from database')
                // setFiles({})
            } else {
                const formatedNodes = dbFiles.map((file) => {
                    return {
                        id: file.id,
                        type: file.type === 'codeEditor' ? 'codeEditor' : 'folderNode',
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
                    };
                })

                const formatedFileData = formatedNodes.map((nds) => ({
                    type: nds.type === 'codeEditor' ? 'file' : 'folder',
                    [nds.type === 'codeEditor' ? 'content' : null]: nds.type === 'codeEditor' && nds.data.code,
                    name: nds.data.name,
                    fullPath: nds.data.label
                })) as mockFilesDataTypes[]

                const generatedEdges = generateEdges(formatedFileData)

                const layoutedNodes = getLayoutedElements(formatedNodes, generatedEdges, { direction: 'TB' });
                // const timeout = setTimeout(() => {
                setNodes([...layoutedNodes.nodes])
                setTimeout(() => {
                    setEdges([...layoutedNodes.edges])
                }, 600);
                // }, 400);
                setIsLoaded(true)
            }
        } catch (e) {
            throw new Error(e)
        } finally {
            setIsLoaded(true)
        }
    }, [nodes, edges, currentProjectId])

    const updateFileContent = async (filePath: string, code: string, type: string, name: string, )=> {
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
        }catch (e) {
            throw new Error(e)
        }finally {
            setIsFileUpdating(false)
        }
    }

    const addNewFile = async (filePath: string, pathName: string, isFile: boolean, nestedFolders: mockFilesDataTypes[]) => {
        try {
            setIsFileUpdating(true)
            const fullPath = `${filePath}/${pathName}`

            if (nestedFolders && !isFile){
                const formatedNestedFolders = nestedFolders.map(nsf => {
                    return {
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
                           onCodeChange: (nodeId: string, newCode: string) =>
                               console.log(`${nodeId} updated:`, newCode)
                       }
                   }
               })

                setNodes(prev => [...prev, ...formatedNestedFolders])

                nestedFolders.map(async nsf => {
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
                    return;
                })
                return;
            }

            setNodes(nds => [...nds, {
                id: fullPath,
                type: isFile ? 'codeEditor' : 'folderNode',
                position: {x: Math.random() * 600, y: Math.random() * 600},
                data: {
                    label: fullPath,
                    name: pathName,
                    isVisible: true,
                    color: defaultNodeColor,
                    code: '',
                    language: 'typescript',
                    isActive: true,
                    onCodeChange: (nodeId: string, newCode: string) =>
                        console.log(`${nodeId} updated:`, newCode)
                }
            }])

            await db.files.put({
                id: fullPath,
                path: fullPath,
                code: '',
                type: isFile ? 'codeEditor' : 'folderNode',
                name: pathName,
                project_id: currentProjectId.id,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })
        }catch (e) {
            throw new Error(e)
        }finally {
            setIsFileUpdating(false)
        }
    }

    const addRootFolder = useCallback(async (name: string, id: string) => {
        setRootFolder(name)
        setNodes([{
            id: name,
            type: 'folderNode',
            position: {x: Math.random() * 600, y: Math.random() * 600},
            data: {
                label: name,
                name: name,
                isVisible: true,
                color: defaultNodeColor,
                code: '',
                language: 'typescript',
                isActive: true,
                onCodeChange: (nodeId: string, newCode: string) =>
                    console.log(`${nodeId} updated:`, newCode)
            }
        }])

        await db.files.put({
            id: name,
            path: name,
            code: '',
            type: 'folderNode',
            name: name,
            project_id: id,
            author_id,
            created_At: Date.now(),
            updated_At: Date.now()
        })
    }, [])

    const handleNodeDelete = useCallback(async (param: any[]) => {
        try {
            setIsDeleting(true)
            for (const nds of param) {
                nodes.filter(nd => nd.id.startsWith(nds.id + '/')).map(async n => {
                    setNodes(nods => nods.filter(ns => ns.id !== n.id))
                    await db.files.delete(n.id)
                })
                await db.files.delete(nds.id)
            }
        }catch (e) {
            console.log(e)
        }finally {
            setIsDeleting(false)
        }
    }, [nodes])

    const handleEdgeDelete = async (param: any[]) => {
        try {
            for (const edg of param) {
                console.log(edg)
                await db.edges.delete(edg.id)
            }
        }catch (e) {
            console.log(e)
        }
    }

    const highlightSubChildrenEdgesAndNodes = useCallback(() => {
        const folderPath = selectedNode ? selectedNode?.data?.label : null;

        if (folderPath && selectedNode){
            setEdges(edgs => edgs.map((edg) => ({
                ...edg,
                animated: true,
                style: {
                    ...edg.style,
                    strokeWidth: edg.target.startsWith(folderPath + '/') && selectedNode && selectedNode.type === 'folderNode' ? 4 : 2,
                    strokeDasharray: edg.target.startsWith(folderPath + '/') && selectedNode && selectedNode.type === 'folderNode' ? '10 10' : '0',
                    stroke: edg.target.startsWith(folderPath + '/') && selectedNode && selectedNode.type === 'folderNode' ? '#00ff4e' : '#ffffff'
                }
            })))

            setNodes(nds => nds.map(nd => ({
                ...nd,
                data: {
                    ...nd.data,
                    color: selectedNode && nd.data.label.startsWith(selectedNode?.data?.label) ? '#00ff4e' : defaultNodeColor
                }
            })))
        }
        return;
    }, [nodes])

    const handlePanClick = useCallback(() => {
        setOpenBottomTabControlPanel(false);

        setIsDeployPanelOpen(false);
        setNodes(nds => nds.map(nd => ({
            ...nd,
            data: {
                ...nd.data,
                color: nd.type === 'folderNode' ? defaultFolderNodeColor : defaultNodeColor,
            },
            selected: false
        })));
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
        setSelectedNode({});
    }, [nodes])

    const collapseSubFolder = () => {
        if (fold.fold){
            const formatedNodes = nodes.map((node) => {
                if (node.data.label.startsWith(fold.path + '/')){
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            isVisible: false
                        }
                    }
                }
                return node
            })
            setEdges(prev => prev.map((flowEdge) => ({
                ...flowEdge,
                style: {
                    ...flowEdge.style,
                    opacity: flowEdge.target.startsWith(fold.path + '/') ? 0 : flowEdge.style.opacity
                }
            })))
            setNodes([...formatedNodes])
        }else {
            const formatedNodes = nodes.map((node) => {
                if (node.data.label.startsWith(fold.path + '/')){
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            isVisible: true
                        }
                    }
                }
                return node
            })
            setEdges(prev => prev.map((flowEdge) => ({
                ...flowEdge,
                style: {
                    ...flowEdge.style,
                    opacity: flowEdge.target.startsWith(fold.path + '/') ? 1 : flowEdge.style.opacity
                }
            })))
            setNodes([...formatedNodes])
        }
    }

    const getLayoutedElements = useCallback((layoutNodes: any, layoutEdges: any, options: any) => {
        const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

        const graphRankSep = layoutNodes.length > 30 ? 800 : layoutNodes.length > 20 ? 500 : layoutNodes.length > 10 ? 300 : 400;
        const graphNodeSep = layoutNodes.length > 30 ? 350 : layoutNodes.length > 20 ? 250 : layoutNodes.length > 10 ? 150 : 150
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

    const resetNodeState = useCallback(() => {
        setNodes(nds => nds.map(nd => ({...nd, selected: false })));
    }, [nodes])

    return (
        <FileContext.Provider value={{
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
            setDeployState
        }}>
            {children}
        </FileContext.Provider>
    )

}

export const useFileState = ()=> {
    const context = useContext(FileContext)
    if (!context) {
        throw new Error('useEditorState() must be wrapped within the provider')
    }
    return context
}