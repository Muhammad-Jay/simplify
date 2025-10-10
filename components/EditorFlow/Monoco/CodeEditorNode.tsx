'use client';
import React , {useState, useCallback, memo, useEffect, useMemo, useRef } from 'react';
import { Handle, Position, NodeProps, useNodes, NodeToolbar } from 'reactflow';
import * as javascriptLanguage from '@codemirror/lang-javascript'
import NodeCard from "@/components/EditorFlow/ui/NodeWrapper";
import {cn} from "@/lib/utils";
import dynamic from 'next/dynamic'
import { Code } from 'lucide-react'
import { EditorSelection, EditorState } from '@codemirror/state'
import { EditorView, ViewPlugin, Decoration } from '@codemirror/view'
import {useEditorState} from "@/context/EditorContext";
import CodeEditor from "@/components/EditorFlow/Monoco/Editor";
import {Button} from "@/components/ui/button";

const MonocoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export type CodeEditorNodeData = {
    label?: string;
    code: string;
    language: string;
};

const CodeEditorNode = ({
                            id,
                            data,
                            selected
                        }: any) => {

    const [isInteractive, setIsInteractive] = useState(false)
    const { code, isVisible, language, onCodeChange, label: filePath } = data;

    const { updateFile: saveFile, files: stateFile, openEditor,
        setOpenEditor, nodes, getRecentNodes, setCurrentNode, theme, selectedNode, setNodes, updateRecentActiveNodes } = useEditorState()

    useEffect(() => {
        const results = javascriptLanguage

        if (selected){
            const activeNode = nodes.filter((node: any) => node.id === id)[0]
            if (activeNode){
                setCurrentNode(activeNode)
                updateRecentActiveNodes(activeNode, 'c15acf41-1bd7-4899-be74-7f70551e644c')
            }else return;

            getRecentNodes()
        }
    }, [selected]);

    // const getLanguageFromPath = (path: string) => {
    //     const extension = path.split('.').pop()?.toLowerCase();
    //     switch (extension) {
    //         case 'ts': return 'typescript';
    //         case 'tsx': return 'typescript';
    //         case 'js': return 'javascript';
    //         case 'jsx': return 'javascript';
    //         case 'json': return 'json';
    //         case 'css': return 'css';
    //         case 'html': return 'html';
    //         default: return 'plaintext';
    //     }
    // }

    const setSelection = useCallback(() => {
        setNodes(nds => nds.id === id ? ({...nds, selected: true}) : ({...nds, selected: false}))
    }, [selected])

    const stopInteraction = (e) => {
        setIsInteractive(true)
    }
    // #d0ff00
    // @ts-ignore
    return (
        <NodeCard
            type={'file'}
            isVisible={isVisible}
            isInteractive={isInteractive}
            selected={selected}
            stroke={ selected ? "#00fa49" : data.color }>
            <div
                className={cn(`rounded-2xl relative container-full`)}>

                {data.label && (
                    <div className={"px-[0px] !items-start py-2 w-full pt-[10px] h-fit between"}>
                        <div className={cn('container-full !items-start center flex-col !pl-[40px] gap-[5px] p-[10px]')}>
                            <h1 className={cn('text-xl center text-foreground font-semibold')}>{data.name}</h1>
                        </div>
                        <div className={'center h-full w-fit gap-[10px]'}>
                            <Button
                                onClick={() => setOpenEditor(true)}
                                className={cn(`size-[70px] !p-0 bd center rounded-full button-neutral hover:!bg-green-400/25 transition-300 !border-[3px] text-xs`,
                                    selected ? "!border-green-400" : "!border-[#00C8FF]",
                                    'group-hover:!border-green-400 border-[3px]'
                                )}>
                                <Code size={75} className={'text-white !text-[60px]'}/>
                            </Button>
                        </div>
                    </div>
                )}

                <div
                    onPointerDown={stopInteraction}
                    onClick={setSelection}
                    onPointerLeave={() => setIsInteractive(false)}
                    className={"overflow-y-auto container-full rounded-2xl"}>

                </div>
            </div>
            <div
                style={{
                    backgroundColor: data.name === 'package.json' ? '#4f5a00' : data.name.startsWith('.env') ? "#00a139" : "#00C8FF"
                }}
                className={cn('w-[65%] !mb-[15px] center h-[7px] rounded-full',)}></div>
        </NodeCard>
    );
};

export default memo(CodeEditorNode)