'use client'
import React, { useState } from 'react'
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";

interface FlowSidebarWrapperType {
    isOpen?: boolean;
    className?: string;
    setIsOpen?: any
    children: React.ReactNode;
}

const FlowSidebarWrapper = ({children, className}: FlowSidebarWrapperType) => {
    const [isOpen, setIsOpen] = useState(true)

    const handleClick = () => setIsOpen((prev: boolean) => !prev)

    return (
        <div className={cn(`h-full w-[30px] !px-[3px] flex-col group !justify-start transition-300 center`,
            className,
            // isOpen ? '!w-[250px]' : '!w-[50px]',
            // 'hover:!w-[300px]'
        )}>
                {children}
        </div>
    )
}
export default FlowSidebarWrapper
