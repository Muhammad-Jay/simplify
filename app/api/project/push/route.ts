import {createClient} from "@/utils/supabase/server";
import {getCurrentUserFromDB} from "@/lib/database";
import {db} from "@/lib/dexie/index.dexie";
import {postt} from "@/lib/dexie/test";
import path from 'path';
import {exec} from 'child_process'

function runCommand(command: string){
    return new Promise((resolve, reject) => {
        console.log('running command...');

        exec(command, (error, stdout, stderr) => {
            if (error){
                console.error('Execution error:', error);
                console.error('stderr:', stderr);
                reject(error);
                return;
            }
            console.error('stdout: ', stdout);
            if (stderr){
                console.warn('stderr warning', stderr);
            }
            resolve(stdout);
        })
    })
}

export  async function POST(req: Request, {params}){
    const { fileTree, projectName,} = await req.json()
    const supabase = await  createClient()
    const user = await getCurrentUserFromDB()
    const author_id = 'jsync4172004@gmail.com'
    const project_id = 'c15acf41-1bd7-4899-be74-7f70551e644c'
    const projectDir = process.cwd()

    if (!fileTree || !projectName) {
        return Response.json({ success: false, status: 400, message: 'file tree must not be null' })
    }

    await runCommand(`simplify push`)

    try {
        for (const tree of fileTree){
            console.log(tree.name)
            // await postt(tree, project_id, author_id)
        }
        // const { data, error: err } = await supabase.from('repositories').select('*').eq('repo_name', projectName).eq('project_id', projectId)
        // if (err) {
        //     console.log(err)
        //     return Response.json({ success: false, status: 400, message: err  }) as Response;
        // }
        // else if (data){
        //     const {error} = await supabase.from('repositories').update({
        //         author_id: user.email,
        //         repo_name: projectName,
        //         projectId,
        //         fileTree,
        //     }).eq('repo_name', projectName).eq('project_id', projectId);
        //
        //     if (error){
        //         console.log(error)
        //         return Response.json({ success: false, status: 400, message: error  }) as Response;
        //     }
        //     return Response.json({ success: true, status: 200, message: 'files saved successfully' }) as Response;
        // }

    }catch (e) {
        console.log(e)
        return Response.json({ success: false, status: 400, message: e  }) as Response;
    }
}