'use server'
import { createClient } from '@/utils/supabase/server'
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {FormDataTypes} from "@/types";
import {signUpUser} from "@/lib/database";

export async function getCurrentUser(){
    const supabase = await createClient()
    const {data, error} = await supabase.auth.getUser()

    if (error) console.error(error)
    return data
}

export async function logOut() {
    const supabase = await createClient()
    try {
        const { error } = await supabase.auth.signOut()
        if (error) console.log(error)
        revalidatePath('/sign-in')
        redirect('/sign-in')
    }catch (e) {
        console.log(e)
    }
}

export async function login(formData: FormDataTypes) {
    const supabase = await createClient()
    try {
        const {email,password} = formData
        const data = {email,password}

        const { error } = await supabase.auth.signInWithPassword(data)

        if (error) {
            redirect('/error')
        }
        redirect('/dashboard/overview')
    }catch (e: any) {
        console.log('login error: ',e)
    }
}


export async function signup(formData: FormDataTypes) {
    const supabase = await createClient()

    const {username, email, password} = formData

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        console.log("signup error  ",error)
        redirect('/error')
    }
    const user = {username, email, password}
    await signUpUser(user)
    revalidatePath('/dashboard/overview')
    redirect('/auth/success')
}

export async function getAuthUsers(id: any){
    const supabase = await createClient()
    const mapping = await id.map( async (userId: any) => {
        const {data,error} = await supabase.auth.admin.getUserById(userId)

        return data
    })
    console.log("auth users/mapping",mapping)
    return [...mapping]
}
