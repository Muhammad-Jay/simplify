'use client'
import React from 'react'
import {useEditorState} from "@/context/EditorContext";
import { Folder, File } from 'lucide-react'
import {cn} from "@/lib/utils";

const SelectedNode = () => {
    const { selectedNode } = useEditorState()

    return (
        <div className={cn(`container-full center flex-col`)}>
            {selectedNode && (<div className={'w-full h-full p-[10px] center !justify-start text-sm font-mono'}>
                <div className={'w-full h-fit p-[10px] text-xs text-white gap-[5px] center !justify-start'}>
                    {selectedNode?.type === 'folderNode' ? (
                        <Folder size={15} className={'text-white'}/>
                    ) : (
                        <File size={15} className={'text-white'}/>
                    )}
                    <strong>{selectedNode?.data?.name || ''}</strong>
                </div>
                <div className={'w-full h-full center flex-col'}>

                </div>
            </div>)}
        </div>
    )
}
export default SelectedNode
