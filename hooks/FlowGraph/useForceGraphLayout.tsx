'use client'
import { useState, useEffect, useMemo } from 'react'
import {
    forceSimulation,
    forceManyBody,
    forceLink,
    forceCenter,
    forceCollide,
    Simulation
} from 'd3-force'
import type { Node, Edge } from '@xyflow/react'

type UseForceGraphLayoutProps = {
    nodes: Node[];
    edges: Edge[];
    width?: number;
    height?: number;
    iteration?: number;
    strength?: number;
    distance?: number;
    collideRadius?: number
}

export function useForceGraphLayout({
                                        nodes,
                                        edges,
                                        width = 1000,
                                        height = 800,
                                        iteration = 300,
                                        strength = -500,
                                        distance = 120,
                                        collideRadius = 50
                                    }: UseForceGraphLayoutProps, setNodes?: any){
    const [positionedNodes, setPositionedNodes] = useState<Node[]>([])

    const { simNodes, simLinks } = useMemo(() : any => {
        const simNodes = nodes.map((node) => ({
            ...node,
            x: Math.random() * width,
            y: Math.random() * height,
            fx: null,
            fy: null
        }))

        const simLinks = edges.map((edge) => ({
            source: edge.source,
            target: edge.target
        }))

        return { simNodes, simLinks }
    }, [nodes, edges, width, height])

    const runSimulation = () => {
        if (!simNodes.length){
            setPositionedNodes([])
            console.log('no nodes')
            return;
        }

        let simulation;
        let animationFromId: number;

        simulation = forceSimulation(simNodes)
            .force('charge', forceManyBody().strength(strength))
            .force('link', forceLink(simLinks)
                .id((d: any) => d.id)
                .distance(distance))
            .force('center', forceCenter(width / 2, height / 2))
            .force('collide', forceCollide(collideRadius))
            .stop()

        for (let i = 0; i < iteration; i++){
            simulation.tick();
        }

        animationFromId = requestAnimationFrame(() => {
            setPositionedNodes(
                simNodes.map(({ x = 0, y = 0, ...nodes}) => ({
                    ...nodes,
                    position: { x, y }
                }))
            )
        })
    }

    // useEffect(() => {
    //
    //     // return () => {
    //     //     if (simulation) simulation.stop()
    //     //     if (animationFromId) cancelAnimationFrame(animationFromId)
    //     }
    // }, [simNodes, simLinks, width, height, strength, distance, iteration, collideRadius]);

    return { positionedNodes, runSimulation }
}