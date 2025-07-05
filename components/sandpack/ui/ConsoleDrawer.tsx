import React from 'react'
import {Drawer, DrawerClose, DrawerContent} from "@/components/ui/drawer";
import {DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {cn} from "@/lib/utils";

const ConsoleDrawer = ({children}: {children: React.ReactNode}) => {
    return (
        <Drawer>
            <DialogTrigger>
                <div className={cn(`size-[26px] rounded-sm bg-white`)}>

                </div>
            </DialogTrigger>
            <DrawerContent>
                <DrawerClose className={cn(`center p-2.5 w-fit absolute top-1.5 z-10 right-0.5 bg-secondary text-xs`)} asChild>
                    <div className={cn(`center p-0.5 w-fit bg-secondary text-xs`)}>
                        close
                    </div>
                </DrawerClose>
                <DialogTitle></DialogTitle>
                <div className={cn(`center w-full h-[500px]`)}>
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
export default ConsoleDrawer
