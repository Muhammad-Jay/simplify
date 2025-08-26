import React from 'react'
import {LoaderCircle} from "lucide-react"
import {cn} from "@/lib/utils";

const Loader = ({className, size} : {className?: string, size?: number}) => {
    return (<LoaderCircle size={size} className={cn(className)}/>)
}
export default Loader
