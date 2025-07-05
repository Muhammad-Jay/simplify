'use client'
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    useSandpack,
    SandpackConsole
} from '@codesandbox/sandpack-react';
import { amethyst } from "@codesandbox/sandpack-themes";
import {useEffect, useLayoutEffect, useState} from "react";
import useComponent from "@/hooks/components/useComponent";
import ConsoleDrawer from "@/components/sandpack/ui/ConsoleDrawer";
import EditorSidebar from "@/components/sandpack/EditorSidebar";
import {cn} from "@/lib/utils";
import ToggleTabs from "@/components/sandpack/ui/ToggleTabs";
import ToggleSidebar from "@/components/sandpack/ui/ToggleSidebar";
import SidebarRenderer from "@/components/sandpack/SidebarRenderer";

const EditorWithChangeHandler = ({id, isFetching}: {id: string, isFetching: boolean}) => {
    const { sandpack } = useSandpack();
    const [isLoading, setIsLoading] = useState(false)
    const { files, activeFile, error } = sandpack
    console.log(files[activeFile])



    useLayoutEffect(() => {
        const save = async (value: any, path: string, slug_id: string) => {
            if (!isFetching){
                try {
                    setIsLoading(true)
                    const response = await fetch('http://localhost:3000/api/file/save',{
                        method: "POST",
                        body: JSON.stringify({
                            code: value,
                            path: path,
                            id: slug_id,
                        })
                    })
                    const data = await response.json()
                    if (data.success){
                        console.log("file saved")
                    }
                } catch (e) {
                    console.log("error saving changes",e)
                }finally {
                    setIsLoading(false)
                }
                return;
            }
        }

        const code = files[activeFile].code
        save(code, activeFile, id).catch(e => console.log(e))
    }, [activeFile]);

    return (
        <SandpackCodeEditor
            showLineNumbers
            showTabs
            style={{
                backgroundColor: "black",
                background: "black",
                height: "95%",
                width: "100%",
                borderRadius: "10px",
                outline: "1px solid cyan"
            }}
            className={"!bd !transition-500 "}
            // onCodeUpdate={handleChange}
            showInlineErrors={true}
        />
    );
};

export default function ComponentEditor({id}: {id: string}) {
   const { files, fetchComponent, isFetching } = useComponent(id)
    const [tab, setTab] = useState<"Editor" | "Preview">("Editor")
    const [isOpen, setIsOpen] = useState(true)

    useEffect(() => {
        fetchComponent().catch(e => console.log(e))
    }, []);

    return (files ? (
        <SandpackProvider
            template="react-ts"
            theme={amethyst}
            style={{
                backgroundColor: "black",
                width: "100%",
                height: "95%"
            }}
            files={files}
        >
            <div className={cn(`w-full h-full gap-2.5 between`)}>
                <div
                    className={"!w-full !h-full flex-col rounded-[10px] !bg-transparent !border-none gap-2.5"}>
                    <ToggleTabs tab={tab} setTab={setTab} setIsOpen={setIsOpen} console={<ConsoleDrawer>
                        <SandpackConsole/>
                    </ConsoleDrawer>}/>
                    {tab === "Editor"? (
                        <EditorWithChangeHandler id={id} isFetching={isFetching}/>
                    ):(
                        <div className={cn(`w-full h-full !transition-500 rounded-md overflow-hidden`)}>
                            <SandpackPreview
                                style={{
                                    borderRadius: "10px"
                                }}
                                className={"w-full h-full !transition-500 rounded-md"}/>
                        </div>
                    )}
                </div>
                <EditorSidebar isOpen={isOpen}/>
            </div>
        </SandpackProvider>) : (
            <div className={'center text-white'}>
                nothing
            </div>
        )
    );
}
