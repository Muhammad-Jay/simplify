'use client'
import React, {memo} from 'react'
import {RightSidebarStateType, useEditorState} from "@/context/EditorContext";
import { Panel } from 'reactflow'
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import SelectedNode from "@/components/EditorFlow/ui/right-sidebar/SelectedNode";
import Dependencies from "@/components/EditorFlow/ui/left-sidebar/Dependencies";
import { SandpackProvider, SandpackPreview, } from '@codesandbox/sandpack-react'
import {useFileState} from "@/context/FileContext";
import {initializeBuildProcess} from "@/lib/podman_actions/init";
import Loader from "@/components/Loader";

const sidebarState = {
    preview : 'Preview',
    documentation: 'Documentation',
    selected: 'Selected',
    none: ''
}

const RightSidebarRenderer = () => {
    const [isRunning, setIsRunning] = React.useState(false)
    const { rightSidebarState, files } = useEditorState()
    const {nodes} = useFileState()

    const handleDeploy = React.useCallback(() => {
        let running = false
        const formatedNodes = nodes.map(nds => {
            if (nds.type === "codeEditor"){
                return {
                    name: nds.data.name,
                    fullPath: nds.data.label,
                    type: 'file',
                    content: nds.data.code
                }
            }else {
                return {
                    name: nds.data.name,
                    fullPath: nds.data.label,
                    type: 'folder',
                }
            }
        })

        const initBuildParams = {
            projectId: 'c15acf41-1bd7-4899-be74-7f70551e644c',
            projectName: 'my-next-app',
            tree: formatedNodes
        }

        initializeBuildProcess(initBuildParams, running).then(() => console.log('building...'))
        setIsRunning(running)
        }, []);


    return (
        <Panel position={'top-right'} className={cn('!w-[320px] !h-[85%] !m-[10px] !z-[7] rounded-md border-[4px] border-zinc-800 !backdrop-blur-sm !bg-neutral-800/25',
            rightSidebarState === sidebarState.none && 'hidden',
            rightSidebarState === sidebarState.preview && '!w-[320px] !h-[280px]')}>
            <div
                className={cn(`container-full center rounded-md center bg-transparent`)}>
                {rightSidebarState === sidebarState.preview && (
                    <div className={'container-full center !justify-end flex-col p-[10px] rounded-lg rounded-md !h-full'}>
                        <Button
                            onClick={handleDeploy}
                            type={'button'}
                            className={'center w-full h-[40px] gap-[5px] rounded-md button-neutral hover:bg-cyan'}
                        >
                            {isRunning && (<Loader size={15} className={'animate-spin text-foreground'}/>)}
                            Run
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
            </div>
        </Panel>
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
