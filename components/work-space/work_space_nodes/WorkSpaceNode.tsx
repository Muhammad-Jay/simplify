'use client'
import React from 'react'
import {useFileState} from "@/context/FileContext";
import {
    Handle,
    Position,
} from 'reactflow'
import NodeCard from "@/components/EditorFlow/ui/NodeWrapper";
import {cn} from "@/lib/utils";
import { motion } from 'framer-motion'
import {useSocket} from "@/context/SocketContext";

const WorkSpaceNode = ({id, selected, data}: any) => {
    const {isVisible} = data
    const { setCurrentProjectId } = useFileState()
    const { containers } = useSocket();

    const [currentContainer, setCurrentContainer] = React.useState<any>({})

    React.useEffect(() => {
        try {
            if (containers){
                const projectContainer = containers.filter(container => container?.Names.includes(id.toLowerCase()))
                if (projectContainer){
                    setCurrentContainer({...projectContainer[0]});
                }
            }
        }catch (e) {
            console.warn(e)
        }
    }, [data.name, containers]);

    return (
        <Wrappar
            type={'workSpace'}
            isVisible={isVisible}
            currentContainer={currentContainer}
            // isInteractive={isInteractive}
            selected={selected}
            data={data}
            stroke={ selected ? "#d0ff00" : data.color }
        >
            <div className={cn('between flex-col gap-[10px] p-[10px]')}>
                <div className={'center w-full !h-full !justify-start p-[5px]'}>
                    <h1 className={'text-foreground center font-semibold !text-xl'}>{data.name}</h1>
                </div>
                <div className={'center w-full h-[50px]'}>

                </div>
            </div>
        </Wrappar>
    )
}
export default WorkSpaceNode

const Wrappar = ({children, type, isVisible, selected, currentContainer, data, stroke = '#855200', isInteractive}: {children: React.ReactNode, currentContainer: any, data: any,  type: string, isVisible?: boolean, isInteractive?: boolean, selected?: boolean, stroke?: string}) => {

    return (
        <div className={cn('container-fit relative transition-300 center',
        )}>
            <motion.div
                id={type === 'workSpace' && 'workFlow-node'}
                initial={{opacity: 0, scale: .5}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: .3}}
                className={cn(`relative !px-[10px] !bg-neutral-900 !backdrop-blur-md !pb-[10px] rounded-3xl flex-col group !justify-between transition-300  center p-[5px]`,
                    // `!border-[${stroke}] border-[4px]`,'hover:!border-[#d0ff00] border-[4px]',
                    selected && '!border-[#d0ff00]',
                    // '!bg-[#855200]/12 border-[4px]',
                    !isVisible && '!hidden transition-500',
                )}>

                <svg width="600" className={'absolute center inset-0'} height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <foreignObject x="-10" y="-10" width="620" height="420"><div className="backdrop-filter:blur(5px);clip-path:url(#bgblur_0_285_3_clip_path);height:100%;width:100%"></div></foreignObject><path
                    style={{
                        stroke: selected ? '#d0ff00' : '#00bcff',
                        strokeWidth: 10,
                        strokeOpacity: 1
                    }}
                    className={cn('group-hover:!stroke-[#d0ff00]')}
                    data-figma-bg-blur-radius="10" d="M30 1H264.831C274.321 1.00002 283.21 5.64257 288.632 13.4307L361.227 117.712C367.022 126.037 376.525 131 386.669 131H570C586.016 131 599 143.984 599 160V370C599 386.016 586.016 399 570 399H209.303C196.504 399 185.219 390.61 181.532 378.354L158.883 303.069C154.941 289.968 142.878 281 129.197 281H30C13.9837 281 1 268.016 1 252V30L1.00977 29.252C1.40654 13.5814 14.2338 1 30 1Z" fill="#171717"  fillOpacity="0.17" stroke="#00bcff" strokeWidth="9"/>
                    <defs>
                    </defs>
                </svg>

                {/*<div*/}
                {/*    style={{*/}
                {/*        borderLeftColor: stroke,*/}
                {/*        borderBottomColor: stroke*/}
                {/*    }}*/}
                {/*    className={cn(`absolute w-[120px] h-[80px] rounded-3xl border-transparent -bottom-[15px] -left-[15px] -z-[2] !border-b-[7px] !border-l-[7px] !border-b-[${stroke}] !border-l-[${stroke}]`, selected && `-bottom-[20px] -left-[20px] transition-300 !border-[#d0ff00]`, `group-hover:!border-b-[#d0ff00] group-hover:!border-l-[#d0ff00]`)}/>*/}
                {/*<div*/}
                {/*    style={{*/}
                {/*        borderTopColor: stroke,*/}
                {/*        borderRightColor: stroke*/}
                {/*    }}*/}
                {/*    className={cn(`absolute w-[120px] h-[80px] rounded-3xl border-transparent -top-[15px] -right-[15px] -z-[2] !border-t-[7px] !border-r-[7px] !border-t-[${stroke}] !border-r-[${stroke}]`, selected && `-top-[20px] -right-[20px] transition-300 !border-[#d0ff00]`, `group-hover:!border-t-[#d0ff00] group-hover:!border-r-[#d0ff00]`)}/>*/}
                {/*<div*/}
                {/*    style={{*/}
                {/*        borderBottomColor: stroke,*/}
                {/*        borderRightColor: stroke*/}
                {/*    }}*/}
                {/*    className={cn(`absolute w-[120px] h-[80px] rounded-3xl border-transparent -bottom-[15px] -right-[15px] -z-[2] !border-b-[7px] !border-r-[7px] !border-b-[${stroke}] !border-r-[${stroke}]`, selected && `-bottom-[20px] -right-[20px] transition-300 !border-[#d0ff00]`, `group-hover:!border-b-[#d0ff00] group-hover:!border-r-[#d0ff00]`)}/>*/}

                {children}

            </motion.div>

            <div
                id={'workFlow-small-1'}
                className={cn(`absolute w-[300px] center h-[140px] rounded-3xl !rounded-bl-[100px] -top-[4px] -right-[10px] transition-300`)}>

                <svg className={cn('absolute inset-0 top-[5px] z-[3]')} width="300" height="120" viewBox="0 0 295 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        style={{
                            stroke: selected ? '#d0ff00' : '#00bcff',
                            strokeWidth: 8,
                            strokeOpacity: 1
                        }}
                        className={cn('group-hover:!stroke-[#d0ff00]')}
                        d="M30.1035 1.5H264.5C280.24 1.5 293 14.2599 293 30V98C293 113.74 280.24 126.5 264.5 126.5H70.3301C60.2559 126.5 50.9301 121.181 45.8008 112.511L5.57422 44.5107C-5.66462 25.5123 8.02977 1.5 30.1035 1.5Z" stroke="#00bcff" strokeWidth="8"/>
                </svg>
                <h1 className={cn('center !text-2xl font-semibold text-foreground/90',
                    currentContainer && currentContainer?.State === 'running' ? 'text-green-400' : currentContainer?.State === 'stopping' ? 'text-yellow-400' : currentContainer?.State === 'exited' ? 'text-red-400' : 'text-foreground/90')}>
                    {currentContainer && currentContainer?.State || 'not created'}
                </h1>
            </div>


            <div
                id={'workFlow-small-2'}
                style={{
                    borderColor: stroke
                }}
                className={cn(`absolute w-[160px] bg-neutral-800/30 backdrop-blur-md h-[110px] rounded-3xl -bottom-[10px] !-left-[0px] transition-300`)}>

                <svg  className={cn('absolute inset-0 z-[3]')} width="160" height="110" viewBox="0 0 172 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        style={{
                            stroke: selected ? '#d0ff00' : '#00bcff',
                            strokeWidth: 8,
                            strokeOpacity: 1
                        }}
                        className={cn('group-hover:!stroke-[#d0ff00]')}
                        d="M30 1.5H127.35C140.507 1.5 151.954 10.5069 155.05 23.2949L169.572 83.2949C173.913 101.23 160.325 118.5 141.872 118.5H30C14.2599 118.5 1.5 105.74 1.5 90V30C1.5 14.2599 14.2599 1.5 30 1.5Z" stroke="#00bcff" strokeWidth="6"/>
                </svg>

            </div>

            <Handle
                id={'target-handle'}
                type="target"
                position={Position.Top}
                className={cn("!size-[15px] center !bg-white",
                    !isVisible && '!hidden transition-500',
                )}
            />
            <Handle
                id={'source-handle'}
                type="source"
                position={Position.Bottom}
                className={cn("!size-[15px] center !bg-white",
                    !isVisible && '!hidden transition-500',
                )}
            />
        </div>
    )
}
