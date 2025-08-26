import React, {memo} from 'react'
import TitleCard from "@/components/layouts/TitleCard";
import GlassCard from "@/components/ui/glass";

const RecentComponents = () => {
    return (
        <section className={'w-full between flex-col h-fit'}>
            <TitleCard title={'Recent Components'} />
            <div className={'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-fit items-center py-[10px] !justify-start gap-[10px] space-x-[10px]'}>
                <div className={'w-full h-[200px] bg-zinc-900 rounded-2xl'}>

                </div>
                <div className={'w-full h-[200px] bg-zinc-900 rounded-2xl'}>

                </div>
                <div className={'w-full h-[200px] bg-zinc-900 rounded-2xl'}>

                </div>
                <div className={'w-full h-[200px] bg-zinc-900 rounded-2xl'}>

                </div>
                <div className={'w-full h-[200px] bg-zinc-900 rounded-2xl'}>

                </div>
            </div>
            <TitleCard title={'Drafts'}/>
            <div className={'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-fit items-center py-[10px] !justify-start gap-[10px] space-x-[10px]'}>
                <div className={'w-full h-[100px] bg-secondary rounded-md'}>

                </div>
                <div className={'w-full h-[100px] bg-secondary rounded-md'}>

                </div>
            </div>
        </section>
    )
}
export default memo(RecentComponents)
