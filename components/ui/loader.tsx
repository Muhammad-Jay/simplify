import React from 'react'
import {LoaderCircle} from "lucide-react";
import {cn} from "@/lib/utils";

const Loader = ({className}: {className?: string}) => {
    return (
        <div className={'center'}>
            <LoaderCircle className={cn(`animate-spin`, className)} size={17}/>
        </div>
    )
}
export default Loader
