'use client'
import React from 'react';
import {cn} from "@/lib/utils";
import {LeftBottomSidebarActionButton} from "@/components/EditorFlow/ui/left-sidebar/LeftSidebarActionButton";

export function BottomEditorSidebar() {

    return (
        <div className={cn(`w-fit center flex-col !justify-start gap-[15px] border-1 border-neutral-800 bg-neutral-800/50 backdrop-blur-md p-[7px] h-fit rounded-md`)}>
            <LeftBottomSidebarActionButton state={'BottomPanelLogs'} className={'text-white hover:text-black'}/>
            <LeftBottomSidebarActionButton state={''}/>
            <LeftBottomSidebarActionButton state={''} />
            <LeftBottomSidebarActionButton state={''} />
        </div>
    )
}