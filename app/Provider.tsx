"use client"
import React from 'react'
import {ClientSideSuspense, LiveblocksProvider} from "@liveblocks/react/suspense";
import MainLoader from "@/components/layouts/MainLoader";
import children from "@/types";
import {authorizeLiveblocks} from "@/lib/liveblocks";
import {Router} from "next/router";
import {getAuthUsers} from "@/lib/supabase-auth/action";

const Provider = ({children} : children) => {
    return (
        <LiveblocksProvider
            authEndpoint={async () => {
                const { data, error } = await authorizeLiveblocks();

                if (error) {
                    console.log('liveblocks auth error: ',error)
                }

                return data;
            }}
            resolveUsers={async ({ userIds}) =>{
                try {
                    return await getAuthUsers(userIds)
                }catch (e) {
                    console.log(e)
                }
            }}
        >
            <ClientSideSuspense fallback={<MainLoader/>}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    )
}
export default Provider
