'use client'
import React from 'react'
import DocumentWrapper from "@/components/layouts/DocumentWrapper";
import useAllComponents from "@/hooks/components/useAllComponents";

const Page = () => {
    const {allComponents, isFetching} = useAllComponents()

    return (
        <div className={'center !justify-start flex-col container-full p-[10px]'}>
            <DocumentWrapper type={'My Components'} isFetching={isFetching} documents={allComponents}/>
        </div>
    )
}
export default Page
