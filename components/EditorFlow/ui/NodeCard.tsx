import React from 'react'
import {cn} from "@/lib/utils";

const NodeCard = ({children, stroke = "#00BBC2"}: {children: React.ReactNode, stroke?: string}) => {
    return (
        <div style={{
            backgroundColor: "black",
        }}
            id={"node-svg"}
            className={cn(`relative !bg-zinc-800 transition-300 overflow-hidden w-[600px] h-[400px] center p-[25px] py-[30px] stroke-[2px] stroke-[#00C8FF]`)}>
            {children}
            <svg className={cn(`overflow-hidden bg-[${stroke}] -z-[4] absolute !w-full !h-full inset-0 top-0 left-0 center`)} width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1H87.75C92.5825 1 96.5 4.91751 96.5 9.75C96.5 15.6871 101.313 20.5 107.25 20.5H494.75C500.687 20.5 505.5 15.6871 505.5 9.75C505.5 4.91751 509.418 1 514.25 1H590C594.971 1 599 5.02944 599 10V74.75C599 79.0302 595.53 82.5 591.25 82.5C585.865 82.5 581.5 86.8652 581.5 92.25V302.25C581.5 307.635 585.865 312 591.25 312C595.53 312 599 315.47 599 319.75V390C599 394.971 594.971 399 590 399H513.25C508.97 399 505.5 395.53 505.5 391.25C505.5 385.865 501.135 381.5 495.75 381.5H106.25C100.865 381.5 96.5 385.865 96.5 391.25C96.5 395.53 93.0302 399 88.75 399H10C5.02944 399 1 394.971 1 390V319.25C1 315.246 4.24594 312 8.25 312C13.3586 312 17.5 307.859 17.5 302.75V91.75C17.5 86.6414 13.3586 82.5 8.25 82.5C4.24594 82.5 1 79.2541 1 75.25V10C1 5.02944 5.02944 1 10 1Z" stroke={stroke} stroke-width="4"/>
            </svg>

        </div>
    )
}
export default NodeCard
