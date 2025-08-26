import React, {memo} from 'react'

const Page = () => {
    return (
        <div className={"page gap-[10px] flex-col !justify-start !p-[10px]"}>
            <div className={"between gap-[10px] container-full"}>
                <div className={"container-full center !justify-start flex-col gap-[20px]"}>
                    <div className={"w-full between gap-[20px] !h-[300px]"}>
                        <div className={"!w-[60%] container-full center bg-zinc-900 bd rounded-2xl"}>

                        </div>
                        <div className={"!w-[40%] container-full center bg-cyan bd rounded-2xl"}>

                        </div>
                    </div>

                    <div className={"w-full between gap-[20px] h-full"}>
                        <div className={"!w-[60%] container-full center bg-zinc-900 bd rounded-2xl"}>

                        </div>
                        <div className={"!w-[40%] container-full center bg-zinc-900 bd rounded-2xl"}>

                        </div>
                    </div>
                </div>

                <div className={"w-[400px] center gap-[20px] flex-col !justify-start"}>
                    <div className={"!h-[60%] container-full center bg-zinc-900 bd rounded-2xl"}>

                    </div>
                    <div className={"!h-full container-full center bg-zinc-900 bd rounded-2xl"}>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default memo(Page)
