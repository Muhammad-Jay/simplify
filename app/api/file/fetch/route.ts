import { createClient } from '@/utils/supabase/server';
import {getCurrentUserFromDB} from "@/lib/database";
import {NextResponse} from 'next/server'

export async function GET(){
    return NextResponse.json({message: "working successfully"})
}

export async function POST(req: Request){
    const {id, template} = await req.json()
    const supabase = await createClient()
    const user = await getCurrentUserFromDB()

    try {
        const {data, error} = await supabase.from('files').select("id, path, code").match({
            author_id: user.email,
            file_id: id,
            template
        })
        if (error){
            console.log(error)
            return NextResponse.json({message:error, success: false})
        }
        console.log("fetched files from server:", data)
        return  NextResponse.json({ data: data, success: true })
    } catch (e) {
        console.log(e)
        return NextResponse.json({message: e, success: false})
    }
}