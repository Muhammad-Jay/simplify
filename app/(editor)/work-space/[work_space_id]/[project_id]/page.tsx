import React, {memo} from 'react'
import SimpleFlow from "@/components/EditorFlow/EditorFlow";
import Providers from "@/app/(editor)/work-space/[work_space_id]/[project_id]/Providers";

const Page = async ({ params }) => {
    const { work_space_id, project_id } = await params;

    return (
        <div className={"!h-[100dvh] !w-[100dvw] center flex-col"}>
            <Providers>
                <SimpleFlow workSpaceId={work_space_id} projectId={project_id}/>
            </Providers>
        </div>
    )
}
export default memo(Page)
