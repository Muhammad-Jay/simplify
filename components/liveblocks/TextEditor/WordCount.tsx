import { Editor } from "@tiptap/react";
import styles from "./WordCount.module.css";
import {cn} from "@/lib/utils";

type Props = {
    editor: Editor;
};

export function WordCount({ editor }: Props) {
    return (
        <div className={cn(`w-full center !justify-start px-[6px] text-white text-xs font-bold`)}>
            {editor.storage.characterCount.words()} words,{" "}
            {editor.storage.characterCount.characters()} characters
        </div>
    );
}