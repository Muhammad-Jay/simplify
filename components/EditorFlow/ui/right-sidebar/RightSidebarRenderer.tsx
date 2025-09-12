'use client'
import React, {memo} from 'react'
import {RightSidebarStateType, useEditorState} from "@/context/EditorContext";
import {cn} from "@/lib/utils";
import {motion} from 'framer-motion'
import {Button} from "@/components/ui/button";
import SelectedNode from "@/components/EditorFlow/ui/right-sidebar/SelectedNode";
import {useFileState} from "@/context/FileContext";
import Loader from "@/components/Loader";
import {DevRun, RunOutputs} from "@/components/EditorFlow/ui/right-sidebar/DevRun";

const sidebarState = {
    preview : 'Preview',
    documentation: 'Documentation',
    selected: 'Selected',
    runPanel: 'Run',
    buildPanel: 'Build',
    none: ''
}

const RightSidebarRenderer = () => {
    const [isRunning, setIsRunning] = React.useState(false)
    const { rightSidebarState, files } = useEditorState()
    const {nodes, currentProjectId } = useFileState()

    const handleDeploy = React.useCallback(() => {
        let running = false

        setIsRunning(running)
        }, []);


    return rightSidebarState !== sidebarState.none && (
        <>
            <div
                className={cn('!w-[340px] !h-[85%] absolute right-[10px] top-[10px] !space-y-[10px] !m-[0px] !z-[7] rounded-md',
                    rightSidebarState === sidebarState.buildPanel,
                    rightSidebarState === sidebarState.runPanel)}>
                <motion.div
                    initial={{opacity: 0, scale: .5, x: 50}}
                    // whileHover={{scale: 1.05, duration: .3}}
                    animate={{opacity: 1, scale: 1, x: 0}}
                    exit={{ opacity: 0 , scale: .5 }}
                    transition={{duration: .1}}
                    className={cn(`container-full center rounded-md center border-[4px] border-zinc-800 !backdrop-blur-sm !bg-neutral-800/25`,
                        rightSidebarState === sidebarState.buildPanel  && '!w-[340px] !h-[250px]',
                        rightSidebarState === sidebarState.runPanel  && '!w-[340px] !h-[250px]')}>
                    {rightSidebarState === sidebarState.runPanel && (
                        <DevRun/>
                    )}
                    {rightSidebarState === sidebarState.buildPanel && (
                        <div className={'container-full center !justify-end flex-col p-[10px] rounded-lg rounded-md !h-full'}>
                            <Button
                                onClick={handleDeploy}
                                type={'button'}
                                className={'center w-full h-[40px] gap-[5px] rounded-md button-neutral hover:bg-cyan'}
                            >
                                {isRunning && (<Loader size={15} className={'animate-spin text-foreground'}/>)}
                                build
                            </Button>
                        </div>
                    )}
                    {rightSidebarState === sidebarState.selected && (
                        <SelectedNode/>
                    )}
                    {rightSidebarState === sidebarState.documentation && (
                        <div className={'container-full center rounded-lg rounded-md !h-full'}>

                        </div>
                    )}
                </motion.div>
                {rightSidebarState === sidebarState.buildPanel ||  rightSidebarState === sidebarState.runPanel &&
                    <RunOutputs sidebarState={sidebarState}/>
                }
            </div>
        </>
    )
}
export default RightSidebarRenderer

export const RightEditorSidebar = () => {
    return (
        <div className={cn(`w-full center flex-col !justify-start gap-[15px] py-[5px] !px-[5px] h-full rounded-xs m-0`)}>
            <RightSidebarActionButton state={'Selected'} />
            <RightSidebarActionButton state={'Documentation'} />
            <Button
                className={cn(`size-[20px] !p-0 rounded-xs button-neutral text-xs`)}>

            </Button>
            <Button
                className={cn(`size-[20px] !p-0 rounded-xs button-neutral text-xs`)}>

            </Button>
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
    const { setOpenBottomTabControlPanel } = useFileState()

    return (
        <Button
            onClick={() => {
                handleRightSidebarState(state)
                setOpenBottomTabControlPanel(false)
            }}
            className={cn(`size-[20px] !p-0 rounded-xs button-neutral text-xs`,
                rightSidebarState === state && 'bg-cyan',
                className)}>
            {icon}
        </Button>
    )
})
