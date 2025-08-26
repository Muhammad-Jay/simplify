'use client'
import React from 'react'
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import {ToolNodes} from "@/constants";

const Tools = () => {

    const onDragStart = (event: React.DragEvent, toolId: string)=> {
        event.dataTransfer.setData('application/reactflow', toolId)
        event.dataTransfer.effectAllowed = 'move'
    }

    return (
        <ScrollArea className={cn(`container-full center !justify-start p-[5px] space-y-[5px]`)}>
            {ToolNodes.map((tool) => (
                <div
                    onDragStart={(event) => onDragStart(event, tool.id)}
                    className={cn(`w-full h-fit cursor-grap center flex-col my-[5px] backdrop-blur-md bg-green-500/15 border-1 border-green-500/50 rounded-lg p-[10px]`)}
                    key={tool.id}
                    draggable={"true"}
                >
                    <div className={'h-[40px] center w-full text-xs font-semibold'}>
                        {tool.name}
                    </div>
                </div>
            ))}
        </ScrollArea>
    )
}
export default Tools
