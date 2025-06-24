import React from 'react'
import { motion } from "framer-motion";

const Card = ({
                  title,
                  desc,
                  isInView,
                  Icon,
                  color,
                  index
} : {title: string, desc: string, isInView: any, Icon: any, color?: string, index?: number}) => {
    return (
        <motion.div
            initial={{opacity: 0, y: 60}}
            whileHover={{scale: 1.05}}
            animate={isInView? {opacity: 1, y: 0} : {opacity: 0, y: 60}}
            transition={{duration: 1,ease: "linear", delay: index && index * 0.1 + 0.5}}
            id={'service-card'} className={`w-[92%] lg:w-full center m-auto flex-col mb-[30px] lg:mb-0 group backdrop-blur-3xl h-[250px] `}>
            {/*<h2 className={'text-md w-full text-center font-bold text-white/80 capitalize pb-[15px]'}>{title}</h2>*/}
            <div className={'w-full center relative !justify-between h-full p-[20px] flex-col hover:border-[2px] hover:border-cyan-600 transition-all duration-400 center rounded-lg bd'}>
                <div className={"absolute w-full h-full inset-0 bg-radial from-[#00BBC2]/20 to-transparent z-[1]"} id={"pulse"}>
                </div>
                <div className={'w-full h-full !items-start between flex-col'}>
                    <div className={'center container-fit mt-[30px] bg-secondary rounded-lg p-[10px]'}>
                        <Icon size={30} style={{color, opacity: .8}}/>
                    </div>
                    <h2 className={`text-lg w-full text-start font-bold capitalize pb-[15px] text-gre`} style={{color}}>{title}</h2>
                </div>
                <p className={'text-wrap transition-all duration-400 text-sm text-gray-300'}>{desc}</p>
            </div>
        </motion.div>
    )
}
export default Card