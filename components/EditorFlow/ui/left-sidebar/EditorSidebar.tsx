'use client'
import React from 'react'
import {cn} from "@/lib/utils";
import {FolderCode, SearchCode} from 'lucide-react'
import {Button} from "@/components/ui/button";
import {useEditorState} from "@/context/EditorContext";
import {LeftSidebarActionButton} from "@/components/EditorFlow/ui/left-sidebar/LeftSidebarActionButton";

const EditorSidebar = () => {
    const { setOpenModel, setOpen } = useEditorState()

    return (
        <div className={cn(`w-fit center flex-col !justify-start gap-[15px] border-1 border-neutral-800 bg-neutral-800/50 backdrop-blur-md p-[7px] h-fit rounded-md`)}>
            <LeftSidebarActionButton state={'File'} icon={<FolderCode size={11} className={'text-white hover:text-black'}/>} />
            <LeftSidebarActionButton state={'Dependencies'} />
            <LeftSidebarActionButton state={'Metadata'} />
            <Button
                onClick={() => setOpen(prev => !prev)}
                className={cn(`size-[25px] !p-0 backdrop-blur-md rounded-md bg-neutral-700 text-xs`)}>
                <SearchCode size={11} className={'text-black'}/>
            </Button>
        </div>
    )
}
export default EditorSidebar

