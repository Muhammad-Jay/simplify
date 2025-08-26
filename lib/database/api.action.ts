'use server'

export async function fetchComponentMetadataById({id}: {id: string}){
    try {
        const response = await fetch("/api/files/fetch",{
            method: "POST",
            body: JSON.stringify({id})
        })
        const data = await response.json()
        if (!data.success){
            console.log(data.message)
        }
        return data.data;
    }catch (e) {
        console.log(e)
    }
}

export async function saveComponentMetadataById({id, meta}: {id: string, meta: any}){
    try {
        const response = await fetch("/api/files/save",{
            method: "POST",
            body: JSON.stringify({id, meta})
        })
        const data = await response.json()
        if (!data.success){
            console.log(data.message)
        }
        return data.success;
    }catch (e) {
        console.log(e)
    }
}

