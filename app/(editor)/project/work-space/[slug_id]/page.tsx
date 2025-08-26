'use client'
import React, {memo} from 'react'
import SimpleFlow from "@/components/EditorFlow/EditorFlow";
import { SandpackProvider } from '@codesandbox/sandpack-react'
import {useEditorState} from "@/context/EditorContext";
import mockSandpackFiles from "@/constants";
import { ReactFlowProvider } from 'reactflow';

const Page = () => {
    const { files } = useEditorState()

    return (
        <div className={"!h-[100dvh] !w-[100dvw] center flex-col"}>
            <ReactFlowProvider>
                {/*<SandpackProvider*/}
                {/*    files={mockSandpackFiles}*/}
                {/*    template={'react'}*/}
                {/*    theme={'dark'}*/}
                {/*    options={{*/}
                {/*        activeFile: '/App.tsx',*/}
                {/*        visibleFiles: Object.keys(files)*/}
                {/*    }}*/}
                {/*>*/}
                    <SimpleFlow/>
                {/*</SandpackProvider>*/}
            </ReactFlowProvider>
        </div>
    )
}
export default memo(Page)
