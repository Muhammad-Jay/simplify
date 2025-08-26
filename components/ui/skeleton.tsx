import React from 'react'
import {cn} from "@/lib/utils";

const Skeleton = ({className}: {className?: string}) => {
    return (
        <div className={cn("w-[300px] h-[260px] center rounded-2xl animate-pulse bg-zinc-900", className)}>

        </div>
    )
}
export default Skeleton
