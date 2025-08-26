import {createClient} from "@/utils/supabase/server";
import {getCurrentUserFromDB} from "@/lib/database";
import {db} from "@/lib/dexie/index.dexie";

export  async function POST(req: Request, {params}){
    const { fileTree, projectName, projectId } = await req.json()
    const supabase = await  createClient()
    const user = await getCurrentUserFromDB()
    const author_id = 'jsync4172004@gmail.com'

    if (!fileTree || !projectName) {
        return Response.json({ success: false, status: 400, message: 'file tree must not be null' })
    }

    for (const tree of fileTree){
        await db.files.put({
            id: tree.fullPath,
            path: tree.fullPath,
            code: tree.content || '',
            project_id: projectId,
            author_id,
            created_At: Date.now(),
            updated_At: Date.now()
        })
    }

    console.log(projectName,fileTree)
    try {
        const { data, error: err } = await supabase.from('repositories').select('*').eq('repo_name', projectName).eq('project_id', projectId)
        if (err) {
            console.log(err)
            return Response.json({ success: false, status: 400, message: err  }) as Response;
        }
        else if (data){
            const {error} = await supabase.from('repositories').update({
                author_id: user.email,
                repo_name: projectName,
                projectId,
                fileTree,
            }).eq('repo_name', projectName).eq('project_id', projectId);

            if (error){
                console.log(error)
                return Response.json({ success: false, status: 400, message: error  }) as Response;
            }
            return Response.json({ success: true, status: 200, message: 'files saved successfully' }) as Response;
        }

    }catch (e) {
        console.log(e)
        return Response.json({ success: false, status: 400, message: e  }) as Response;
    }
}