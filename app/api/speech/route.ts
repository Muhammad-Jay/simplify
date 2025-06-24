import {NextRequest, NextResponse} from "next/server";
import {GoogleGenAI} from "@google/genai";

export async function POST(req: NextRequest){
    const prompt = await req.json()

    const encoder = new TextEncoder()
    const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!})
    const geminiStream = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt
    })

    // let text = "";
    // for await (const chunk of geminiStream) {
    //     console.log(chunk.text);
    //     text += chunk.text;
    // }
    //
    // const stream = new ReadableStream({
    //     async start(controller){
    //         try {
    //             for await (const chunk of geminiStream){
    //                 const text = chunk.text
    //                 controller.enqueue(encoder.encode(text))
    //             }
    //             controller.close()
    //         }catch (e) {
    //             controller.enqueue(encoder.encode("[error streaming Gemini output]"))
    //             controller.close()
    //         }
    //     }
    // })
    //
    // return new Response(stream,{
    //     headers: {
    //         'Content-Type': 'text/plain; charset=utf-8',
    //         'Catch-Control': 'no-catch'
    //     }
    // })

    return NextResponse.json(geminiStream.text)
}
