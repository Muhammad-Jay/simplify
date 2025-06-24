'use server'
import {nanoid} from "nanoid";
import { revalidatePath } from "next/cache";
import { liveblocks } from "./liveblocks.config";
import {parseStringify} from "@/lib/utils";

export async function CreateLiveblocksRoom(userid: string, email:  string){
    const roomId = nanoid()
    try {
        const metadata = {
            creatorId: userid,
            email: email,
            title: 'untitled'
        }
        const usersAccesses: any = {
            [email]: ['room:write']
        }
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: ["room:write"],
        });
        revalidatePath('/')
        return parseStringify(room)
    }catch (e) {
        console.log(e)
    }
}