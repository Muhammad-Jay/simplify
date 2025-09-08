'use client'
import React, { useMemo, useState } from 'react'
import type { Node, Edge} from 'reactflow'
import {nanoid} from 'nanoid'
import {useForceGraphLayout} from "@/hooks/FlowGraph/useForceGraphLayout";
import {useEditorState} from "@/context/EditorContext";

type SandpackFiles = {
    [filePath: string]: { code: string }
}

type Options = {
    projectName?: string
}

export function useFileTreeGraph(files: SandpackFiles, options?: Options){
    const [activeFolder, setActiveFolder] = useState<string | null>(null)
    const { projectName, updateEdge } = useEditorState()
    const defaultNode = {
        id: projectName,
        type: 'folderNode',
        position: { x: Math.random() * 600, y: Math.random() * 600},
        data: {
            label: projectName,
            name: projectName,
            isVisible: true,
            code: `nothing`,
            language: 'typescript',
            isActive:  () => setActiveFolder(projectName),
            onCodeChange: (nodeId: string, newCode: string) =>
                console.log(`${nodeId} updated:`, newCode)
        }
    }

    const nodes: Node[] = []
    const edges: Edge[] = []

    const colors = ['#edc106', "#06ed4b", "#0634ed", "#a006ed", "#ed0689"]

    return useMemo(() => {
        const parentChildMap = new Map<string, Set<string>>()
        const addNodes = new Set<string>()

        Object.keys(files).forEach((path) => {
            const segments = path.split('/').filter(Boolean)
            for (let i = 0; i < segments.length; i++) {
                const parent = '/' + segments.slice(0, i).join('/');
                const child = '/' + segments.slice(0, i + 1).join('/');

                if (!parentChildMap.has(parent)){
                    parentChildMap.set(parent, new Set())
                }
                parentChildMap.get(parent)!.add(child)
            }
        })

        const rootPath = `${projectName}`;

        if (!parentChildMap.has("")){
            parentChildMap.set("", new Set([rootPath]))
        }

        parentChildMap.forEach((children, parent) => {
            children.forEach((child, index) => {
                const parentName = parent.split('/').filter(Boolean)[parent.split('/').filter(Boolean).length > 1? parent.split('/').filter(Boolean).length - 1 : 0]
                const childName = child.split('/').filter(Boolean)[child.split('/').filter(Boolean).length > 1 ? child.split('/').filter(Boolean).length - 1 : 0]

                if (!addNodes.has(child)){
                    const isFile = /\.\w+$/.test(child)

                    nodes.push({
                        id: child,
                        type: isFile ? 'codeEditor' : 'folderNode',
                        position: { x: Math.random() * 600, y: Math.random() * 600},
                        data: {
                            label: child,
                            name: childName === undefined ? projectName : childName,
                            isVisible: true,
                            code: isFile ? files[child] || `nothing` : undefined,
                            language: 'typescript',
                            isActive: !isFile ? () => setActiveFolder(child) : null,
                            onCodeChange: (nodeId: string, newCode: string) =>
                                console.log(`${nodeId} updated:`, newCode)
                        }
                    })

                    addNodes.add(child)
                }

                if (parent){
                    const newEdge = {
                        id: nanoid(),
                        source: parent,
                        target: child,
                        type: 'simplebezier',
                        style: {
                            stroke: '#ffffff',
                            opacity: 2,
                            strokeWidth: 3
                        },
                        data: {
                            color: colors[Math.random() * 4],
                            parentName,
                            isVisible: false,
                            childName,
                            className: parentName,
                            label: `${parentName || rootPath} >>> ${childName}`
                        }
                    }
                    updateEdge(newEdge, 'c15acf41-1bd7-4899-be74-7f70551e644c')
                    edges.push(newEdge)
                }
            })
        })

        return { nodes, edges }
    }, [files, options])

}
