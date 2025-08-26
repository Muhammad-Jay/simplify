'use client'
import React from 'react'
import { Panel } from 'reactflow'
import {cn} from "@/lib/utils";

const TopMiddleTap = () => {
    return (
        <Panel
            position={'bottom-left'}
            className={cn(`center relative !justify-start w-[500px] !mb-[2px] max-w-[700px] rounded-xs p-[3px] backdrop-blur-md bg-cyan-500/20`)}
        >
            <div className={'w-full h-[15px]'}>

            </div>
        </Panel>
    )
}
export default TopMiddleTap
