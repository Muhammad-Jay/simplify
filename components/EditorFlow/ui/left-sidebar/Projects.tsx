'use client'
import React from 'react'
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import {useFileState} from "@/context/FileContext";
import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import { useParams, useRouter } from 'next/navigation'

const Projects = () => {
    const { work_space_id } = useParams();
    const router = useRouter();

    const {
        nodes,
        selectedWorkFlowNode,
        handleNavigate,
    } = useWorkFlowState();
    const {
        currentProjectId,
        setCurrentProjectId,
    } = useFileState();

    const handleClick = (nd: any) => {
            setCurrentProjectId({
                id: nd.id,
                name: nd.data.name,
                workSpaceName: work_space_id || ''
            });
            router.push(`/work-space/${work_space_id}/${nd.id}`);
            return;
    }

    return (
        <div className={'center w-full h-full gap-[5px] !justify-start flex-col'}>
            <div
                onClick={() => {
                    handleNavigate(currentProjectId.workSpaceName)
                }}
                className={cn('between cursor-pointer !justify-start w-full h-[30px] bg-neutral-800 text-xs font-semibold text-foreground p-[10px] rounded-sm')}>
                {currentProjectId ? currentProjectId.workSpaceName : work_space_id }
            </div>
            <ScrollArea className={cn('center !space-y-[5px] !pl-[10px] !justify-start !w-full !max-h-[240px]')}>
                {nodes && nodes.map(nd => (
                    <div
                        style={{
                            borderLeft: nd?.data?.name === currentProjectId.name ? '3px solid cyan' : '0px',
                            borderBottomLeftRadius: nd?.data?.name === currentProjectId.name && '3px',
                            borderTopLeftRadius: nd?.data?.name === currentProjectId.name && '3px'
                        }}
                        onClick={() => {
                            handleClick(nd)
                        }}
                        key={nd?.id}
                        className={cn('w-full !my-[5px] cursor-pointer !justify-start transition-300 text-xs hover:bg-cyan-500/30 text-foreground/85 center h-fit !p-[6px] rounded-sm',
                            nd?.data?.name === currentProjectId.name && 'bg-cyan-500/30 text-yellow-400/90'
                        )}>
                        {nd?.data?.name}
                    </div>
                ))}
            </ScrollArea>
        </div>
    )
}
export default Projects
