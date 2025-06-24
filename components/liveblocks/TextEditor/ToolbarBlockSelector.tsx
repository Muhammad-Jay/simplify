import { Toolbar } from "@liveblocks/react-tiptap";
import { Editor } from "@tiptap/react";
import {CheckIcon } from "lucide-react";
import styles from "./Toolbar.module.css";

type Props = {
    editor: Editor | null;
};

export function ToolbarBlockSelector({ editor }: Props) {
    return (
        <Toolbar.BlockSelector
            className={styles.blockSelector}
            items={(defaultBlockItems) => [
                ...defaultBlockItems,
                {
                    name: "Task list",
                    icon: <CheckIcon style={{ width: 17 }} />,
                    isActive: () => editor?.isActive("taskList") ?? false,
                    // @ts-ignore
                    setActive: () => editor?.chain().focus().toggleList().run(),
                },
            ]}
        />
    );
}