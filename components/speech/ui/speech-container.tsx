'use client'
import React, {useEffect, useState} from 'react'
import ConversationCard from './speech-ai-card'
import SpeechUserContainer from "@/components/speech/ui/speech-user-container";
import {ConversationCardType, Messages, TranscriptMessages} from "@/types";
import Loader from '@/components/ui/loader'
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import {toast} from "sonner";
import {GenAiResponse} from "@/lib/AI/generativeAI";
import { motion } from 'framer-motion';

const LastTranscriptContainer = ({transcript, error}: {transcript: string, error: string | null})=> {
    if (transcript){
        return (
            <motion.p
                initial={{opacity: 0, y: 10}}
                animate={transcript && {opacity: 1, y: 0}}
                transition={{duration: .4, ease: 'linear'}}
                className={`center bg-gray/50 p-[15px] self-center text-center text-white/90 text-xs md:text-sm font-regular rounded-lg transition-opacity duration-600 opacity-100`}>
                { !error && transcript}
            </motion.p>
        )
    }
    return;
}

const SpeechContainer = ({ name}: ConversationCardType) => {
    const [response, setResponse] = useState('')
    const [transcript, setTranscript] = useState<TranscriptMessages>({role: '', message: ''})
    const {transcriptMessages, setTranscriptMessages, chatHistory, setChatHistory, callStatus, status, startListening, isListening, stopListening, error} = useSpeechRecognition()

    useEffect(() => {
        if(callStatus === 'active'){
           setTranscriptMessages(prev => [...prev, { role: 'model', message: 'hello, how can i help you?'}])
            setChatHistory(prev => [...prev, {
                role: 'model',
                parts: [
                    {
                        text: 'hello, how can i help you?'
                    }
                ]
            }])
        }
    }, [callStatus]);

    useEffect(() => {
        if (transcriptMessages.length > 0){
            setTranscript(transcriptMessages[transcriptMessages.length - 1])
            console.log(chatHistory)
        }
        if (response){
            // useSpeechSynthesis(isListening, response)
        }
    },[transcriptMessages,response])

    useEffect(() => {
        if (status){
            toast.message(<p className={'text-xs font-bold text-white'}>{status}</p>)
        }
    }, [status]);



    useEffect(() => {
        if (transcript.role === "user" && transcript.message.trim()){
            const AiResponse = async (messages: Messages[]) => {
                const aiText = await GenAiResponse(messages)
                if (aiText) {
                    setTranscriptMessages(prev => [...prev, {role: 'model', message: aiText}])
                    setChatHistory(prev => [...prev, {
                        role: 'model',
                        parts: [
                            {
                                text: aiText
                            }
                        ]
                    }])
                }
            }
            AiResponse(chatHistory).catch(e => console.log(e))
        }
        console.log(response)
    }, [transcript, transcriptMessages]);

    useEffect(() => {
        if(error){
            console.log(error)
        }
    }, [error]);

    const handleCall = async () => {
        if (callStatus === 'active'){
            stopListening()
            return;
        }
        await startListening()
    }

    return (
        <div className="w-full h-full center flex-col">
            <div className="w-full h-full center space-x-1 overflow-hidden">
                <ConversationCard transcript={transcript} isSpeechActive={isListening} callStatus={callStatus} name={name}/>
                <SpeechUserContainer transcript={transcript} isSpeechActive={isListening}/>
            </div>
            <div className="w-full h-[230px] center bd flex-col mt-[10px] rounded-full relative">
                <div className={"w-full h-[70px] center"}>
                    <LastTranscriptContainer error={error} transcript={transcript.message}/>
                </div>
                <button
                    onClick={handleCall}
                        type={"button"}
                        className={`w-[100px] md:w-[130px] h-[37px] ${callStatus === "active" ? "bg-red-700 hover:bg-red-500" : "bg-green-700 hover:bg-green-500"} rounded-full text-xs font-bold transition-500 center`}>
                    {callStatus === "active" && "End"}
                    {callStatus === "loading" && (<Loader/>)}
                    {callStatus === "inactive" && "Call"}
                </button>
            </div>
        </div>
    )
}
export default SpeechContainer
