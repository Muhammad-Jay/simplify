import React from 'react'
import {cn} from "@/lib/utils";

const TitleCard = ({className, titleClassName, title}   : {className?: string, titleClassName?: string, title: string}) => {
    return (
        <div className={cn(`w-full center flex-row !justify-start p-[10px]`,className)}>
            <h1 className={cn(`text-md font-semibold text-white center w-fit capitalize h-fit`,titleClassName)}>{title}</h1>
        </div>
    )
}
export default TitleCard
