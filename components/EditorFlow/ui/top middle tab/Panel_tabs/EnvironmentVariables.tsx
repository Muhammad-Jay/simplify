'use client'
import React, {useEffect, useState} from 'react'
import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useFileState} from "@/context/FileContext";
import {InputField} from "@/components/EditorFlow/ui/top middle tab/Panel_tabs/Configurations";

const EnvironmentVariables = () => {
    const [envs, setEnvs] = useState([])
    const {
        nodes,
        currentProjectId
    } = useFileState();

    useEffect(() => {
        const envNode = nodes.filter((node: any) => node?.id?.includes('.env'));
        if (!envNode) return;
        const envContent = envNode[0]?.data?.code;
        if (!envContent) return;
        const formatedEnvs = envContent.split('\n').filter(Boolean).map((line: string) => {
            const splitLine = line.split('=');
            return { key: splitLine[0], value: splitLine[1] }
        })
        setEnvs([...formatedEnvs]);
    }, [nodes, currentProjectId]);

    return (
        <ScrollArea
            className={cn('container-full overflow-hidden p-[10px] center flex-col gap-[20px] !justify-start')}
        >
            {envs && (
                <div className={cn('w-full h-fit p-[10px] between gap-[20px] flex-nowrap')}>
                    <h2 className={'center w-[30%] !justify-start text-xs text-foreground/80 font-semibold'}>Key</h2>
                    <h2 className={'center w-full !justify-start text-xs text-foreground/80 font-semibold'}>Value</h2>
                </div>
            )}
            {envs && envs.map(({key, value} : {key: string, value: string}, index) => (
                <div
                    key={`${key}-${index}`}
                    className={cn('w-full h-fit p-[10px] between gap-[20px] flex-nowrap')}
                >
                    <InputField
                        value={key}
                        wrapperClassName={'w-[30%]'}
                        inputClassName={'text-xs border-neutral-700 border-1'}
                    />
                    <InputField
                        value={value}
                        inputClassName={'text-xs border-neutral-700 border-1'}
                    />
                </div>
            ))}
        </ScrollArea>
    )
}
export default EnvironmentVariables
