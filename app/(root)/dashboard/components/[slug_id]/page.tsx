import React, {memo} from 'react'
import CodeEditor from "@/components/EditorFlow/Monoco/Editor";


const Page = async ({params}: {params: {slug_id: string}}) => {
    const {slug_id} = await params;

    return (
       <div className={"center container-full"}>
       </div>
    )
}
export default memo(Page)
