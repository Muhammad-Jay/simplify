'use client'
import React, {useEffect, useState} from 'react'

const useComponent = (id: string) => {
    const [files, setFiles] = useState<Record<string, { code: string }>>({})
    const [isFetching, setIsFetching] = useState(false)

    const fetchComponent = async () => {
        try {
            setIsFetching(true)
            const response = await fetch('http://localhost:3000/api/file/fetch',{
                method: 'POST',
                body: JSON.stringify({id})
            })
            const data = await response.json()
            console.log("fetched files: ", data)
            if (data.success){
                const formatedFiles = Object.fromEntries(
                    data.data.map(({path, code}) => [path, {code: code}])
                )
                setFiles(formatedFiles)
            }
            console.log(data.message)
        }catch (e){
            console.log(e)
        }finally {
            setIsFetching(false)
        }
    }

    return{
        isFetching,
        files,
        fetchComponent
    }
}
export default useComponent
