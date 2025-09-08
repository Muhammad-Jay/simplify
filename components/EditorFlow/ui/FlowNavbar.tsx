'use client'
import React, {useMemo} from 'react'
import {Play} from 'lucide-react'
import {Button} from "@/components/ui/button";
import {useEditorState} from "@/context/EditorContext";
import {cn} from "@/lib/utils";
import {useFileState} from "@/context/FileContext";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useWorkFlowState} from "@/context/WorkSpaceContext";

const FlowNavbar = ({id}) => {
    const { rightSidebarState, leftSidebarState, handleRightSidebarState, handleLeftSidebarState, recentActiveNodes, nodes, selectedNode, setCurrentNode, setIsOnFitView } = useEditorState()
    const {currentProjectId} = useFileState();
    const { handleNavigate } = useWorkFlowState();

    const fullPath = useMemo(() => {
        return recentActiveNodes && recentActiveNodes.map((recent) => {
            return nodes.filter((node) => node && node.data.name === recent.name)[0]
        }) || []
    }, [selectedNode, recentActiveNodes])

    return (
        <div className={'w-full h-[35px] gap-[4px] mt-[3px] between p-[3px] py-[5px] px-[3px] bg-black'}>
            <div className={'w-fit h-full rounded-xs center gap-[7px] px-[3px] !justify-start'}>
                <Button type={'button'} className={'w-[70px] h-[25px] !p-[0px] font-light text-xs rounded-xs button-neutral text-white'}>

                </Button>
                {id && (
                    <Button
                        type={'button'}
                        onClick={() => handleLeftSidebarState('WorkSpaceProjects')}
                        className={cn(`w-[70px] h-[25px] !p-[0px] font-semibold gap-[5px] center button-neutral !text-white text-xs hover:bg-cyan/80 transition-300 rounded-xs`,
                            leftSidebarState === 'WorkSpaceProjects' && 'bg-cyan !text-black')}>
                        projects
                    </Button>
                )}
                <Button type={'button'} className={'w-[70px] h-[25px] !p-[0px] font-light text-xs rounded-xs button-neutral text-white'}>

                </Button>
            </div>
            <div className={'w-full overflow-x-auto p-[2px] px-[10px] gap-[10px] center !justify-start h-full rounded-xs bg-zinc-800'} id={'no-scrollbar'}>
                {currentProjectId && (
                    <>
                        <span
                            onClick={() =>  handleNavigate(currentProjectId.workSpaceName)}
                            className={cn('center cursor-pointer hover:!text-cyan-500 transition-300 text-foreground text-xs font-bold',
                            !id && 'text-[#d0ff00]')}>{currentProjectId?.workSpaceName || ''}</span>
                        <span className={'text-cyan-500/90  text-xs'}>{'>'}</span>
                        {currentProjectId.id === id && (<h2 className={'center text-xs text-[#d0ff00] font-regular'}>{currentProjectId?.name}</h2>)}
                    </>
                )}
            </div>
            <div className={'w-fit h-full rounded-xs center gap-[7px] px-[3px] !justify-end'}>
                <Button
                    type={'button'}
                    onClick={() => handleRightSidebarState('Preview')}
                    className={cn(`w-[70px] h-[25px] !p-[0px] font-semibold gap-[5px] cursor-pointer center button-neutral !text-white text-xs hover:bg-cyan/80 transition-300 rounded-xs`,
                        rightSidebarState === 'Preview' && 'bg-cyan !text-black')}>
                    <Play size={7} className={cn('center text-white fill-white',
                        rightSidebarState === 'Preview' && 'fill-black text-black' )}/>
                    Build
                </Button>
                <Button type={'button'} className={'w-[70px] h-[25px] !p-[0px] cursor-pointer font-light text-xs rounded-xs button-neutral text-white'}>

                </Button>
                <Button type={'button'} className={'w-[70px] h-[25px] !p-[0px] cursor-pointer font-light text-xs rounded-xs button-neutral text-white'}>

                </Button>
            </div>
        </div>
    )
}
export default FlowNavbar
