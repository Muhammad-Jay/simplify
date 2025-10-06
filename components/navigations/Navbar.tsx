'use client'
import React , {useState, useEffect, memo} from 'react'
import {cn} from "@/lib/utils";
import Link from 'next/link'
import {User} from 'lucide-react'
import {usePathname} from "next/navigation";
import SearchInput from "@/components/navigations/SearchInput";
import SidebarHeader from "@/components/navigations/sidebar/SidebarHeader";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {useWorkFlowState} from "@/context/WorkSpaceContext";

const Navbar = () => {
    const { setIsSidebarOpen } = useWorkFlowState();

    return (
        <div className="h-[45px] w-full flex bg-transparent rounded-md backdrop-lg rounded-sm items-center justify-between">
            <div className={'w-fit between h-full space-x-[37px] pl-[15px]'}>
                <div
                    onClick={() => setIsSidebarOpen(prev => !prev)}
                    className={cn('center size-[30px] rounded-md bg-neutral-800')}>

                </div>
            </div>

            <div className={cn('between gap-[20px]')}>
                {[1,2,3,4,5].map((item: any) => (
                    <div
                        key={item}
                        className={cn('center size-[35px] rounded-full bg-neutral-900')}>

                    </div>
                ))}
            </div>

            <Link href={'/dashboard/profile'} className="w-fit ml-[20px] group transition-500 flex gap-[10px] max-[361px]:hidden flex-row h-full items-center justify-center rounded p-[8px]">
                <div className="w-[32px] h-[32px] bg-secondary text-white rounded-full text-xs flex items-center justify-center">
                    <User size={17} className={'group-hover:text-cyan-400 transition-500'}/>
                </div>
            </Link>
        </div>
    )
}
export default memo(Navbar)

const NavLinks = ({title, href}: {title: string, href: string}) => {
    const path = usePathname()

    return (
            <Link href={href} className={cn(`center p-[5px] capitalize text-shadow shadow-zinc-300 hover:text-cyan-400 transition-500 font-semibold text-white text-xs`, path === href && "text-cyan-400")}>
                {title}
            </Link>
    )
}
