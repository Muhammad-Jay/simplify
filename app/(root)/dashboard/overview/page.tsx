"use client"
import React, {memo} from 'react'
import Header from "@/components/layouts/overview/Header";
import dynamic from 'next/dynamic';
import {cn} from "@/lib/utils";

const RecentComponents = dynamic(()=> import("@/components/layouts/overview/RecentComponents"), {ssr: false})
const TrendingCreators = dynamic(()=> import("@/components/layouts/overview/TrendingCreators"), {ssr: false})

const Draft = () => {

    return (
        <main className={`page rounded-lg !bg-transparent relative !justify-start gap-[10px] pt-[30px] px-[20px] !flex-col`}>
            <div className={cn(`absolute container-full inset-0 animate-pulse`)}/>
           <Header/>
            <div className={'between !bg-transparent w-full h-fit !items-start gap-[20px]'}>
               <RecentComponents/>
               <TrendingCreators/>
            </div>
        </main>
    )
}
export default memo(Draft)
