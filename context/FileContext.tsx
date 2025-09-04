'use client'
import {createContext, useContext, useMemo, useCallback, useEffect, useState} from 'react'
import {toast} from 'sonner';
import Fuss from 'fuzzysort'
import {db, FileInterface} from "@/lib/dexie/index.dexie";
import {mockFileData, mockFilesDataTypes} from "@/constants";
import {generateEdges} from "@/utils/flow/edge";
import {getLayoutedElements} from "@/components/EditorFlow/EditorFlow";

const FileContext = createContext<any| undefined>(undefined)

const author_id = 'jsync4172004@gmail.com'
const project_id = 'c15acf41-1bd7-4899-be74-7f70551e644c'
const defaultNodeColor = '#00bcff'
const defaultFolderNodeColor = '#0d86b1'

export type GlobalMessageType = {
    type: 'error' | 'success' | 'warning' | '',
    message: string
}

export function GlobalFileProvider({
                                       children,
                                   }: {
    children: React.ReactNode;
}){
    const [projectDir, setProjectDir] = useState([]);
    const [rootFolder, setRootFolder] = useState('simplify');
    const [changedDir, setChangedDir] = useState([]);
    const [query, setQuery] = useState('');
    const [isFileUpdating, setIsFileUpdating] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOnQuery, setIsOnQuery] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [selectedNode, setSelectedNode] = useState<any>({});
    const [selectedFileNode, setSelectedFileNode] = useState<any>({});
    const [currentEditorNode, setCurrentEditorNode] = useState<any>({});
    const [editorContent, setEditorContent] = useState('');
    const [globalMessage, setGlobalMessage] = useState<GlobalMessageType>({ type: '', message: '' })
    const [panContextMenuOpen, setPanContextMenuOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)
    const [fold, setFold] = useState({
        fold: false,
        path: ''
    });

    useEffect(() => {
        mockFileData.map(async (file) => {
            await db.files.put({
                id: file.fullPath,
                path: file.fullPath,
                code: file.content,
                type: file.type === 'file' ? 'codeEditor' : 'folderNode',
                name: file.name,
                project_id,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })
        })
        // const formatedNodes = mockFileData.map((file) => {
        //     return {
        //         id: file.fullPath,
        //         type: file.type === 'file' ? 'codeEditor' : 'folderNode',
        //         position: {x: Math.random() * 600, y: Math.random() * 600},
        //         data: {
        //             label: file.fullPath,
        //             name: file.name,
        //             isVisible: true,
        //             code: file.type === 'file' ? file.content : undefined,
        //             language: 'typescript',
        //             isActive: true,
        //             onCodeChange: (nodeId: string, newCode: string) =>
        //                 console.log(`${nodeId} updated:`, newCode)
        //         }
        //     };
        // })

        loadFiles()
        // return () => clearTimeout(timeout);
    }, []);

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
            console.log(formatedFileData);
            const generatedEdges = generateEdges(formatedFileData)
            setEdges([...generatedEdges])
        }, 500)

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

    const loadFiles = useCallback(async () => {
        // formatFiles()
        try {
            const dbFiles: FileInterface[] = await db.files.where('project_id').equals(project_id).toArray()
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
                setEdges([...layoutedNodes.edges])
                // }, 400);
                setIsLoaded(true)
            }
        } catch (e) {
            throw new Error(e)
        } finally {
            setIsLoaded(true)
        }
    }, [])

    const updateFileContent = async (filePath: string, code: string, type: string, name: string, )=> {
        try {
            await db.files.put({
                id: filePath,
                path: filePath,
                code,
                type,
                name,
                project_id,
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
                        project_id,
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
                project_id,
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

    const addRootFolder = useCallback(async (name: string) => {
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
            project_id,
            author_id,
            created_At: Date.now(),
            updated_At: Date.now()
        })
    }, [])

    const handleNodeDelete = useCallback(async (param: any[]) => {
        try {
            setIsDeleting(true)
            for (const nds of param) {
                nodes.filter(nd => nd.id.startsWith(nds.id + '/')).map(n => {
                    setTimeout(async () => {
                        setNodes(nods => nods.filter(ns => ns.id !== n.id))
                        await db.files.delete(n.id)
                    }, 300)
                })
                setTimeout(async () => {
                    await db.files.delete(nds.id)
                }, 500)
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
        setNodes(nds => nds.map(nd => ({
            ...nd,
            data: {
                ...nd.data,
                color: nd.type === 'folderNode' ? defaultFolderNodeColor : defaultNodeColor,
            },
            selected: false
        })))
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
        })))
        setSelectedNode({})
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

    return (
        <FileContext.Provider value={{
            nodes,
            setNodes,
            edges,
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
            editorContent,
            setEditorContent,
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
            rootFolder,
            setRootFolder,
            panContextMenuOpen,
            setPanContextMenuOpen,
            addRootFolder,
            globalMessage,
            setGlobalMessage,
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