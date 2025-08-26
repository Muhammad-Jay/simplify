import React from 'react'
import {cn} from "@/lib/utils";

type FolderNodeWrapperTypes = {
    children: React.ReactNode,
    stroke?: string
}

const NodeFolderWrapper = ({children, stroke = "#00BBC2"}: FolderNodeWrapperTypes) => {
    return (
        <div className={cn(`relative !bg-zinc-800 rounded-full transition-300 w-[200px] h-[100px] center p-[5px] border-2 border-cyan-500 stroke-[2px] stroke-[#00C8FF]`)}>
            <div className={"container-full center rounded-full border-2 border-cyan-500"}>
                {children}
            </div>
            <div style={{ backgroundColor: stroke}} className={cn(`!bg-zinc-800 border-2 border-cyan-500 !w-[120px] !h-[120px] rounded-full   -ml-[40px] z-[1] border-2`)}>

            </div>
            {/*<div style={{ backgroundColor: stroke}} className={cn(`absolute !bg-cyan-600 w-[50px] h-[120px] rounded-md bg-zinc-800  -right-[10px] -z-[2] border-2`)}/>*/}
        </div>
    )
}
export default NodeFolderWrapper
