'use client'
import React, { useState, useEffect } from 'react'
import { Panel } from 'reactflow';
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useEditorState} from "@/context/EditorContext";
import {useFileState} from "@/context/FileContext";

const PanContextMenu = () => {
    const [value, setValue] = useState('')
    const [isFile, setIsFile] = useState(true)
    const [completePath, setCompletePath] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    const { files } = useEditorState();
    const {
        addRootFolder,
        panContextMenuOpen,
        currentProjectId,
        setPanContextMenuOpen,
    } = useFileState();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (value){
                const joinedPath = value.split('/').filter(Boolean);
                setCompletePath(joinedPath);
            }
        }, 200);

        return () => clearTimeout(timeout);
    }, [value]);

    const handleChange = (e) => {
        setValue(e.target.value)
        if (isFile){
            if (value.includes('/')){
                setErrorMessage('file name cannot contain "/".');
                return;
            }
            setErrorMessage('');
            return;
        }
        if (value.includes('.')){
            setErrorMessage('folder name cannot contain "."');
            return;
        }
        setErrorMessage('');
    }

    const handleKeyDown = (e) => {
        if (e.keys === 'Enter' && !e.shiftKey && value){
            e.preventDefault();
            if (!value || errorMessage.trim()) return;
            let completePath = '';
            let formatedNestedFolders = []
            if (!isFile){
                const nestedFolder = value.split('/').filter(Boolean)
                if (nestedFolder.length === 0) return;
                for (const nf of nestedFolder){
                    completePath = `${completePath}/${nf}`
                    formatedNestedFolders.push({
                        type: 'folder',
                        name: nf,
                        fullPath: completePath
                    })
                }
            }
            addRootFolder(value, currentProjectId.id)
        }
    }

    const handleClick = () => {
        if (!value || errorMessage.trim()) return;
        let formatedNestedFolders = []
        let completePath = '';
        if (!isFile){
            const nestedFolder = value.split('/').filter(Boolean)
            if (nestedFolder.length === 0) return;
            for (const nf of nestedFolder){
                completePath = `${completePath}/${nf}`
                formatedNestedFolders.push({
                    type: 'folder',
                    name: nf,
                    fullPath: completePath
                })
            }
        }
        addRootFolder(value, currentProjectId.id)
    }

    return panContextMenuOpen && (
        <>
            <div
                onClick={() => {
                    setPanContextMenuOpen(false)
                }}
                style={{
                    width: '100dvw',
                    height: '100dvh'
                }}
                className={'absolute !screen inset-0 center z-[6] bg-black/30'}
            />
            <Panel position={'top-center'} className={'!h-[250px] !top-[15%] !w-[500px] !z-[8] !backdrop-blur-sm center rounded-lg !bg-neutral-800/20 border-2'}>
                {/*@ts-ignore*/}
                <div className={'!h-[250px] !w-[500px] center p-[20px]'}>
                    <div className={'container-full center flex-col !items-start '} >
                        <div className={'w-full'}>
                            {/*<div className={'w-full between gap-[10px] h-[50px] pr-[10px]'}>*/}
                            {/*    <Button*/}
                            {/*        type={'button'}*/}
                            {/*        onClick={() => setIsFile(true)}*/}
                            {/*        className={cn(`center w-[50%] text-sm font-semibold hover:bg-neutral-700 transition-300 text-foreground bg-neutral-700`,*/}
                            {/*            isFile && 'bg-cyan-500/60 hover:bg-cyan-500/60')}>*/}
                            {/*        File*/}
                            {/*    </Button>*/}
                            {/*    <Button*/}
                            {/*        type={'button'}*/}
                            {/*        onClick={() => setIsFile(false)}*/}
                            {/*        className={cn(`center w-[50%] text-sm font-semibold hover:bg-neutral-700 transition-300 text-foreground bg-neutral-700`,*/}
                            {/*            !isFile && 'bg-cyan-500/60 hover:bg-cyan-500/60')}>*/}
                            {/*        Folder*/}
                            {/*    </Button>*/}
                            {/*</div>*/}
                            <div className={'text-sm'}>create a new root folder</div>
                            <div className={'text-xs'}>
                                {!isFile && "use '/' to create nested folders."}
                            </div>
                        </div>
                        <div className={"container-full gap-[10px] !items-start center flex-col"}>
                            <div className={cn(`w-full h-fit center bg-black rounded-sm`)}>
                                <Input
                                    inputType={'text'}
                                    placeholder={'search files, folders...'}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    value={value}
                                    name={'search'}
                                    className={'w-full h-[30px] text-xs text-white p-[10px] outline-none border-[1px] outline-zinc-600 !border-zinc-600 bg-neutral-900 rounded-sm'}
                                />
                            </div>
                            {errorMessage && value && (<p className={'text-xs mt-[5px] text-red-400/90'}>{errorMessage}</p>)}
                            <div className={'w-full !justify-start overflow-x-auto center flex-row h-fit p-[10px] gap-[10px]'} id={'no-scrollbar'}>
                                {completePath && completePath.map((path: string, index: number) => (
                                    <div key={`${path}:${index}`}  className={'center container-fit flex-row text-xs gap-[5px]'}>
                                        <p className={'text-xs bg-transparent rounded-xs transition-300 container-fit p-[2px] text-white/80'}>
                                            {path || ''}
                                        </p>
                                        <p className={'text-cyan-500/90  text-xs'}>
                                            {index === completePath.length - 1 ? '' : '/'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div
                                className={'w-full center'}>
                                <Button
                                    disabled={!!errorMessage || !value}
                                    onClick={handleClick}
                                    className={'w-full center text-xs text-white hover:!bg-cyan-500/60 button-neutral'}>
                                    Add
                                </Button>
                            </div>
                        </div>
                        <div className={'center w-full !justify-end'}>
                            <div>
                                <Button onClick={() => {
                                    setPanContextMenuOpen(false)
                                }} type={'button'} variant={'ghost'}>close</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>
        </>
    )
}
export default PanContextMenu
