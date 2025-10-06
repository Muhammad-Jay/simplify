import React from 'react'
import {cn} from "@/lib/utils";
import {EditorProvider} from "@/context/EditorContext";
import {GlobalUserProvider} from "@/context/UserContext";
import {GlobalFileProvider} from "@/context/FileContext";
import {WorkSpaceProvider} from "@/context/WorkSpaceContext";

export default function  Layout({
                                    children
                                }: {
    children: React.ReactNode;
}) {
    return (
        <div className={cn(`screen relative center container-full overflow-hidden`)}>
            {children}
        </div>
    )
}