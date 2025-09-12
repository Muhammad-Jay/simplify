'use client'
import React, {useMemo, useCallback, useEffect, useState } from 'react'
import {Panel, useReactFlow} from 'reactflow'
import {useEditorState} from "@/context/EditorContext";
import {useFileState} from "@/context/FileContext";
import {cn} from "@/lib/utils";
import {useWorkFlowState} from "@/context/WorkSpaceContext";

export const LeftBottomPanel = () => {
    const { setIsOnFitView } = useEditorState()
    const { selectedNode, setSelectedNode, nodes, setIsOnQuery} = useFileState()

    const fullPath = useMemo(() => {
        return selectedNode && selectedNode.data?.label.split('/').filter(Boolean).map((path) => {
            return nodes.filter((node: any) => node.data.name === path)[0]
        }) || []
    }, [selectedNode, nodes])

    return (
        <Panel position={'bottom-left'} className={'!ml-[10px] !mb-[8px]'}>
            <div className={'w-[300px] !items-start h-[40px] bg-zinc-800 flex-col center p-[3px] rounded-sm'}>
                <ul className={'text-xs !w-full !justify-start px-[6px] text-white flex-nowrap center flex-row gap-[5px]'}>
                    {!fullPath ? null : fullPath.map((node: any, index: number) => (
                      <li key={`${node?.data?.name || 'empty'}:${index}`} className={'center container-fit flex-row text-xs gap-[5px]'}>
                          <button
                              type={'button'}
                              onClick={() => {
                                  setSelectedNode(node)
                                  setIsOnFitView(true)
                                  setIsOnQuery(true)
                              }}
                              className={cn('text-xs bg-transparent hover:text-cyan-500 rounded-xs transition-300 container-fit p-[2px] text-white/80',
                              node?.data?.name === selectedNode?.data?.name && 'text-[#d0ff00]'
                              )}>{node?.data?.name || ''}
                          </button>
                          <p className={'text-cyan-500/90  text-xs'}>
                              {index === fullPath.length - 1 ? '' : '>'}
                          </p>
                      </li>
                    ))}
                </ul>
            </div>
        </Panel>
    )
}

export const RightBottomPanel = ({id}) => {
    const [rvalue, setRvalue] = useState(20);
    const [nValue, setNValue] = useState(20);
    const {
        openBottomTabControlPanel,
        setOpenBottomTabControlPanel,
        setNodes,
        setEdges,
        nodes,
        edges,
        layoutConfig,
        setLayoutConfig,
        getLayoutedElements,
    } = useFileState()
    const {
        setNodes: setFlowNodes,
        setEdges: setFlowEdges,
        nodes: flowNodes,
        edges: flowEdges,
    } = useWorkFlowState();
    const {fitView} = useReactFlow()

    // useEffect(() => {
    //     // let timer = setTimeout(() => {
    //         const layouted = getLayoutedElements(nodes, edges, { direction: 'TB' })
    //         setNodes([...layouted.nodes]);
    //         setEdges([...layouted.edges]);
    //     // }, 50)
    //
    //     // return () => clearTimeout(timer);
    // }, [layoutConfig]);

    // useEffect(() => {
    //     let timer = setTimeout(() => {
    //         setLayoutConfig(prev => ({...prev, rankSep: rvalue * 10}))
    //     }, 100)
    //
    //     return () => clearTimeout(timer);
    // }, [rvalue]);
    //
    // useEffect(() => {
    //     let timer = setTimeout(() => {
    //         setLayoutConfig(prev => ({...prev, nodeSep: nValue * 10 }))
    //     }, 100)
    //
    //     return () => clearTimeout(timer);
    // }, [nValue]);

    const onLayout = useCallback((direction: any) => {
        fitView({
            nodes: id ? nodes : flowNodes,
            duration: 800,
            padding: 0.05,
            maxZoom: 1.1,
            minZoom: .28
        })
        if (id){
            const layouted = getLayoutedElements(nodes, edges, { direction })
            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);
        }else {
            const layouted = getLayoutedElements(flowNodes, flowEdges, { direction })
            setFlowNodes([...layouted.nodes]);
            setFlowEdges([...layouted.edges]);
        }
    }, [nodes, edges, flowEdges, flowNodes])

    return (
        <Panel position={'bottom-right'} className={cn('!mr-[10px] !z-[10] flex-col border-[3px] transition-300 border-neutral-800 w-[320px] !items-end between gap-[5px]  bg-zinc-800/30 backdrop-blur-sm rounded-sm !mb-[8px]',
            openBottomTabControlPanel ? 'h-[160px]' : 'h-[40px]')}>
            <div className={cn('w-full transition-300 overflow-y-hidden px-[10px] gap-[15px] flex-col h-[130px] center',
                !openBottomTabControlPanel && '!h-[0px]')}>
                <div className={'w-full between gap-[5px]'}>
                    <div className={'text-xs w-[100px] !justify-start flex-nowrap center !text-white/80 mr-[5px]'}>Rank-sep</div>
                    <input type={'range'} id={'slider'} onChange={(e) => setRvalue(Number(e.target.value))} min={0} value={rvalue} max={100} className={'center w-[80%] h-[5px] rounded-sm'}/>
                    <div className={'text-xs w-[50px] center'}>{rvalue}%</div>
                </div>

                <div className={'w-full between gap-[5px]'}>
                    <div className={'text-xs w-[100px] !justify-start flex-nowrap center !text-white/80 mr-[5px]'}>Node-sep</div>
                    <input type={'range'} id={'slider'} onChange={(e) => setNValue(Number(e.target.value))} min={0} value={layoutConfig.nodeSep / 10} max={100} className={'center w-[80%] h-[5px] rounded-sm'}/>
                    <div className={'text-xs w-[50px] center'}>{nValue}%</div>
                </div>
            </div>
            <div className={'w-full h-fit between pl-[5px] gap-[10px]'}>
                <div className={'w-full center gap-[5px] h-fit !justify-start'}>
                    <div
                        onClick={() => {
                            onLayout('TB')
                        }}
                        className={cn('center text-xs font-bold text-foreground w-[50px] h-[26px] rounded bg-neutral-600',
                            !openBottomTabControlPanel ? 'mb-[5px] mr-[5px]' : 'mb-[5px] mr-[5px]')}>
                        V
                    </div>
                    <div
                        onClick={() => {
                            onLayout('LR')
                        }}
                        className={cn('center text-xs font-bold text-foreground w-[50px] h-[26px] rounded bg-neutral-600',
                            !openBottomTabControlPanel ? 'mb-[5px] mr-[5px]' : 'mb-[5px] mr-[5px]')}>
                        H
                    </div>
                </div>
                <div
                    onClick={() => {
                        setOpenBottomTabControlPanel(prev => !prev)
                    }}
                    className={cn('center w-[30px] h-[26px] rounded bg-neutral-600',
                        !openBottomTabControlPanel ? 'mb-[5px] mr-[5px]' : 'mb-[5px] mr-[5px]')}>

                </div>
            </div>
        </Panel>
    )
}
