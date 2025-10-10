"use client"
import React, {useRef, useEffect } from 'react'
import {motion} from 'framer-motion'
import { Handle, Position } from 'reactflow'
import gsap from 'gsap'
import {cn} from "@/lib/utils";

const NodeCard = ({children, type, isVisible, selected, stroke = '#855200', isInteractive}: {children: React.ReactNode, type: string, isVisible?: boolean, isInteractive?: boolean, selected?: boolean, stroke?: string}) => {
    const nodeRef = useRef(null);

    // useEffect(() => {
    //     const tl = gsap.timeline()
    //
    //     tl.from(nodeRef.current, {
    //         duration: .3,
    //         scale: .5,
    //         opacity: .5
    //     }).to(nodeRef.current, {
    //
    //     })
    // }, []);

    return (
        <div
            // initial={{opacity: 0, scale: .5}}
            // animate={{opacity: 1, scale: 1}}
            // whileHover={{scale: 1.05}}
            // transition={{duration: .3}}
            ref={nodeRef}
            className={cn('container-fit transition-300 center',
                )}>
            <motion.div
                initial={{opacity: 0, scale: .5}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: .3}}
                style={{
                backgroundColor: "black",
                borderColor: stroke
            }}
                 className={cn(`relative !px-[10px] !backdrop-blur-lg !bg-[#171717]/30 !pb-[10px] rounded-3xl flex-col group !justify-between transition-300 min-w-[400px] max-w-[500px] min-h-[250px] max-h-[550px] center p-[5px]`, `!border-[${stroke}] border-[4px]`,'hover:!border-green-400 border-[4px]',
                     selected && '!border-green-400 !bg-green-400/5 border-[4px]',
                     !isVisible && '!hidden transition-500',
                 )}>

                <div
                    style={{
                        borderTopColor: stroke,
                        borderLeftColor: stroke
                    }}
                    className={cn(`absolute w-[120px] h-[80px] rounded-3xl border-transparent -top-[15px] -left-[15px] -z-[2] !border-t-[7px] !border-l-[7px] !border-t-[${stroke}] !border-l-[${stroke}]`, selected && `-top-[20px] -left-[20px] transition-300 !border-green-400`, `group-hover:!border-t-green-400 group-hover:!border-l-green-400`)}/>
                <div
                    style={{
                        borderLeftColor: stroke,
                        borderBottomColor: stroke
                    }}
                    className={cn(`absolute w-[120px] h-[80px] rounded-3xl border-transparent -bottom-[15px] -left-[15px] -z-[2] !border-b-[7px] !border-l-[7px] !border-b-[${stroke}] !border-l-[${stroke}]`, selected && `-bottom-[20px] -left-[20px] transition-300 !border-green-400`, `group-hover:!border-b-green-400 group-hover:!border-l-green-400`)}/>
                <div
                    style={{
                        borderTopColor: stroke,
                        borderRightColor: stroke
                    }}
                    className={cn(`absolute w-[120px] h-[80px] rounded-3xl border-transparent -top-[15px] -right-[15px] -z-[2] !border-t-[7px] !border-r-[7px] !border-t-[${stroke}] !border-r-[${stroke}]`, selected && `-top-[20px] -right-[20px] transition-300 !border-green-400`, `group-hover:!border-t-green-400 group-hover:!border-r-green-400`)}/>
                <div
                    style={{
                        borderBottomColor: stroke,
                        borderRightColor: stroke
                    }}
                    className={cn(`absolute w-[120px] h-[80px] rounded-3xl border-transparent -bottom-[15px] -right-[15px] -z-[2] !border-b-[7px] !border-r-[7px] !border-b-[${stroke}] !border-r-[${stroke}]`, selected && `-bottom-[20px] -right-[20px] transition-300 !border-green-400`, `group-hover:!border-b-green-400 group-hover:!border-r-green-400`)}/>
                    {children}

            </motion.div>
            {/* Node Handles */}
            {type === 'file' ? (
                <>
                    <Handle
                        type="target"
                        position={Position.Top}
                        className={cn("!size-[15px] center !bg-white",
                            !isVisible && '!hidden transition-500',
                        )}
                    />
                    {/*<Handle*/}
                    {/*    type="source"*/}
                    {/*    position={Position.Right}*/}
                    {/*    className={cn("!size-[15px] center !bg-white",*/}
                    {/*        !isVisible && '!hidden transition-500',*/}
                    {/*    )}*/}
                    {/*/>*/}
                    {/*<Handle*/}
                    {/*    type="source"*/}
                    {/*    position={Position.Left}*/}
                    {/*    className={cn("!size-[15px] center !bg-white",*/}
                    {/*        !isVisible && '!hidden transition-500',*/}
                    {/*    )}*/}
                    {/*/>*/}
                    {/*<Handle*/}
                    {/*    type="source"*/}
                    {/*    position={Position.Bottom}*/}
                    {/*    className={cn("!size-[15px] center !bg-white",*/}
                    {/*        !isVisible && '!hidden transition-500',*/}
                    {/*    )}*/}
                    {/*/>*/}
                </>
            ) : (
                <>
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
                </>
            )}
        </div>
    )
}
export default NodeCard