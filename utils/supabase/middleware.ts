import { createServerClient } from '@supabase/ssr'
import {NextRequest, NextResponse} from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: DO NOT REMOVE auth.getUser()

    // const {
    //     data: { user },
    // } = await supabase.auth.getUser()
    //
    // if(user && request.nextUrl.pathname === "/"){
    //     return   NextResponse.redirect(new URL("/dashboard/overview", request.url))
    // }
    // if(user && request.nextUrl.pathname.startsWith("/sign-in") || user && request.nextUrl.pathname.startsWith("/sign-up")){
    //     return   NextResponse.redirect(new URL("/dashboard/overview", request.url))
    // }
    // if(!user && request.nextUrl.pathname.startsWith("/dashboard")){
    //     return   NextResponse.redirect(new URL("/sign-in", request.url))
    // }

    return supabaseResponse
}