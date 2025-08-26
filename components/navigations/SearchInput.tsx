"use client"
import {memo} from 'react'

import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";

function SearchInput({className}: {className?: string}, props?: any) {
    return(
        <div className={cn(`center lg:w-[40%] w-[200px] h-[87%] !my-auto bg-zinc-900 rounded-full border-[1px] border-zinc-700 overflow-x-hidden`, className)}>
            <Input placeholder={"Search creators"}
                   inputType={"text"}
                   {...props}
                   className={"container-full z-[5] text-xs !border-none !outline-none"}/>
        </div>
    )
}

export default memo(SearchInput)