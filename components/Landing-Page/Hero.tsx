'use client'
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import Image from "next/image";
import {motion,useInView} from "framer-motion"
import Link from 'next/link';
import TextGenerateEffect from "@/components/ui/typewriter";
import HeroIcons from './HeroIcons';


const HeroContent = () => {
    return (
        <div className={'w-[90dvw] h-[600px] z-[5] overflow-hidden md:w-[80dvw] rounded-lg border-2 border-[#00CCD3] emp-bg center lg:!hidden'}>

        </div>
    )
}

export const Hero = () => {
    return (
        <div className="w-screen center md:p-[40px] p-[20px] flex-col overflow-x-hidden" id={"no-scrollbar"}>
            <div className="center w-full h-[400px] relative md:h-[500px] flex-col">
                <section className="max-w-[80%] h-full center flex-col md:!justify-between relative px-[20px] pt-[50px] md:pt-[100px] py-[30px] md:pb-[47px] md:py-[60px]">
                    <HeroIcons/>
                    <div id={'hero-title'} className="mb-[10px] md:mb-[30px] group center !font-bold gap-0 flex-col w-[90%]">
                        <h1 className="bg-gradient-to-r from-foreground/80 via-foreground to-foreground/80 bg-clip-text text-transparent pb-[13px] text-nowrap self-center capitalize text-2xl min-[440px]:text-3xl sm:text-4xl md:text-5xl lg:text-7xl group-hover:text-[#3AFFFF] transition-all duration-400 font-simibold mb-[5px] !h-fit">
                            the ai-Powered writing partner
                        </h1>
                        <h1 className="bg-gradient-to-r from-foreground/80 via-foreground to-foreground/80 bg-clip-text text-transparent center flex-row text-nowrap  self-center text-2xl min-[440px]:text-3xl sm:text-4xl md:text-5xl lg:text-7xl capitalize group-hover:text-[#3AFFFF] w-fit transition-all duration-400 font-bold mb-[5px]">
                            for seamless
                            <div className="text-[#3AFFFF] center w-fit flex-col group-hover:border-none group-hover:outline-none transition-all duration-400 group-hover:bg-white/90 group-hover:text-black ml-[6px] md:ml-[15px] relative h-fit">
                               <span className={'!font-bold center'}>
                                   teamwork
                               </span>
                            </div>
                        </h1>
                    </div>
                    <div className="mb-[20px] md:mb-[10px] center w-full flex-col">
                        <p className="text-xs w-full md:text-xl text-wrap md:w-[80%] center flex-col text-foreground/80 text-center font-regular mb-[4px]">Collaborate in real-time and unlock the power of AI to enhance your team's writing. Simplify delivers a smarter, more efficient way to create content together.</p>
                    </div>
                    <div id={'cta-container'} className="w-full h-[87px] center justify-between space-x-[30px] md:mt-[50px] mb-[40px]">
                        <Link href="/sign-up" className="md:w-[170px] w-[90px] h-[40px] md:h-[55px] button-accent rounded-full center text-xs md:text-sm text-center">
                            Get started
                        </Link>
                        <Link href="/sign-in" className="md:w-[170px] w-[90px] h-[40px] !border-[2px] md:ml-[50px] md:h-[55px] bd rounded-full center text-xs md:text-sm text-center">
                            Sign in
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}


export const SecondHero = () => {
    const com = useRef(null);
    const inView = useInView(com,{once: true, amount: 0.4})

    return (
        <div className={'w-full h-fit center'}>
            <HeroContent/>
            <div ref={com} className={'w-fit relative h-fit !hidden lg:!flex center rounded-[10px] lg:rounded-[20px] mt-[20px] md:mt-[60px] mb-[70px] lg:mt-[40px] md:mb-[160px] p-[10px]'}>
                <div id={'card'} className={"center w-[300px] h-[300px] md:!w-[600px] md:!h-[600px] lg:!w-[750px] lg:!h-[750px] relative overflow-hidden"}>
                    <div id={'disc'} className={'w-[65%] h-[30px] md:h-[60px] z-[6] center rounded-md bg-white absolute top-[20px] left-[10px]'}>

                    </div>
                    <svg id={'hero-clip'} className={'overflow-hidden absolute !w-full !h-full z-[16] inset-0 top-0 left-0 center'} width="750" height="750" viewBox="0 0 750 750" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 1.5H730C740.217 1.5 748.5 9.78273 748.5 20V63.5C748.5 73.7173 740.217 82 730 82H622.5C610.626 82 601 91.6259 601 103.5V423C601 434.874 610.626 444.5 622.5 444.5H730C740.217 444.5 748.5 452.783 748.5 463V730C748.5 740.217 740.217 748.5 730 748.5H324C313.783 748.5 305.5 740.217 305.5 730V324.5C305.5 312.626 295.874 303 284 303H20C9.78273 303 1.5 294.717 1.5 284.5V20C1.5 9.78273 9.78273 1.5 20 1.5Z" stroke="#00CCD3" strokeOpacity="1" className={'md:stroke-[3] lg:stroke-[7]'} strokeWidth="7"/>
                    </svg>

                </div>
                <motion.div
                    initial={{x: 100, opacity: 0}}
                    animate={inView? {x: 0, opacity: 1} : {x: 100, opacity: 0}}
                    transition={{duration: 1, ease: "easeInOut"}}
                    id={'card2'} className={'md:w-[220px] md:h-[280px] lg:w-[300px] overflow-hidden lg:h-[350px] center emp-bg absolute rounded-[18px] border-1 lg:border-[3px] border-[#00CCD3] top-[13%] md:-right-[15.5%]  lg:-right-[19%]'}>

                </motion.div>
                <motion.div
                    initial={{x: -100, opacity: 0}}
                    animate={inView? {x: 0, opacity: 1} : {x: -100, opacity: 0}}
                    transition={{duration: 1, ease: "easeInOut"}}
                    className={'md:w-[280px] md:h-[440px] lg:w-[400px] lg:h-[565px] absolute overflow-hidden z-[5] lg:border-[3px] border-[#00CCD3] rounded-[20px] md:border-1 md:-bottom-[12.5%] md:-left-[5%] lg:-bottom-[15%] lg:-left-[11.8%]'}>
                </motion.div>
            </div>
        </div>
    )
}