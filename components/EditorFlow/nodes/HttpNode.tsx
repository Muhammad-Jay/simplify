import React from 'react'
import {cn} from "@/lib/utils";
import { Handle, Position, useNodes } from 'reactflow'
import AddFileModel from "@/components/EditorFlow/Monoco/AddFileModel";
import {useEditorState} from "@/context/EditorContext";

const HttpNode = ({id, data, selected }: any) => {

    const { setCurrentNode, nodes: stateNodes, setFold, projectName } = useEditorState()
    const nodes = useNodes()

    React.useEffect(() => {
        if (selected){
            const activeNode = nodes.filter((node: any) => node.id === id)
            if (activeNode){
                setCurrentNode(activeNode[0])
            }
        }
    }, [selected]);

    return (
        <div className={cn(`bg-neutral-700/20 backdrop-blur-md group relative rounded-xl gap-[5px] transition-300 w-[230px] h-[150px] center p-[5px] border-2 border-cyan-500`,
            'hover:!border-[#d0ff00] border-2',
            selected && '!border-[#d0ff00] border-2 shadow shadow-[#d0ff00]',
           )}>
            <div className={"container-full between px-[10px] !justify-start p-[5px] rounded-xl bg-transparent"}>
                <div className={cn(`size-[100px] rounded-full border-2 border-cyan-500 center !bg-transparent flex-col gap-[10px] transition-300`,
                    'group-hover:!border-[#d0ff00] border-2',
                    selected && 'border-[#d0ff00] border-2',)}>

                    <div className={cn(`absolute -right-[80px] -top-[0%] center w-[70px] h-full flex-col gap-[5px] rounded-sm bg-neutral-800 border-2 border-cyan-500`,
                        'group-hover:!border-[#d0ff00] border-2',
                        selected && 'border-[#d0ff00] border-2')}>

                    </div>
                    <AddFileModel fullPath={data.label} parentName={data.name}/>

                    <Handle
                        type="target"
                        position={Position.Top}
                        className="container-fit center bg-blue-500 hover:bg-blue-400"
                    >
                        <div className={'size-[10px] bg-cyan border-border border-white rounded-full'}>

                        </div>
                    </Handle>
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        className="container-fit center bg-green-500 hover:bg-green-400"
                    >
                        <div className={'size-[10px] bg-cyan border-border border-white rounded-full'}>

                        </div>
                    </Handle>
                </div>
            </div>
            <div className={'text-white center flex-col gap-[10px] text-xs w-full h-full p-[5px] rounded-sm'}>
                <div className={'center gap-[5px] text-xs w-full text-white font-semibold !justify-start'}>
                    {/*<Folder size={15} className={'text-white fill-white'}/>*/}
                    <h1 className={'text-md truncate'}>{data.name}</h1>
                </div>
                <div className={'w-full center p-[5px] !justify-start'}>

                </div>
            </div>
        </div>
    )
}
export default HttpNode
