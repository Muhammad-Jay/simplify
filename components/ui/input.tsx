import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = {
    className?: string,
    type?: 'sign-in' | 'sign-up',
    required?: string,
    inputType?: string,
    placeholder?: string
    value?: string,
    id?: string,
    onChange?: (e?:any)=> void,
    defaultValue?: string,
    name?: string
}

function Input({
                   className,
                   type,
                   required,
                   inputType,
                   placeholder,
                   value,
                   onChange,
                   defaultValue,
                   ...props
               } : InputProps) {
    return (
        <input autoComplete={"on"}
               type={inputType || type}
               data-slot="input"
               placeholder={placeholder}
               value={value}
               onChange={onChange}
               className={cn(
                   "file:text-foreground placeholder:text-muted-foreground placeholder:text-sm placeholder:font-regular  dark:bg-input/30 flex h-9 w-full min-w-0 rounded-full border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                   "focus-visible:border-[#279397] focus-visible:border-2",
                   "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                   className
               )}
               {...props}/>
    );
}

export { Input }