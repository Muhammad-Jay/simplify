'use client'
import React, {useState} from 'react'
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {MetadataTypes} from "@/types";
import {Label} from "@/components/ui/label";

const SidebarRenderer = () => {
    const [metadata, setMetadata] = useState<MetadataTypes>({
        name: "",
        description: "",
        tags: ["button"],
        dependencies: [],
    })

    const handleChange = (e: React.ChangeEvent<any>) => {
        const {name, value} = e.target
       setMetadata(prev => ({...prev, [name]: value}))
        console.log(metadata)
    }

    return (
        // <div className={" relative center"}>
            <div className={cn(`w-full !justify-start p-[5px] pt-[15px] gap-[10px] inset-0 overflow-y-auto !h-full bg-zinc-900 rounded-md center flex-col`)} id={"no-scrollbar"}>
                <div className={"w-full px-[5px] flex-col h-fit center !items-start gap-[20px]"}>
                    <Label className={"text-xs text-white items-start font-regular"}>name</Label>
                    <Input
                        inputType={"text"}
                        name={"name"}
                        value={metadata.name}
                        placeholder={"Example: form-input"}
                        className={cn(`w-full bg-black text-white/80 border-none rounded-sm outline-none`)}
                        onChange={handleChange}/>
                </div>
                <div className={"w-full px-[5px] flex-col h-fit center !items-start gap-[5px]"}>
                    <Label className={"text-xs text-white items-start font-regular"}>description</Label>
                    <textarea
                        name={"description"}
                        value={metadata.description}
                        className={cn(`w-full bg-zinc-800 min-h-[70px] p-[5px] placeholder:text-white placeholder:font-regular font-regular text-white/80 border-none rounded-sm outline-none`)}
                        onChange={handleChange}/>
                </div>
                <div className={"w-full h-fit between"}>
                    <Label className={"text-xs text-white items-start font-regular"}>tags</Label>
                    <div className={"w-[5%] h-[30px rounded-sm bg-zinc-800"}>

                    </div>
                </div>
                <div className={"w-full h-fit overflow-x-auto"}>
                    {metadata.tags.map((tag)=> (
                        <div key={tag} className={"w-fit text-xs bg-cyan-700 rounded-md font-regular p-[5px] text-black px capitalized"}>
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        // </div>
    )
}
export default SidebarRenderer
