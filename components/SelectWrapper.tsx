'use client'
import React, {useState, useEffect} from 'react'
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

const SelectWrapper = ({placeholder,isStrict, setIsOpen, isOpen, setValue, children, items, label,className}: {placeholder?: string, setIsOpen?:any, isOpen?: boolean, isStrict?:boolean, setValue?:any, children?: React.ReactNode, items?: {value: string, name: string}[], label?: string, className?: string}) => {

    return (
        <Select defaultValue={placeholder} onValueChange={(value) => {setValue(prev => ({...prev, environment: value}))}}>
            <SelectTrigger className={cn("!outline-none p-[10px] text-xs text-foreground/90 !border-none m-o !w-full",className)}>
                {placeholder ? (
                    <SelectValue defaultValue={placeholder} className={"bg-transparent text-foreground/90 !text-xs  hover:text-cyan-500 transition-300"}/>
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
export default SelectWrapper
