'use client'
import React from 'react';
import {ScrollArea} from "@/components/ui/scroll-area";
import { Plus } from 'lucide-react'
import {cn} from "@/lib/utils";
import {useWorkFlowState} from "@/context/WorkSpaceContext";
import {Label} from "@/components/ui/label";

export function NodeConfigRenderer(){
    const {
        nodes
    } = useWorkFlowState();

    return (
        <div className={'container-full p-[10px] center'}>
            <ScrollArea className={cn('w-full h-full !pr-[10px] center rounded-lg !backdrop-blur-lg !bg-black/70 !justify-start p-[5px] flex-col gap-1.5')}>
                {nodes && nodes.map((node: any, index: number)  => (
                    <NodeConfigCard node={node} key={index} />
                ))}
            </ScrollArea>
        </div>
    )
}


const NodeConfigCard = ({node}: {node: any}) => {
    const [state, setState] = React.useState<number | ''>('')
    const [ports, setPorts] = React.useState([])
    const [errorMessage, setErrorMessage] = React.useState('')

    const {addNodePort, removePort, nodes} = useWorkFlowState();

    const getCurrentNode = React.useMemo(() => {
        return nodes.filter(nd => nd?.id === node?.id)
    }, [addNodePort, node])

    React.useEffect(() => {
        const currentNode = getCurrentNode

        if (!currentNode) return

        setPorts(currentNode[0]?.data?.ports)
    }, [addNodePort, node])

    const handleChange = React.useCallback((e: any) => {
        if (isNaN(e.target.value)){
            setState(e.target.value);
            setErrorMessage('port value must be a number.');
        }else {
            setState(Number(e.target.value));
            setErrorMessage('');
        }
    }, [state])

    return (
        <div className={cn('w-full h-fit center !items-start flex-row p-[10px] gap-[10px] rounded-lg !backdrop-blur-lg !bg-neutral-600/26 mb-[10px]')}>
            <div className={cn('center container-full flex-col gap-[10px]')}>
                <div className={cn('w-full h-fit between !justify-start')}>
                    <h3 className={cn('text-xs font-medium capitalize text-foreground/90')}>{node?.data?.name?.replaceAll('_', " ")?.replaceAll('-', " ")}</h3>
                    {/*<p className={cn('text-xs font-medium text-foreground/70')}>{node?.id}</p>*/}
                </div>
                <div className={cn('container-full center flex-row gap-2')}>
                    <div className={cn('container-full center flex-col gap-[10px]')}>
                        <div className={cn('container-full center')}>
                            <div className={cn('w-full h-[100px]')}>

                            </div>
                        </div>
                        <div className={cn('w-full h-fit between flex-col gap-5')}>
                            <div className={cn('w-full between gap-[10px] h-fit')}>
                                <div className={'w-full h-[30px] between'}>
                                    <Label className={cn('text-xs text-foreground/80')}>Ports</Label>
                                    <input
                                        type={'text'}
                                        placeholder={'3000'}
                                        maxLength={5}
                                        onChange={handleChange}
                                        onKeyDown={(e: any) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addNodePort(node, state, setErrorMessage)
                                            }
                                        }}
                                        value={state}
                                        className={'rounded-sm border-1 font-mono border-neutral-500 focus-visible:border-cyan-500 transition-300 !outline-none h-full text-xs text-foreground/90 p-[5px] bg-neutral-800 w-[40%]'}/>
                                </div>
                                <button
                                    type={'button'}
                                    disabled={!!errorMessage?.trim()}
                                    onClick={() => {
                                        addNodePort(node, state, setErrorMessage)
                                    }}
                                    className={'w-[60px] h-[30px] rounded-sm center hover:bg-neutral-600 transition-300  bg-neutral-700'}>
                                    {/*<Plus size={15} className={'text-foreground font-bold'}/>*/}
                                </button>
                            </div>
                            <p className={cn('text-xs text-red-500/90 font-normal w-full center !justify-end pr-5')}>{errorMessage && errorMessage}</p>
                            <div className={cn('w-full min-h-[40px] p-[6px] rounded-sm bg-neutral-950/80 !items-start gap-2 grid grid-cols-5')}>
                                {ports && ports?.map((port: any, index: number) => (
                                    <div
                                        key={port?.port} className={cn('w-[70px] m-0 px-1 h-[26px] hover:bg-cyan-500/50 transition-300 between gap-2 text-xs rounded-sm border-1 border-neutral-700 bg-neutral-800 backdrop-blur-md')}>
                                        <span
                                            onClick={() => {
                                                removePort(node, port)
                                            }}
                                            className={cn('size-[10px] cursor-pointer rounded-full bg-black')}>

                                        </span>
                                        <span className={cn('w-full center h-full text-xs font-mono font-medium text-foreground/80')}>
                                           {port?.port}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div
                className={cn('w-[500px] min-h-[230px] h-full rounded-md flex-col gap-2 bg-neutral-950')}>
                <div className={'container-full'}>

                </div>
            </div>
        </div>
    )
}