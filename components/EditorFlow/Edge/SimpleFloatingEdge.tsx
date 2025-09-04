'use client'

import { Position, getBezierPath, useNodes, useReactFlow } from 'reactflow'
import {useFileState} from "@/context/FileContext";

function getParams(nodeA: any, nodeB: any){
    const centerA = getNodeCenter(nodeA);
    const centerB = getNodeCenter(nodeB);

    const horizontalDiff = Math.abs(centerA.x - centerB.x);
    const verticalDiff = Math.abs(centerA.y - centerB.y);

    let position;

    if (horizontalDiff > verticalDiff){
        position = centerA.x > centerB.x ? Position.Left :  Position.Right;
    }else {
        position = centerA.y > centerB.y ? Position.Top :  Position.Bottom;
    }

    const [x, y] = getHandleCoordsByPosition(nodeA, position);
    return [x, y, position];
}

function getHandleCoordsByPosition(node: any, handlePosition: any){
    const handle = node?.internals?.handleBounds?.source?.find((h) => h?.position === handlePosition);

    let offSetX = handle?.width / 2;
    let offSetY = handle?.height / 2;

    switch (handlePosition) {
        case Position.Left:
            offSetX = 0;
            break;
        case Position.Right:
            offSetX = handle?.width;
            break;
        case Position.Top:
            offSetY = 0;
            break;
        case Position.Bottom:
            offSetY = handle?.height;
            break;
    }

    const x = node?.internals?.positionAbsolute?.x + handle?.x + offSetX;
    const y = node?.internals?.positionAbsolute?.y + handle?.y + offSetY;

    return [x, y]
}

function getNodeCenter(node: any){
    return {
        x: node?.internals?.positionAbsolute?.x + node.width / 2,
        y: node?.internals?.positionAbsolute?.y + node.height / 2,
    }
}

function getEdgeParams(source: any, target: any){
    const [sx, sy, sourcePos] = getParams(source, target);
    const [tx, ty, targetPos] = getParams(target, source);

    return {
        sx,
        sy,
        tx,
        ty,
        sourcePos,
        targetPos
    }
}

function SimpleFloatingEdge({
    id,
    source,
    target,
    markerEnd,
    style
                           }){
    const flow = useReactFlow()
    const nodes = flow.getNodes()
    const sourceNode = nodes.filter((nd) => nd.id === source)[0];
    const targetNode = nodes.filter((nd) => nd.id === target)[0];

    console.log('from floating edge nodes', nodes)
    console.log('from floating edge source', source, sourceNode)
    console.log('from floating edge target', target, targetNode)
    console.log(style)

    if (!sourceNode || !targetNode){
        return null;
    }

    const {
        sx,
        sy,
        tx,
        ty,
        sourcePos,
        targetPos
    } = getEdgeParams(sourceNode, targetNode);

    const [edgePath] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
        targetX: tx,
        targetY: ty
    })

    return (
        <path
            id={id}
            d={edgePath}
            strokeWidth={3}
            className={'!stroke-3 !stroke-white'}
            markerEnd={markerEnd}
            style={style}
        />
    )
}

export default SimpleFloatingEdge;