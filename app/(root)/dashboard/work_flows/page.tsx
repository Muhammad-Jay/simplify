import React from 'react'
import DocumentWrapper from "@/components/layouts/DocumentWrapper";
import NewWorkflowDialog from "@/components/layouts/workFlows/NewWorkflowDialog";

const Page = () => {
    return (
        <div className={'center !justify-start flex-col container-full'}>
            <DocumentWrapper/>
            <NewWorkflowDialog/>
        </div>
    )
}
export default Page
