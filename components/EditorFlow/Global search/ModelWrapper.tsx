'use client';
import React, { useState, useEffect } from 'react';
import { SearchCode } from 'lucide-react';
import { Panel } from 'reactflow';
import {useEditorState} from "@/context/EditorContext";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import Loader from "@/components/Loader";
import {useFileState} from "@/context/FileContext";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

const ModelWrapper = () => {
    const { setOpen, open, setCurrentNode, } = useEditorState()
    const { query, setQuery, setNodes, setSelectedNode, isSearching, setSelectedFileNode, setIsOnQuery, searchResults } = useFileState()


    const handleChange = (e) => {
        setQuery(e.target.value)
    }

    // const handleNodeSelection = (nodeId) => {
    //     setNodes(nds => nds.map(n => ({...n, selected: n.id === nodeId})))
    // }

    return open && (
        <>
            <div
                onClick={() => setOpen(false)}
                style={{
                    width: '100dvw',
                    height: '100dvh'
                }}
                className={'absolute !screen inset-0 center z-[7] bg-black/30'}/>
                <Panel
                    position={'top-right'}
                    className={'!w-[500px] translate-y-[8%] transition-300 !my-auto ml-[25%] !h-[470px] !z-[9] p-0 !backdrop-blur-sm center rounded-lg !bg-neutral-800/20 border-2 border-input'}>
                    <div className={'container-full p-[15px] center flex-col !items-start'}>
                        <div className={'w-full center mt-[10px] !justify-start mb-[5px]'}>
                            <h1 className={'text-lg text-white center !justify-start'}>search files</h1>
                        </div>
                        <div className={"container-full gap-[10px] center flex-col"}>
                            <div className={cn(`w-full h-fit center bg-black rounded-transparent`)}>
                                <Input
                                    inputType={'text'}
                                    placeholder={'search files, folders...'}
                                    onChange={handleChange}
                                    value={query}
                                    name={'search'}
                                    className={'w-full h-[30px] text-xs font-regular !z-[10] text-white p-[10px] outline-none border-[1px] outline-zinc-600 !border-zinc-600 bg-neutral-900 rounded-sm'}
                                />
                            </div>
                            <div className={'center container-full !h-[300px] overflow-y-auto p-[10px] px-0'} id={'no-scrollbar'}>
                                {isSearching ? (
                                    <div className={'container-full center'}>
                                        <Loader size={16} className={'animate-spin text-white'}/>
                                    </div>
                                ) : (
                                    <ScrollArea className={'container-full center flex-col !justify-start space-y-[10px]'}>
                                        {searchResults && searchResults.map((result: any, index: number) => (
                                            <div
                                                key={`${result.data.name}:${index}`}
                                                className={'w-full hover:bg-cyan-500/15 transition-300 pr-[10px] px-[5px] !my-[3px] p-[3px] rounded-md center'}
                                            >
                                                <div onClick={()=> {
                                                    setCurrentNode(result);
                                                    setIsOnQuery(true);
                                                    setOpen(false);
                                                    setSelectedNode({...result});
                                                    setTimeout(() => setSelectedNode({}), 400)
                                                    if (result.type === 'codeEditor'){
                                                        setSelectedFileNode({...result});
                                                    }
                                                }}
                                                    className={'w-full h-[22px] center !justify-start gap-[5px] p-[3px]'}>
                                                    <h1 className={'text-xs text-semibold text-foreground/90'}>{result.data.name}</h1>
                                                    <p className={'text-xs text-yellow-300 font-light flex-nowrap'}>{result.data.label || ''}</p>
                                                    <div className={'w-full h-full center !justify-end'}>
                                                        {result.type === 'codeEditor' && (
                                                            <h1 className={'text-xs font-light text-foreground/80 flex-nowrap center truncate'}>{result.data?.code?.slice(0, 30)}</h1>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <ScrollBar/>
                                    </ScrollArea>
                                )}
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                </Panel>
        </>
    )
}
export default ModelWrapper
