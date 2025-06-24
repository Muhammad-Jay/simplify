"use server"

import {liveblocks} from "@/lib/liveblocks/liveblocks.config";

export async function  getDocuments(){
    try {
        const room = await liveblocks.getRooms()
        return room.data
    }catch (e) {
        console.log("Error while getting room. ", e)
    }
}