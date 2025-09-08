'use client'
import React from 'react'
import {useFileState} from "@/context/FileContext";
import NodeCard from "@/components/EditorFlow/ui/NodeWrapper";
import {cn} from "@/lib/utils";

const WorkSpaceNode = ({selected, data}: any) => {
    const {isVisible} = data
    const { setCurrentProjectId } = useFileState()

    return (
        <NodeCard
            type={'workSpace'}
            isVisible={isVisible}
            // isInteractive={isInteractive}
            selected={selected}
            stroke={ selected ? "#d0ff00" : data.color }
        >
            <div className={cn('between flex-col gap-[10px] p-[10px]')}>
                <div className={'center w-full !h-full'}>

                </div>
                <div className={'center w-full h-[50px]'}>
                    <h1 className={'text-foreground center font-semibold !text-sm'}>{data.name}</h1>
                </div>
            </div>
        </NodeCard>
    )
}
export default WorkSpaceNode
