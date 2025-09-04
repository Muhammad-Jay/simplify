import {db} from "@/lib/dexie/index.dexie";

export async function postt(tree, project_id, author_id){
    await db.files.put({
        id: tree.fullPath,
        path: tree.fullPath,
        code: tree.content || '',
        type: tree.type === 'file'? 'codeEditor' : 'folderNode',
        name: tree.name,
        project_id,
        author_id,
        created_At: Date.now(),
        updated_At: Date.now()
    })
}