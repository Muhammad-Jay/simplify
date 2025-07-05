import { createClient } from '@/utils/supabase/server';
import {NextResponse} from 'next/server'
import {getCurrentUserFromDB} from "@/lib/database";

export async function GET(){
    return NextResponse.json({message: "working successfully"})
}

export async function POST(req: Request){
    const {id, code, path} = await req.json()
    const supabase = await createClient()
    const user = await getCurrentUserFromDB()
    try {
        if (path && code){
            const {data: existingFile, error} = await supabase.from('files').select().match({
                path: path,
                file_id: id,
                author_id: user.email
            })
            if (existingFile.length > 0){
                const {error: err} = await supabase.from("files").update({
                    code
                }).match({
                    path: path,
                    file_id: id,
                    author_id: user.email
                })
                if (err){
                    console.log("error saving files to  database: ",err)
                }
                console.log(`successfully save part: ${path} to the database`)
                return;
            }else {
                const {error: saveError} = await supabase.from("files").insert({
                    code,
                    path,
                    file_id: id,
                    author_id: user.email
                })
                if (saveError){
                    console.log("error saving files to  database:", saveError)
                }
            }

            // const {data, error} = await supabase.from("files").upsert({
            //     id: primary_id,
            //     code,
            //     path,
            //     file_id: id,
            //     author_id: user.email
            // }, {
            //     onConflict: 'id',
            //     ignoreDuplicates: false
            // })
            // if (error){
            //     console.log(error)
            // }
            return NextResponse.json({message: "success", success: true})
        }else {
            console.log("files must not be empty")
            return  NextResponse.json({message: 'files must not be empty', success: false})
        }
    } catch (e) {
        return NextResponse.json({message: "error", success: false})
    }
}