'use client'
import React from 'react'
import WorkSpaceFlow from "@/components/work-space/WorkSpaceFlow";
import {ReactFlowProvider} from 'reactflow'

const Page = () => {
    return (
        <div className={"!h-[100dvh] !w-[100dvw] center flex-col"}>
            <ReactFlowProvider>
                <WorkSpaceFlow/>
            </ReactFlowProvider>
        </div>
    )
}
export default Page
