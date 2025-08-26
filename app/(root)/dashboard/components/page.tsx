'use client'
import React, {memo} from 'react'
import DocumentWrapper from "@/components/layouts/DocumentWrapper";
import useAllComponents from "@/hooks/components/useAllComponents";

const Page = () => {
    const {allComponents, isFetching} = useAllComponents()

    if (!allComponents && !isFetching) return (
        <div className={"w-[80%] h-[60%] rounded-md m-[20px] center bg-zinc-900"}>

        </div>
    )

    return (
        <div className={'center !justify-start flex-col container-full p-[10px]'}>
            <DocumentWrapper type={'My Components'} isFetching={isFetching} documents={allComponents}/>
        </div>
    )
}
export default memo(Page)
