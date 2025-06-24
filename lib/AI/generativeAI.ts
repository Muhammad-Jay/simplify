'use server'

import {GoogleGenAI} from "@google/genai";
import {Messages} from "@/types";

export async function GenAiResponse(chatHistory: Messages[]){
    // if (chatHistory.length > 20){
    //
    // }

    // const formattedMessages = chatHistory.map(history => {
    //     role: history
    // })

    const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!})
    const geminiText = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: `you are a helpful, polite, intelligent voice assistant. you assist with general knowledge, reasoning, creative task , and live search when needed.
            if the user asked something ambiguous. ask a clarifying question. keep your answer very short and conversational when appropriate. ask questions if you do not understand the user request.`
                    }
                ]
            },
            ...chatHistory
            ]
    })

    return geminiText.text
}
