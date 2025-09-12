'use client'
import React from 'react'
import { Panel } from 'reactflow'
import {motion} from 'framer-motion'
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import { useParams } from 'next/navigation'
import {Button} from "@/components/ui/button";
import {useFileState} from "@/context/FileContext";

const AddNewProjectModel = () => {
    const {
        isDialogOpen,
        setIsDialogOpen,
        addNewProjectNode,
    } = useWorkFlowState();
    const {
        currentProjectId,
    } = useFileState()

    const { work_space_id } = useParams()

    const [name, setName] = React.useState('')

    const handleKeyDown = (e) => {
        if (name && e.key === 'Enter'){
            e.preventDefault()
            addNewProjectNode(name);
            setIsDialogOpen(false);
        }
    }

    const handleChange = (e) => {
        setName(e.target.value);
    }

    const handleClick = () => {
        addNewProjectNode(name, currentProjectId.workSpaceName ? currentProjectId.workSpaceName : work_space_id );
        console.log(work_space_id, currentProjectId.workSpaceName)
        setIsDialogOpen(false);
    }

    return isDialogOpen && (
        <>
            <div
                onClick={() => {
                    setIsDialogOpen(false)
                }}
                style={{
                    width: '100dvw',
                    height: '100dvh'
                }}
                className={'absolute !screen inset-0 center z-[6] bg-black/30'}
            />
            <div className={'!h-[250px] absolute right-[50%] translate-x-[50%] !top-[15%] !w-[500px] !z-[8] !backdrop-blur-sm center rounded-lg !bg-neutral-800/20 border-2'}>
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
                            <div className={'text-sm'}>create a new project</div>
                        </div>
                        <div className={"container-full gap-[10px] !items-start center flex-col"}>
                            <div className={cn(`w-full h-fit center bg-black rounded-sm`)}>
                                <Input
                                    inputType={'text'}
                                    placeholder={'search files, folders...'}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    value={name}
                                    name={'name'}
                                    className={'w-full h-[30px] text-xs text-white p-[10px] outline-none border-[1px] outline-zinc-600 !border-zinc-600 bg-neutral-900 rounded-sm'}
                                />
                            </div>
                            <div
                                className={'w-full center'}>
                                <Button
                                    disabled={!name}
                                    onClick={handleClick}
                                    className={'w-full center text-xs text-white hover:!bg-cyan-500/60 button-neutral'}>
                                    Add
                                </Button>
                            </div>
                        </div>
                        <div className={'center w-full !justify-end'}>
                            <div>
                                <Button onClick={() => {
                                    setIsDialogOpen(false)
                                }} type={'button'} variant={'ghost'}>close</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AddNewProjectModel
