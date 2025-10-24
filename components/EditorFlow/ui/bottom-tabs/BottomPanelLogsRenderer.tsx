'use client'
import React from 'react';
import { Panel } from 'reactflow';
import {PanelWrapper} from "@/components/EditorFlow/ui/PanelWrapper";
import {cn} from "@/lib/utils";
import {useEditorState} from "@/context/EditorContext";
import {Button} from "@/components/ui/button";

export function BottomPanelLogsRenderer() {
    const {
        isBottomLogsRendererOpen,
        setIsBottomLogsRendererOpen
    } = useEditorState();

    return (

    <PanelWrapper position={'Bottom Left'} className={cn('!left-[60px] fixed !z-[6] flex-col transition-300 bg-transparent border-none backdrop-blur-none !w-[550px] !mb-[8px]',
        isBottomLogsRendererOpen ? '!h-[220px] rounded-2xl' : '!h-[40px]')}>
        <div className={cn('container-full center flex-col border-[3px] transition-300 border-neutral-800 center !justify-start gap-[5px] overflow-hidden bg-zinc-800/30 px-[5px]  backdrop-blur-sm rounded-lg',
            isBottomLogsRendererOpen && 'rounded-2xl'
        )}>
            <div className={'w-full h-fit between py-[4px] pt-[5px] gap-[10px]'}>
                <div className={'w-full center gap-[5px] h-fit !justify-start'}>

                </div>
                <Button
                    onClick={() => setIsBottomLogsRendererOpen(prev => !prev)}
                    className={cn(`!size-[25px] my-auto !p-0 backdrop-blur-md rounded-md bg-neutral-700 text-xs`,
                        isBottomLogsRendererOpen && 'bg-cyan',
                    )}>

                </Button>
            </div>
            <div className={cn('!w-full transition-300 bg-black rounded-md overflow-y-hidden px-[10px] gap-[15px] flex-col h-full',
                !isBottomLogsRendererOpen && '!h-[0px]')}>

            </div>
        </div>
    </PanelWrapper>
    )
}
