import React from 'react'
import {cn} from "@/lib/utils";

export default function  Layout({
                    children
                }: {
    children: React.ReactNode;
}) {
    return (
        <div className={cn(`screen relative bd center container-full overflow-hidden`)}>
            {children}
        </div>
    )
}
