'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import {cn} from "@/lib/utils";
import WorkflowCardMenu from "@/components/layouts/workFlows/WorkflowCardMenu";

const WorkFlowProjectCard = ({flow}: {flow: any}) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = React.useState(false)
    const [workFlowProjects, setWorkFlowProjects] = React.useState([])
    const {
        loadWorkSpaceProjects,
        getWorkflowProjects,
    } = useWorkFlowState();

    React.useEffect(() => {
        getWorkflowProjects(flow.name).then(projects => {
            setWorkFlowProjects(projects)
        })
    }, [flow]);

    return (
        <div className={cn('center flex-col container-fit mb-[20px] gap-[5px] transition-300 relative !w-full')}>
            <div
                onClick={() => {
                    if (isOpen) return;
                    loadWorkSpaceProjects(flow.name)
                    router.push(`/work-space/${flow.name}`)
                }}
                className={cn('center w-full h-[190px] cursor-pointer flex-col text-xs !justify-start border-[2px] border-neutral-700/50 transition-300 font-semibold text-foreground rounded-lg bg-neutral-900/35 backdrop-md',
                    'hover:bg-cyan-500/20 hover:border-cyan-500/70'
                )}
            >
                <div className={'w-full h-fit between gap-[10px] p-[10px]'}>
                    <div className={'center w-[35px] h-[30px] border-1 border-neutral-300 rounded-full border-neutral-700'}>

                    </div>
                    <div className={'w-full h-full center gap-[6px] flex-col !items-start text-xs pl-[10px]'}>
                        <p className={'text-xs font-semibold text-foreground'}>
                            {flow.name.replace('_', " ")}
                        </p>
                        <p className={'!text-[11px] font-semibold text-foreground/70'}>
                            {flow.id}
                        </p>
                    </div>
                    <WorkflowCardMenu setIsOpen={setIsOpen} id={flow.id}/>
                </div>
                <div className={'container-full max-h-[130px] center !justify-end flex-col gap-[10px]'}>
                    {/*{workFlowProjects.slice(0, 3).map(project => (*/}
                    {/*    <div*/}
                    {/*        key={project.name}*/}
                    {/*        className={cn('w-full h-[30px] text-xs text-foreground-70 !mx-[5px] p-[5px] px-[10px] center !justify-start')}>*/}
                    {/*        {project.name.replace('_', " ")}*/}
                    {/*    </div>*/}
                    {/*))}*/}
                </div>
            </div>
            {/*<div className={cn('between px-[5px] bg-transparent w-full h-[40px]')}>*/}
            {/*    */}
            {/*    <p className={'text-xs'}>*/}
            {/*        {flow.created_At}*/}
            {/*    </p>*/}
            {/*</div>*/}
        </div>
    )
}

export default WorkFlowProjectCard;
