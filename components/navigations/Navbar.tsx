'use client'
import React , {useState, useEffect, memo} from 'react'
import {cn} from "@/lib/utils";
import Link from 'next/link'
import {User} from 'lucide-react'
import {usePathname} from "next/navigation";
import SearchInput from "@/components/navigations/SearchInput";

const Navbar = () => {
    const [id, setId] = useState("")
    const [isLoaded, setIsLoaded] = useState(false)
    const pathName = usePathname()

    return (
        <div className="h-[38px] w-full flex bg-transparent rounded-sm items-center justify-between mb-[8px]">
            <div className={'w-fit between h-full space-x-[37px] pl-[15px]'}>
                <NavLinks title={'explore'} href={'/explore'}/>
                <NavLinks title={'create new'} href={'/dashboard/create'}/>
                <NavLinks title={'my library'} href={'/dashboard/components'}/>
            </div>

            {pathName === "/dashboard/overview" && (
                <SearchInput/>
            )}
                {/*<div className={"w-fit h-full center"}>*/}
                {/*    {componentId && (*/}
                {/*        <button*/}
                {/*            type={"button"}*/}
                {/*            onClick={handleClick}*/}
                {/*            className={cn(`center !w-[100px] h-[25px] rounded-sm bd container-fit text-xs z-10 text-white bg-cyan-500 px-[10px] p-[5px] outline-none`)}>*/}
                {/*            publish*/}
                {/*        </button>*/}
                {/*    )}*/}
                {/*</div>*/}

            <Link href={'/dashboard/profile'} className="w-fit ml-[20px] group transition-500 flex gap-[10px] max-[361px]:hidden flex-row h-full items-center justify-center rounded p-[8px]">
                {/*{isOnline ? (*/}
                {/*    <span className={cn(`size-[15px] rounded-full bg-green-500`)}/>*/}
                {/*): (*/}
                {/*    <span className={cn(`size-[15px] rounded-full bg-red-500`)}/>*/}
                {/*)}*/}

                <span className="w-full hidden group-hover:text-cyan-400 transition-500 capitalize h-full md:flex items-center text-nowrap text-white justify-center font-semibold text-xs">
                    profile
                </span>
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
