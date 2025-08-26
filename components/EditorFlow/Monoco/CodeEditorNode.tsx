'use client';
import React , {useState, useCallback, memo, useEffect, useMemo, useRef } from 'react';
import { Handle, Position, NodeProps, useNodes, NodeToolbar } from 'reactflow';
import {
    useSandpack,
    // SandpackCodeEditor,
    // SandpackProvider
} from '@codesandbox/sandpack-react'
import * as javascriptLanguage from '@codemirror/lang-javascript'
import NodeCard from "@/components/EditorFlow/ui/NodeWrapper";
import {cn} from "@/lib/utils";
import dynamic from 'next/dynamic'
import { Code } from 'lucide-react'
import * as monoco from 'monaco-editor'
import { EditorSelection, EditorState } from '@codemirror/state'
import { EditorView, ViewPlugin, Decoration } from '@codemirror/view'
import {useEditorState} from "@/context/EditorContext";
import { linter, lintGutter } from '@codemirror/lint'
import {eslintConfig, linterInstance} from "@/lib/eslint-linter/eslint";
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
            isVisible={isVisible}
            isInteractive={isInteractive}
            selected={selected}
            stroke={selected ? "#d0ff00" : "#00C8FF"}>
            <div
                className={cn(`rounded-2xl relative container-full`,
                    isInteractive && "nodrag nowheel")}>

                {data.label && (
                    <div className={"px-[0px] !items-start py-2 w-full pt-[10px] h-fit between"}>
                        <div className={cn('container-full !items-start center flex-col !pl-[40px] gap-[5px] p-[10px]')}>
                            <h1 className={cn('text-xl center text-foreground font-semibold')}>{data.name}</h1>
                        </div>
                        <div className={'center h-full w-fit gap-[10px]'}>
                            <Button
                                onClick={() => setOpenEditor(true)}
                                className={cn(`size-[70px] !p-0 bd center rounded-full button-neutral hover:!bg-[#d0ff00]/25 transition-300 !border-[3px] text-xs`,
                                    selected ? "!border-[#d0ff00]" : "!border-[#00C8FF]",
                                    'group-hover:!border-[#d0ff00] border-[3px]'
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
        </NodeCard>
    );
};

export default memo(CodeEditorNode)


// const Editor = memo(({data, isInteractive, stopInteraction, setIsInteractive} : any) => {
//     const { updateFile: saveFile, files: stateFile, setCurrentNode, selectedNode } = useEditorState()
//     const { sandpack } = useSandpack()
//     const { activeFile, files, error } = sandpack
//
//     const [showModel, setShowModel] = useState(false)
//     const [popoverState, setPopoverState] = useState({
//         x: 0,
//         y: 0
//     })
//     const [context, setContext] = useState({
//         line: [] as string[],
//         cursorPosition: { top: 0, left: 0, bottom: 0, right: 0 },
//         fullContent: ''
//     })
//
//     const ref = useRef(null)
//
//     useEffect(() => {
//         const cmInstance = ref.current.getCodemirror();
//         if (!cmInstance){
//             console.log('no cm instance')
//             return;
//         }
//         const currentPosition = cmInstance.state.selection.ranges[0].to;
//
//
//     }, []);
//
//     useEffect(() => {
//         const cmInstance = ref.current.getCodemirror();
//         if (!cmInstance){
//             console.log('no cm instance')
//             return;
//         }
//
//         const handleChange = () => {
//             setIsInteractive(true)
//             const state = cmInstance.state;
//             const cursorPos = state.selection.ranges[0].head;
//             const doc = state.doc;
//             const cursorLine = doc.lineAt(cursorPos);
//             const currentPosition = cmInstance.coordsAtPos(cursorPos);
//             const startLine = Math.max(1, cursorLine.number - 2);
//             const endLine = cursorLine.number;
//             const line = [];
//
//             // const eslintSource = linter(view => {
//             const editorCode = state.doc.toString()
//             const results = linterInstance.verify(editorCode, {
//                 rules: {
//                     semi: ['error', 'never'],
//                 }
//             })
//
//             return results
//         }
//
//         handleChange()
//
//         const timer = setTimeout(() => {
//             setShowModel(false)
//             sandpack.updateFile(data.label, files[activeFile].code)
//             saveFile(data.label, files[activeFile].code, 'c15acf41-1bd7-4899-be74-7f70551e644c')
//         }, 1000)
//
//         if (error) console.log(error)
//
//         return () => {
//             // unSubscribe()
//             clearTimeout(timer)
//             setIsInteractive(false)
//         }
//     }, [files[activeFile].code, activeFile]);
//
//     return (
//         <div className={'container-full center'}>
//             {/*<SandpackCodeEditor*/}
//             {/*    ref={ref}*/}
//             {/*    showTabs={false}*/}
//             {/*    showInlineErrors*/}
//             {/*    showLineNumbers*/}
//             {/*    // @ts-ignore*/}
//             {/*    style={{ width: '100%', height: '100%', overflowY: 'auto'}}*/}
//             {/*    className={cn(`!min-h-[240px] !max-h-[300px] transition-300`, isInteractive ? "nodrag nowheel" : '')}*/}
//             {/*/>*/}
//             {showModel && (
//                 <div
//                     style={{
//                         top: `${Math.round(context.cursorPosition.top) / 2 + 10}px`,
//                         left: `${10}px`
//                     }}
//                     className={cn('w-[200px] h-[300px] rounded-md border-[1px] border-zinc-800 !backdrop-blur-sm !bg-neutral-800/25 absolute')}
//                 >
//                     <pre className={'container-full flex-wrap p-[10px]'}>{context.line[context.line.length - 1] || 'nothing'}</pre>
//                 </div>
//             )}
//         </div>
//     )
// });