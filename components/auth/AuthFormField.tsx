"use client"
import React from 'react'
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

type AuthFormProps = {
    className?: string,
    control: any,
    name: string,
    label: string,
    placeholder: string,
    required?: string,
    inputType: string,
    type?: "sign-in" | "sign-up"
}

const AuthFormField = ({control,name,label,placeholder,type, required, inputType,className} : AuthFormProps) => {
    return (
        <div >
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className={`w-[300px] md:w-[350px] ${className}`}>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Input placeholder={placeholder} {...field} inputType={inputType} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
export default AuthFormField
