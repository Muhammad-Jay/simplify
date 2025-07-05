import React from 'react'
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

const ToggleSidebar = ({setIsOpen}: {setIsOpen: any}) => {
    const handleToggle = () => {
        setIsOpen(prev => !prev)
    }

    return (
        <Button
            className={cn(`size-[26px] center !bg-white transition-500 bd text-sm text-black absolute top-[5px] z-10 right-[5px] rounded-sm`)}
            variant={"outline"}
            onClick={handleToggle}>
            {"<"}
        </Button>
    )
}
export default ToggleSidebar
