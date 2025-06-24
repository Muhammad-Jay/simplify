'use client'
import React, {useState} from 'react'
import {File, MoreVertical} from 'lucide-react'
import Link from "next/link";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";

const SidebarGroupLinks = ({group, isOpen} : {group : string, isOpen : boolean, key : string}) => {
    const path = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <div className={cn(`group hover:bg-[#00BBC2]/40 hover:pl-[4px] hover:rounded-sm mb-[5px] text-xs w-full h-[30px] transition-500 flex items-center text-center justify-between`,
            !isOpen && '!hidden',
            path === `/dashboard/${group}` && "bg-[#00BBC2]/30 rounded-sm !border-l-4 !rounded-l-none !border-l-[#00BBC2] text-white")}>
            <Link href={`/dashboard/${group}`} className={'container-full transition-500 flex items-center text-center justify-between'}>
                 <span className="w-[35px] h-full text-xs center transition-all duration-500">
                    <File size={18}/>
                 </span>
                <span className={`transition-all ml-[10px] text-nowrap capitalize duration-500 flex text-xs items-center justify-start w-full h-full`}>
                   {group.length > 10 ? group.slice(0,10) + "..." : group}
                </span>
            </Link>
            <span  className={'h-full w-fit center px-[5px]'}>
                <MoreVertical size={14}/>
            </span>
        </div>
    )
}
export default SidebarGroupLinks
