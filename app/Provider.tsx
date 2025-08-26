import React from 'react'
import {HeroUIProvider, ToastProvider} from "@heroui/react"

const Provider = ({children} : { children : React.ReactNode }) => {
    return (
        <HeroUIProvider>
            {children}
            <div className={"center w-[330px] h-fit"}>
                <ToastProvider placement={"bottom-right"} toastProps={{
                    variant: "bordered",
                    radius: "sm",
                    timeout: 2000
                }} maxVisibleToasts={3}/>
            </div>
        </HeroUIProvider>
    )
}
export default Provider
