'use client'
import React, {memo} from 'react'
import SimpleFlow from "@/components/EditorFlow/EditorFlow";
import {useEditorState} from "@/context/EditorContext";
import { ReactFlowProvider } from 'reactflow';

const Page = () => {

    return (
        <div className={"!h-[100dvh] !w-[100dvw] center flex-col"}>
            <ReactFlowProvider>
                <SimpleFlow/>
            </ReactFlowProvider>
        </div>
    )
}
export default memo(Page)
