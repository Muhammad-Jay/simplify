import React from 'react'
import TitleCard from "@/components/layouts/TitleCard";
import {DialogBtn} from "@/components/CreateComponentBtn";
import WorkFlowsRenderer from "@/components/layouts/workFlows/WorkFlowsRenderer";

const DocumentWrapper = () => {

    return (
        <div className={'container-full rounded-xl !rounded-b-[0px] relative p-[5px] md:px-[10px] pt-0 md:p-[10px] !pb-0 flex-col center !justify-start gap-[5px]'}>
            <div className={'container-full sticky top-0 mx-auto !h-[60px] between'}>
                <div className={'container-full between flex-col gap-[10px] lg:mt-[10px]'}>
                    <TitleCard title={'Workflows'} titleClassName={'text-lg font-bold'}/>
                </div>
                <DialogBtn/>
            </div>
            <WorkFlowsRenderer/>
        </div>
    )
}
export default DocumentWrapper
