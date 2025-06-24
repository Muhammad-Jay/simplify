import React from 'react'
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import styles from "@/components/liveblocks/TextEditor/TextEditor.module.css";
import { useThreads } from "@liveblocks/react/suspense";
import {CommentIcon} from "@liveblocks/react-ui/_private";
import {
    AnchoredThreads,
    FloatingComposer,
    FloatingThreads,
    useLiveblocksExtension,
} from "@liveblocks/react-tiptap";
import {cn} from "@/lib/utils";
import {Composer} from '@liveblocks/react-ui'

const Comments = ({ editor }: { editor: Editor | null }) => {
    const { threads } = useThreads();

    return (
        <div className={cn(`w-[320px] center flex-col`)}>
            <div className={'center w-full h-full !justify-start flex-col px-[10px]'}>
                <AnchoredThreads
                threads={threads}
                editor={editor}
                style={{ width: 300}}
                className={cn(`!rounded-md`)}
            />

                <Composer/>
            </div>
        </div>
    );
}
export default Comments
