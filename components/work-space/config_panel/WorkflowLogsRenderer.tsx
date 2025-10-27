'use client'
import React, { useState, useEffect, useCallback } from 'react';
import {cn} from "@/lib/utils";
import SelectWrapper from "@/components/SelectWrapper";
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import WorkflowSelect from "@/components/work-space/config_panel/WorkflowSelect";

export function WorkflowLogsRenderer() {

    return (
        <div className={cn('container-full center flex-col gap-2 p-[10px]')}>
            <SelectProject/>
            <div className={cn('container-full rounded-md bg-neutral-950')}>

            </div>
        </div>
    )
}

const SelectProject = () => {
    const { nodes } = useWorkFlowState();

    return (
        <div className={cn('w-full h-fit gap-2 center')}>
            <div className={cn('w-full h-full center')}>

            </div>
            <div className={'w-[300px] h-fit'}>
                <WorkflowSelect
                    setValue={() => {}}
                    defaultValue={nodes && nodes[0]?.data?.name || ""}
                    items={nodes?.map((node: any) => ({ name: node?.data?.name , value: node?.id }))}
                />
            </div>
        </div>
    )
}