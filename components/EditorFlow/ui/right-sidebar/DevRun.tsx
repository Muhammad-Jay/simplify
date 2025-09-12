'use client'
import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button";
import {useFileState} from "@/context/FileContext";
import {initializeBuildProcess} from "@/lib/podman_actions/init";
import Loader from "@/components/Loader";
import {cn} from "@/lib/utils";
import {useEditorState} from "@/context/EditorContext";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useSocket} from "@/context/SocketContext";

export const DevRun = () => {
    const {nodes, currentProjectId , setGlobalMessage } = useFileState()
    const { message } = useSocket();

    const [isRunning, setIsRunning] = React.useState(false);
    const [value, setValue] = React.useState('')

    const handleRun = async () => {
        // if (!value) return;
        try {
            setIsRunning(true);
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
                projectId: currentProjectId?.id || 'c15acf41-1bd7-4899-be74-7f70551e644c',
                projectName: currentProjectId && currentProjectId?.name,
                containerName: value,
                tree: formatedNodes
            }

            initializeBuildProcess(initBuildParams, ).then(() => console.log('building...'))
        }catch (e) {
            console.log(e)
        }finally {
            setIsRunning(false);
        }
    }
    return (
        <div className={'container-full between flex-col p-[10px] rounded-lg rounded-md !h-full'}>
            <div className={'w-full h-fit center !items-start flex-col gap-[7px] mt-[10px]'}>
                <p className={'center text-foreground/80 text-xs font-semibold'}>container name</p>
                {/*<Input*/}
                {/*    inputType={'text'}*/}
                {/*    placeholder={'unique..'}*/}
                {/*    onChange={(e) => setValue(e.target.value)}*/}
                {/*    value={value}*/}
                {/*    name={'search'}*/}
                {/*    className={'w-full h-[30px] text-xs font-regular !z-[10] text-foreground p-[10px] outline-none border-[1px] outline-zinc-600 !border-zinc-600 bg-neutral-900 rounded-sm'}*/}
                {/*/>*/}
                <p className={'text-foreground/90 font-semibold text-xs'}>{JSON.stringify(message)}</p>
            </div>
            <Button
                onClick={handleRun}
                type={'button'}
                className={'center w-full h-[40px] gap-[5px] rounded-md button-neutral hover:bg-cyan'}
            >
                {isRunning && (<Loader size={15} className={'animate-spin text-white'}/>)}
                Run
            </Button>
        </div>
    )
}

export const RunOutputs = (sidebarState: any) => {
    const { rightSidebarState } = useEditorState()
    const { message, isConnected, buildMessages } = useSocket();
    const [messages, setMessages] = useState([])

    return (
        <div className={cn('!w-[340px] !h-[230px] rounded-md border-[4px] border-zinc-800 !backdrop-blur-sm !bg-neutral-800/25',
            rightSidebarState === sidebarState.buildPanel || rightSidebarState === sidebarState.runPanel  && '!w-[340px] !h-[230px]',
            )}>
            <ScrollArea className={'center flex-col !justify-start container-full p-[10px]'}>
                {buildMessages && buildMessages.map((msg,index) => (
                    <div key={index} className={cn('w-full h-[20px] text-xs text-foreground/80 my-[5px]')}>
                        {JSON.stringify(msg?.message)}
                    </div>
                ))}
            </ScrollArea>
        </div>
    )
}
