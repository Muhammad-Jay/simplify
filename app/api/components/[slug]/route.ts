import { NextRequest, NextResponse } from 'next/server'
import {createClient} from "@/utils/supabase/client";

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { slug } = params

    try {
        const supabase = await createClient()
        const {data, error} = await supabase.from('components_slug').select().eq('slug', slug)
        if (error){
            return NextResponse.json({error})
        }

        return NextResponse.json(data[0])
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
