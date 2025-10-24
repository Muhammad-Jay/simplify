import React, { useEffect } from 'react'
import { Panel } from  'reactflow'
import { motion } from 'framer-motion'
import {cn} from "@/lib/utils";
import {useEditorState} from "@/context/EditorContext";
import Tools from "@/components/EditorFlow/ui/left-sidebar/Tools";
import Dependencies from "@/components/EditorFlow/ui/left-sidebar/Dependencies";
import {Button} from "@/components/ui/button";
import Loader from "@/components/Loader";
import Projects from "@/components/EditorFlow/ui/left-sidebar/Projects";
import SelectedWorkFlowNode from "@/components/EditorFlow/ui/left-sidebar/SelectedWorkFlowNode";
import {PanelWrapper} from "@/components/EditorFlow/ui/PanelWrapper";
import {BottomPanelLogsRenderer} from "@/components/EditorFlow/ui/bottom-tabs/BottomPanelLogsRenderer";

const sidebarState = {
    projects: 'WorkSpaceProjects',
    file : 'File',
    dependencies: 'Dependencies',
    metadata: 'Metadata',
    bottomPanelLogs: 'BottomPanelLogs',
    none: ''
}

const LeftSidebarRenderer = () => {
    const { leftSidebarState, isBottomLogsRendererOpen, leftBottomSidebarState } = useEditorState()

    return leftSidebarState !== sidebarState.none && (
        <div
            className={cn('!w-[270px] center transition-300 absolute top-[10px] left-[60px] !z-7',
                isBottomLogsRendererOpen ? 'h-[55dvh]' : '!h-[80dvh]'
        )}>
            <motion.div
                initial={{opacity: 0, scale: .5, x: -100, y: -200}}
                // whileHover={{scale: 1.05, duration: .3}}
                animate={{opacity: 1, scale: 1, x: 0, y: 0}}
                exit={{ opacity: 0 , scale: .5 , x: -100, y: -200}}
                transition={{duration: .1, ease: 'circInOut'}}
                className={cn(`container-full transition-300 center center border-[3px] rounded-2xl border-zinc-800 !backdrop-blur-md !bg-neutral-800/35`)}>
                {leftSidebarState === sidebarState.projects && (
                    <div className={'container-full center !justify-end flex-col p-[5px] rounded-lg !h-full'}>
                        <Projects/>
                    </div>
                )}
                {leftSidebarState === sidebarState.file && (
                    <div className={'container-full center rounded-lg !h-full'}>
                        <Tools/>
                    </div>
                )}
                {leftSidebarState === sidebarState.dependencies && (
                    <div className={'container-full center rounded-lg !h-full'}>
                        <Dependencies/>
                    </div>
                )}
                {leftSidebarState === sidebarState.metadata && (
                    <div className={'container-full center rounded-lg !h-full'}>
                        <SelectedWorkFlowNode/>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
export default LeftSidebarRenderer


export const LeftBottomSidebarRenderer = () => {
    const { leftBottomSidebarState } = useEditorState()

    return leftBottomSidebarState !== sidebarState.none && (
        <div
            className={cn('!w-fit center !h-fit absolute bottom-[15px] left-[60px] !z-6',
                leftBottomSidebarState === sidebarState.bottomPanelLogs && 'container-fit'
            )}>
            <motion.div
                initial={{opacity: 0, scale: .5, x: -100, y: 500}}
                // whileHover={{scale: 1.05, duration: .3}}
                animate={{opacity: 1, scale: 1, x: 0, y: 0}}
                exit={{ opacity: 0 , scale: .5 , x: -100, y: 500}}
                transition={{duration: .1, ease: 'circInOut'}}
                className={cn(`container-full transition-300 center center border-[3px] rounded-2xl border-zinc-800 !backdrop-blur-md !bg-neutral-800/35`,
                )}>
                {leftBottomSidebarState === sidebarState.bottomPanelLogs && (
                    <BottomPanelLogsRenderer/>
                )}
            </motion.div>
        </div>
    )
}


