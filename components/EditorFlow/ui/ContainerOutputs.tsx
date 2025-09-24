'use client'
import React, { useEffect, useState } from 'react'
import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {FormatedLogs} from "@/components/EditorFlow/ui/right-sidebar/LogsRenderer";
import {useSocket} from "@/context/SocketContext";

const ContainerOutputs = () => {
    const logsContainerRef = React.useRef(null);

    const {
        containerOutputs
    } = useSocket()

    useEffect(() => {
        const scrollableElement = logsContainerRef.current.getScrollElement ? logsContainerRef.current.getScrollElement() : logsContainerRef.current
        if (scrollableElement){
            scrollableElement.scrollTop = scrollableElement.scrollHeight;
        }
    }, [containerOutputs])

    return (
        <div className={cn('between flex-col container-full gap-[10px] p-[4px]')}>
            <div className={cn('w-full h-[40px] rounded-sm bg-neutral-900')}>

            </div>
            <ScrollArea
                ref={logsContainerRef}
                className={cn('w-full !transition-300 overflow-hidden center !px-[10px] !justify-start',
                '!max-h-[400px] h-full')}>
                {containerOutputs && containerOutputs.map((log: any, i: number) => (
                    <div
                        key={`${log.message}:${i}`}
                        className={cn('center w-full my-[1px] h-fit p-[5px] !py-[2px]')}>
                         <pre className={cn('logs_wrapper w-full whitespace-trim overflow-scroll max-h-fit flex !flex-wrap p-[5px] rounded-sm bg-neutral-900/55 backdrop-blur-xs text-xs text-foreground/70 font-regular',
                             !log.message && '!p-0',
                             // log.type === 'error' && '!bg-red-500/20'
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
                <textarea
                    className={'w-full !min-h-[40px] !h-fit text-xs p-[5px] rounded-sm text-foreground/90 font-normal border-none outline-none mx-[5px] bg-neutral-900/55'}
                    id={'no-scrollbar'}
                />
        </div>
    )
}
export default ContainerOutputs
