'use client'
import React, {useEffect} from 'react'
import { motion } from 'framer-motion'
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
            <path
                // initial={{ opacity: 0}}
                // animate={{ opacity: 1 }}
                // transition={{ duration: 2 }}
                id={id}
                d={edgePath}
                stroke={'#ffffff'}
                strokeWidth={3}
                className={'!stroke-3 !stroke-white'}
                markerEnd={markerEnd}
                style={{

                }}
            />
        </>
    )
}
export default CustomStepEdge
