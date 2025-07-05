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

export async function createNewComponent(formData: {name: string, fileName: string}, author_id : string){
    try {
        const user = await getCurrentUserFromDB()
        console.log(user)
        const supabase = await createClient()
        const {data, error} = await supabase.from('components').insert({
            slug: formData.name,
            author_id: user.email
                // "jsync4172004@gmail.com"
        }).select("*").single()
        console.log(" the data: ", data)
        if (error){
            console.log("error creating component",error)
        }
        return data;
    } catch (e) {
        console.log(e)
    }
}

export async function fetchComponentById(id: string){
    try {
        const supabase = await createClient()
        const {data, error} = await supabase.from('components').select("*").eq("slug_id", id).single()
        if (error){
            console.log("error fetching component",error)
        }
        return data
    } catch (e) {
        console.log(e)
    }
}

export async function saveCode(value: any, id: string){
    try {
        console.log(id)
        const supabase = await createClient()
            const {data, error} = await supabase.from('components').update({
                files: JSON.stringify(value)
            }).match({
                slug_id: id
            })

            if (error) console.log("error:",error)
            return;

    } catch (e) {
        console.log(e)
    }
}

export async function fetchAllComponents(){
    try {
        const user = await getCurrentUserFromDB()
        console.log(user)
        const supabase = await createClient()
        if (user){
            const {data, error} = await supabase.from("components").select().eq("author_id", user.email)
            if (error){
                console.log(error)
            }
            return data;
        }else console.log("no current user found")
    }catch (e) {
        console.log(e)
    }
}