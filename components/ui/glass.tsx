import React from 'react'
import {cn} from "@/lib/utils";

const GlassCard = ({children, className}: {children?: React.ReactNode, className?: string}) => {
    return (
        <div className={cn(`backdrop-blur-lg border border-cyan-700/40 rounded-xl`, className)}>
            {children}
        </div>
    )
}
export default GlassCard
