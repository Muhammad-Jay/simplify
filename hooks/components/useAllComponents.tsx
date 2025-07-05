'use client'
import React, {useEffect, useState} from 'react'
import {fetchAllComponents} from "@/lib/database";

const useAllComponents = () => {
    const [allComponents, setAllComponents] = useState([])
    const [isFetching, setIsFetching] = useState(false)

    const fetchComponents = async () => {
         const data = await fetchAllComponents()
        if (data){
            setAllComponents(data)
        }
        console.log("no components found")
    }

    useEffect(() => {
        try {
            setIsFetching(true)
            fetchComponents().catch(e => console.log(e))
        }catch (e) {
            console.log(e)
        }finally {
            setIsFetching(false)
        }
    }, []);

    return {
        isFetching,
        allComponents
    }
}
export default useAllComponents
