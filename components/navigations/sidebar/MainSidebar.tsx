'use client'
import React from 'react'
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import {ChevronDown, ChevronRight, File, LogOut, Settings, ChartPie, FileCode2} from "lucide-react";
import {sidebarLinkProps} from "@/types";
import Link from "next/link";

const MainSidebar = () => {
    const {
        isSidebarOpen
    } = useWorkFlowState();

    return (
        <div className={cn('between p-[8px] flex-col group container-fit !h-full')}>
            <div
                className={cn('!bg-transparent h-full rounded-md gap-[5px] w-[40px] transition-500 center !justify-start flex-col !backdrop-blur-lg',
                    isSidebarOpen ? 'w-[230px]' : 'gap-[15%]')}
            >
                <div className={cn('w-full center h-[120px] mb-[10px] rounded-md bg-neutral-900')}>
                    {/*<SidebarHeader/>*/}
                </div>

                <div className={cn('center flex-col gap-[10px] transition-300 w-full h-fit py-[10px] rounded-full',
                    !isSidebarOpen && 'bg-neutral-950')}>
                    <SidebarLinks
                        href={'/dashboard/overview'}
                        title={'Overview'}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20x" fill="#e3e3e3"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>
                        }/>

                    <SidebarLinks
                        href={'/dashboard/components'}
                        title={'My Components'}
                        icon={
                            <FileCode2 size={16}/>
                        }/>

                    <SidebarLinks
                        href={'/dashboard/analytics'}
                        title={'Analytics'}
                        icon={
                            <ChartPie size={16}/>
                        }/>
                </div>

            </div>

            <div className={cn('center mb-[10px] flex-col gap-[5px] w-full h-fit')}>
                <div className={cn('w-full center h-[100px] mb-[10px] rounded-md bg-neutral-900')}>

                </div>
                <SidebarLinks
                    href={'/dashboard/analytics'}
                    title={'Logout'}
                    icon={
                        <ChartPie size={16}/>
                    }/>
            </div>
        </div>
    )
}
export default MainSidebar


const SidebarLinks = ({href, icon, title, className} : sidebarLinkProps) => {
    const path = usePathname()
    const {
        isSidebarOpen
    } = useWorkFlowState();

    return (
        <Link href={href} className={cn(`hover:bg-[#00BBC2]/40 rounded-md mb-[5px] w-[35px] h-[35px] animate-in transition-all duration-500 flex items-center text-center justify-center ${path === href && "bg-[#00BBC2]/30 rounded-sm !border-l-4 !rounded-l-none !border-l-[#00BBC2] text-white" }`,
            isSidebarOpen ? 'w-full hover:pl-[7px]' : 'rounded-full',
            )}>
            <div className="flex items-center justify-between flex-row w-full h-full">
              <span className="mx-2 w-[35px] h-[35px] center">
                  {icon}
              </span>
                <span className={cn(`transition-all text-nowrap duration-500 hidden text-xs items-center justify-start w-full h-full ${path === href && "text-foreground"}`, className,
                    isSidebarOpen && 'flex')}>
                 {title}
              </span>
            </div>
        </Link>
    )
}
