'use client'
import React, {useMemo} from 'react'
import {Button} from "@/components/ui/button";
import {useEditorState} from "@/context/EditorContext";
import {cn} from "@/lib/utils";

const FlowNavbar = ({onLayout}: {onLayout: any}) => {
    const { rightSidebarState, handleRightSidebarState, recentActiveNodes, nodes, selectedNode, setCurrentNode, setIsOnFitView } = useEditorState()

    const fullPath = useMemo(() => {
        return recentActiveNodes && recentActiveNodes.map((recent) => {
            return nodes.filter((node) => node && node.data.name === recent.name)[0]
        }) || []
    }, [selectedNode, recentActiveNodes])

    return (
        <div className={'w-full h-[35px] gap-[4px] mt-[3px] between p-[3px] bg-black rounded-lg'}>
            <div className={'w-[30%] h-full rounded-sm bg-zinc-800'}>

            </div>
            <div className={'w-full overflow-x-auto p-[2px] px-[7px] center !justify-start h-full rounded-sm bg-zinc-800'} id={'no-scrollbar'}>
                {/*{fullPath && fullPath.map((recentNode: any, index: number) => (*/}
                {/*    <div key={`${recentNode.id}:${index}`} className={cn('center flex-col w-[70px] border-[1px] border-cyan-500 truncate !justify-start h-full backdrop-blur-md')}>*/}
                {/*        <button*/}
                {/*            type={'button'}*/}
                {/*            onClick={() => {*/}
                {/*                setIsOnFitView(true)*/}
                {/*                setCurrentNode(recentNode)*/}
                {/*            }}*/}
                {/*            className={cn(`text-xs font-light text-cyan`, selectedNode  && recentNode ? selectedNode.data?.name === recentNode.data.name && 'text-green-500' : '')}>{recentNode.data.name || ''}</button>*/}
                {/*    </div>*/}
                {/*))}*/}
            </div>
            <div className={'w-[30%] h-full rounded-sm center gap-[10px] px-[10px] !justify-end bg-zinc-800'}>
                <Button type={'button'} onClick={() => onLayout('TB')} className={'w-[60px] h-[15] !p-[0px] font-light text-xs rounded-xs button-neutral text-white'}>
                    vertical
                </Button>
                <Button type={'button'} onClick={() => onLayout('LR')} className={'w-[60px] h-[15] !p-[0px] font-light text-xs rounded-xs button-neutral text-white'}>
                    horizontal
                </Button>
                <Button
                    type={'button'}
                    onClick={() => handleRightSidebarState('Preview')}
                    className={cn(`w-[60px] h-[15] !p-[0px] font-light button-neutral text-white text-xs hover:bg-cyan transition-300 rounded-xs`,
                        rightSidebarState === 'Preview' && 'bg-cyan text-white')}>
                    preview
                </Button>
            </div>
        </div>
    )
}
export default FlowNavbar
