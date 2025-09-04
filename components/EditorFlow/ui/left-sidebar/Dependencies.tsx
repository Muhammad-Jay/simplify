'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {cn} from "@/lib/utils";
import {useEditorState} from "@/context/EditorContext";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Folder} from 'lucide-react'
import {useFileState} from "@/context/FileContext";

export type DependenciesTypes = {
    dependencies: {name: string, version: string}[],
    devDependencies: {name: string, version: string}[],
    peerDependencies: {name: string, version: string}[]
}

const Dependencies = () => {
    const { nodes } = useFileState()

    const [isVisible, setIsVisible] = useState(false)
    const [isDependencies, setIsDependencies] = useState(true)
    const [multiPkgJsonFile, setMultiPkgJsonFile] = useState<any>([])
    const [selectedPkgJsonNode, setSelectedPkgJsonNode] = useState('')
    const [dependencies, setDependencies] = useState<DependenciesTypes>({
        dependencies: [],
        devDependencies: [],
        peerDependencies: []
    })

    useEffect(() => {
        const package_json_node = nodes.filter(nd => nd.data.label.includes('package.json'));

        if (!package_json_node) return;
        setSelectedPkgJsonNode(package_json_node[0]?.id);
    }, []);

    useEffect(() => {
        const package_json_node = nodes.filter(nd => nd.data.label.includes('package.json'));
        let timeout;

        if (!package_json_node) return;

        timeout = setTimeout(() => {
            setMultiPkgJsonFile(package_json_node.map(nd => ({name: nd.data.name, path: nd.id})))
            getDependenciesByPath(selectedPkgJsonNode)
        })

        return () => {
            if (timeout){
                clearTimeout(timeout);
            }
        }
    }, [nodes, selectedPkgJsonNode]);

    const getDependenciesByPath = useCallback((path) => {
        const package_json_node = nodes.filter(nd => nd.data.label === path)[0];
        try {
            const filtered = package_json_node.data.code.split('\n').filter(li => !li.trim().startsWith('//')).join('\n')
            const parsedFile = JSON.parse(filtered);
            const depend = parsedFile.dependencies;
            const dev = parsedFile.devDependencies;
            // console.log(parsedFile)
            const formatedDependencies = Object.entries(depend).map(([name, version]: [string,string]) => ({ name, version }))
            const formatedDevDependencies = Object.entries(dev).map(([name, version]: [string,string]) => ({ name, version }));

            setDependencies(prev => ({...prev, dependencies: formatedDependencies, devDependencies: formatedDevDependencies }))
        }catch (e) {
            console.log(e)
            setDependencies({
                dependencies: [],
                devDependencies: [],
                peerDependencies: []
            });
        }
    }, [multiPkgJsonFile, nodes, selectedPkgJsonNode])

    return (
        <div className={cn('container-full !justify-start center p-[5px] flex-col gap-[10px]')}>
            <div className={'w-full h-full overflow-y-hidden pt-[10px] center flex-col !justify-start !items-start'}>
                {/*<div className={'w-full center h-fit mb-[10px] !justify-end'}>*/}
                {/*    <Button*/}
                {/*        onClick={() => setIsVisible(prev => !prev)}*/}
                {/*        className={cn(`size-[20px] !m-0 center text-xs !p-0 text-white rounded-sm !bg-neutral-800`)}*/}
                {/*        type={'button'}>*/}
                {/*        +*/}
                {/*    </Button>*/}
                {/*</div>*/}
                {/*{isVisible && <DependencyInput/>}*/}

                {multiPkgJsonFile && (
                    <ScrollArea className={cn('w-full max-h-[140px] flex-col mb-[10px] pr-[10px] bg-black/70 rounded-sm between !space-y-[5px] p-[5px]')}>
                        {multiPkgJsonFile && multiPkgJsonFile.map((nd: any, index: number) => (
                            <div
                                key={`${nd?.path}:${index}`}
                                style={{
                                    borderLeft: nd?.path === selectedPkgJsonNode ? '3px solid cyan' : '0px',
                                    borderBottomLeftRadius: nd?.path === selectedPkgJsonNode && '3px',
                                    borderTopLeftRadius: nd?.path === selectedPkgJsonNode && '3px'
                                }}
                                onClick={() => setSelectedPkgJsonNode(nd?.path)}
                                className={cn('w-full h-fit bg-zinc-800/70 rounded-sm px-[10px] pr-[12px] !my-[5px] between p-[4px] flex-nowrap hover:bg-cyan-500/10  transition-300 py-[5px] text-[11px] text-foreground',
                                    nd?.path === selectedPkgJsonNode ? 'bg-cyan-500/30 !border-l-[3px] !border-l-cyan-500/50 hover:bg-cyan-500/30 backdrop-blur-md font-semibold' : 'text-foreground'
                                )}>
                                <h3 className={cn('capitalize center gap-[5px] text-foreground')}>
                                    <Folder size={10} className={cn('text-foreground fill-white/90')}/>
                                    {nd.path.split('/').filter(Boolean)[nd?.path?.split('/').filter(Boolean).length - 2]}</h3>
                                <h3 className={cn('text-[10px] text-yellow-400/90')}>{nd?.path.slice(0, 27)}</h3>
                            </div>
                        ))}
                    </ScrollArea>
                )}

                <div className={cn('w-full h-fit bg-black/70 mb-[10px] rounded-sm between gap-[5px] p-[5px]')}>
                    <div
                        onClick={() => setIsDependencies(true)}
                        className={cn('w-full bg-zinc-800/70 rounded-sm center h-fit p-[5px] flex-nowrap hover:bg-cyan-500/10  transition-300 py-[5px] text-[11px] text-white',
                            isDependencies? 'text-foreground bg-cyan-500/30 hover:bg-cyan-500/30 backdrop-blur-md font-semibold' : 'text-foreground'
                            )}>
                        Dependencies
                    </div>
                    <div
                        onClick={() => setIsDependencies(false)}
                        className={cn('w-full bg-zinc-800/70 rounded-sm center h-fit p-[5px] flex-nowrap  hover:bg-cyan-500/10 transition-300 py-[5px] text-[11px] text-white',
                            !isDependencies? 'text-foreground bg-cyan-500/30 hover:bg-cyan-500/30 backdrop-blur-md font-semibold' : 'text-foreground'
                            )}>
                        Dev Dependencies
                    </div>
                </div>
                <div className={cn('center w-full mb-[7px] !justify-end gap-[5px] h-fit px-[10px]')}>
                    <p className={'text-[11px] text-white/80'}>total:</p>
                    <p className={cn('!text-[11px] p-0 !text-cyan-500/90')}>
                        {isDependencies ? dependencies.dependencies.length : dependencies.devDependencies.length}</p>
                </div>
                <ScrollArea
                    // id={'scrollable'}
                    className={cn('w-full h-full overflow-y-hidden center flex-col space-y-[5px]')}>
                    {isDependencies ? dependencies.dependencies && dependencies.dependencies.map(({name, version}) => (
                        <div
                            className={cn(`w-full !h-[30px] py-[7px] my-[5px] px-[10px] between backdrop-blur-md bg-green-500/3 rounded-md border-1 border-green-500/30`)}
                            key={name}>
                            <h1 className={cn(`text-foreground/90 text-xs font-light truncate`)}>{name}</h1>
                            <span className={cn(`text-foreground/90 text-xs font-light truncate`)}>{version}</span>
                        </div>
                    )) : dependencies.devDependencies && dependencies.devDependencies.map(({name, version}) => (
                        <div
                            className={cn(`w-full !h-[30px] py-[7px] my-[5px] px-[10px] between backdrop-blur-md bg-green-500/3 rounded-md border-1 border-green-500/30`)}
                            key={name}>
                            <h1 className={cn(`text-foreground/90 text-xs font-light truncate`)}>{name}</h1>
                            <span className={cn(`text-foreground/90 text-xs font-light truncate`)}>{version}</span>
                        </div>
                    ))}
                    <ScrollBar className={'text-cyan rounded-md'}/>
                </ScrollArea>
            </div>
        </div>
    )
}
export default Dependencies

const DependencyInput = () => {
    const [depPackage, setDepPackage] = useState({ name: '', version: 'latest' })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setDepPackage(prev => ({...prev, [name]: value }));
    }

    const handleKeyDown = () => {
        if (depPackage.name.trim() && depPackage.version.trim()){

        }

    }

    return (
        <div className={cn(`w-full h-fit between gap-[5px] bg-black rounded-sm`)}>
            <Input
                inputType={'text'}
                placeholder={''}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                value={depPackage.name}
                name={'name'}
                className={'w-full h-[30px] text-xs font-light text-foreground p-[10px] outline-none border-[1px] !shadow-none outline-zinc-600 !border-zinc-600 bg-neutral-900 rounded-sm'}
            />
            <Input
                inputType={'text'}
                placeholder={'search files, folders...'}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                value={depPackage.version}
                name={'version'}
                className={'w-[110px] h-[30px] text-xs font-light text-foreground p-[10px] outline-none border-[1px] !shadow-none outline-zinc-600 !border-zinc-600 bg-neutral-900 rounded-sm'}
            />
        </div>
    )
}
