'use client'
import React, { useState, useEffect } from 'react'
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useEditorState} from "@/context/EditorContext";
import {useFileState} from "@/context/FileContext";

const AddFileModel = ({parentName, color, selected, fullPath, type}: { parentName: string, color: string, selected: boolean, fullPath: string, type?: 'folder' | 'editor'}) => {
    const [value, setValue] = useState('')
    const [isFile, setIsFile] = useState(true)
    const [completePath, setCompletePath] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    const { files } = useEditorState();
    const { addNewFile, setGlobalMessage, nodes, } = useFileState();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (value){
                const joinedPath = `${fullPath}/${value}`.split('/').filter(Boolean)
                setCompletePath(joinedPath)
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
            let completePath = fullPath;
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
            console.log(formatedNestedFolders)
            addNewFile(fullPath, value, isFile, formatedNestedFolders)
        }
    }

    const handleClick = () => {
        const existingFileNode = nodes.find(nd => nd.data.label === `${fullPath}/${value}`);
        if (!value || errorMessage.trim()){
            setGlobalMessage({
                type: 'error',
                message: `enter ${isFile ? "file" : "folder"} name.`
            })
            return;
        }
        if (existingFileNode){
            setGlobalMessage({
                type: 'error',
                message: `path already exist.`
            })
            return;
        }else {
            let formatedNestedFolders = []
            let completePath = fullPath;
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
            console.log(formatedNestedFolders)
            addNewFile(fullPath, value, isFile, formatedNestedFolders)
        }
    }

    return (
        <div className={'!h-[200px] !w-[300px] center bg-transparent'}>
            {/*@ts-ignore*/}
            <Dialog className={'!backdrop-blur-sm !bg-neutral-800/20 !w-[300px] !h-[200px]'}>
                <DialogTrigger className={'size-[60px] rounded-full center'} asChild>
                    <Button
                        style={{
                            borderColor: color
                        }}
                        className={cn(`size-[50px] !p-0 bd center rounded-full button-neutral hover:!bg-[#d0ff00]/25 transition-300 !border-[3px] text-md`,
                            selected && "!border-[#d0ff00]",
                            'group-hover:!border-[#d0ff00] border-[3px]'
                        )}>
                        +
                    </Button>
                </DialogTrigger>
                <DialogContent showCloseButton={false} className={'!backdrop-blur-sm center flex-col !items-start !bg-neutral-800/20'} >
                    <DialogHeader className={'w-full'}>
                        <div className={'w-full between gap-[10px] h-[50px] pr-[10px]'}>
                            <Button
                                type={'button'}
                                onClick={() => setIsFile(true)}
                                className={cn(`center w-[50%] text-sm font-semibold hover:bg-neutral-700 transition-300 text-foreground bg-neutral-700`,
                                    isFile && 'bg-cyan-500/60 hover:bg-cyan-500/60')}>
                                File
                            </Button>
                            <Button
                                type={'button'}
                                onClick={() => setIsFile(false)}
                                className={cn(`center w-[50%] text-sm font-semibold hover:bg-neutral-700 transition-300 text-foreground bg-neutral-700`,
                                    !isFile && 'bg-cyan-500/60 hover:bg-cyan-500/60')}>
                                Folder
                            </Button>
                        </div>
                        <DialogTitle className={'text-sm'}>create a new {isFile ? 'file' : 'folder'} to {parentName || ''} folder</DialogTitle>
                        <DialogDescription className={'text-xs'}>
                            {!isFile && "use '/' to create nested folders."}
                        </DialogDescription>
                    </DialogHeader>
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
                        <DialogClose
                            disabled={!!errorMessage || !value}
                            className={'w-full center'}
                            asChild>
                            <Button
                                disabled={!!errorMessage || !value}
                                onClick={handleClick}
                                className={'w-full center text-xs text-white hover:!bg-cyan-500/60 button-neutral'}>
                                Add
                            </Button>
                        </DialogClose>
                    </div>
                    <DialogFooter className={'center w-full !justify-end'}>
                        <DialogClose asChild>
                            <Button type={'button'} variant={'ghost'}>close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
    )
}
export default AddFileModel
