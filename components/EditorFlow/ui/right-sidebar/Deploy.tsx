'use client'
import React from 'react'
import {DevRun} from "@/components/EditorFlow/ui/right-sidebar/DevRun";
import {Button} from "@/components/ui/button";
import Loader from "@/components/Loader";
import {useSocket} from "@/context/SocketContext";
import {useEditorState} from "@/context/EditorContext";
import {socketEvents} from "@/lib/socket/events";
import {onDeployRequest} from "@/lib/socket/actions";
import {useFileState} from "@/context/FileContext";
import {sidebarState} from "@/components/EditorFlow/ui/right-sidebar/RightSidebarRenderer";
import {cn} from "@/lib/utils";

const Deploy = () => {
    const {
        isComplete,
        setIsComplete,
        socket,
        setIsRunning,
        deployedUrl,
        containers
    } = useSocket();
    const {
        currentProjectId,
        setGlobalMessage,
        nodes,
        currentContainer,
        setIsDeployPanelOpen,
        setCurrentContainer
    } = useFileState();

    React.useEffect(() => {
        try {
            if (currentProjectId.name && containers){
                const projectContainer = containers.filter(container => container?.Names.includes(currentProjectId?.id.toLowerCase()))
                if (projectContainer){
                    setCurrentContainer({...projectContainer[0]});
                }
                console.log(projectContainer)
                // if (projectContainer?.State === 'running' && isRunning || buildStatus === 'error' || buildStatus === 'complete'){
                //     setIsComplete(true);
                // }
            }
        }catch (e) {
            console.warn(e)
        }
    }, [currentProjectId, containers]);

    const handleRun = async () => {
        setIsDeployPanelOpen(true);
        try {
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
                projectId: currentProjectId?.id,
                projectName: currentProjectId && currentProjectId?.name,
                containerName: currentProjectId && currentProjectId?.name,
                tree: formatedNodes,
            }

            if (isComplete && currentContainer?.State === 'running'){
                socket.emit(socketEvents.deployStop, currentProjectId?.id)
                setGlobalMessage({ type: 'success', message: 'stopping container...' })
            }else {
                setIsComplete(false)

                setGlobalMessage({ type: 'success', message: 'running the container.' })
                onDeployRequest({
                    projectId: currentProjectId.id,
                    projectName: currentProjectId.name,
                    tree: formatedNodes
                }, socket)
            }
        }catch (e) {
            console.log(e)
        }
    }

    return (
        <div className={'container-full between flex-col p-[10px] rounded-lg rounded-md !h-full'}>
            <div className={cn('center w-full h-full !justify-start flex-col gap-[10px] p-[10px]')}>
                {deployedUrl?.port && (
                    <a
                        className={cn('text-xs font-bold text-foreground/90 underline')}
                        target={'_blank'}
                        href={`http://${deployedUrl?.hostname}:${deployedUrl?.port}`}>
                        {`http://${deployedUrl?.hostname}:${deployedUrl?.port}`}
                    </a>
                )}
            </div>
            <Button
                onClick={handleRun}
                type={'button'}
                disabled={!isComplete}
                className={cn('center w-full !h-[30px] !p-0 !text-xs !transition-400 !font-semibold gap-[5px] !bg-cyan-500 rounded-sm button-neutral hover:bg-cyan',
                    currentContainer && currentContainer?.State === 'running' && '!bg-red-500 text-black hover:!bg-red-400')}
            >
                {!isComplete && (<Loader size={15} className={'animate-spin text-white'}/>)}
                {currentContainer && currentContainer?.State === 'running' ? 'Stop' : 'Deploy'}
            </Button>
        </div>
    )
}
export default Deploy
