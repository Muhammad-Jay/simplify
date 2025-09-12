'use client'

import React, {useEffect} from 'react'
import { Handle, Position, NodeProps, useNodesState } from 'reactflow';
import {Menu, Folder, FolderPlus } from 'lucide-react'
import { motion } from 'framer-motion';
import {cn} from "@/lib/utils";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import AddFileModel from "@/components/EditorFlow/Monoco/AddFileModel";
import {Button} from "@/components/ui/button";
import {useFileState} from "@/context/FileContext";

type FolderNodeType = {
    data: any;
    selected: boolean;
    id: string;
}

const FolderNode = ({id, selected, data}: FolderNodeType) => {
    const { setFold } = useFileState()

    const { isVisible } = data

    const handleFolderClick = () => {
       setFold(prev => ({
           fold: !prev.fold,
           path: data.label
       }))
    }

    return (
        <motion.div
            initial={{opacity: 0, scale: .5}}
            whileHover={{scale: 1.05, duration: .3}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 1}}
            className={cn(`group relative flex-col rounded-xl gap-[5px] transition-300 w-[230px] h-fit center p-[5px]`,
            !isVisible && '!hidden')}>
            <div className={'container-full center'}>
                <div
                    style={{
                        borderColor: data.color
                    }}
                    className={cn("container-full !space-x-[10px] between px-[10px] !justify-start !h-[75px] p-[5px] rounded-xl !bg-neutral-900/30 backdrop-blur-md",
                    selected ? '!border-[#d0ff00] border-4' : '!border-4',
                    'group-hover:!border-[#d0ff00] border-4'
                )}>
                    <div
                        style={{
                            borderColor: data.color
                        }}
                        className={cn(`size-[50px] rounded-full border-2  center !bg-transparent flex-col gap-[10px] transition-300`,
                        'group-hover:!border-[#d0ff00] border-2',
                        selected && 'border-[#d0ff00] border-2',)}>
                        {/*<span className={cn(`h-[64px] w-[2px] bg-white/70 absolute left-0 -top-[50%] rotate-[-37deg] !-z[5]`)}/>*/}
                        {/*<div className={'text-white absolute right-[108%] center flex-col text-xs w-[120px] -top-[50%] h-[55px] p-[5px] rounded-sm bg-cyan-500/10 backdrop-blur-md border-2 border-cyan-500'}>*/}
                        {/*    <h2 className={'center gap-[5px] text-xs w-full text-white font-semibold !justify-start'}>*/}
                        {/*        <Folder size={12} className={'text-white fill-white'}/>*/}
                        {/*        {data.name || 'Untitled'}*/}
                        {/*    </h2>*/}
                        {/*</div>*/}
                        {/*<div className={'text-white absolute left-[108%] center flex-col text-xs w-[120px] -top-[50%] h-[55px] p-[5px] rounded-sm bg-cyan-500/10 backdrop-blur-md border-2 border-cyan-500'}>*/}
                        {/*</div>*/}
                        <AddFileModel selected={selected} fullPath={data.label} color={data.color} parentName={data.name}/>
                    </div>
                </div>
                <div
                    style={{
                        borderColor: data.color
                    }}
                    className={cn(`center w-[70px] h-[75px] ml-[5px] flex-col backdrop-blur-md gap-[5px] rounded-md bg-stone-500/30 !border-4 `,
                    'group-hover:!border-[#d0ff00] !border-4',
                    selected && '!border-[#d0ff00] !border-4')}>
                        <Button
                            onClick={handleFolderClick}
                            className={cn(`container-full !m-0 !p-0 bd center rounded-md button-neutral hover:!bg-[#d0ff00]/25 transition-300 !border-none text-md`,
                                selected && "!border-[#d0ff00]",
                                // 'group-hover:!border-[#d0ff00] border-[4px]'
                            )}>
                            ^
                        </Button>
                </div>
            </div>
            <div
                style={{
                    borderColor: data.color
                }}
                className={cn('w-full !backdrop-blur-lg !bg-zinc-900/30 h-[50px] flex-col !items-start px-[10px] rounded-md center',
                selected ? '!border-[#d0ff00] border-4' : '!border-4',
                'group-hover:!border-[#d0ff00] border-4'
                )}>
                <h1 className={cn('text-xl center text-foreground font-regular')}>{data.name}</h1>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!size-[15px] center !bg-foreground"
            >

            </Handle>
            <Handle
                type="target"
                position={Position.Top}
                className="!size-[15px] center !bg-foreground"
            >
            </Handle>
        </motion.div>
    )
}
export default FolderNode

const ShowContext = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={'!z-[5] cursor-pointer'}>
                <Menu size={20} className={'text-white'}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"w-[230px] h-[100px]"}>
                <DropdownMenuItem className={'w-full center gap-[5px] !justify-start'}>

                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const AddDialog = () => {
    return (
        <Dialog>
            <DialogTrigger className={'w-full center gap-[5px] !justify-start'}>
                <FolderPlus size={13} className={'text-white fill-white'}/>
                new
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>add</DialogTitle>
                <DialogHeader>

                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
