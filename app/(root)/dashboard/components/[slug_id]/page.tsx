import React from 'react'
import EditorWrapper from "@/components/sandpack/EditorWrapper";

const Page = async ({params}: {params: {slug_id: string}}) => {
    const {slug_id} = await params;

    return (
       <EditorWrapper id={slug_id}/>
    )
}
export default Page
