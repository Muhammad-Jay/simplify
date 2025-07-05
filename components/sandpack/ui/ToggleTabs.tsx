'use client'
import React from 'react'
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

const ToggleTabs = ({setTab, tab, console, setIsOpen}: {tab: "Editor" | "Preview", setIsOpen: any, console: any, setTab: any}) => {
    const handleTab = () => {
        if (tab === "Editor"){
            setTab("Preview")
            return;
        }else {
            setTab("Editor")
            return;
        }
    }

    const handleToggle = () => {
        setIsOpen(prev => !prev)
    }

    return (
        <div className={cn(`w-full h-fit center flex-row gap-[10px] !justify-end mb-[10px] p-1`)}>
            <div className={cn(`size-[26px] rounded-sm bg-white`)}>

            </div>
            <div onClick={handleTab} className={cn(`text-xs h-[26px] w-[70px] center rounded-sm p-1 text-black bg-white transition-500`)}>
                {tab}
            </div>
            <div className={cn(`size-[26px] rounded-sm bg-white`)}>
                {console}
            </div>
            <div onClick={handleToggle} className={cn(`size-[26px] rounded-sm bg-white`)}>

            </div>
        </div>
    )
}
export default ToggleTabs
