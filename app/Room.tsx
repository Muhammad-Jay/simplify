"use client"
import React from 'react'
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import MainLoader from "@/components/layouts/MainLoader";

const Room = ({children, roomId} : {children: React.ReactNode, roomId: string}) => {
    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<MainLoader/>}>
                {children}
            </ClientSideSuspense>
        </RoomProvider>
    )
}
export default Room
