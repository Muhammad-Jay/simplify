import React from 'react'
import DocumentWrapper from "@/components/layouts/DocumentWrapper";
import {domeDocuments} from "@/constants";
import {GroupParamsTypes} from "@/types";

const Page = async ({params}: GroupParamsTypes) => {
    const {groupID} = await params

    return (
        <div className={'page rounded-md center'}>
            {/*<DocumentWrapper documents={domeDocuments} type={groupID}/>*/}
        </div>
    )
}
export default Page
