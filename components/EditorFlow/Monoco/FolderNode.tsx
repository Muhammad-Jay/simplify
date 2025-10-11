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
import {ContextMenu, ContextMenuContent, ContextMenuTrigger} from "@/components/ui/context-menu";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {ScrollArea} from "@/components/ui/scroll-area";

type FolderNodeType = {
    data: any;
    selected: boolean;
    id: string;
}

const FolderNode = ({id, selected, data}: FolderNodeType) => {
    const {
        setFold,
        currentFilePath,
    } = useFileState()

    const { isVisible } = data

    const handleFolderClick = () => {
       setFold(prev => ({
           fold: !prev.fold,
           path: data.label
       }))
    }

    if (currentFilePath !== id){
        return <SubFolder id={id} selected={selected} data={data}/>
    }

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1}}
            className={cn(`group relative flex-col rounded-xl gap-[5px] transition-300 w-[230px] h-fit center p-[5px]`,
            !isVisible && '!hidden')}>
            <div className={'container-full center'}>
                <div
                    style={{
                        borderColor: data.color
                    }}
                    className={cn("container-full !space-x-[10px] between px-[10px] !justify-start !h-[75px] p-[5px] rounded-xl !bg-neutral-900/30 backdrop-blur-md",
                    selected ? '!border-green-400 border-4' : '!border-4',
                    'group-hover:!border-green-400 border-4'
                )}>
                    <div
                        style={{
                            borderColor: data.color
                        }}
                        className={cn(`size-[50px] rounded-full border-2  center !bg-transparent flex-col gap-[10px] transition-300`,
                        'group-hover:!border-green-400 border-2',
                        selected && 'border-green-400 border-2',)}>
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
                    'group-hover:!border-green-400 !border-4',
                    selected && '!border-green-400 !border-4')}>
                        <Button
                            onClick={handleFolderClick}
                            className={cn(`container-full !m-0 !p-0 bd center rounded-md button-neutral hover:!bg-green-400/25 transition-300 !border-none text-md`,
                                selected && "!border-green-400",
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
                selected ? '!border-green-400 border-4' : '!border-4',
                'group-hover:!border-green-400 border-4'
                )}>
                <h1 className={cn('text-xl center text-foreground font-regular')}>{data.name}</h1>
            </div>

            {currentFilePath !== id && (
                <Handle
                    type="target"
                    position={Position.Top}
                    className="!size-[15px] center !bg-foreground"
                >
                </Handle>
            )}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!size-[15px] center !bg-foreground"
            >

            </Handle>
        </motion.div>
    )
}
export default FolderNode

const SubFolder = ({ id, selected, data }: { id: string, selected: boolean, data: any }) => {
    const [folderChildren, setFolderChildren] = React.useState([])
    const contextBtnRef = React.useRef(null);
    const {
        nodes,
        setCurrentFilePath
    } = useFileState();

    useEffect(() => {
        if (id){
            const children = nodes.filter(nd => nd.id.startsWith(id + '/'))
            console.log(children)
            setFolderChildren([...children]);
        }
    }, [id])

    const Render = () => {
        const handleClick = (children: any) => {
            if (children?.type === 'folderNode'){
                setCurrentFilePath(children?.id)
            }
        }

        return (
            <div
                className={cn('w-[230px] h-fit center !justify-start p-[10px] gap-[10px] mb-[20px] overflow-hidden flex-col border-2 !border-green-400/30 absolute -bottom-[105%] -left-[105%] !bg-neutral-800/30 !backdrop-blur-lg rounded-lg')}

            >
                <div className={cn('center w-full h-fit py-[3px] !justify-start')}>
                    <h1 className={cn('text-xs font-semibold text-green-400')}>{data?.name}</h1>
                </div>
                <ScrollArea
                    className={cn('container-full !max-h-[210px] center !justify-start flex-col')}
                >
                    {folderChildren && folderChildren.map((children: any, index: any) => (
                        <div
                            key={index}
                            onClick={() => handleClick(children)}
                            className={cn('w-full h-fit hover:border-cyan-500 border-l-[2px] pl-[4px] transition-300 between p-[5px] text-xs font-regular text-foreground')}
                        >
                            <div className={'container-fit gap-[10px] center'}>
                                <Folder size={15} className={'text-foreground'}/>
                                {children?.data?.name}
                            </div>

                            <span className={'text-foreground font-semibold text-xs'}>
                                {'>'}
                            </span>
                        </div>
                    ))}
                </ScrollArea>
            </div>
        )
    }

    return (
        <TooltipRenderer
            render={<Render/>}
            className={cn('backdrop-blur-md')}
            selected={selected}>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 1}}
                className={cn(`group relative flex-col rounded-full gap-[5px] border-cyan-500 transition-300 w-[220px] h-[220px] center p-[10px]`,
                    selected ? '!border-green-400 border-4' : '!border-4',
                    'hover:!border-green-400 border-4'
                )}>
                {/*{folderChildren && folderChildren.map((children: any, index: number) => (*/}
                {/*    <div*/}
                {/*        key={index}*/}
                {/*        className={cn('h-[50px] center flex-col !justify-start w-[230px]  overflow-hidden rounded-xl absolute',*/}
                {/*            `bottom-[50%] translate-y-[50%] -right-[20px] rotate-[${35 * index}deg] !border-cyan-500 border-4`*/}
                {/*        )}*/}
                {/*    >*/}

                {/*    </div>*/}
                {/*))}*/}

                <div
                    className={cn("container-full !space-x-[10px] between border-cyan-500 !justify-start p-[5px] rounded-full !bg-neutral-900/30 backdrop-blur-md",
                        selected ? '!border-green-400 border-4' : '!border-4',
                        'group-hover:!border-green-400 border-4'
                    )}
                >

                </div>
                <Handle
                    type="target"
                    position={Position.Top}
                    className="!size-[15px] center !bg-foreground"
                >
                </Handle>
            </motion.div>
        </TooltipRenderer>
    )
}

export const TooltipRenderer = ({children, selected, render, className, id, type, data }: { children: React.ReactNode, selected?: boolean, className?: string, render: any, id?: string, type?: string, data?: any }) => {

    return (
        <Tooltip delayDuration={1000}>
            <TooltipTrigger>
                {children}
            </TooltipTrigger>
            <TooltipContent className={cn(className)}>
                {render}
            </TooltipContent>
        </Tooltip>
    )
}