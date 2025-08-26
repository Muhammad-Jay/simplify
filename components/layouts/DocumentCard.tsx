'use client'
import {motion} from "framer-motion";
import React from "react";
import Link from "next/link";
import {cn} from "@/lib/utils";
import GlassCard from "@/components/ui/glass";

export const DocumentCard = ({doc, index}: {doc: any, index?: number}) => {
    return(
        <motion.div
            initial={{opacity: 0, y: 60}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: .6,ease: "linear", staggerChildren: 0.01,delay: index && index * 0.1 + 0.2}}
            id={'service-card'} className={`w-full center mx-auto flex-col mb-[30px] lg:mb-0 group h-[250px] `}>
            {/*<h2 className={'text-md w-full text-center font-bold text-white/80 capitalize pb-[15px]'}>{title}</h2>*/}
            <div className={'w-full center relative !justify-between h-full p-[20px] flex-col hover:border-[2px] hover:bg-cyan-500/20 hover:border-[#00BBC2]/80 overflow-hidden transition-all duration-300 center rounded-lg'}>
                <GlassCard className={"absolute container-full inset-0 rounded-lg bd"}/>
                <Link href={`/dashboard/work-flow/${doc.slug_id}`} className={cn(`w-full h-full center z-[10]`)}>
                    {index}
                </Link>
            </div>
        </motion.div>
    )
}