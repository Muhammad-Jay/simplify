'use client'
import React from 'react'
import {HeroUIProvider, ToastProvider} from "@heroui/react"
import {SocketProvider} from "@/context/SocketContext";

const Provider = ({children} : { children : React.ReactNode }) => {
    return (
        <SocketProvider>
            {children}
        </SocketProvider>
    )
}
export default Provider
