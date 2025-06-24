import React from 'react'
import {cn} from "@/lib/utils";

const Header = () => {
    return (
        <div className={cn(`w-full h-[180px] between p-[20px] rounded-md mx-[10px] md:px-[40px] bg-secondary`)}>
            <div className={'center flex-col w-full !items-start h-full !justify-start p-[10px]'}>
                <h1 className={'font-bold center capitalize text-cyan-400 mb-[10px] text-3xl'}>welcome back!</h1>
                <p className={'center text-nowrap text-white font-semibold text-sm'}>Start creating and publishing</p>
                <p className={'center text-nowrap text-white font-semibold text-sm'}>components</p>
            </div>

            <div className={'w-[250px] h-full center rounded-md bg-primary'}>

            </div>
        </div>
    )
}
export default Header
