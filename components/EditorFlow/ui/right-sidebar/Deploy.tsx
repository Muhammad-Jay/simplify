'use client'
import React, { useCallback } from 'react'
import {Button} from "@/components/ui/button";
import Loader from "@/components/Loader";
import {useSocket} from "@/context/SocketContext";
import {onDeployRequest} from "@/lib/socket/actions";
import {useFileState} from "@/context/FileContext";
import {cn} from "@/lib/utils";
import {socketEvents} from "@/lib/socket/events";
import {useWorkFlowState} from "@/context/WorkSpaceContext";

/**
 * Interface for the file structure used in the deployment payload.
 */
interface DeployFileNode {
    name: string;
    fullPath: string;
    type: 'file' | 'folder';
    content?: string;
}

const Deploy: React.FC = () => {
    const {
        isComplete,
        setIsComplete,
        socket,
    } = useSocket();

    const {
        currentProjectId,
        setGlobalMessage,
        nodes, // Assuming nodes have FileNode structure from FileContext
        containerName,
        setIsDeployPanelOpen,
        currentContainer
    } = useFileState();

    const {workFlows} = useWorkFlowState();

    /**
     * Handles the Run/Stop toggle logic for container deployment.
     */
    const handleRun = useCallback(async () => {
        setIsDeployPanelOpen(true);
        try {
            // 1. Prepare file tree data for deployment payload
            const formatedNodes: DeployFileNode[] = nodes.map(nds => ({
                name: nds.data.name,
                fullPath: nds.data.label,
                type: nds.type === "codeEditor" ? 'file' : 'folder',
                content: nds.type === "codeEditor" ? nds.data.code : undefined,
            }));

            const isContainerRunning = currentContainer && currentContainer.State === 'running';

            // 2. Handle Stop Request
            if (isComplete && isContainerRunning && containerName) {
                if (socket) {
                    socket.emit(socketEvents.deployStop, containerName);
                    setGlobalMessage({type: 'success', message: `Stopping running container: ${containerName}.`});
                }
                return;
            }

            // 3. Handle Deploy Request (New Deployment)
            if (!isComplete) {
                setGlobalMessage({type: 'info', message: 'Deployment is already running.'});
                return;
            }

            // Start new deployment process
            setIsComplete(false);

            // Find the workflow node configuration
            const currentWorkFlowNode = workFlows.find(
                (nd: any) => nd.name === currentProjectId?.workSpaceName
            );

            // Validate workflow configuration
            if (!currentWorkFlowNode || !currentWorkFlowNode.id) {
                setGlobalMessage({type: 'error', message: 'Deployment failed. No valid workflow configuration found.'});
                setIsComplete(true);
                return;
            }

            setGlobalMessage({type: 'success', message: 'Starting deployment process...'});

            // Initiate the deploy request via socket
            if (socket) {
                onDeployRequest({
                    projectId: currentProjectId.id.toLowerCase(),
                    projectName: currentProjectId.name.toLowerCase(),
                    tree: formatedNodes,
                    workflowName: currentProjectId.workSpaceName.toLowerCase(),
                    workflowId: currentWorkFlowNode.id.toLowerCase()
                }, socket);
            } else {
                setGlobalMessage({type: 'error', message: 'Socket connection is not available.'});
                setIsComplete(true);
            }

        } catch (e) {
            console.error('Error during deployment preparation:', e);
            setGlobalMessage({type: 'error', message: 'An unexpected error occurred during deployment preparation.'});
            setIsComplete(true);
        }
    }, [isComplete, currentContainer, containerName, currentProjectId, nodes, workFlows, socket, setIsComplete, setGlobalMessage, setIsDeployPanelOpen]);

    const isRunning = currentContainer && currentContainer.State === 'running';

    return (
        <Button
            onClick={handleRun}
            type={'button'}
            // Disable if deployment is in progress AND it's not a running container we intend to stop
            disabled={!isComplete && !isRunning}
            className={cn(
                'center w-[70px] !h-[30px] !p-0 !text-xs !transition-400 !font-semibold gap-[5px] rounded-sm button-neutral',
                // Default Deploy style
                !isRunning && 'bg-gradient-to-br from-cyan-500 to-cyan-700 hover:bg-cyan',
                // Stop style when container is running
                isRunning && '!bg-gradient-to-br from-red-500 to-red-700 text-white hover:!bg-red-400'
            )}
        >
            {!isComplete && !isRunning && (
                <Loader size={15} className={'animate-spin text-white'}/>
            )}
            {isRunning ? 'Stop' : 'Deploy'}
        </Button>
    )
}

export default Deploy