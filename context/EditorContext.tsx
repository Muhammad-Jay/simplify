'use client'
import {createContext, useCallback, useMemo, useContext, useState, useLayoutEffect, useEffect} from "react";
import {EditorFilesTypes, MetadataTypes, TemplateType} from "@/types";
import Fuss from 'fuzzysort'
import mockSandpackFiles from "@/constants"
import {db, Edges, FileInterface} from "@/lib/dexie/index.dexie"
import * as dck from 'dockerode'

const EditorContext = createContext<any| undefined>(undefined)

export type LeftSidebarStateType = 'File' | 'Dependencies' | 'Metadata' | 'WorkSpaceProjects' | ''

export type RightSidebarStateType = 'Preview' | 'Selected' | 'Documentation' | 'Run' | 'Build' | ''

export type LeftBottomSidebarStateType = 'BottomPanelLogs' | ''

export type ActualFile = {
    path: string,
    code: string
}

export function EditorProvider({
                                   children,
                                   sandpackFiles
                               }: {
    children: React.ReactNode;
    sandpackFiles?: any
}){
    const [isUpdating, setIsUpdating] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [selectedNode, setSelectedNode] = useState<any>({})
    const [openModel, setOpenModel] = useState(false)
    const [nodes, setNodes] = useState([])
    const [query, setQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [isOnQuery, setIsOnQuery] = useState(false)
    const [isOnFitView, setIsOnFitView] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [leftSidebarState, setLeftSidebarState] = useState<LeftSidebarStateType>('')
    const [rightSidebarState, setRightSidebarState] = useState<RightSidebarStateType>('')
    const [leftBottomSidebarState, setLeftBottomSidebarState] = useState<LeftBottomSidebarStateType>('')
    const [recentActiveNodes, setRecentActiveNodes] = useState([])
    const [files, setFiles] = useState<any>(mockSandpackFiles)
    const [actualFiles, setActualFiles] = useState<ActualFile[]>([])
    const [projectName, setProjectName] = useState('Untitled')
    const [openEditor, setOpenEditor] = useState(false)
    const [isBottomLogsRendererOpen, setIsBottomLogsRendererOpen] = useState(false);
    const [open, setOpen] = useState(false)
    const [fold, setFold] = useState({
        fold: false,
        path: ''
    })
    const author_id = 'jsync4172004@gmail.com'

    const results = useMemo(() => {
        try {
            setIsSearching(true)
            const formatedFiles = Object.entries(files).map(([path, code]) => ({ path, code }))
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
    }, [files, query])

    const formatFiles = () => {
        const obj = Object.entries(files).map(([path, code]: any) => ({ path, code }))
        setActualFiles([...obj]);
        console.log(actualFiles);
    }

    // Load all Files
    const loadFiles = useCallback(async (project_id?: string) => {
        // formatFiles()
        try {
            // const dbFiles: FileInterface[] = await db.files.where('project_id').equals('c15acf41-1bd7-4899-be74-7f70551e644c').toArray()
            // if (!dbFiles) {
            //     console.log('no files from local storage, fetching files from database')
            //     // setFiles({})
            // } else {
            //     setFiles({...Object.fromEntries(
            //             dbFiles.map(({path, code}) => [path, {code: code}])
            //         )})
            // }
        } catch (e) {
            throw new Error(e)
        } finally {
            setLoaded(true)
        }
    }, [])


    // Add file
    const addNewFile = async (filePath: string, pathName: string, project_id: string) => {
        try {
            setIsUpdating(true)
            const fullPath = pathName.startsWith('/') ? `${filePath}${pathName}` : `${filePath}/${pathName}`
            setFiles(prev => ({...prev, [fullPath]: { code: '' }}))
            // await db.files.put({
            //     id: fullPath,
            //     path: fullPath,
            //     code: '',
            //     project_id,
            //     author_id,
            //     created_At: Date.now(),
            //     updated_At: Date.now()
            // })
        }catch (e) {
            throw new Error(e)
        }finally {
            setIsUpdating(false)
        }
    }

    const setCurrentNode = (data: any) => {
        setSelectedNode(data)
    }

    const handleRightSidebarState = (state: RightSidebarStateType) => {
        setRightSidebarState(prev => prev === state ? '' : state)
    }

    const handleLeftSidebarState = (state: LeftSidebarStateType) => {
        setLeftSidebarState(prev => prev === state ? '' : state)
    }

    const getRecentNodes = useCallback(async () => {
        const last = await db.recentActiveNodes.orderBy('updated_At').reverse().limit(10).toArray()

        if (last){
            setRecentActiveNodes(last);
        }else {
            console.log('no last active nodes')
        }
    }, [selectedNode])

    const updateRecentActiveNodes = async (node: any, project_id: string) => {
        try {
            const existingNode = recentActiveNodes.filter((recentNode) => recentNode.id === node.id)
            if (existingNode.length > 0) return;
            
            if(selectedNode){
                await db.recentActiveNodes.put({
                    pathName: selectedNode.id,
                    name: selectedNode.data.name,
                    project_id,
                    author_id,
                    created_At: Date.now(),
                    updated_At: Date.now()
                })
                getRecentNodes()
            }
        }catch (e) {
            console.log(e)
        }
    }

    const toggleFolder = (flowNodes: any, setFlowNodes: any, setEdges: any) => {
        if (fold.fold){
            const formatedNodes = flowNodes.map((node) => {
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
            setFlowNodes([...formatedNodes])
        }else {
            const formatedNodes = flowNodes.map((node) => {
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
            setFlowNodes([...formatedNodes])
        }
    }

    const highlightSubChildrenEdges = (setFlowEdges: any) => {
        const folderPath = selectedNode ? selectedNode.data.label : null;

        if (folderPath && selectedNode){
            setFlowEdges(prev => prev.map((flowEdge) => ({
                        ...flowEdge,
                        animated: true,
                        style: {
                            ...flowEdge.style,
                            strokeWidth: flowEdge.target.startsWith(folderPath + '/') && selectedNode.type === 'folderNode' ? 4 : 2,
                            strokeDasharray: flowEdge.target.startsWith(folderPath + '/') && selectedNode.type === 'folderNode' ? '10 10' : '0',
                            stroke: flowEdge.target.startsWith(folderPath + '/') && selectedNode.type === 'folderNode' ? '#d0ff00' : '#CCC'
                        }
                    })))
        }
        return;
    }

    const updateNode = useCallback(async (node: any, project_id: string) => {
        try {
            setIsUpdating(true)
            await db.nodes.put({
                id: node.id,
                node,
                project_id,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })

        }catch (e) {
            throw new Error(e)
        }finally {
            setIsUpdating(false)
        }
    }, [files, nodes])

    const updateEdge = useCallback(async (edge: any, project_id: string) => {
        try {
            await db.edges.put({
                id: edge.source,
                edge,
                project_id,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })

        }catch (e) {
            throw new Error(e)
        }finally {
            setIsUpdating(false)
        }
    }, [files, nodes])

    const loadEdges = useCallback(async (project_id) => {
        try {
            const dbEdges: Edges[]  = await db.edges.where('project_id').equals('c15acf41-1bd7-4899-be74-7f70551e644c').toArray()
            if (!dbEdges) return;
            return dbEdges.map((edg: Edges) => edg.edge);

        }catch (e) {
            console.log(e)
            return [];
        }finally {
            setIsUpdating(false)
        }
    }, [])

    const handleNodeDelete = async (param) => {
        // try {
        //     for (const nds of param) {
        //         const formatedFiles = Object.entries(files).map(([path, code]) => {
        //             if (path.startsWith(nds.data.label))return;
        //             return { path, code }
        //         })
        //
        //         setFiles({...Object.fromEntries(
        //                 formatedFiles.map(({path, code}: any) => [path, {code: code}])
        //             )})
        //         console.log(files)
        //         await db.nodes.delete(nds.id)
        //     }
        // }catch (e) {
        //     console.log(e)
        // }
    }

    const handleEdgeDelete = async (param) => {
        try {
            for (const edg of param) {
                await db.edges.delete(edg.id)
            }
        }catch (e) {
            console.log(e)
        }
    }

    return (
        <EditorContext.Provider value={{
            loadFiles,
            loadEdges,
            addNewFile,
            setCurrentNode,
            selectedNode,
            isUpdating,
            setIsUpdating,
            loaded,
            files,
            setFiles,
            leftSidebarState,
            handleLeftSidebarState,
            handleRightSidebarState,
            rightSidebarState,
            setOpenModel,
            openModel,
            results,
            query,
            setQuery,
            setNodes,
            nodes,
            setSearchResults,
            searchResults,
            isOnQuery,
            setIsOnQuery,
            isSearching,
            setIsOnFitView,
            isOnFitView,
            updateRecentActiveNodes,
            getRecentNodes,
            recentActiveNodes,
            setFold,
            fold,
            toggleFolder,
            highlightSubChildrenEdges,
            projectName,
            setProjectName,
            updateNode,
            updateEdge,
            openEditor,
            setOpenEditor,
            open,
            setOpen,
            handleEdgeDelete,
            handleNodeDelete,
            leftBottomSidebarState,
            setLeftBottomSidebarState,
            isBottomLogsRendererOpen,
            setIsBottomLogsRendererOpen,
        }}>
            {children}
        </EditorContext.Provider>
    )
}

export const useEditorState = ()=> {
    const context = useContext(EditorContext)
    if (!context) {
        throw new Error('useEditorState() must be wrapped within the provider')
    }
    return context
}