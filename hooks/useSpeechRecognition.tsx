// 'use client'
// import {useEffect, useRef, useState} from 'react'
//
// const CALLSTATUS : CALLSTATUSTYPE= {
//     ACTIVE: 'active',
//     INACTIVE: "inactive",
//     LOADING: "loading"
// }
//
// const useSpeechRecognition = () => {
//     const [isListening, setIsListening] = useState(false)
//     const [status, setStatus] = useState('')
//     const [transcriptMessages, setTranscriptMessages] = useState<TranscriptMessages[]>([])
//     const [error, setError] = useState<string | null>(null)
//     const recognitionRef = useRef<any>(null)
//     let micRef: MediaStream | null = null
//     const [callStatus, setCallStatus] = useState<'active' | 'inactive' | 'loading' >(CALLSTATUS.INACTIVE)
//     const [chatHistory, setChatHistory] = useState<Messages[]>([])
//
//     useEffect(() => {
//         const SpeechRecognition  =
//             typeof window !== 'undefined' &&
//             ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
//
//         if (!SpeechRecognition) {
//             setError('Speech recognition is not supported in this browser.')
//             return
//         }
//
//         const recognition = new SpeechRecognition()
//         recognition.continuous = true
//         recognition.interimResults = false
//         recognition.maxAlternatives = 1
//         recognition.lang = 'en-US'
//
//         recognition.onresult = (e: { resultIndex: number; results: string[] | any[] }) => {
//             let interimTranscript = ''
//             for (let i = e.resultIndex; i < e.results.length; ++i) {
//                 const result = e.results[i]
//                 interimTranscript += result[0].transcript
//             }
//             // setChatHistory((prev)  => [...prev, {role: 'user', parts: [{text: 'what is AI'}]}])
//             if (interimTranscript.trim()){
//                 setTranscriptMessages(prev => [...prev,{role: 'user', message: interimTranscript.trim()}])
//                 setChatHistory(prev => [...prev, {
//                     role: 'user',
//                     parts: [
//                         {
//                             text: interimTranscript.trim()
//                         }
//                     ]
//                 }])
//             }
//         }
//
//         recognition.onspeechstart = () => {
//             setCallStatus(CALLSTATUS.ACTIVE)
//             speechSynthesis.cancel();
//             setIsListening(true)
//             setStatus('User is speaking...')
//         }
//
//         recognition.onspeechend = () => {
//             setCallStatus(CALLSTATUS.INACTIVE)
//             setIsListening(false)
//             speechSynthesis.cancel();
//             setStatus('User speech ended.')
//         }
//
//         recognition.onend = () => {
//             if (callStatus !== 'inactive') {
//                 recognition.start()
//                 return;
//             }
//         }
//
//         recognition.onerror = (e: any) => {
//             setError(e.error)
//             if (e.error === 'network') {
//                 setStatus(`error:  ` + " " + `${e.error}`)
//                 setCallStatus(CALLSTATUS.INACTIVE)
//                 setIsListening(false)
//             }
//             recognition.start()
//         }
//
//         recognitionRef.current = recognition
//
//         return () => {
//             recognition.stop()
//         }
//     }, [])
//
//     const startListening =  async () => {
//         try {
//             setCallStatus(CALLSTATUS.LOADING)
//             setStatus('Requesting microphone permission.')
//             micRef = await navigator.mediaDevices.getUserMedia({audio: true});
//             if (micRef){
//                 recognitionRef.current?.start()
//                 setCallStatus(CALLSTATUS.ACTIVE)
//                 setStatus('Call Connected.')
//             }
//         } catch (err) {
//             setError('Failed to start recognition. Make sure microphone permissions are granted.')
//             setIsListening(false)
//             setCallStatus(CALLSTATUS.INACTIVE)
//             recognitionRef.current.stop()
//         }
//     }
//
//     const stopListening = () => {
//         setCallStatus(CALLSTATUS.INACTIVE)
//         recognitionRef.current?.stop()
//         if (micRef){
//            micRef.getTracks().forEach(track => track.stop())
//             micRef = null
//             recognitionRef.current = null
//         }
//         setIsListening(false)
//         setStatus(`Call Disconnected.`)
//     }
//
//     return {
//         isListening,
//         startListening,
//         stopListening,
//         setChatHistory,
//         setTranscriptMessages,
//         transcriptMessages,
//         chatHistory,
//         error,
//         callStatus,
//         recognitionRef,
//         status
//     }
// }
//
// export default useSpeechRecognition