'use client'
import {createContext, useContext, useMemo, useCallback, useEffect, useState} from 'react'
import {
    applyNodeChanges,
} from 'reactflow';
import Fuss from 'fuzzysort'
import {db, FileInterface} from "@/lib/dexie/index.dexie";
import {mockFileData, mockFilesDataTypes} from "@/constants";
import {generateEdges} from "@/utils/flow/edge";
import {getLayoutedElements} from "@/components/EditorFlow/EditorFlow";

const FileContext = createContext<any| undefined>(undefined)

const author_id = 'jsync4172004@gmail.com'
const project_id = 'c15acf41-1bd7-4899-be74-7f70551e644c'

const generatedEdges = generateEdges(mockFileData)

export function GlobalFileProvider({
                                       children,
                                   }: {
    children: React.ReactNode;
}){
    const [projectDir, setProjectDir] = useState([])
    const [changedDir, setChangedDir] = useState([])
    const [query, setQuery] = useState('')
    const [isFileUpdating, setIsFileUpdating] = useState(false);
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [isOnQuery, setIsOnQuery] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false)
    const [edges, setEdges] = useState([])
    const [nodes, setNodes] = useState([])
    const [selectedFileNode, setSelectedFileNode] = useState<any>({})
    const [currentEditorNode, setCurrentEditorNode] = useState<any>({})
    const [editorContent, setEditorContent] = useState('')

    useEffect(() => {
        // mockFileData.map(async (file) => {
        //     await db.files.put({
        //         id: file.fullPath,
        //         path: file.fullPath,
        //         code: file.content,
        //         type: file.type === 'file' ? 'codeEditor' : 'folderNode',
        //         name: file.name,
        //         project_id,
        //         author_id,
        //         created_At: Date.now(),
        //         updated_At: Date.now()
        //     })
        // })
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
                            code: file.type === 'codeEditor' ? file.code : undefined,
                            language: 'typescript',
                            isActive: true,
                            onCodeChange: (nodeId: string, newCode: string) =>
                                console.log(`${nodeId} updated:`, newCode)
                        }
                    };
                })

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
            setCurrentEditorNode,
            currentEditorNode,
            setSelectedFileNode,
            isFileUpdating,
            setIsFileUpdating,
            updateFileContent,
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