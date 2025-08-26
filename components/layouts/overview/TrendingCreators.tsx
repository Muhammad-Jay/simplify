import React, {memo} from 'react'
import TitleCard from "@/components/layouts/TitleCard";
import { Input } from "@/components/ui/input"


const TrendingCreators = () => {
    return (
        <section className={'w-[350px] h-fit center flex-col p-2.5'}>
            <TitleCard title={'Trending Creators'} />
            <div className={'w-full grid grid-cols-1 h-fit items-center py-[10px] !justify-start space-y-[10px]'}>
                <div className={'w-full h-[100px] bg-secondary rounded-md'}>

                </div>
                <div className={'w-full h-[100px] bg-secondary rounded-md'}>

                </div>
            </div>
            <TitleCard title={'Drafts'}/>
            <div className={'w-full grid grid-cols-1 h-fit items-center py-[10px] !justify-start space-y-[10px]'}>
                <div className={'w-full h-[100px] bg-secondary rounded-md'}>

                </div>
                <div className={'w-full h-[100px] bg-secondary rounded-md'}>

                </div>
            </div>
        </section>
    )
}
export default memo(TrendingCreators)
