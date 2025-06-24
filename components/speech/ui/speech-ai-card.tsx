import {ConversationCardType} from "@/types";


const ConversationCard = ({isSpeechActive, callStatus,name, transcript}: ConversationCardType) => {
    return (
        <section className="md:w-[50%] relative w-full p-2.5  h-full bd emp-bg rounded-[20px] space-y-1 center flex-col overflow-hidden">
            <div className={"absolute w-full h-full bg-radial from-[#00BBC2]/20 to-transparent z-[1]"} id={"conversation-pulse"}>
            </div>
            <div className="center w-full h-full flex-col !justify-between p-2.5 z-[2]">
                <div className="size-[130px] border-[3px] mt-[35px] border-[#00BBC2]/30 center rounded-full relative ">
                    <div className={`absolute inset-0 top-0 bottom-0 size-full  bd border-[3px]  border-[#00BBC2]/30 center rounded-full ${callStatus === 'connected' && transcript.role === 'model' && 'bg-cyan-600 opacity-100 animate-ping'}`}>
                    </div>
                    <div className={`relative size-[130px] z-[2] text-[10px] bd border-[#00BBC2]/5 center rounded-full bg-[#4B4B4B]/10 `}>
                        <div //id={callStatus === "loading" && "spin-animate"}
                            className={` absolute  transition-all duration-75 h-[130px] w-[130px] rotate-[30deg] rounded-full ${callStatus === "loading" && "bg-[linear-gradient(#00BBC2,black,black,black,#00BBC2)] animate-spin"}`}
                        ></div>
                        <div className={`size-[100px] z-[2] text-[10px] bd border-[3px]  border-[#00BBC2]/5 center rounded-full bg-gradient-to-b from-[#072324] via-[#136669] to-[#00F6FF]`}>
                            <div className={`size-[100px] bd center emp-bg rounded-full `}>
                                {/*<Image  src={callStatus === "active" ? 'active' : 'disConneected'} alt={"robot"} width={150} height={150} />*/}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"center z-[2] w-full md:w-[80%] h-[25%] py-[5px] bg-black/50 rounded-2xl text-sm text-white/60"}>
                    {name}
                </div>
            </div>
        </section>
    )
}
export default ConversationCard