import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import {NextRequest} from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type: any = searchParams.get('type')
    const next = searchParams.get('next') ?? '/dashboard'

    if (token_hash && type) {
        const supabase = await createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            redirect(next)
        }
        console.log("verification error  ",error)
    }

    redirect('/error')
}