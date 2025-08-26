'use client'
import React, {memo} from 'react'
import {RightSidebarStateType, useEditorState} from "@/context/EditorContext";
import { Panel } from 'reactflow'
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import SelectedNode from "@/components/EditorFlow/ui/right-sidebar/SelectedNode";
import Dependencies from "@/components/EditorFlow/ui/left-sidebar/Dependencies";
import { SandpackProvider, SandpackPreview, } from '@codesandbox/sandpack-react'

const sidebarState = {
    preview : 'Preview',
    documentation: 'Documentation',
    selected: 'Selected',
    none: ''
}

const RightSidebarRenderer = () => {
    const { rightSidebarState, files } = useEditorState()

    return (
        <Panel position={'top-right'} className={cn('!w-[290px] !h-[85%] !m-[10px] !z-[7] rounded-md border-[4px] border-zinc-800 !backdrop-blur-sm !bg-neutral-800/25',
            rightSidebarState === sidebarState.none && 'hidden',
            rightSidebarState === sidebarState.preview && '!w-[320px] !h-[280px]')}>
            <div
                className={cn(`container-full center rounded-md center bg-transparent`)}>
                {rightSidebarState === sidebarState.preview && (
                    <div className={'container-full center rounded-lg rounded-md !h-full'}>
                        {/*<SandpackProvider*/}
                        {/*    files={files}*/}
                        {/*    template={'react'}*/}
                        {/*>*/}
                        {/*    <SandpackPreview  className={'container-full rounded-md'}/>*/}
                        {/*</SandpackProvider>*/}
                    </div>
                )}
                {rightSidebarState === sidebarState.selected && (
                    <SelectedNode/>
                )}
                {rightSidebarState === sidebarState.documentation && (
                    <div className={'container-full center rounded-lg rounded-md !h-full'}>

                    </div>
                )}
            </div>
        </Panel>
    )
}
export default RightSidebarRenderer

export const RightEditorSidebar = () => {
    return (
        <div className={cn(`w-full center flex-col !justify-start gap-[15px] py-[5px] !px-[5px] h-full rounded-xs m-0`)}>
            <RightSidebarActionButton state={'Preview'} />
            <RightSidebarActionButton state={'Selected'} />
            <RightSidebarActionButton state={'Documentation'} />
            <RightSidebarActionButton state={'Preview'} />
            <Button
                className={cn(`size-[20px] !p-0 rounded-xs button-neutral text-xs`)}>

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

const RightSidebarActionButton = memo(({state, icon, className } : { state: RightSidebarStateType, icon?: any, className?: string }) => {
    const { handleRightSidebarState, rightSidebarState } = useEditorState()

    return (
        <Button
            onClick={() => handleRightSidebarState(state)}
            className={cn(`size-[20px] !p-0 rounded-xs button-neutral text-xs`,
                rightSidebarState === state && 'bg-cyan',
                className)}>
            {icon}
        </Button>
    )
})
