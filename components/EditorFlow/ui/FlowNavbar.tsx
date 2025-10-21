// 'use client'
// import React, {useMemo, useState} from 'react'
// import {Play, Copy, Check} from 'lucide-react'
// import {Button} from "@/components/ui/button";
// import { useReactFlow } from 'reactflow'
// import {useEditorState} from "@/context/EditorContext";
// import {cn} from "@/lib/utils";
// import {useFileState} from "@/context/FileContext";
// import {useWorkFlowState} from "@/context/WorkSpaceContext";
// import {useSocket} from "@/context/SocketContext";
// import {ScrollArea} from "@/components/ui/scroll-area";
//
// const FlowNavbar = ({id}) => {
//     const { rightSidebarState, leftSidebarState, handleRightSidebarState, handleLeftSidebarState, recentActiveNodes, nodes, selectedNode, setCurrentNode, setIsOnFitView } = useEditorState()
//     const { currentProjectId, setIsDeployPanelOpen, isDeployPanelOpen, currentContainer, setGlobalMessage } = useFileState();
//     const { handleNavigate } = useWorkFlowState();
//     const { isConnected, error, socket, fetchContainerLoaded } = useSocket();
//
//     const fullPath = useMemo(() => {
//         return recentActiveNodes && recentActiveNodes.map((recent) => {
//             return nodes.filter((node) => node && node.data.name === recent.name)[0]
//         }) || []
//     }, [selectedNode, recentActiveNodes])
//
//
//     return (
//         <div className={'w-full h-[35px] gap-[4px] mt-[3px] between p-[3px] py-[5px] px-[3px] bg-black'}>
//             <div className={'w-fit h-full rounded-xs center gap-[7px] px-[3px] !justify-start'}>
//                 <Button
//                     type={'button'}
//                     onClick={() => handleLeftSidebarState('WorkSpaceProjects')}
//                     className={cn(`w-[70px] h-[25px] !p-[0px] font-semibold gap-[5px] center button-neutral !text-white text-xs hover:bg-cyan/80 transition-300 rounded-xs`,
//                         leftSidebarState === 'WorkSpaceProjects' && 'bg-cyan !text-black')}>
//                     projects
//                 </Button>
//                 <Button type={'button'} className={'w-[70px] h-[25px] !p-[0px] font-light text-xs rounded-xs button-neutral text-white'}>
//
//                 </Button>
//                 <Button type={'button'} className={'w-[70px] h-[25px] !p-[0px] font-light text-xs rounded-xs button-neutral text-white'}>
//
//                 </Button>
//             </div>
//             <div className={'w-full overflow-x-auto p-[2px] px-[10px] gap-[5px] between h-full rounded-xs bg-zinc-800'} id={'no-scrollbar'}>
//                 {currentProjectId && (
//                     <div className={'w-fit center gap-[10px]'}>
//                         <span
//                             onClick={() =>  handleNavigate(currentProjectId.workSpaceName)}
//                             className={cn('center cursor-pointer hover:!text-cyan-500 transition-300 text-foreground text-xs font-bold',
//                             !id && 'text-[#d0ff00]')}>{currentProjectId?.workSpaceName || ''}</span>
//                         <span className={'text-cyan-500/90  text-xs'}>{'>'}</span>
//                     </div>
//                 )}
//                 <RenderPath/>
//                 <div className={'center container-fit gap-[10px]'}>
//                     <Button
//                         onClick={() => {
//                             socket.emit('build_logs_client', {type: 'build' ,message: "message sent!. okay?" })
//                         }}
//                         type={'button'} className={cn('w-[50px] h-[20px] !p-[0px] cursor-pointer font-semibold text-xs rounded-sm button-neutral text-white')}>
//
//                     </Button>
//
//                     <span className={cn('!size-[10px] rounded-full bg-yellow-400',
//                         isConnected && !error && 'bg-green-400')}/>
//                 </div>
//             </div>
//             <div className={'w-fit h-full rounded-xs center gap-[7px] px-[3px] !justify-end'}>
//                 <Button
//                     type={'button'}
//                     onClick={() => {
//                         setIsDeployPanelOpen(prev => !prev);
//                     }}
//                     className={cn('w-[70px] h-[25px] !p-[0px] cursor-pointer bg-gradient-to-br from-cyan-500 to-cyan-700 transition-300 font-semibold text-xs rounded-xs button-neutral text-white',
//                         isDeployPanelOpen && 'bg-gradient-to-br from-cyan-500 to-cyan-700')}
//                 >
//                     <Play size={5} className={cn('center text-white fill-white',
//                         rightSidebarState === 'Run' && 'fill-black text-black' )}/>
//                     Run
//                 </Button>
//                 {fetchContainerLoaded && (
//                     <>
//                         <Button
//                             onClick={() => {
//                                 handleRightSidebarState('Run')
//                             }}
//                             type={'button'} className={cn('w-[70px] h-[25px] !p-[0px] cursor-pointer font-semibold text-xs rounded-xs button-neutral text-white',
//                             rightSidebarState === 'Run' && 'bg-cyan !text-black')}>
//
//                         </Button>
//                     </>
//                 )}
//             </div>
//         </div>
//     )
// }
// export default FlowNavbar
//
