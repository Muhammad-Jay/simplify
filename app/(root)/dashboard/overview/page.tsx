import React, {ReactNode} from 'react'
import CreateRoomBtn from "@/components/liveblocks/CreateRoomBtn";
import DocumentWrapper from "@/components/layouts/DocumentWrapper";
import {domeDocuments} from "@/constants";
import {getDocuments} from "@/lib/liveblocks/getDocument";
import Header from "@/components/layouts/overview/Header";
import RecentComponents from "@/components/layouts/overview/RecentComponents";
import TrendingCreators from "@/components/layouts/overview/TrendingCreators";
import {cn} from "@/lib/utils";

const Draft = async () => {
    const data = await getDocuments()

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
export default Draft
