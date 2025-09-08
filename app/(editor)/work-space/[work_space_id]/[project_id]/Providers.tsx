'use client'
import React from 'react'
import { ReactFlowProvider } from 'reactflow';

const Providers = ({ children }) => {
    return (
        <ReactFlowProvider>
            {children}
        </ReactFlowProvider>
    )
}
export default Providers
