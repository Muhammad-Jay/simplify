'use client'
import React from 'react'
import {useFileState} from "@/context/FileContext";

const WorkSpaceProjectNode = ({data}: any) => {
    const { setCurrentProjectId } = useFileState()

    return (
        <div className={'w-[300px] h-[200px] rounded-lg center bg-neutral-900'}>
            {data.name}
        </div>
    )
}
export default WorkSpaceProjectNode
