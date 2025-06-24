'use client'
import React from 'react'
import {USER} from "@/types";
import useAuthClient from "@/hooks/supabase-auth/useAuthClient";
import {cn} from "@/lib/utils";
import Link from 'next/link'


const Navbar = () => {
    const user: USER = useAuthClient()

    return (
        <div className="h-[38px] w-full flex items-center justify-between mb-[8px]">
            <div className={'w-fit between h-full space-x-[37px] pl-[15px]'}>
                <NavLinks title={'explore'} href={'/explore'}/>
                <NavLinks title={'create new'} href={'/dashboard/create'}/>
                <NavLinks title={'my library'} href={'/dashboard/components'}/>
            </div>
            <Link href={'/dashboard/profile'} className="w-fit ml-[20px] group transition-500 flex gap-[10px] max-[361px]:hidden flex-row h-full items-center justify-center rounded p-[8px]">
                <span className="w-full hidden group-hover:text-cyan-400 transition-500 capitalize h-full md:flex items-center text-nowrap text-white justify-center font-semibold text-xs">
                    profile
                </span>
                <div className="w-[32px] h-[32px] bg-secondary rounded-full text-xs flex items-center justify-center">

                </div>
            </Link>
        </div>
    )
}
export default Navbar

const NavLinks = ({title, href}: {title: string, href: string}) => {
    return (
            <Link href={href} className={cn(`center p-[5px] capitalize text-shadow shadow-zinc-300 hover:text-cyan-400 transition-500 font-semibold text-white text-xs`)}>
                {title}
            </Link>
    )
}
