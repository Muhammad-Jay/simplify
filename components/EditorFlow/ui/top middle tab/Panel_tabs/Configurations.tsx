import React, { useState, useCallback, useEffect, memo } from 'react';
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import SelectWrapper from "@/components/SelectWrapper";
import {useSocket} from "@/context/SocketContext";
import {useFileState} from "@/context/FileContext";
import {Switch} from "@/components/ui/switch";

type InputFieldPropTypes = {
    wrapperClassName?: string;
    inputClassName?: string;
    placeholder?: string;
    labelClassName?: string;
    type?: string;
    isDefault?: boolean;
    htmlFor?: string;
    disable?: boolean;
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
                {/*<div className={'w-full between text-foreground/80 text-xs font-semibold'}>*/}
                {/*    <div className={cn('center !flex-nowrap text-xs gap-[40px] capitalize font-semibold',*/}
                {/*        currentContainer?.State === 'running' ? 'text-green-400' : currentContainer?.State === 'stopping' ? 'text-yellow-300' : 'text-cyan')}>*/}
                {/*        <h3 className={'center container-fit text-xs font-regular text-foreground/80'}>Status</h3>*/}
                {/*        {currentContainer && currentContainer?.State || 'not_created'}*/}
                {/*    </div>*/}
                {/*    <div className={cn('!text-sm font-semibold text-foreground/90')}>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
            <div className={cn('between flex-row gap-[20px] container-full')}>
                <div className={'center flex-col !justify-start gap-[20px] container-full'}>
                    <div className={'w-full center flex-col gap-[10px] !items-end'}>
                        <InputField
                            label={'Source'}
                            htmlFor={'source'}
                            name={'source'}
                            disable={config.useCurrentFlow}
                            value={config.source}
                            onChange={setConfig}
                            placeholder={'GitHub'}
                        />
                        <InputField
                            htmlFor={'use-current-flow'}
                            label={'Use Current Flow'}
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
                        <div className={cn('between w-full h-fit')}>
                            <SelectWrapper
                                items={Environments}
                                setValue={setConfig}
                                className={'self-end !h-[29px] !m-0'}
                                placeholder={config.environment}
                            />
                            {/*<div className={cn('h-[29px] w-[29px] rounded-sm !bg-neutral-800')}>*/}

                            {/*</div>*/}
                        </div>
                    </InputField>

                    <InputField
                        label={'Build Command'}
                        value={config.buildCommand}
                        placeholder={'npm run dev'}
                        name={'buildCommand'}
                        htmlFor={'buildCommand'}
                        onChange={setConfig}
                    />

                    <InputField
                        label={'Run-Time'}
                        value={config.runTime}
                        placeholder={'Node JS'}
                        name={'runTime'}
                        htmlFor={'runTime'}
                        onChange={setConfig}
                    />
                    <h3 className={'text-xs center my-[10px] !self-start font-bold text-foreground'}>Networking & Access</h3>

                    <InputField
                        label={'Ports'}
                        type={'text'}
                    />
                </div>
                <div className={'!w-[500px] center h-full bg-neutral-700/50 backdrop-blur-md rounded-lg'}>

                </div>
            </div>
        </div>
    )
})

export const InputField = memo(({
                             labelClassName,
                             type = 'text',
                             children,
                             label,
                             value,
                             name,
                             onChange,
                             disable,
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
                    id={htmlFor}
                    inputType={type}
                    value={value}
                    name={name}
                    disable={disable}
                    placeholder={placeholder}
                    onChange={(e) => onChange(prev => ({...prev, [e.target.name]: e.target.value}))}
                    className={cn('w-full p-[3px] placeholder:text-xs px-[5px] !h-[29px] bg-neutral-800/50 backdrop-blur-md rounded-sm border-neutral-800 outline-none border-[0.5px] !text-xs !font-regular text-foreground', inputClassName)}
                />
            ) : children}
        </div>
    )
})

