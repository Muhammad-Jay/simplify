'use client'
import React, { useState, useCallback, useEffect } from 'react'
import {cn} from "@/lib/utils";
import { motion } from 'framer-motion'
import {useFileState} from "@/context/FileContext";
import {Button} from "@/components/ui/button";
import {LogsRenderer} from "@/components/EditorFlow/ui/right-sidebar/LogsRenderer";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Configurations} from "@/components/EditorFlow/ui/top middle tab/Panel_tabs/Configurations";
import Deploy from "@/components/EditorFlow/ui/right-sidebar/Deploy";
import EnvironmentVariables from "@/components/EditorFlow/ui/top middle tab/Panel_tabs/EnvironmentVariables";


export const deployPanelState = {
    overview: 'overview',
    logs: 'logs',
    environmentVariable: 'environment_Variable',
    settings: 'settings',
    advance: 'advance',
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
            className={cn('!w-[340px] transition-300 absolute right-[10px] top-[30px] !space-y-[10px] !m-[0px] !z-[10] rounded-2xl',
                // rightSidebarState === sidebarState.runPanel && buildProcess.length > 0 ? '!h-[94%]' : '!h-[250px]',
                '!h-[85%]',
                'right-[50%] translate-x-[50%] !w-[750px]'
            )}>
            <motion.div
                initial={{opacity: 0, scale: .5, x: 50}}
                // whileHover={{scale: 1.05, duration: .3}}
                animate={{opacity: 1, scale: 1, x: 0}}
                exit={{ opacity: 0 , scale: .5 }}
                transition={{duration: .1}}
                className={cn(`container-full transition-300 center rounded-2xl center flex-col border-[4px] !z-[10] border-zinc-800 !backdrop-blur-lg !bg-neutral-700/26`)}
            >
                <div className={'w-full between h-fit pr-[15px] pt-[5px]'}>
                    <Tabs setDeployState={setDeployState}/>
                    <Deploy/>
                </div>
                <div className={cn('center container-full !max-h-[90%]')}>
                    {deployState === deployPanelState.environmentVariable && (
                        <div className={cn('container-full center flex-col')}>
                            <EnvironmentVariables/>
                        </div>
                    )}
                    {deployState === deployPanelState.logs && (
                        <div className={cn('container-full center flex-col')}>
                            <Logs/>
                        </div>
                    )}
                    {deployState === deployPanelState.overview && (
                        <Configurations/>
                    )}
                    {deployState === deployPanelState.advance && (
                        <Advance/>
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

    return (
        <div className={'container-full between !justify-start !items-start flex-col p-[10px] gap-[10px] rounded-md !h-full'}>
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

const Advance = () => {
    return (
        <div className={cn('container-full center p-[15px] flex-col gap-[15px]')}>
            <div className={'w-full h-[40px] rounded-md bg-neutral-700'}>

            </div>
            <div className={'container-full rounded-lg bg-black'}>

            </div>
        </div>
    )
}
