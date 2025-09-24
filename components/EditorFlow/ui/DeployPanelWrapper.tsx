'use client'
import React, { useState, useCallback, useEffect } from 'react'
import {cn} from "@/lib/utils";
import { motion } from 'framer-motion'
import {useFileState} from "@/context/FileContext";
import {Button} from "@/components/ui/button";
import Loader from "@/components/Loader";
import {LogsRenderer} from "@/components/EditorFlow/ui/right-sidebar/LogsRenderer";
import {useSocket} from "@/context/SocketContext";
import ContainerOutputs from "@/components/EditorFlow/ui/ContainerOutputs";
import {ScrollArea} from "@/components/ui/scroll-area";


const deployPanelState = {
    configurations: 'configurations',
    logs: 'logs',
    environmentVariable: 'environment_Variable',
    settings: 'settings'
}

const DeployPanelWrapper = () => {
    const {
        deployState,
        setDeployState,
        setIsDeployPanelOpen,
        isDeployPanelOpen,
    } = useFileState();
    return (
        <div
            className={cn('!w-[340px] transition-300 absolute right-[10px] top-[10px] !space-y-[10px] !m-[0px] !z-[7] rounded-md',
                // rightSidebarState === sidebarState.runPanel && buildProcess.length > 0 ? '!h-[94%]' : '!h-[250px]',
                '!h-[95%]',
                'right-[50%] translate-x-[50%] !w-[700px]'
            )}>
            <motion.div
                initial={{opacity: 0, scale: .5, x: 50}}
                // whileHover={{scale: 1.05, duration: .3}}
                animate={{opacity: 1, scale: 1, x: 0}}
                exit={{ opacity: 0 , scale: .5 }}
                transition={{duration: .1}}
                className={cn(`container-full transition-300 center rounded-md center flex-col border-[4px] border-zinc-800 !backdrop-blur-sm !bg-neutral-800/26`)}
            >
                <div className={'w-full center h-fit'}>
                    <Tabs setDeployState={setDeployState}/>
                </div>
                <div className={cn('center container-full !max-h-[90%]')}>
                    {deployState === deployPanelState.environmentVariable && (
                        <div className={cn('container-full center flex-col')}>
                            {deployState}
                        </div>
                    )}
                    {deployState === deployPanelState.logs && (
                        <div className={cn('container-full center flex-col')}>
                            <Logs/>
                        </div>
                    )}
                    {deployState === deployPanelState.configurations && (
                        <div className={cn('container-full center flex-col')}>
                            {deployState}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
export default DeployPanelWrapper

const Tabs = ({setDeployState}: { setDeployState: any}) => {
    const {
        deployState
    } = useFileState();

    return (
        <ScrollArea className={cn('w-full center !flex-row !mx-[10px] border-b-[1px] pt-[10px] mt-[10px] border-b-neutral-800/70 !justify-start p-[5px] gap-[10px] h-[40px]')}>
            {Object.entries(deployPanelState).map(([key, value]) => (
                <Button
                    key={value}
                    type={'button'}
                    onClick={() => {
                        setDeployState(value)
                    }}
                    className={cn('w-fit h-[25px] hover:bg-transparent mx-[10px] capitalize bg-transparent !p-[0px] cursor-pointer font-semibold text-xs rounded-xs text-foreground/60',
                        deployState === value && 'text-cyan')}>
                    {value.replace('_', " ")}
                </Button>
            ))}
        </ScrollArea>
    )
}

export const Logs = () => {
    const {
        currentContainer,
        setIsDeployPanelOpen,
        isDeployPanelOpen,
    } = useFileState();

    const {
        isComplete,
    } = useSocket();

    return (
        <div className={'container-full between !justify-start !items-start flex-col p-[10px] gap-[10px] rounded-lg rounded-md !h-full'}>
            <div className={'w-full h-fit center !justify-start !items-start flex-col gap-[7px] mt-[0px]'}>
                {currentContainer && (
                    <>
                        <div className={'w-full between text-foreground/80 text-xs font-semibold'}>
                            <div className={cn('center !flex-nowrap text-xs capitalize font-semibold',
                                currentContainer?.State === 'running' ? 'text-green-400' : currentContainer?.State === 'stopping' ? 'text-yellow-300' : 'text-cyan')}>
                                {currentContainer && currentContainer?.State || 'not_created'}
                            </div>
                            <div className={cn('!text-sm font-semibold text-foreground/90')}>
                            </div>
                            <Button
                                onClick={() => {}}
                                type={'button'}
                                disabled={!isComplete}
                                className={cn('center w-[60px] !h-[30px] !p-0 !text-xs !transition-400 !font-semibold gap-[5px] !bg-cyan-500 rounded-sm button-neutral hover:bg-cyan',
                                    currentContainer && currentContainer?.State === 'running' && '!bg-red-500 text-black hover:!bg-red-400')}
                            >
                                {!isComplete && (<Loader size={15} className={'animate-spin text-white'}/>)}
                                {currentContainer && currentContainer?.State === 'running' ? 'Stop' : 'Run'}
                            </Button>
                        </div>
                    </>
                )}
            </div>
            <LogsRenderer/>
            <div className={cn('center w-full h-fit')}>
                <textarea
                    className={'w-full min-h-[40px] text-xs p-[5px] rounded-sm text-foreground/90 font-normal border-none outline-none mx-[5px] bg-neutral-900/55'}
                    id={'no-scrollbar'}
                />
            </div>
        </div>
    )
}
