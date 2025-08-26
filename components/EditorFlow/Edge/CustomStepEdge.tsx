'use client'
import React, {useEffect} from 'react'
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from '@xyflow/react'

const CustomStepEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    data,
    selected
                        }: EdgeProps) => {
    const centerY = (sourceY + targetY) / 2;
    const curveOffset = 20;

    // const edgePath = `M ${sourceX},${sourceY}
    // Q ${sourceX},${centerY} ${sourceX + curveOffset}, ${centerY}
    // L ${targetX - curveOffset},${centerY}
    // Q ${targetX},${centerY} ${targetX},${targetY}`;

    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        targetY,
        targetX,
        sourcePosition,
        targetPosition,
        curvature: 0.3
    })

    return (
        <>
            {/*@ts-ignore*/}
            <BaseEdge className={data.className} id={data.className} path={edgePath} style={{
                stroke: '#edc106',
                strokeWidth: 2,
                animation: 'dash 1.5s linear infinite',
                transition: 'stroke 0.2s',
            }} markerEnd={markerEnd}/>
            {data?.label && (
                <EdgeLabelRenderer>
                    <div className={'container-fit p-[10px] center rounded-sm bg-zinc-800 text-xs text-cyan'}>
                        {/*@ts-ignore*/}
                        {data.parentName}
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    )
}
export default CustomStepEdge
