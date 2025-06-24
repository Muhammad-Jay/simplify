'use client'
import React from 'react'
import {usePathname} from "next/navigation";
import Link from "next/link";
import {sidebarLinkProps} from "@/types";

const SidebarLinks = ({href, icon, title, className} : sidebarLinkProps) => {
    const path = usePathname()

    return (
        <Link href={href} className={`group hover:bg-[#00BBC2]/40 hover:pl-[7px] hover:rounded-sm mb-[5px] w-[175px] h-[30px] animate-in transition-all duration-500 flex items-center text-center justify-center ${path === href && "bg-[#00BBC2]/30 rounded-sm !border-l-4 !rounded-l-none !border-l-[#00BBC2] text-white" }`}>
            <div className="flex items-center justify-between flex-row w-full h-full">
              <span className="mx-2 w-[35px] h-[35px] center">
                  {icon}
              </span>
                <span className={`transition-all text-nowrap duration-500 flex text-xs items-center justify-start w-full h-full ${path === href && "text-white"} ${className}`}>
                 {title}
              </span>
            </div>
        </Link>
    )
}
export default SidebarLinks
