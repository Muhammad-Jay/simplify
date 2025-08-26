'use client'
import React, {useEffect, useState} from 'react'

const useComponent = (id: string, template: string) => {
    const [files, setFiles] = useState<Record<string, { code: string }>>({})
    const [isFetching, setIsFetching] = useState(false)

    const fetchComponent = async () => {
        try {
            const endpoint = process.env.ENDPOINT!
            setIsFetching(true)
            const response = await fetch(`${endpoint}/api/file/fetch`,{
                method: 'POST',
                body: JSON.stringify({id, template})
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

    const updateFile = (value: string) => {
        const actualFiles = Object.entries(files).map(([path, code])=> ({path, code}))
        const newFiles = [...actualFiles, {path: value ,code: `//......`}]
        const formatedFiles = Object.fromEntries(
            newFiles.map(({path, code}) => [path, {code}])
        )
        // @ts-ignore
        setFiles(formatedFiles)
    }

    return{
        isFetching,
        files,
        setFiles,
        fetchComponent,
        updateFile
    }
}
export default useComponent
