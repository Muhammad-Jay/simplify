'use client'
import React, {useState} from 'react'
import ComponentEditor from "@/components/sandpack/Editor";
import EditorSidebar from "@/components/sandpack/EditorSidebar";
import useComponent from "@/hooks/components/useComponent";

const EditorWrapper = ({id}: {id: string}) => {
    return (
        <div className={'page between gap-2.5 p-3.5'}>
            <ComponentEditor id={id}/>
        </div>
    )
}
export default EditorWrapper
