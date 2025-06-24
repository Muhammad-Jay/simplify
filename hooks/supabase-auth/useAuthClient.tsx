'use client'
import React, {use, useEffect, useState} from 'react'
import {getCurrentUserFromDB} from "@/lib/database";
import {USER} from "@/types";


const UseAuthClient = () => {
    const [user, setUser] = useState<USER>({
        id: 0,
        created_at: "",
        email: "@jjj",
        password: "",
        user_id: "",
        username: "Anonymous",
        history: ""
    })

    const getUser = async () => {
        const data = await getCurrentUserFromDB()
        if (!data){
            console.log('no user found')
        }
        setUser({...data})
        return;
    }

    useEffect(() => {
      getUser().catch(e => console.log(e))
    }, []);

    return user

}
export default UseAuthClient
