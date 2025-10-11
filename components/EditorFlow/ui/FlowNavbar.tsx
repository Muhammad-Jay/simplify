'use client'
import React, {useMemo, useState} from 'react'
import {Play, Copy, Check} from 'lucide-react'
import {Button} from "@/components/ui/button";
import { useReactFlow } from 'reactflow'
import {useEditorState} from "@/context/EditorContext";
import {cn} from "@/lib/utils";
import {useFileState} from "@/context/FileContext";
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import {useSocket} from "@/context/SocketContext";
import {ScrollArea} from "@/components/ui/scroll-area";

const FlowNavbar = ({id}) => {
    const { rightSidebarState, leftSidebarState, handleRightSidebarState, handleLeftSidebarState, recentActiveNodes, nodes, selectedNode, setCurrentNode, setIsOnFitView } = useEditorState()
    const { currentProjectId, setIsDeployPanelOpen, isDeployPanelOpen, currentContainer, setGlobalMessage } = useFileState();
    const { handleNavigate } = useWorkFlowState();
    const { isConnected, error, socket, fetchContainerLoaded } = useSocket();

    const fullPath = useMemo(() => {
        return recentActiveNodes && recentActiveNodes.map((recent) => {
            return nodes.filter((node) => node && node.data.name === recent.name)[0]
        }) || []
    }, [selectedNode, recentActiveNodes])


    return (
        <div className={'w-full h-[35px] gap-[4px] mt-[3px] between p-[3px] py-[5px] px-[3px] bg-black'}>
            <div className={'w-fit h-full rounded-xs center gap-[7px] px-[3px] !justify-start'}>
                <Button
                    type={'button'}
                    onClick={() => handleLeftSidebarState('WorkSpaceProjects')}
                    className={cn(`w-[70px] h-[25px] !p-[0px] font-semibold gap-[5px] center button-neutral !text-white text-xs hover:bg-cyan/80 transition-300 rounded-xs`,
                        leftSidebarState === 'WorkSpaceProjects' && 'bg-cyan !text-black')}>
                    projects
                </Button>
                <Button type={'button'} className={'w-[70px] h-[25px] !p-[0px] font-light text-xs rounded-xs button-neutral text-white'}>

                </Button>
                <Button type={'button'} className={'w-[70px] h-[25px] !p-[0px] font-light text-xs rounded-xs button-neutral text-white'}>

                </Button>
            </div>
            <div className={'w-full overflow-x-auto p-[2px] px-[10px] gap-[5px] between h-full rounded-xs bg-zinc-800'} id={'no-scrollbar'}>
                {currentProjectId && (
                    <div className={'w-fit center gap-[10px]'}>
                        <span
                            onClick={() =>  handleNavigate(currentProjectId.workSpaceName)}
                            className={cn('center cursor-pointer hover:!text-cyan-500 transition-300 text-foreground text-xs font-bold',
                            !id && 'text-[#d0ff00]')}>{currentProjectId?.workSpaceName || ''}</span>
                        <span className={'text-cyan-500/90  text-xs'}>{'>'}</span>
                    </div>
                )}
                <RenderPath/>
                <div className={'center container-fit gap-[10px]'}>
                    <Button
                        onClick={() => {
                            socket.emit('build_logs_client', {type: 'build' ,message: "message sent!. okay?" })
                        }}
                        type={'button'} className={cn('w-[50px] h-[20px] !p-[0px] cursor-pointer font-semibold text-xs rounded-sm button-neutral text-white')}>

                    </Button>

                    <span className={cn('!size-[10px] rounded-full bg-yellow-400',
                        isConnected && !error && 'bg-green-400')}/>
                </div>
            </div>
            <div className={'w-fit h-full rounded-xs center gap-[7px] px-[3px] !justify-end'}>
                <Button
                    type={'button'}
                    onClick={() => {
                        setIsDeployPanelOpen(prev => !prev);
                    }}
                    className={cn('w-[70px] h-[25px] !p-[0px] cursor-pointer bg-gradient-to-br from-cyan-500 to-cyan-700 transition-300 font-semibold text-xs rounded-xs button-neutral text-white',
                        isDeployPanelOpen && 'bg-gradient-to-br from-cyan-500 to-cyan-700')}
                >
                    <Play size={5} className={cn('center text-white fill-white',
                        rightSidebarState === 'Run' && 'fill-black text-black' )}/>
                    Run
                </Button>
                {fetchContainerLoaded && (
                    <>
                        <Button
                            onClick={() => {
                                handleRightSidebarState('Run')
                            }}
                            type={'button'} className={cn('w-[70px] h-[25px] !p-[0px] cursor-pointer font-semibold text-xs rounded-xs button-neutral text-white',
                            rightSidebarState === 'Run' && 'bg-cyan !text-black')}>

                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}
export default FlowNavbar

const CopyProjectId = ({projectId}: { projectId: string}) => {
    const { setGlobalMessage } = useFileState();
    const [copied, setCopied] = useState(false)

    const copyId = async () => {
        try {
            setCopied(true)
            await navigator.clipboard.writeText(projectId);
            setGlobalMessage({
                type: 'success',
                message: '✅ project ID copied'
            })
        }catch (e) {
            setGlobalMessage({
                type: 'error',
                message: 'Error copying text'
            })
        }finally {
            setTimeout(() => {
                setCopied(false)
            }, 3000)
        }
    }

    return (
        <div className={cn('w-fit center flex-nowrap gap-[5px] h-fit')}>
                <span
                    onClick={copyId}
                    className={cn('container-fit transition-300 center text-nowrap text-xs text-foreground/80 font-regular')}
                >{projectId && projectId.slice(0, 15)}...</span>
            <span
                onClick={copyId}
                className={'size-[20px] center rounded-sm transition-300'}
            >
                {
                    copied ? <Check size={14} className={'text-foreground transition-300 hover:text-cyan-500'}/>
                        :
                        <Copy size={14} className={'text-foreground transition-300 hover:text-cyan-500'}/>
                }
                </span>
        </div>
    )
}

const RenderPath = () => {
    const { setIsOnFitView } = useEditorState()
    const { fitView } = useReactFlow();
    const {
        selectedNode,
        setSelectedNode,
        nodes,
        setIsOnQuery,
        currentFilePath,
        setCurrentFilePath,
        currentNodes,
        setCurrentSelectedNode,
        currentSelectedNode,
        currentProjectId,
    } = useFileState();

    const fullPath = useMemo(() => {
        if (!currentFilePath) return [];
        return currentFilePath && currentFilePath.split('/').filter(Boolean).map((path) => {
            return nodes.filter((node: any) => node.data.name === path)[0]
        })
    }, [currentFilePath])

    return (
        <ScrollArea
            className={cn('w-full center flex-row !justify-start gap-[5px]')}
            id={'no-scrollbar'}
        >
            <ul className={'text-xs !w-full !justify-start px-[6px] text-white flex-nowrap center flex-row gap-[5px]'}>
                {!fullPath ? null : fullPath.map((node: any, index: number) => (
                    <li key={`${node?.data?.name || 'empty'}:${index}`} className={'center group container-fit flex-row mr-[5px] text-xs gap-[10px]'}>
                        <button
                            type={'button'}
                            onClick={() => {
                                setCurrentSelectedNode(node)
                                setCurrentFilePath(node.id)
                                fitView({
                                    nodes: [],
                                    duration: 800,
                                    padding: 0.10,
                                    maxZoom: 1,
                                    minZoom: .5
                                })
                                setIsOnQuery(true)
                            }}
                            className={cn('text-xs bg-transparent center gap-[5px] text-nowrap hover:text-cyan-500 rounded-xs transition-300 container-fit p-[2px] text-white/80',
                                node?.data?.name === selectedNode?.data?.name && 'text-[#d0ff00]'
                            )}>{node?.data?.name || ''}
                        </button>
                        {node?.data?.name === currentProjectId?.name && (
                            <span className={'text-cyan-500/90'}>|</span>
                        )}
                        {node?.data?.name === currentProjectId?.name && (
                            <CopyProjectId projectId={currentProjectId?.id}/>
                        )}
                        <p className={'text-cyan-500/90  text-xs'}>
                            {index === fullPath.length - 1 ? '' : '>'}
                        </p>
                    </li>
                ))}
            </ul>
        </ScrollArea>
    )
}
