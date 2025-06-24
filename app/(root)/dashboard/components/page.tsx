import React from 'react'
import TitleCard from "@/components/layouts/TitleCard";
import {domeDocuments} from "@/constants";
import DocumentWrapper from "@/components/layouts/DocumentWrapper";

const Page = () => {
    return (
        <div className={'center !justify-start flex-col container-full p-[10px]'}>
            <DocumentWrapper type={'My Components'} documents={domeDocuments}/>
        </div>
    )
}
export default Page
