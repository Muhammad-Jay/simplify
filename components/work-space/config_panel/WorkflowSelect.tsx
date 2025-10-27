'use client'
import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {cn} from "@/lib/utils";

type WorkflowSelectProps = {
    defaultValue: any,
    setValue: Function,
    className?: string,
    items: { name: string; value: string }[],
    label?: string,
    children?: React.ReactNode,
}

function WorkflowSelect({
                                   defaultValue,
                                   setValue,
                                   className,
                                   items,
                                   label,
                                   children,
                               }: WorkflowSelectProps) {
    return (
        <Select defaultValue={defaultValue} onValueChange={(value) => {setValue(value)}}>
            <SelectTrigger className={cn("!outline-none p-[10px] text-xs text-foreground/90 !border-none m-o !w-full",className)}>
                {defaultValue ? (
                    <SelectValue defaultValue={defaultValue} className={"bg-transparent text-foreground/90 !text-xs  hover:text-cyan-500 transition-300"}/>
                ): children}
            </SelectTrigger>
            <SelectGroup>
                <SelectContent>
                    <SelectLabel className={cn('text-xs text-foreground/90 w-full')}>{label}</SelectLabel>
                    {items?.length > 0 && items.map(({value, name}, index) => (
                        <SelectItem className={cn('text-xs text-foreground/90 w-full')} key={index} value={value}>{name}</SelectItem>
                    ))}
                </SelectContent>
            </SelectGroup>
        </Select>
    )
}

export default WorkflowSelect;