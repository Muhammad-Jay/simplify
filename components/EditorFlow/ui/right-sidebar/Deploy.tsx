'use client'
import React from 'react'
import {Button} from "@/components/ui/button";
import Loader from "@/components/Loader";
import {useSocket} from "@/context/SocketContext";
import {onDeployRequest} from "@/lib/socket/actions";
import {useFileState} from "@/context/FileContext";
import {cn} from "@/lib/utils";
import {socketEvents} from "@/lib/socket/events";
import {useWorkFlowState} from "@/context/WorkSpaceContext";

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

    const { workFlows } = useWorkFlowState();

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

                const currentWorkFlowNode = workFlows.filter(nd => nd.name === currentProjectId?.workSpaceName);

                console.log('the current workflow node', currentWorkFlowNode[0]?.id)

                if (!currentWorkFlowNode){
                    setGlobalMessage({ type: 'error', message: 'No workflow ID.' })
                    return;
                }

                setGlobalMessage({ type: 'success', message: 'running the container.' })
                onDeployRequest({
                    projectId: currentProjectId.id,
                    projectName: currentProjectId.name,
                    tree: formatedNodes,
                    workflowName: currentProjectId?.workSpaceName,
                    workflowId: currentWorkFlowNode[0]?.id?.toLowerCase()
                }, socket)
            }
        }catch (e) {
            console.log(e)
        }
    }

    return (
            <Button
                onClick={handleRun}
                type={'button'}
                disabled={!isComplete}
                className={cn('center w-[70px] !h-[30px] !p-0 !text-xs !transition-400 !font-semibold gap-[5px] bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-sm button-neutral hover:bg-cyan',
                    currentContainer && currentContainer?.State === 'running' && '!bg-gradient-to-br from-red-500 to-red-700 text-black hover:!bg-red-400')}
            >
                {!isComplete && (<Loader size={15} className={'animate-spin text-white'}/>)}
                {currentContainer && currentContainer?.State === 'running' ? 'Stop' : 'Deploy'}
            </Button>
    )
}
export default Deploy
