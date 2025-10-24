'use client'
import React from 'react';
import {LeftBottomSidebarStateType, LeftSidebarStateType, useEditorState} from "@/context/EditorContext";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export const LeftSidebarActionButton = React.memo(({state, icon, className}: {
    state: LeftSidebarStateType,
    icon?: any,
    className?: string
}) => {
    const {handleLeftSidebarState, leftSidebarState} = useEditorState()

    return (
        <Button
            onClick={() => handleLeftSidebarState(state)}
            className={cn(`size-[25px] !p-0 backdrop-blur-md rounded-md bg-neutral-700 text-xs`,
                leftSidebarState === state && 'bg-cyan',
                className)}>
            {icon}
        </Button>
    )
})

export const LeftBottomSidebarActionButton = React.memo(({state, icon, className}: {
    state: LeftBottomSidebarStateType,
    icon?: any,
    className?: string
}) => {
    const {leftBottomSidebarState,
        setLeftBottomSidebarState} = useEditorState()

    return (
        <Button
            onClick={() => setLeftBottomSidebarState(prev => prev === state ? '' : state)}
            className={cn(`size-[25px] !p-0 backdrop-blur-md rounded-md bg-neutral-700 text-xs`,
                leftBottomSidebarState === state && 'bg-cyan',
                className)}>
            {icon}
        </Button>
    )
})