import React from 'react'
import {cn} from "@/lib/utils";
import SidebarRenderer from "@/components/sandpack/SidebarRenderer";

const EditorSidebar = ({className, isOpen}: { isOpen: boolean, className?: string}) => {
    return (
        <div className={cn(`center flex-col z-10 bg-zinc-900 bd h-full rounded-md transition-500`, className,
            isOpen ? "w-[350px]" : "!w-0")}>
            <SidebarRenderer/>
        </div>
    )
}
export default EditorSidebar
