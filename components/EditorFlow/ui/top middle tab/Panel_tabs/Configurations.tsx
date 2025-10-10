import React, { useState, useCallback, useEffect, memo } from 'react';
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import SelectWrapper from "@/components/SelectWrapper";
import {Button} from "@/components/ui/button";
import Loader from "@/components/Loader";
import {useSocket} from "@/context/SocketContext";
import {useFileState} from "@/context/FileContext";
import Deploy from "@/components/EditorFlow/ui/right-sidebar/Deploy";
import {Switch} from "@/components/ui/switch";
import {json} from "express";

type InputFieldPropTypes = {
    wrapperClassName?: string;
    inputClassName?: string;
    placeholder?: string;
    labelClassName?: string;
    type?: string;
    isDefault?: boolean;
    htmlFor?: string;
    children?: React.ReactNode;
    label?: string
    value?: any;
    name?: string;
    onChange?: any;
}

const Environments = [
    {
        name: 'Production',
        value: 'Production'
    },
    {
        name: 'Development',
        value: 'Development'
    }
]

export const Configurations = memo(() => {
    const {
        currentContainer,
        setIsDeployPanelOpen,
        isDeployPanelOpen,
        config,
        setConfig,
    } = useFileState();

    const {
        isComplete,
    } = useSocket();

    return (
        <div className={cn('container-full center p-[20px] flex-col !justify-start gap-[20px]')}>
            <div className={'w-full h-fit center !justify-start !items-start flex-col gap-[7px] mt-[0px]'}>
                <div className={'w-full between text-foreground/80 text-xs font-semibold'}>
                    <div className={cn('center !flex-nowrap text-xs gap-[40px] capitalize font-semibold',
                        currentContainer?.State === 'running' ? 'text-green-400' : currentContainer?.State === 'stopping' ? 'text-yellow-300' : 'text-cyan')}>
                        <h3 className={'center container-fit text-xs font-regular text-foreground/80'}>Status</h3>
                        {currentContainer && currentContainer?.State || 'not_created'}
                    </div>
                    <div className={cn('!text-sm font-semibold text-foreground/90')}>
                    </div>
                </div>
            </div>
            <div className={cn('center flex-col !justify-start gap-[20px] container-full')}>
                <div className={'w-full center flex-col gap-[10px] !items-end'}>
                    <InputField
                        label={'Source'}
                        name={'source'}
                        value={config.source}
                        onChange={setConfig}
                        placeholder={'GitHub'}
                    />
                    <InputField
                        htmlFor={'use-current-flow'}
                        label={'use current flow'}
                        isDefault={false}
                        wrapperClassName={'max-w-fit'}
                    >
                        <Switch
                            defaultChecked={config.useCurrentFlow}
                            onCheckedChange={(value: boolean) => setConfig(prev => ({...prev, useCurrentFlow: value}))}
                            id={'use-current-flow'}
                        />
                    </InputField>
                </div>
                <InputField
                    label={'Environment'}
                    wrapperClassName={'between'}
                    isDefault={false}>
                    <SelectWrapper
                        items={Environments}
                        setValue={setConfig}
                        className={'w-full m-0'}
                        placeholder={config.environment}
                    />
                </InputField>

                <InputField
                    label={'Build Command'}
                    value={config.buildCommand}
                    placeholder={'npm run dev'}
                    name={'buildCommand'}
                    onChange={setConfig}
                />
                <h3 className={'text-xs center my-[10px] !self-start font-bold text-foreground'}>Networking & Access</h3>

                <InputField
                    label={'Ports'}
                    type={'text'}
                />
            </div>
        </div>
    )
})

const InputField = memo(({
                             labelClassName,
                             type = 'text',
                             children,
                             label,
                             value,
                             name,
                             onChange,
                             htmlFor,
                             wrapperClassName,
                             inputClassName,
                             placeholder,
                             isDefault = true,
                         }: InputFieldPropTypes) => {

    return (
        <div className={cn('w-full h-fit between gap-[40px]', wrapperClassName)}>
            {label && (
                <Label
                    htmlFor={htmlFor}
                    className={cn('text-xs text-foreground/80  text-nowrap font-semibold container-fit', labelClassName)}
                >{label}</Label>
            )}
            {isDefault ? (
                <Input
                    inputType={type}
                    value={value}
                    name={name}
                    placeholder={placeholder}
                    onChange={(e) => onChange(prev => ({...prev, [e.target.name]: e.target.value}))}
                    className={cn('w-full p-[3px] px-[5px] !h-[27px] bg-neutral-800/50 backdrop-blur-md rounded-md border-neutral-800 outline-none border-1 text-xs !font-regular text-foreground/80', inputClassName)}
                />
            ) : children}
        </div>
    )
})

