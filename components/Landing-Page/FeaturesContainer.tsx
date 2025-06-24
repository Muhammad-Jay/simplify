'use client'
import React, {useRef} from 'react'
import Card from "@/components/Landing-Page/FeaturesCard";
import {service_texts} from "@/constants";
import {useInView} from "framer-motion";

const CardContainer = () => {
    const featuresRef = useRef(null);
    const isInView = useInView(featuresRef,{once: true,amount: 0.3})

    return (
        <div ref={featuresRef} id={'features'} className={'w-full h-fit center flex-col py-[30px] mt-[30px] lg:px-[30px]'}>
            <div className={`w-[90%] lg:w-full h-fit p-[10px] center max-w-[600px] !justify-between flex-col overflow-hidden`}>
                <h1 className={'bg-gradient-to-r from-foreground/80 via-foreground to-foreground/80 bg-clip-text text-3xl capitalize font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl m-auto text-nowrap mb-[30px]'}>
                    service we offer
                </h1>
                <p className={'bg-gradient-to-r from-foreground/80 via-foreground to-foreground/80 bg-clip-text text-transparent capitalize font-semibold  m-auto text-xl md:text-3xl mb-[30px] text-nowrap'}>AI-Powered collaboration in real-time</p>
                <p className={'bg-gradient-to-r from-foreground/80 via-foreground to-foreground/80 bg-clip-text text-transparent text-sm center text-center m-auto text-wrap'}>
                    Unlock the full potential of teamwork with our AI tool that assist you throughout your collaborative journey.
                    Weather you're brainstorming, editing document or making data-driven decisions, our platform adapts to your needs in real time.
                </p>
            </div>
            <span className={'w-[70%] h-[2px] accent opacity-65 mt-[30px]'}/>
            <div className={`w-full !justify-center space-y-[30px] gap-20px lg:gap-[30px] h-fit items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-0 lg:p-[20px] pt-[100px]`}>
                {service_texts.map(({title,desc,Icon,color},index) => (
                    <Card key={title} title={title} desc={desc} index={index} isInView={isInView} Icon={Icon} color={color}/>
                ))}
            </div>
        </div>
    )
}
export default CardContainer