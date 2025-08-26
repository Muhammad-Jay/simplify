'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {cn} from "@/lib/utils";
import {useEditorState} from "@/context/EditorContext";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export type DependenciesTypes = {
    dependencies: {name: string, version: string}[],
    devDependencies: {name: string, version: string}[],
    peerDependencies: {name: string, version: string}[]
}

const Dependencies = () => {
    const { files } = useEditorState()

    const [isVisible, setIsVisible] = useState(false)
    const [isDependencies, setIsDependencies] = useState(true)
    const [dependencies, setDependencies] = useState<DependenciesTypes>({
        dependencies: [{name: 'react', version: 'latest'}],
        devDependencies: [],
        peerDependencies: []
    })

    useEffect(() => {
        try {
            const parsedFile = JSON.parse(files['/package.json'].code);
            const depend = parsedFile.dependencies;
            const dev = parsedFile.devDependencies;
            const formatedDependencies = Object.entries(depend).map(([name, version]: [string,string]) => ({ name, version }))
            const formatedDevDependencies = Object.entries(dev).map(([name, version]: [string,string]) => ({ name, version }));

            setDependencies(prev => ({...prev, dependencies: formatedDependencies, devDependencies: formatedDevDependencies }))
        }catch (e) {
            console.log(e)
        }
    }, [files]);

    return (
        <div className={cn('container-full center p-[5px] flex-col gap-[10px]')}>
            <div className={'w-full center flex-col gap-[0px] !justify-start !items-start'}>
                {/*<div className={'w-full center h-fit mb-[10px] !justify-end'}>*/}
                {/*    <Button*/}
                {/*        onClick={() => setIsVisible(prev => !prev)}*/}
                {/*        className={cn(`size-[20px] !m-0 center text-xs !p-0 text-white rounded-sm !bg-neutral-800`)}*/}
                {/*        type={'button'}>*/}
                {/*        +*/}
                {/*    </Button>*/}
                {/*</div>*/}
                {/*{isVisible && <DependencyInput/>}*/}
                <div className={cn('w-full h-fit between px-[5px]')}>
                    <div
                        onClick={() => setIsDependencies(prev => !prev)}
                        className={cn('w-full center h-fit p-[5px] flex-nowrap hover:text-cyan-500/90  transition-300 py-[10px] rounded-md text-xs text-white',
                            isDependencies? 'text-cyan-500/90 font-semibold' : 'text-foreground'
                            )}>
                        Dependencies
                    </div>
                    <div
                        onClick={() => setIsDependencies(prev => !prev)}
                        className={cn('w-full center h-fit p-[5px] flex-nowrap hover:text--cyan-500/90 transition-300 py-[10px] rounded-md text-xs text-white',
                            !isDependencies? 'text-cyan-500/90 font-semibold' : 'text-foreground'
                            )}>
                        Dev Dependencies
                    </div>
                </div>
                <ScrollArea
                    // id={'scrollable'}
                    className={cn('w-full max-h-[420px] center flex-col space-y-[5px]')}>
                    {isDependencies ? dependencies.dependencies && dependencies.dependencies.map(({name, version}) => (
                        <div
                            className={cn(`w-full h-fit py-[10px] my-[5px] px-[10px] between backdrop-blur-md bg-green-500/3 rounded-md border-1 border-green-500/30`)}
                            key={name}>
                            <h1 className={cn(`text-foreground/90 text-xs font-light truncate`)}>{name}</h1>
                            <span className={cn(`text-foreground/90 text-xs font-light truncate`)}>{version}</span>
                        </div>
                    )) : dependencies.devDependencies && dependencies.devDependencies.map(({name, version}) => (
                        <div
                            className={cn(`w-full h-fit py-[10px] my-[5px] px-[10px] between backdrop-blur-md bg-green-500/3 rounded-md border-1 border-green-500/30`)}
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
