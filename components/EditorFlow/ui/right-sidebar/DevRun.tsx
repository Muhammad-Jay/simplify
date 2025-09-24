'use client'
import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button";
import {useFileState} from "@/context/FileContext";
import {initializeBuildProcess} from "@/lib/podman_actions/init";
import Loader from "@/components/Loader";
import {cn} from "@/lib/utils";
import { stop } from '@/lib/podman_actions/process/stop'
import {useEditorState} from "@/context/EditorContext";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useSocket} from "@/context/SocketContext";
import {LogsRenderer} from "@/components/EditorFlow/ui/right-sidebar/LogsRenderer";
import {onDeployRequest} from "@/lib/socket/actions";
import {socketEvents} from "@/lib/socket/events";
import {sidebarState} from "@/components/EditorFlow/ui/right-sidebar/RightSidebarRenderer";
import {motion} from 'framer-motion'
import DeployPanelWrapper from "@/components/EditorFlow/ui/DeployPanelWrapper";


export const DevRun = () => {
    const {
        nodes,
        currentProjectId ,
        isRunning,
        setIsRunning,
        value,
        setValue,
        setGlobalMessage,
        setIsDeployPanelOpen,
        isDeployPanelOpen,
        currentContainer,
        setCurrentContainer,
    } = useFileState()
    const {
        socket,
        containers,
        isComplete,
        setIsComplete,
        buildMessages,
        buildStatus
    } = useSocket();

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    return isDeployPanelOpen && (
        <div  className={cn('center w-fit h-fit')}>
            <DeployPanelWrapper/>
        </div>
    )
}

export const RunOutputs = (sidebarState: any) => {
    const { rightSidebarState } = useEditorState()
    const { message, isConnected, buildMessages } = useSocket();
    const [messages, setMessages] = useState([])

    const scrollRef = React.useRef(null)

    useEffect(() => {
        if (scrollRef.current){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [buildMessages.length]);

    return (
        <div className={cn('!w-[340px] h-fit p-[10px] rounded-md',
            rightSidebarState === sidebarState.buildPanel || rightSidebarState === sidebarState.runPanel  && '!w-[340px] !h-[230px]',
            )}>
            <ScrollArea ref={scrollRef} className={'center flex-col !max-h-[400px] !justify-start container-full p-[10px]'}>
                {buildMessages && buildMessages.map((msg,index) => (
                    <div key={index} className={cn('w-full h-fit center flex-wrap !justify-start text-xs !gap-[5px] border-y-[1px] border-neutral-800 text-foreground/95 py-[10px]')}>
                        {msg?.message}
                    </div>
                ))}
            </ScrollArea>
        </div>
    )
}
