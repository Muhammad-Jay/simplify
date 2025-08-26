"use client"
import React from 'react'
import {motion} from 'framer-motion'
import { Handle, Position } from 'reactflow'
import {cn} from "@/lib/utils";

const NodeCard = ({children, isVisible, selected, stroke = "#00BBC2", isInteractive}: {children: React.ReactNode, isVisible?: boolean, isInteractive?: boolean, selected?: boolean, stroke?: string}) => {
    const [isCollapsed, setIsCollapsed] = React.useState(selected)

    return (
        <div
            className={cn('container-fit transition-300 center',
                )}>
            <div style={{
                backgroundColor: "black",
            }}
                 className={cn(`relative !px-[10px] !backdrop-blur-lg !bg-zinc-700/30 !pb-[10px] rounded-3xl flex-col group !justify-start transition-300 min-w-[400px] max-w-[500px] min-h-[250px] max-h-[550px] center p-[5px]`, `!border-[#00BBC2] border-[2px]`,'hover:!border-[#d0ff00] border-[3px]',
                     selected && '!border-[#d0ff00] border-[3px]',
                     !isVisible && '!hidden transition-500',
                 )}>
                <div className={cn(`absolute w-[120px] h-[80px] rounded-3xl border-transparent -top-[15px] -left-[15px] -z-[2] !border-t-[7px] !border-l-[7px] !border-t-cyan-500 !border-l-cyan-500`, selected && `-top-[20px] -left-[20px] transition-300 !border-[#d0ff00]`, `group-hover:!border-t-[#d0ff00] group-hover:!border-l-[#d0ff00]`)}/>
                <div className={cn(`absolute w-[120px] h-[80px] rounded-3xl border-transparent -bottom-[15px] -left-[15px] -z-[2] !border-b-[7px] !border-l-[7px] !border-b-cyan-500 !border-l-cyan-500`, selected && `-bottom-[20px] -left-[20px] transition-300 !border-[#d0ff00]`, `group-hover:!border-b-[#d0ff00] group-hover:!border-l-[#d0ff00]`)}/>
                <div className={cn(`absolute w-[120px] h-[80px] rounded-3xl border-transparent -top-[15px] -right-[15px] -z-[2] !border-t-[7px] !border-r-[7px] !border-t-cyan-500 !border-r-cyan-500`, selected && `-top-[20px] -right-[20px] transition-300 !border-[#d0ff00]`, `group-hover:!border-t-[#d0ff00] group-hover:!border-r-[#d0ff00]`)}/>
                <div className={cn(`absolute w-[120px] h-[80px] rounded-3xl border-transparent -bottom-[15px] -right-[15px] -z-[2] !border-b-[7px] !border-r-[7px] !border-b-cyan-500 !border-r-cyan-500`, selected && `-bottom-[20px] -right-[20px] transition-300 !border-[#d0ff00]`, `group-hover:!border-b-[#d0ff00] group-hover:!border-r-[#d0ff00]`)}/>
                    {children}
            </div>

            {/* Node Handles */}
            <Handle
                type="target"
                position={Position.Top}
                className="!size-[15px] center !bg-white"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!size-[15px] center !bg-white"
            />
            <Handle
                type="source"
                position={Position.Left}
                className="!size-[15px] center !bg-white"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="!size-[15px] center !bg-white"
            />
        </div>
    )
}
export default NodeCard