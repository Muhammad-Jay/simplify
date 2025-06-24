import React from 'react'

const Page = async ({params}: {params: {component_Id: string}}) => {
    const { component_Id } = await params

    return (
        <div>component: {component_Id}</div>
    )
}
export default Page
