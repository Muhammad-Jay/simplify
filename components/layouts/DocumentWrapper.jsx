
import React from 'react'
import CreateRoomBtn from "../liveblocks/CreateRoomBtn";
import {DocumentCard} from "@/components/layouts/DocumentCard";
import TitleCard from "@/components/layouts/TitleCard";
import {DialogBtn} from "@/components/CreateComponentBtn";


const DocumentWrapper = ({documents, isFetching, type}) => {
    return (
        <div className={'container-full relative p-[5px] pt-0 md:p-[10px] !pb-0 flex-col center gap-[10px]'}>
            <div className={'container-full sticky top-0 mx-auto !h-[75px] between'}>
                <div className={'container-full between flex-col gap-[10px] lg:mt-[10px]'}>
                    <TitleCard title={'My Components'} titleClassName={'text-lg'}/>
                    <div className={'center container-full !justify-start'}>
                        <span className={'transition-500 center text-xs font-semibold capitalize p-[5px]'}>total:  {documents?.length || 0}</span>
                    </div>
                </div>
                <DialogBtn/>
            </div>
            <div className={'relative center container-full !p-0'}>
                <div className={'wrapper-grid p-[10px] rounded-md absolute inset-0 h-full w-full flex-col !justify-start !items-start overflow-y-scroll'} id={'no-scrollbar'}>
                    {documents?.length > 0 && documents.map((doc, index) => (
                        <DocumentCard key={doc.id} doc={doc} index={index}/>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default DocumentWrapper
