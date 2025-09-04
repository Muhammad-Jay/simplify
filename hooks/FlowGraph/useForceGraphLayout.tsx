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
    nodesData: Node[] | any;
    linksData: Edge[];
    containerRef: any
}

export function useForceGraphLayout({
                                        nodesData,
                                        linksData,
                                        containerRef
                                    }: UseForceGraphLayoutProps,){
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [dimentions, setDimentions] = useState({width: 0, height: 0});

    useEffect(() => {
        if (!containerRef.current){
            return;
        }

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries){
                setDimentions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        })

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [containerRef]);

    useEffect((): any => {
        if (dimentions.width === 0 || dimentions.height === 0) return;

       const simulation = forceSimulation(nodesData)
            .force('link', forceLink(linksData)
                .id((d: any) => d.id)
                .distance(150))
            .force('charge', forceManyBody().strength(-300))
            .force('center', forceCenter(dimentions.width / 2, dimentions.height / 2))
           .on('end', () => {
               const layoutedNodes = nodesData.map(nds => ({
                   ...nds,
               }))
               setNodes([...layoutedNodes])
               setLinks({...linksData})
           })

        return () => simulation.stop();
    }, []);

    return { nodes, links }
}