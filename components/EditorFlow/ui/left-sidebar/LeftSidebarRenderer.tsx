import React, { useEffect } from 'react'
import { Panel } from  'reactflow'
import { motion } from 'framer-motion'
import {cn} from "@/lib/utils";
import {useEditorState} from "@/context/EditorContext";
import Tools from "@/components/EditorFlow/ui/left-sidebar/Tools";
import Dependencies from "@/components/EditorFlow/ui/left-sidebar/Dependencies";

const sidebarState = {
    file : 'File',
    dependencies: 'Dependencies',
    metadata: 'Metadata',
    none: ''
}

const LeftSidebarRenderer = () => {
    const { leftSidebarState } = useEditorState()

    return (
        <Panel position={'top-left'} className={cn('!w-[270px] !h-[85%] rounded-md border-[3px] !z-[7] !m-[10px] border-zinc-800 !backdrop-blur-sm !bg-neutral-800/25',
            leftSidebarState === sidebarState.none && 'hidden')}>
            <div
                className={cn(`container-full center rounded-md center bg-transparent`)}>
                {leftSidebarState === sidebarState.file && (
                    <div className={'container-full center rounded-lg rounded-md !h-full'}>
                        <Tools/>
                    </div>
                )}
                {leftSidebarState === sidebarState.dependencies && (
                    <div className={'container-full center rounded-lg rounded-md !h-full'}>
                        <Dependencies/>
                    </div>
                )}
                {leftSidebarState === sidebarState.metadata && (
                    <div className={'container-full center rounded-lg rounded-md !h-full'}>
                        {leftSidebarState}
                    </div>
                )}
            </div>
        </Panel>
    )
}
export default LeftSidebarRenderer


