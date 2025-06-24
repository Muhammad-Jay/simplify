import React from 'react'

const Page = async ({params}: {params: {userName: string}}) => {
    const { userName } = await params;

    return (
        <div>userName: {userName}</div>
    )
}
export default Page
