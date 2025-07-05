'use client'
import {motion} from "framer-motion";
import React from "react";
import Link from "next/link";
import {cn} from "@/lib/utils";

export const DocumentCard = ({doc, index}: {doc: any, index?: number}) => {
    return(
        <motion.div
            initial={{opacity: 0, y: 60}}
            whileHover={{scale: 1.01}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: .6,ease: "linear", staggerChildren: 0.01,delay: index && index * 0.1 + 0.2}}
            id={'service-card'} className={`w-full center mx-auto flex-col mb-[30px] lg:mb-0 group h-[250px] `}>
            {/*<h2 className={'text-md w-full text-center font-bold text-white/80 capitalize pb-[15px]'}>{title}</h2>*/}
            <div className={'w-full center relative !justify-between h-full p-[20px] flex-col hover:border-[2px] hover:bg-[#00BBC2]/5 hover:border-[#00BBC2]/80 transition-all duration-400 center rounded-lg bd'}>
                <div className={"absolute w-full h-full inset-0 bg-radial from-[#00BBC2]/17 to-transparent z-[1]"} id={"conversation-pulse"}>
                </div>
                <Link href={`/dashboard/components/${doc.slug_id}`} className={cn(`w-full h-full center z-[10]`)}>
                    {index}
                </Link>
            </div>
        </motion.div>
    )
}