'use client'
import React from 'react'
import useAuthClient from "@/hooks/supabase-auth/useAuthClient";
import {CodeEditor} from "@/components/sandpack/Editor";

const Page = () => {
    const user1 = useAuthClient()

    return (
        <div className={'page'}>
            <CodeEditor/>
        </div>
    )
}
export default Page
