'use client'
import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {createNewComponent} from "@/lib/database";
import {USER} from '@/types'
import useAuthClient from "@/hooks/supabase-auth/useAuthClient";

export type FormDataType = {
    name: string,
    fileName: string
}

const UseCreateComponent = (formData: FormDataType) => {
    const router = useRouter()
    const user: USER = useAuthClient()
    const [loading, setLoading] = useState(false)
   const createComponent = async () => {
       try {
           setLoading(true)
           const data = await createNewComponent(formData, user.email)
           if (data){
               console.log(data)
               router.push(`/dashboard/components/${data.slug_id}`)
           }
           console.log('error, no data found')
       } catch (e) {
           console.log(e)
       }finally {
           setLoading(false)
       }
   }

   return{
        loading,
       createComponent
   }
}
export default UseCreateComponent
