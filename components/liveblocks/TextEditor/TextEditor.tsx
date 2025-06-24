"use client";

import {RoomProvider, useSelf} from "@liveblocks/react";
import {useState} from 'react'
import { ClientSideSuspense, useThreads } from "@liveblocks/react/suspense";
import {
    AnchoredThreads,
    FloatingComposer,
    FloatingThreads,
    useLiveblocksExtension,
} from "@liveblocks/react-tiptap";
import { CharacterCount } from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
// import TaskList from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorView } from "prosemirror-view";
// import { CustomTaskItem } from "./CustomTaskItem";
import { SelectionToolbar, StaticToolbar } from "./Toolbars";
import { WordCount } from "./WordCount";
import styles from "./TextEditor.module.css";
import MainLoader from "@/components/layouts/MainLoader";
import {CommentIcon} from "@liveblocks/react-ui/_private";
import {cn} from "@/lib/utils";
import Navbar from "@/components/navigations/Navbar";
import {Composer} from "@liveblocks/react-ui";
import {liveblocks} from "@/lib/liveblocks/liveblocks.config";
import Comments from "@/components/liveblocks/coments/Comments";
import ToggleComments from "@/components/liveblocks/coments/ToggleComments";

export function TextEditor({roomId}: {roomId: string}) {
    return (
        <ClientSideSuspense fallback={<MainLoader/>}>
            <RoomProvider id={roomId}>
                <TiptapEditor/>
            </RoomProvider>
        </ClientSideSuspense>
    );
}

// Collaborative text editor with simple rich text and live cursors
function TiptapEditor() {
    const [isOpen, setIsOpen] = useState(true)
    const liveblocks = useLiveblocksExtension({
        offlineSupport_experimental: true,
    });

    // Set up editor with plugins, and place user info into Yjs awareness and cursors
    const editor = useEditor({
        immediatelyRender: false,
        // Start read-only, updated after `canWrite` is loaded
        editable: false,
        editorProps: {
            attributes: {
                // Add styles to editor element
                class: styles.editor,
            },
        },
        extensions: [
            // Add collaboration
            liveblocks,

            StarterKit.configure({
                blockquote: {
                    HTMLAttributes: {
                        class: "tiptap-blockquote",
                    },
                },
                code: {
                    HTMLAttributes: {
                        class: "tiptap-code",
                    },
                },
                codeBlock: {
                    languageClassPrefix: "language-",
                    HTMLAttributes: {
                        class: "tiptap-code-block",
                        spellcheck: false,
                    },
                },
                heading: {
                    levels: [1, 2, 3],
                    HTMLAttributes: {
                        class: "tiptap-heading",
                    },
                },
                // The Collaboration extension comes with its own history handling
                history: false,
                horizontalRule: {
                    HTMLAttributes: {
                        class: "tiptap-hr",
                    },
                },
                listItem: {
                    HTMLAttributes: {
                        class: "tiptap-list-item",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "tiptap-ordered-list",
                    },
                },
                paragraph: {
                    HTMLAttributes: {
                        class: "tiptap-paragraph",
                    },
                },
            }),
            CharacterCount,
            Highlight.configure({
                HTMLAttributes: {
                    class: "tiptap-highlight",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "tiptap-image",
                },
            }),
            Link.configure({
                HTMLAttributes: {
                    class: "tiptap-link",
                },
            }),
            Placeholder.configure({
                placeholder: "Start writing…",
                emptyEditorClass: "tiptap-empty",
            }),
            // TaskList.configure({
            //     HTMLAttributes: {
            //         class: "tiptap-task-list",
            //     },
            // }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Typography,
            Youtube.configure({
                modestBranding: true,
                HTMLAttributes: {
                    class: "tiptap-youtube",
                },
            }),
        ],
    });

    // Check if user has write access in current room
    // const canWrite = useSelf((me) => me.canWrite) || false;
    const canWrite = true
    const disableToolbar = !editor || !canWrite;

    // If canWrite changes, sync to Tiptap, as we're defaulting to false in the config
    if (editor && editor.isEditable !== canWrite) {
        editor.setEditable(canWrite);
    }


    return (
        <div className={cn(`center screen p-[10px] flex-col pb-0`)}>
            <Navbar/>
            <div
                // className={styles.editorHeader}
                className={cn(`w-full h-fit center flex-row !justify-start mb-[10px] overflow-x-auto md:overflow-hidden`)}
                data-disabled={disableToolbar || undefined}
                id={'no-scrollbar'}
            >
                <StaticToolbar editor={editor} />
            </div>
            <div className={cn(`w-full !h-full relative center mb-[5px]`)}>
                <ToggleComments setIsOpen={setIsOpen}/>
                <SelectionToolbar editor={editor} />
                {/*<div className={styles.editorContainerOffset}>*/}
                    <div className={cn(`center !justify-between w-full h-full gap-2.5`)}>
                        <div className={cn(`relative w-full h-full center overflow-y-auto`)} id={'no-scrollbar'}>
                            <EditorContent editor={editor} className={cn(`w-full h-full absolute overflow-y-auto rounded-sm bg-white text-black p-2`)} id={'no-scrollbar'}/>
                        </div>
                        <FloatingComposer editor={editor} style={{ width: 350 }} />
                            <div className={cn(`overflow-hidden transition-500 center h-full flex-col`,
                                isOpen? "w-[320px]" : "w-0")}>
                                <ClientSideSuspense fallback={null}>
                                        <Comments editor={editor}/>
                                </ClientSideSuspense>
                            </div>
                    {/*</div>*/}
                </div>
            </div>
            {editor ? <WordCount editor={editor} /> : null}
        </div>
    );
}


// Prevents a matchesNode error on hot reloading
EditorView.prototype.updateState = function updateState(state) {
    // @ts-ignore
    if (!this.docView) return;
    // @ts-ignore
    this.updateStateInner(state, this.state.plugins != state.plugins);
};