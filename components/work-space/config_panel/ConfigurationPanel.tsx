'use client'

import React from 'react';
import {cn} from "@/lib/utils";
import { motion } from "framer-motion";
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import Deploy from "@/components/EditorFlow/ui/right-sidebar/Deploy";
import {Tabs} from "@/components/EditorFlow/ui/DeployPanelWrapper";
import {NodeConfigRenderer} from "@/components/work-space/config_panel/NodeConfigRenderer";

const configurationPanelState = {
    configuration: 'configuration',
    advance: 'advance',
    resource: 'resource',
}

export const ConfigurationPanel = () => {
    const {
        isConfigurationPanelOpen,
        configPanelState,
        setConfigPanelState,
    } = useWorkFlowState();

    const { setDeployState } = useWorkFlowState();

    return isConfigurationPanelOpen && (
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
                    <Tabs option={configPanelState} values={configurationPanelState} setValue={setConfigPanelState}/>
                </div>
                <div className={cn('center container-full !max-h-[90%]')}>
                    {configPanelState === configurationPanelState.configuration && (
                        <NodeConfigRenderer/>
                    )}
                    {configPanelState === configurationPanelState.advance && (
                        <div>

                        </div>
                    )}
                    {configPanelState === configurationPanelState.resource && (
                        <div>

                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}