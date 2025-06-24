'use server'
import {FormDataTypes} from "@/types";
import {createClient} from '@/utils/supabase/server'
import { getCurrentUser } from "../supabase-auth/action";

export async function getUsers(userIDs: any){

}

export async function signUpUser(user: FormDataTypes){
    const supabase = await createClient()
    const {error} = await supabase.from("users").insert(user)
    if(error) return console.log(error)
}

export async function getCurrentUserFromDB(){
    const authUser = await getCurrentUser()
    if(!authUser) console.log("there is no auth user found")
    const supabase = await createClient()
    const {data, error} = await supabase.from("users").select().eq("email", authUser?.user?.email)

    if(error) return error

    return data[0]

}