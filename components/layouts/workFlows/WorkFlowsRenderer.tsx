'use client'
import React from 'react'
import {cn} from "@/lib/utils";
import { useRouter } from 'next/navigation';
import {ScrollArea} from "@/components/ui/scroll-area";
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import WorkFlowProjectCard from "@/components/layouts/workFlows/WorkFlowProjectCard";

const WorkFlowsRenderer = () => {
    const {
        fetchAllWorkFlows,
        workFlows,
        loadWorkSpaceProjects,
    } = useWorkFlowState();

    React.useEffect(() => {
        fetchAllWorkFlows()
    }, []);

    return (
        <ScrollArea className={cn('w-full h-full !rounded-b-[0px] rounded-lg bg-black center !overflow-hidden !justify-start p-[16px] flex-col')}>
            <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] w-full h-fit')}>
                {workFlows && workFlows.map(flow => (
                    <WorkFlowProjectCard key={flow.id} flow={flow}/>
                ))}
            </div>
        </ScrollArea>
    )
}
export default WorkFlowsRenderer
