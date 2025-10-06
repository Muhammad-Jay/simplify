'use client'
import React, {useState} from 'react'
import SidebarLinks from "@/components/navigations/sidebar/SidebarLinks";
import {cn} from "@/lib/utils";
import {ChevronDown, ChevronRight, File, LogOut, Settings, ChartPie, FileCode2} from "lucide-react";
import SidebarGroupLinks from "@/components/navigations/sidebar/SidebarGroupLinks";
import SidebarLogoutBtn from "@/components/navigations/sidebar/SidebarLogoutBtn";

const SidebarGroup = () => {
    const [group, setGroup] = useState(["drafts", "notes", 'todos', 'vision', 'market'])
    const [isOpen, setIsOpen] = useState(true)

    const handleToggle = () => {
        setIsOpen(prevState => !prevState)
    }

    return(
        <div className={'container-full !h-fit transition-all duration-500 center flex-col'}>
            <div onClick={handleToggle} className={cn(`container-full !h-[40px] pb-[5px] w-[130px] animate-in transition-all duration-500 border-b-1 border-b-[#00BBC2]/30 flex items-center text-center justify-center`)}>
                <span className={`pl-[10px] transition-all text-nowrap duration-500 flex text-sm font-bold items-center justify-start w-full h-full`}>
                    Group
                </span>
                <span className="w-[35px] h-full text-xs center transition-all duration-500">
                    {isOpen ? (<ChevronDown size={14} className={'transition-500'}/>) : (<ChevronRight size={14} className={'transition-500'}/>)}
                </span>
            </div>
            <div className={cn(`container-full relative justify-start transition-500 center flex-col`, !isOpen ? '!h-0 overflow-hidden' : '!h-[150px]')}>
                <div className={cn(`absolute inset-0 container-full overflow-y-auto pl-[35px] justify-start transition-500 center flex-col`)} id={'no-scrollbar'}>
                    {group.length > 0 ? group.map(g => (
                        <SidebarGroupLinks key={g} group={g} isOpen={isOpen}/>
                    )) : (
                        <div className={cn(`container-full center !h-[30px] text-xs font-semibold transition-500`, isOpen && '!hidden')}>
                            create a group
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


const Sidebar = () => {

    return (
            <aside className={`between !justify-start w-fit h-full z-10  gap-[10px] bg-neutral-300/10 backdrop-blur-lg border-r-[1px] border-neutral-800/80 flex-col rounded-lg p-[10px] px-0 !pt-0`}>
                <div className={'center flex-col container-full !pt-0 !px-[5px] gap-[5px] !h-fit'}>
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

                    {/*<SidebarLinks*/}
                    {/*    href={'/dashboard/conversation'}*/}
                    {/*    title={'Conversation'}*/}
                    {/*    icon={*/}
                    {/*        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20x" fill="#e3e3e3"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>*/}
                    {/*    }/>*/}

                    <SidebarLinks
                        href={'/dashboard/settings'}
                        title={'Settings'}
                        icon={
                            <Settings size={16}/>
                        }/>

                    <SidebarGroup/>
                </div>
                <div className={`center container-full flex-col !justify-end`}>
                    <SidebarLogoutBtn
                        href={''}
                        title={'Log Out'}
                        icon={
                            <LogOut size={16}/>
                        }/>
                </div>
            </aside>
    )
}
export default Sidebar
