'use client'
import React, {useState, useEffect, memo} from 'react'
import {cn} from "@/lib/utils";
import mockSandpackFiles from "@/constants";
import { FolderCode, SearchCode } from 'lucide-react'
import {Button} from "@/components/ui/button";
import {LeftSidebarStateType, useEditorState} from "@/context/EditorContext";
import ModelWrapper from "@/components/EditorFlow/Global search/ModelWrapper";

const EditorSidebar = () => {
    const { setOpenModel, setOpen } = useEditorState()

    return (
        <div className={cn(`w-full center flex-col !justify-start gap-[15px] py-[5px] !px-[5px] h-full rounded-xs m-0`)}>
            <LeftSidebarActionButton state={'File'} icon={<FolderCode size={11} className={'text-white hover:text-black'}/>} />
            <LeftSidebarActionButton state={'Dependencies'} />
            <LeftSidebarActionButton state={'Metadata'} />
            <Button
                onClick={() => setOpen(prev => !prev)}
                className={cn(`size-[20px] !p-0 rounded-xs button-neutral text-xs`)}>
                <SearchCode size={11} className={'text-black'}/>
            </Button>
            <Button
                className={cn(`size-[20px] !p-0 rounded-xs button-neutral text-xs`)}>

            </Button>
            <Button
                className={cn(`size-[20px] !p-0 rounded-xs button-neutral text-xs`)}>

            </Button>
        </div>
    )
}
export default EditorSidebar

const LeftSidebarActionButton = memo(({state, icon, className } : { state: LeftSidebarStateType, icon?: any, className?: string }) => {
    const { handleLeftSidebarState, leftSidebarState } = useEditorState()

    return (
        <Button
            onClick={() => handleLeftSidebarState(state)}
            className={cn(`size-[20px] !p-0 rounded-xs button-neutral text-xs`,
                leftSidebarState === state && 'bg-cyan',
                className)}>
            {icon}
        </Button>
    )
})
