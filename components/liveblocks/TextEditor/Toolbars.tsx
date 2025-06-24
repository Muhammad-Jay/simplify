import { FloatingToolbar, Toolbar } from "@liveblocks/react-tiptap";
import { Editor } from "@tiptap/react";
// import { ToolbarInlineAdvanced } from "./TextInlineAdvanced";
import { ToolbarAlignment } from "./ToolbarAlignment";
import { ToolbarBlockSelector } from "./ToolbarBlockSelector";
import './Toolbar.module.css'
import {cn} from "@/lib/utils";

type Props = {
    editor: Editor | null;
};

export function StaticToolbar({ editor }: Props) {
    return (
        <Toolbar editor={editor} data-toolbar="static" className={cn(`center w-fit h-fit flex-row space-x-1.5`)}>
            <Toolbar.SectionHistory />
            <Toolbar.Separator />
            <ToolbarBlockSelector editor={editor} />
            <Toolbar.Separator />
            <Toolbar.SectionInline />
            {/*<ToolbarInlineAdvanced editor={editor} />*/}
            <Toolbar.Separator />
            <ToolbarAlignment editor={editor} />
            <Toolbar.Separator />
            <Toolbar.Separator />
            <Toolbar.SectionCollaboration />
        </Toolbar>
    );
}

export function SelectionToolbar({ editor }: Props) {
    return (
        <FloatingToolbar editor={editor} data-toolbar="selection" className={cn(`center w-fit h-fit flex-row space-x-1.5`)}>
            <ToolbarBlockSelector editor={editor} />
            <Toolbar.Separator />
            <Toolbar.SectionInline />
            <Toolbar.Separator />
            <Toolbar.SectionCollaboration />
        </FloatingToolbar>
    );
}