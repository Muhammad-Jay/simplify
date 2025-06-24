'use client'
import React, {use, useState} from 'react'
import {sidebarLinkProps} from "@/types";
import {logOut} from "@/lib/supabase-auth/action";
import {toast} from "sonner";

const SidebarLogoutBtn = ({icon, title, className, href}: sidebarLinkProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        try {
            setIsLoading(true)
            await logOut()
        }catch (e) {
            toast.error(<p className={'center text-red-400 capitalize text-xs font-normal'}>error logging out</p>)
        }finally {
           setIsLoading(false)
        }
    }

    return (
        <button onClick={handleLogout} className={`group hover:bg-[#00BBC2]/40 hover:pl-[7px] hover:rounded-sm mb-[5px] w-[175px] h-[30px] animate-in transition-all duration-500 flex items-center text-center justify-center`}>
            <div className="flex items-center justify-between flex-row w-full h-full">
              <span className="mx-2 w-[35px] h-[35px] center">
                  {icon}
              </span>
                <span className={`transition-all text-nowrap duration-500 flex text-xs items-center justify-start w-full h-full ${className}`}>
                 {title}
              </span>
            </div>
        </button>
    )
}
export default SidebarLogoutBtn
