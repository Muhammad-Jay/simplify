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

const SelectWrapper = ({placeholder,isStrict, setIsOpen, isOpen, setValue, children, items, label,className}: {placeholder?: string, setIsOpen?:any, isOpen?: boolean, isStrict?:boolean, setValue?:any, children: React.ReactNode, items?: {value: string, name: string}[], label?: string, className?: string}) => {

    return (
        <Select onValueChange={(value) => {setValue(value)}}>
            <SelectTrigger className={cn("!outline-none !border-none",className)}>
                {placeholder ? (
                    <SelectValue placeholder={placeholder} className={"bg-transparent text-white  hover:text-cyan-500 transition-300"}/>
                ): children}
            </SelectTrigger>
            <SelectGroup>
                <SelectContent>
                    <SelectLabel>{label}</SelectLabel>
                    {items?.length > 0 && items.map(({value, name}, index) => (
                        <SelectItem key={index} value={value}>{name}</SelectItem>
                    ))}
                </SelectContent>
            </SelectGroup>
        </Select>
    )
}
export default SelectWrapper
