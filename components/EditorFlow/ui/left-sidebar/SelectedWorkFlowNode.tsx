'use client'
import React from 'react'
import {cn} from "@/lib/utils";
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import {useFileState} from "@/context/FileContext";
import { useParams } from 'next/navigation'

const SelectedWorkFlowNode = () => {
    const { work_space_id } = useParams()
    const [configFileFormat, setConfigFileFormat] = React.useState('')
    const {
        selectedWorkFlowNode,
    } = useWorkFlowState();
    const {
        currentProjectId
    } = useFileState()

    React.useEffect(() => {
        if (!selectedWorkFlowNode) return;
        setConfigFileFormat(getConfigFile(work_space_id, selectedWorkFlowNode[0]?.data?.name, selectedWorkFlowNode[0]?.id))
    }, [selectedWorkFlowNode, work_space_id]);

    const getConfigFile = (workflowName: any, projectName: string, projectId: string) => {
        return '{\n' +
            '  "workflow": {\n' +
            `    "name": "${workflowName}",
` +
            '    "project": {\n' +
            `      "name": "${projectName}",
` +
            `      "project_id": "${projectId}"
` +
            '    }\n' +
            '  }\n' +
            '}'
    }

    return (
        <div className={cn('container-full center !justify-start flex-col gap-[10px] p-[5px]')}>
            <div className={cn('w-full h-fit center flex-row flex-nowrap gap-[10px] p-[10px]')}>
                {/*<h3 className={cn('center text-xs text-foreground/90 font-semibold')}>{selectedWorkFlowNode[0]?.data?.name.replace('_', " ")}</h3>*/}
                <p className={cn('text-xs text-foreground/70 transition-300 hover:text-cyan-400')}>{selectedWorkFlowNode[0]?.id}</p>
            </div>
            <pre
                id={'no-scrollbar'}
                className={cn('center w-full h-fit p-[10px] !justify-start overflow-x-scroll rounded-md bg-neutral-900/50 backdrop-blur-md text-xs font-semibold')}>
                <code>
                    {configFileFormat}
                </code>
            </pre>
        </div>
    )
}
export default SelectedWorkFlowNode
