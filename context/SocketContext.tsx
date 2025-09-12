'use client'
import { useCallback, useState, useMemo, useRef, useEffect, createContext, useContext } from 'react'
import {db, Edges} from "@/lib/dexie/index.dexie";
import {nanoid} from 'nanoid'
import {useEditorState} from "@/context/EditorContext";
import {getAllContainers} from "@/lib/podman_actions/getContainers";

const SocketContext = createContext<any| undefined>(undefined)

const WEBSOCKET_URL = 'localhost:8080';
const RECONNECT_DELAY_MS = 1000

type BuildMessagesType = {
    type: string,
    message: any
}

const messageType = {
    build: 'build'
}

export function SocketProvider({
                                       children,
                                   }: {
    children: React.ReactNode;
}){
    const ws = useRef(null);
    const reconnectionTimeout = useRef(null);
    const reconnectionDelay = useRef(null);

    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(false)
    const [buildMessages, setBuildMessages] = useState<BuildMessagesType[]>([])
    const [socket, setSocket] = useState<any>(null)
    const [message, setMessage] = useState<any>('')
    const [containers, setContainers] = useState([])

    useEffect(() => {
       getAllContainers().then(data => {
           console.log(data);
       })
    }, [])

    const connect = useCallback(() => {
        if (reconnectionTimeout.current){
            clearTimeout(reconnectionTimeout.current);
        }

        ws.current = new WebSocket(`ws://${WEBSOCKET_URL}`);

        ws.current.onopen = () => {
            setIsConnected(true);
            setSocket(ws.current);
            reconnectionDelay.current = RECONNECT_DELAY_MS;
        }

        ws.current.onmessage = (message) => {
            if (message.data instanceof ArrayBuffer){
                const decoder = new TextDecoder('utf-8')
                const decodedMessage = decoder.decode(message.data);
                console.log('message received:', decodedMessage);
                setMessage(decodedMessage);
            }else {
                const parsedData = JSON.parse(message.data)
                setMessage(parsedData);
                setBuildMessages(prev => ([...prev, parsedData]))
                console.log("not ArrayBuffer:", parsedData)
            }
        }

        ws.current.onclose = (event) => {
            console.log('connection closed', event.reason);
            setIsConnected(false);
            setSocket(null);

            const delay = Math.min(reconnectionDelay.current, 30000);
            console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);

            reconnectionTimeout.current = setTimeout(() => {
                reconnectionDelay.current *= 2;
                connect();
            }, delay)
        }

        ws.current.onerror = (error) => {
            console.warn('connection error:', error);
            ws.current.close();
        }
    }, [])

    useEffect(() => {
        connect();

        return () => {
            if (reconnectionTimeout.current){
                clearTimeout(reconnectionTimeout.current);
            }
            if (ws.current){
                ws.current.close();
            }
        }
    }, [connect]);

    return (
        <SocketContext.Provider value={{
            isConnected,
            error,
            message,
            socket,
            buildMessages,
            setBuildMessages,
        }}>
            {children}
        </SocketContext.Provider>
    )

}

export const useSocket = ()=> {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useEditorState() must be wrapped within the provider')
    }
    return context
}