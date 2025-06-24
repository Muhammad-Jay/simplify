'use client'
import React, { useState } from 'react'
import {toast} from "sonner";
import {Plus} from "lucide-react";
import { useRouter } from 'next/navigation';
import useAuthClient from "@/hooks/supabase-auth/useAuthClient";
import {CreateLiveblocksRoom} from "@/lib/liveblocks/createDocument";

const CreateRoomBtn = ({type} : {type: string}) => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const user = useAuthClient()

    const handleClick = async (e: React.MouseEvent< HTMLButtonElement>) => {
        try {
            const { user_id, email } = user
            const room = await CreateLiveblocksRoom(user_id,email)
            if(room) {
                // await upDateRoomTitle(room.id,value)
                await router.push(`/document/${room.id}`)
            }
        }catch (e) {
            console.log(e)
        }
    }

    return (
        <button
            type='button'
            onClick={handleClick}
            className={'center rounded-md p-[5px] pr-[10px] w-[100px] hover:bg-[#00BBC2]/90 transition-500 gap-2 h-[35px] text-xs text-white button-light bd'}>
            <Plus size={15} className={'stroke-3'}/>
            create
        </button>
    )
}
export default CreateRoomBtn
