'use client'
import React from 'react'
import { EllipsisVertical, Trash2 } from 'lucide-react'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {cn} from "@/lib/utils";
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import Loader from "@/components/Loader";

const WorkflowCardMenu = ({id, setIsOpen}: { id: string, setIsOpen: any}) => {
    const {
        isDeleting,
        deleteWorkFlow,
    } = useWorkFlowState();

    return (
        <DropdownMenu onOpenChange={(val) => setIsOpen(val)}>
            <DropdownMenuTrigger className={'border-none outline-none ring-none'}>
                <div
                    className={'!text-foreground bg-transparent container-fit p-[5px] !pr-0'}
                >
                    <EllipsisVertical className={cn('text-foreground font-bold translate-z-[180deg]')} size={17}/>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={cn('w-[150px] !z-[13]')}>
                <DropdownMenuItem
                    onClick={async () => deleteWorkFlow(id)}
                    className={'w-full'}>
                    <div className={cn('w-full h-fit between')}>
                        <h3 className={cn('text-xs text-foreground center gap-[4px] font-regular',
                            isDeleting && 'text-foreground/70')}>
                            Delete
                            {isDeleting && <Loader size={13} className={'animate-spin'}/>}
                        </h3>
                        <Trash2 size={15} className={cn('text-red-400')}/>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default WorkflowCardMenu
