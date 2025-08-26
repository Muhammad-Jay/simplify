'use client'
import React, {useEffect, useState} from 'react'
import {fetchAllComponents} from "@/lib/database";

const useAllComponents = () => {
    const [allComponents, setAllComponents] = useState([])
    const [isFetching, setIsFetching] = useState(false)

    const fetchComponents = async () => {
        try {
            setIsFetching(true)
            const data = await fetchAllComponents()
            if (data){
                setAllComponents(data)
            }
            console.log("no components found")
        }catch (e) {
            console.log(e)
        }finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchComponents().catch(e => console.log(e))
    }, []);

    return {
        isFetching,
        allComponents
    }
}
export default useAllComponents
