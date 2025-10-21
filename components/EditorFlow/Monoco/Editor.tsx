'use client';

import React, {memo, useEffect, useRef, useState} from 'react';
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Panel, applyNodeChanges } from 'reactflow'
import { cn } from '@/lib/utils';
import { parseScript, parseModule } from 'esprima';
// import io from 'socket.io';
import {oneDarkTheme} from '@codemirror/theme-one-dark'
import {Linter} from 'eslint-linter-browserify'
import { tags as t } from '@lezer/highlight';
import {dracula} from '@uiw/codemirror-theme-dracula'
import {basicSetup} from 'codemirror'
import {autocompletion} from '@codemirror/autocomplete'
import { linter, Diagnostic } from '@codemirror/lint'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import {useEditorState} from "@/context/EditorContext";
import Loader from "@/components/Loader";
import useCodeStructure from "@/hooks/code-mirror/useCodeStructure";
import {useFileState} from "@/context/FileContext";

const CodeEditor = () => {
    const {
        openEditor,
        setOpenEditor,
        theme,
        files: stateFiles,
    } = useEditorState()
    const { selectedFileNode: selectedNode, setSelectedFileNode, isFileUpdating, setNodes } = useFileState()

    return selectedNode && openEditor && (
        <>
            <div
                onClick={() => {
                    setSelectedFileNode({})
                    setNodes(nds => nds.map(nd => ({...nd, selected: false})));
                    setOpenEditor(false)
                }}
                style={{
                    width: '100dvw',
                    height: '100dvh'
                }}
                className={'absolute !screen inset-0 center z-[5] bg-black/30'}/>
                <Panel
                    position={'top-right'}
                    // initial={{opacity: 0, scale: .7}}
                    // animate={{opacity: 1, scale: 1}}
                    // transition={{ duration: 500, ease: 'easeInOut'}}
                    // exit={{opacity: 0, scale: .7}}
                    className={'!w-[600px] translate-y-[10%] -translate-x-[3%] transition-300 !my-auto !h-[450px] z-[7] p-0 !backdrop-blur-xs center rounded-lg !bg-neutral-800/10 border-2 border border-input'}
                >
                    <div className={cn(
                        'relative container-full rounded-lg center border border-input'
                    )}>
                        <div className={'center container-fit !h-[13px] absolute top-[15px] right-[15px]'}>
                            {isFileUpdating ? (
                                    <div className={'center gap-[6px] flex-no-wrap'}>
                                        <p className={'text-white text-xs'}>updating</p>
                                        <Loader size={11} className={'animate-spin'}/>
                                    </div>
                            ):(
                                <span className={cn(`size-[10px] rounded-full center`,'bg-green-500')}/>
                            )}
                        </div>
                        <div
                            className={'!backdrop-blur-sm container-full center flex-col !items-start !bg-neutral-800/20'}>
                            <div className={'center !justify-start w-full px-[20px]'}>{selectedNode && <h2 className={'center text-xs font-semibold text-white'}>{selectedNode?.data?.name || ''}</h2>}</div>
                            <div className={'center container-full !h-[400px] overflow-y-auto p-[10px]'} id={'no-scrollbar'}>
                                <div className={'w-[98%] h-[95%] bg-black center overflow-hidden rounded-lg'}>
                                    <Div selectedNode={selectedNode}/>
                                </div>
                            </div>

                            {/*<div className={cn(`absolute size-[130px] rounded-2xl bg-transparent -top-[10px] -left-[10px] -z-[2]`, `!border-t-[4px] !border-l-[4px] !border-t-cyan-500 border-l-cyan-500 border-b-transparent border-r-transparent`, `group-hover:!border-[#d0ff00] border-[3px]`)}/>*/}
                            {/*<div className={cn(`absolute size-[130px] rounded-2xl bg-transparent -bottom-[10px] -left-[10px] -z-[2]`, `!border-b-[4px] !border-l-[4px] !border-b-cyan-500 border-l-cyan-500 border-t-transparent border-r-transparent`,`group-hover:!border-[#d0ff00] border-[3px]`)}/>*/}
                            {/*<div className={cn(`absolute size-[130px] rounded-2xl bg-transparent -top-[10px] -right-[10px] -z-[2]`, `!border-t-[4px] !border-r-[4px] !border-t-cyan-500 border-r-cyan-500 border-b-transparent border-l-transparent`, `group-hover:!border-[#d0ff00] border-[3px]`)}/>*/}
                            {/*<div className={cn(`absolute size-[130px] rounded-2xl bg-transparent -bottom-[10px] -right-[10px] -z-[2]`, `!border-b-[4px] !border-r-[4px] !border-b-cyan-500 border-r-cyan-500 border-t-transparent border-l-transparent`,`group-hover:!border-[#d0ff00] border-[3px]`)}/>*/}
                        </div>
                    </div>
                </Panel>
        </>
    );
};

export default memo(CodeEditor);

const Div = memo(({selectedNode, containerRef }: { containerRef?: any, editorRef?: any, selectedNode: any }) => {
    const editorRef = useRef(null);
    const [editorState, setEditorState] = useState<any>(null)
    const [editorCode, setEditorCode] = useState(selectedNode?.data?.code)
    const [socketConnected, setSocketConnected] = useState(false)

    const {
        updateFileContent,
        setIsFileUpdating,
        setEditorContent,
        nodes,
        setNodes,
        currentEditorNode,
        setCurrentEditorNode,
        setSelectedFileNode,
        setCurrentNodes
    } = useFileState()


    // useEffect(() => {
    //     const socket = io()
    //
    //     socket.on('connect', () => {
    //         setSocketConnected(true);
    //         console.log('socket connected successfully');
    //     })
    //
    //     socket.on('disconnect', () => {
    //         setSocketConnected(false);
    //         console.log('socket disconnected');
    //     })
    //
    //     return () => {
    //         socket.disconnect()
    //     }
    // }, []);

    useEffect(() => {
        let fileTimeout;

        const amethystHighlightStyle = HighlightStyle.define([
            { tag: t.comment, color: '#7c7c7c' },
            { tag: t.keyword, color: '#984eff' },
            { tag: t.string, color: '#87ffa9' },
            { tag: t.variableName, color: '#acacac' },
            { tag: t.propertyName, color: '#88a1fd' },
            // { tag: t.function, color: '#EE82EE' },
            { tag: t.typeName, color: '#be6bef' },
            { tag: t.number, color: '#f48067' },
        ]);

        const amethystEditorTheme = EditorView.theme({
            // Base editor styles
            // '&': {
            //     backgroundColor: '#000000', // Solid black background
            //     color: '#E6E6FA',           // Lavender foreground text
            // },
            '.cm-content': {
                caretColor: '#E6E6FA',
            },
            '&.cm-editor': {
                fontSize: '11.5px',
                lineHeight: '1.5', // Adjust for readability
                fontWeight: 'light'
            },
            // Selection and highlight
            '&.cm-focused .cm-selectionBackground': {
                backgroundColor: 'rgba(128, 0, 128, 0.4)', // A transparent purple selection
            },
            '.cm-activeLine': {
                backgroundColor: 'rgba(41,41,41,0.13)'
            },
            '.cm-cursor, .cm-dropcursor': {
                borderLeftColor: '#f0f0f0',
                color: '#00bbff',
                backgroundColor: '#00bbff',
                width: '3px'
            },
            '.cm-cursor': {
                color: '#00bbff',
                backgroundColor: '#00bbff',
                width: '3px'
            },
            // Gutter styles (line numbers)
            '.cm-gutters': {
                backgroundColor: '#0A0A0A',
                color: '#8A2BE2',
                border: 'none',
            },
            '.cm-completionList': {
                backgroundColor: '#333',
                color: '#eee',
                border: '1px solid #555',
                borderRadius: '4px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
            },
            '.cm-completionListItem': {
                padding: '4px 8px',
            },
            '.cm-completionListItem.cm-active': {
                backgroundColor: '#555',
                color: '#fff',
            },
        });

        // const myEslintLinter = linter((view) => {
        //     let diagnostics = []
        //     const code = view.state.doc.toJSON();
        //
        //     const lint = new Linter();
        //     const messages = lint.verify(code);
        //     console.log(messages)
        //
        //     // for (let message of messages){
        //     //     diagnostics.push({
        //     //         from: view.state.doc.line(message.line).from + message.column - 1,
        //     //         to: view.state.doc.line(message.line).from + message.column - 1,
        //     //         message: message.message,
        //     //         severity: message.severity === 2 ? 'error' : 'warning'
        //     //     })
        //     // }
        //     return diagnostics;
        // })

        const state = EditorState.create({
            doc: selectedNode?.data?.code,
            extensions: [
                javascript(),
                autocompletion(),
                // amethystEditorTheme,
                // dracula,
                oneDarkTheme,
                basicSetup,
                // myEslintLinter,
                syntaxHighlighting(amethystHighlightStyle),
                EditorView.updateListener.of((update) => {
                    const newCode = update.state.doc.toString();
                    // const ast = parseModule(newCode, {
                    //     jsx: true,
                    //     range: true,
                    //     loc: true,
                    //     tolerant: true,
                    // });
                    if (update.docChanged){

                        fileTimeout = setTimeout(() => {
                            const imports = [];
                            const exports = [];
                            const variables = [];
                            const lint = new Linter();
                            const messages = lint.verify(newCode);
                            console.log(messages)

                            // ast.body.forEach(node => {
                            //     if (node.type === 'ImportDeclaration') {
                            //         // Extract imported names and source
                            //         node.specifiers.forEach(specifier => imports.push(specifier.local.name));
                            //     } else if (node.type === 'ExportNamedDeclaration' && node.declaration) {
                            //         // Extract exported names
                            //         node.declaration.declarations.forEach(declaration => exports.push(declaration.id.name));
                            //     } else if (node.type === 'VariableDeclaration') {
                            //         // Extract variable names
                            //         node.declarations.forEach(declaration => variables.push(declaration.id.name));
                            //     }
                            // });
                            //
                            // console.log('Imports:', imports);
                            // console.log('Exports:', exports);
                            // console.log('Variables:', variables);
                            setIsFileUpdating(true);
                            setNodes(nds => nds.map((nd) => nd.data.label === selectedNode?.data?.label ? ({...nd, data: {...nd.data, code: newCode}}) : nd))
                            updateFileContent(selectedNode.data.label, newCode, selectedNode?.type, selectedNode?.data?.name);
                            setEditorState(update.state)
                        }, 3000);
                        setIsFileUpdating(false)
                        setSelectedFileNode(selectedNds => ({...selectedNds, data: {...selectedNds.data, code: newCode }}));
                    }
                })
            ]
        })
       const view =  new EditorView({
            state: state,
            parent: editorRef.current
        })

        // const stateTimeout = setTimeout(() => setEditorState(view.state), 2000)

        return () => {
            view.destroy()
            if (fileTimeout){
                clearTimeout(fileTimeout)
                // clearTimeout(stateTimeout)
            }
        }
    }, []);

    // const {exports, functions, imports, variables} = useCodeStructure(editorState)

    // useEffect(() => {
    //     if (!selectedNode){
    //         console.log('no cm instance')
    //         return;
    //     }
    //
    //     const cmInstance = editorRef.current.getCodemirror();
    //
    //     if (!cmInstance) return;
    //     // const handleChange = () => {
    //     //     const state = cmInstance?.state;
    //     //     const cursorPos = state.selection.ranges[0].head;
    //     //     const doc = state.doc;
    //     //     const cursorLine = doc.lineAt(cursorPos);
    //     //     const currentPosition = cmInstance.state.selection.ranges[0];
    //     //     const startLine = Math.max(1, cursorLine.number - 2);
    //     //     const endLine = cursorLine.number;
    //     //     const line = [];
    //     //
    //     //     // const eslintSource = linter(view => {
    //     //     const editorCode = state.doc.toString();
    //     //
    //     //     console.log(currentPosition)
    //     //     // const results = linterInstance.verify(editorCode, {
    //     //     //     rules: {
    //     //     //         semi: ['error', 'never'],
    //     //     //     }
    //     //     // })
    //     //
    //     //
    //     // }
    //     //
    //     // handleChange()
    //
    //     const filesTimeout = setTimeout(() => {
    //         setCurrentFile({[selectedNode?.data?.label]: { code: files[activeFile].code }})
    //     }, 500)
    //
    //     const editorCode = cmInstance?.state.doc.toString();
    //
    //     setIsUpdating(true)
    //     const timer = setTimeout(() => {
    //         saveFile(selectedNode.data.label, editorCode, 'c15acf41-1bd7-4899-be74-7f70551e644c')
    //         sandpack.updateFile(selectedNode?.data.label, editorCode)
    //     }, 1000 )
    //
    //     return () => {
    //         clearTimeout(filesTimeout)
    //         clearTimeout(timer)
    //     }
    // }, [files[activeFile].code]);

    return (
        <div
            id={'cm-editor-simplify'}
            ref={editorRef}
            className={'!container-full !text-xs'}
            style={{ width: '100%', height: '100%', overflowY: 'auto'}}
        ></div>
    )
})
