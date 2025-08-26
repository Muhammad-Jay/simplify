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

const AddFileModel = ({parentName, selected, fullPath, type}: { parentName: string, selected: boolean, fullPath: string, type?: 'folder' | 'editor'}) => {
    const [value, setValue] = useState('')
    const [completePath, setCompletePath] = useState([])
    let errors: string[] = []

    const { addNewFile, files } = useEditorState()

    useEffect(() => {
        if (value){
            const joinedPath = `${fullPath}/${value}`.split('/').filter(Boolean)
            setCompletePath(joinedPath)
        }
    }, [value]);

    const handleChange = (e) => {
        setValue(e.target.value)
    }

    const handleKeyDown = (e) => {
        if (e.keys === 'Enter' && !e.shiftKey && value){
            addNewFile(fullPath, value, type, 'c15acf41-1bd7-4899-be74-7f70551e644c')
        }
    }

    const handleClick = () => {
        if (!value) return;
        addNewFile(fullPath, value, type, 'c15acf41-1bd7-4899-be74-7f70551e644c')
        console.log(files)
    }

    return (
        <div className={'!h-[200px] !w-[300px] center bg-transparent'}>
            {/*@ts-ignore*/}
            <Dialog className={'!backdrop-blur-sm !bg-neutral-800/20 !w-[300px] !h-[200px]'}>
                <DialogTrigger className={'size-[60px] rounded-full center'} asChild>
                    <Button
                        className={cn(`size-[60px] !p-0 bd center rounded-full button-neutral hover:!bg-[#d0ff00]/25 transition-300 !border-[3px] text-md`,
                            selected ? "!border-[#d0ff00]" : "!border-[#00C8FF]",
                            'group-hover:!border-[#d0ff00] border-[3px]'
                        )}>
                        +
                    </Button>
                </DialogTrigger>
                <DialogContent className={'!backdrop-blur-sm center flex-col !items-start !bg-neutral-800/20'} >
                    <DialogHeader>
                        <DialogTitle className={'text-sm'}>create a new file/folder to {parentName || ''} folder</DialogTitle>
                        <DialogDescription className={'text-xs'}>
                            use '/' to create nested folders.
                        </DialogDescription>
                    </DialogHeader>
                    <div className={"container-full gap-[10px] center flex-col"}>
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
                            className={'w-full center'}
                            asChild>
                            <Button
                                onClick={handleClick}
                                className={'w-full center text-xs text-white button-neutral'}>
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
