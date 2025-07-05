'use client'
import React, {useEffect, useState} from 'react'
import {saveCode} from "@/lib/database";

const UseSandpackEditor = (codes: Record<string, string>, activeCode: string, id: string) => {
    const [isSaving, setIsSaving] = useState(false)
    const [prevFiles, setPrevFiles] = useState<Record<string, string>>({})
    const [files, setFiles] = useState<Record<string, string>>({})

    // useEffect(() => {
    //     setFiles({...codes})
    // }, []);

    useEffect(() => {
        setPrevFiles({...files})
        if (files){
            const updateChanges = async (value: any) => {
                try{
                    setIsSaving(true)
                    // const code = codes[activeCode]
                    // await saveCode(value, id)
                }catch (e) {
                    console.log(e)
                }finally {
                    setIsSaving(false)
                }
            }

            updateChanges(files)
        }
    }, [files])

    return {
        isSaving
    }
}
export default UseSandpackEditor
