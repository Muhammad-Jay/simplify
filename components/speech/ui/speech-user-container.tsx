'use client'
import useAuthClient from "@/hooks/supabase-auth/useAuthClient";

type SpeechUser = {
    transcript: {
        role: string,
        message: string
    },
    isSpeechActive: boolean
}

const SpeechUserContainer = ({transcript, isSpeechActive}: SpeechUser) => {
    const user = useAuthClient()

    return (
        <section className="md:w-[50%] hidden md:flex p-2.5  h-full bd emp-bg rounded-[20px] space-y-1 items-center justify-center flex-col">
            <div className="center w-full flex-col !justify-between h-full p-2.5">
                <div className="size-[130px] border-[3px] mt-[35px] border-[#00BBC2]/30 center rounded-full relative ">
                    <div className={`absolute inset-0 top-0 bottom-0 size-full  bd border-[3px]  border-[#00BBC2]/30 center rounded-full ${transcript.role === "user" && isSpeechActive && 'bg-cyan-600 opacity-100 animate-ping'}`}>
                    </div>
                    <div className={` size-[130px] z-[2] text-[10px] bd border-[#00BBC2]/30 center rounded-full emp-bg `}>
                        <div className={`size-[100px] z-[2] text-[10px] bd border-[3px]  border-[#00BBC2]/30 center rounded-full bg-gradient-to-b from-[#072324]/40 via-[#136669]/47 to-[#00F6FF]/37`}>
                            <div className={`size-[100px] bd center text-3xl emp-bg rounded-full`}>

                            </div>
                        </div>
                    </div>
                </div>
                <div className={"center w-full md:w-[80%] h-[25%] py-[5px] bg-black/50 rounded-2xl text-sm text-white/60"}>
                    {user?.username || " "}
                </div>
            </div>
        </section>
    )
}
export default SpeechUserContainer