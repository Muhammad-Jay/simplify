'use client'
import React, {useMemo} from 'react'
import {Panel} from 'reactflow'
import {useEditorState} from "@/context/EditorContext";

export const LeftBottomPanel = () => {
    const { selectedNode, setCurrentNode, nodes, files, setIsOnFitView, setIsOnQuery } = useEditorState()

    const fullPath = useMemo(() => {
        return selectedNode && selectedNode.data?.label.split('/').filter(Boolean).map((path) => {
            return nodes.filter((node: any) => node.data.name === path)[0]
        }) || []
    }, [selectedNode, files])

    return (
        <Panel position={'bottom-left'} className={'ml-[40px] mb-[3px]'}>
            <div className={'w-[300px] !items-start h-[40px] bg-zinc-800 flex-col center p-[3px] rounded-sm'}>
                <ul className={'text-xs !w-full !justify-start px-[6px] text-white flex-nowrap center flex-row gap-[5px]'}>
                    {!fullPath ? null : fullPath.map((node: any, index: number) => (
                      <li key={`${node?.data?.name || 'empty'}:${index}`} className={'center container-fit flex-row text-xs gap-[5px]'}>
                          <button
                              type={'button'}
                              onClick={() => {
                                  setCurrentNode(node)
                                  setIsOnFitView(true)
                                  setIsOnQuery(true)
                              }}
                              className={'text-xs bg-transparent hover:text-cyan-500 rounded-xs transition-300 container-fit p-[2px] text-white/80'}>{node?.data?.name || ''}
                          </button>
                          <p className={'text-cyan-500/90  text-xs'}>
                              {index === fullPath.length - 1 ? '' : '>'}
                          </p>
                      </li>
                    ))}
                </ul>
            </div>
        </Panel>
    )
}

export const RightBottomPanel = () => {
    return (
        <Panel position={'bottom-right'} className={'mr-[40px] mb-[3px]'}>
            <div className={'w-[300px] h-[40px] bg-zinc-800 rounded-sm'}>

            </div>
        </Panel>
    )
}
