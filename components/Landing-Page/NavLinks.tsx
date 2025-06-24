'use client'
import React, {useState} from 'react'
import {nav_links} from "@/constants";
import Link from "next/link";
import {cn} from "@/lib/utils";

const HomeNavLinks = () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(prevState => !prevState)
    }



    return (
        <>
            <div id={'nav-links'} className={`md:w-[35%] stroke-[4] !w-[352px] stroke-cyan-500 !border-t-[0px] !border-[#00BBC2]/80 sm:w-[38%] fixed bg-zinc-900 rounded-b-[20px] z-[100] -top-[0px] left-[50%] -translate-x-[50%] h-[45px] center`}>
                <div className={'w-full h-full center relative'}>
                    <svg className={'absolute inset-0 z-10 left-0'} width="352" height="45" viewBox="0 0 352 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.39746 1H346.727C349.849 1.00019 351.729 4.39504 350.18 7.01953L350.019 7.27148L325.874 42.2715C325.127 43.3538 323.896 44 322.581 44H27.8486C26.5714 44 25.3765 43.3902 24.626 42.3691L24.4814 42.1602L2.03027 7.16016C0.322581 4.49793 2.23462 1.00004 5.39746 1Z" stroke="#00CCD3" strokeOpacity="0.97" strokeWidth="2"/>
                    </svg>
                    <div className={cn(`items-center hidden w-full px-[50px] h-full !justify-between gap-[30px]`,`min-[633px]:flex`)}>
                        {nav_links.map(item => (
                            <Link key={item.title} href={item.href} className={`w-fit z-[110] text-xs transition-all duration-400 font-regular text-white/90 hover:text-[#00BBC2]`}>
                                {item.title}
                            </Link>
                        ))}
                    </div>
                    <button onClick={handleClick} className={cn(`center z-[110] flex-col h-full gap-[3px] w-[30px] cursor-pointer`, `min-[633px]:!hidden`)}>
                        <span className={'w-full h-[1px] accent'}/>
                        <span className={'w-full h-[1px] accent'}/>
                        <span className={'w-full h-[1px] accent'}/>
                    </button>
                </div>
            </div>

            <div className={cn(`fixed transition-all z-[8] gap-[10px] duration-300 w-full h-fit p-[15px] py-[20px] bg-black bd center flex-col !justify-between`,
                isOpen ? 'top-0' : '-top-[100%]'
            )}>
                <div className={'w-full center h-[40px]'}>

                </div>
                {nav_links.map(item => (
                    <Link key={item.title} onClick={handleClick}  href={item.href} className={`w-full h-[20px] p-[5px] capitalize center text-center text-xs m-auto transition-all duration-400 font-regular text-white/70 hover:text-[#00BBC2]`}>
                        {item.title}
                    </Link>
                ))}
            </div>
        </>
    )
}
export default HomeNavLinks