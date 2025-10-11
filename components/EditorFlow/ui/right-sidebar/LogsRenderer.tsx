'use client'

import React, { useRef, useState, memo, useCallback, useEffect } from 'react';
import {useSocket} from "@/context/SocketContext";
import {cn} from "@/lib/utils";
import { ChevronRight, ChevronDown } from 'lucide-react'
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import Loader from "@/components/Loader";
import {nanoid} from 'nanoid'
import {Button} from "@/components/ui/button";
import {useFileState} from "@/context/FileContext";
import {deployPanelState} from "@/components/EditorFlow/ui/DeployPanelWrapper";

export const LogsRenderer = () => {
    const {
        buildProcess,
        buildStatus,
        setBuildProcess,
    } = useSocket();
    const {
        setDeployState,
    } = useFileState();

    const logsRef = useRef(null);

    useEffect(() => {
        if (buildProcess.build.logs?.length === 1){
            setDeployState(deployPanelState.logs)
        }
        if (logsRef.current){
            logsRef.current.scrollBottom = logsRef.current.scrollHeight;
        }
    }, [buildProcess]);

    const handleToggle = useCallback((e) => {
        const name = e.target?.id;
        console.log(name)
        setBuildProcess(prev => ({ ...prev, [name]: {...prev[name], isOpen: !prev[name]?.isOpen}}))
    }, [buildProcess, buildStatus])

    return (
        <>
            <ScrollArea
                ref={logsRef}
                className={cn('center flex-col !gap-0 !pr-[5px] !justify-start overflow-y-hidden !m-0 w-full transition-300 !max-h-[400px]')}
            >
                {Object.entries(buildProcess).map(([key, value]: [string, any], index: number) => (
                        <div
                            key={`${index}:${key}`}
                            className={cn('w-full center !justify-start flex-col overflow-y-hidden !gap-[3px] rounded-sm transition-300',
                                value.isOpen ? 'h-fit' : 'h-fit gap-0')}>
                            <button
                                id={key}
                                type={'button'}
                                onClick={handleToggle}
                                className={cn('between !w-full !gap-[8px] px-[10px] text-xs font-semibold rounded-sm transition-300 h-[40px] hover:bg-neutral-800 bg-neutral-800')}>
                                <div className={cn('w-fit center !gap-[8px] !justify-start flex-row h-full')}>
                                    {value.isOpen ? (
                                        <ChevronDown size={20} className={cn('text-foreground/90')}/>
                                    ) : (
                                        <ChevronRight size={20} className={cn('text-foreground/90')}/>
                                    )}
                                    <p className={cn('text-xs font-semibold text-foreground/90 capitalize')}>
                                        {key.replace('_', " ")}
                                    </p>
                                    {buildStatus === key && (
                                        <Loader size={15} className={cn('text-foreground/50 animate-spin')}/>
                                    )}
                                </div>

                                <div className={cn('center transition-300 pr-[10px] text-xs text-foreground/60 font-semibold')}>
                                    {value.logs.length > 0 && value.logs.length}
                                </div>
                            </button>
                            <ScrollArea className={cn('w-full !transition-300 overflow-hidden !py-[4px] center !justify-start',
                                value.isOpen ? 'h-fit' : 'h-[0px]')}>
                                {value.logs && value.logs.map((log: any, i: number) => (
                                    <div
                                        key={`${key}:${i}`}
                                        className={cn('center w-full h-fit')}>
                                           <pre className={cn('logs_wrapper w-full whitespace-trim overflow-scroll max-h-fit py-[10px] flex !flex-wrap p-[5px] px-[10px] bg-black/90 backdrop-blur-xs text-xs text-foreground/70 font-regular',
                                               !log.message && '!p-0',
                                               log.message.startsWith('Error') && 'bg-red-400/40',
                                               log.message.includes('successful') && 'bg-green-400/40'
                                           )}
                                                id={'no-scrollbar'}
                                           >
                                               <code className={cn('logs_wrapper h-fit')}>
                                                   <FormatedLogs log={log.message.toString()}/>
                                               </code>
                                           </pre>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                ))}
                <ScrollBar/>
            </ScrollArea>
        </>
    )
}

export  const FormatedLogs = memo(({log}: any) => {
    const [part, setPart] = useState([])

    useEffect(() => {
        let logMessage = log.replace(/"([^"]*)"/g, `<span key={index} className={'string-log text-green-400'}>"$1"</span>`)
        console.log(logMessage)
        const regexPattern = /(\[.*?\])|(".*?"|'.*?')|(\b\d+\b)/g

        const splits = log?.split(regexPattern).filter(Boolean);
        setPart(splits);
        console.log(part)
    }, [log])

    return (
        <div>
            {part.map((part, index) => {
                if (part.startsWith('[')){
                    return <span key={index} className={'bracket-log !font-bold text-xs !text-cyan-500/90 !mr-[4px]'}>{part}</span>
                }else if (part.startsWith("'") || part.startsWith('"')){
                    return <span key={index} className={'string-log text-green-400'}>{part}</span>
                }else if (!isNaN(Number(part)) && isFinite(Number(part))){
                    return <span key={index} className={'number-log text-yellow-400'}>{part}</span>
                }else {
                    return part
                }
            })}
        </div>
    )
})