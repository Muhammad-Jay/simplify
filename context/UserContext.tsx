'use client'
import { useCallback, useState, useMemo, useEffect, createContext, useContext } from 'react'
import {db, Edges} from "@/lib/dexie/index.dexie";
import {nanoid} from 'nanoid'
import {useEditorState} from "@/context/EditorContext";

const UserContext = createContext<any| undefined>(undefined)

const author_id = 'jsync4172004@gmail.com'
const project_id = 'c15acf41-1bd7-4899-be74-7f70551e644c'

export function GlobalUserProvider({
                                       children,
                                   }: {
    children: React.ReactNode;
}){
    const { files, nodes } = useEditorState()

    const [userEdges, setUserEdges] = useState([])


    const updateEdge = useCallback(async (edge: any) => {
        try {
            await db.userEdges.put({
                id: edge.source,
                edge,
                project_id,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })

            const newEdge = {
                id: nanoid(),
                source: edge.source,
                target: edge.target,
                type: 'simplebezier',
                style: {
                    stroke: '#2bff6c',
                    opacity: 1,
                    strokeWidth: 1
                },
                data: {
                    parentName: '',
                    isVisible: false,
                    childName: '',
                    className: edge.source,
                    // label: `${parentName || rootPath} >>> ${childName}`
                }
            }

            setUserEdges(prev => ([...prev, newEdge]))
        }catch (e) {
            throw new Error(e)
        }
    }, [files, nodes])

    const loadEdges = async () => {
        try {
            const dbEdges: Edges[]  = await db.userEdges.where('project_id').equals(project_id).toArray()
            if (!dbEdges) return;
            const formatedEdges = dbEdges.map(({edge}) => ({
                id: nanoid(),
                source: edge.source,
                target: edge.target,
                type: 'simplebezier',
                style: {
                    stroke: '#2bff6c',
                    opacity: .8,
                    strokeWidth: .8
                },
                data: {
                    parentName: '',
                    isVisible: false,
                    childName: '',
                    className: edge.source,
                    // label: `${parentName || rootPath} >>> ${childName}`
                }
            }));
            setUserEdges([...formatedEdges]);
            return formatedEdges;
        }catch (e) {
            console.log(e)
            return [];
        }
    }


    return (
        <UserContext.Provider value={{
            userEdges,
            setUserEdges,
            updateEdge,
            loadEdges
        }}>
            {children}
        </UserContext.Provider>
    )

}

export const useUserState = ()=> {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useEditorState() must be wrapped within the provider')
    }
    return context
}