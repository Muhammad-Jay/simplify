import React from 'react'
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";

const TooltipCard = ({children, className, content}: {children?: React.ReactNode, className: string, content: any}) => {
    return (
        <Tooltip>
            <TooltipTrigger>{children}</TooltipTrigger>
            <TooltipContent className={cn(className)}>{content}</TooltipContent>
        </Tooltip>
    )
}
export default TooltipCard
