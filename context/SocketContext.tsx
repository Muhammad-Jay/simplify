'use client'
import { useCallback, useState, useMemo, useRef, useEffect, createContext, useContext } from 'react'
import {db, Edges} from "@/lib/dexie/index.dexie";
import {nanoid} from 'nanoid'
import {useEditorState} from "@/context/EditorContext";
// @ts-ignore
import {io} from 'socket.io-client';
import {getAllContainers} from "@/lib/podman_actions/getContainers";
import { useParams } from 'next/navigation'
import {socketEvents} from "@/lib/socket/events";

const SocketContext = createContext<any| undefined>(undefined)

const WEBSOCKET_URL = 'localhost:8000';
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

    const { project_id } = useParams()

    const socket_io = useRef(null);
    const reconnectionTimeout = useRef(null);
    const reconnectionDelay = useRef(null);
    const containerTimeout = useRef(null);

    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(false)
    const [buildMessages, setBuildMessages] = useState<BuildMessagesType[]>([])
    const [socket, setSocket] = useState<any>(null)
    const [isRunning, setIsRunning] = useState(true)
    const [fetchContainerLoaded, setFetchContainerLoaded] = useState(false);
    const [message, setMessage] = useState<any>('')
    const [containers, setContainers] = useState([])
    const [isComplete, setIsComplete] = useState(true);
    const [deployedUrl, setDeployedUrl] = useState({ });
    const [buildProcess, setBuildProcess] = useState({
        complete: { logs: [], isOpen: false },
        build: { logs: [], isOpen: false },
        container_outputs: { logs: [], isOpen: false },
    })
    const [containerOutputs, setContainerOutputs] = useState([])
    const [buildStatus, setBuildStatus] = useState<'build' | 'run' | 'complete' | ''>('');

    const fetchContainers = () => {
        try {
            getAllContainers().then((data: any) => {
                const parsedData = JSON.parse(data);
                // if (parsedData === containers) {
                //     setFetchContainerLoaded(true);
                //     return;
                // }
                setContainers(parsedData)
                setFetchContainerLoaded(true);
                setIsRunning(false)
            })
        }catch (e) {
            console.log(e);
            setIsRunning(false)
        }

        containerTimeout.current = setTimeout(fetchContainers, 2500);
    }


    const connect = useCallback(() => {
        if (reconnectionTimeout.current){
            clearTimeout(reconnectionTimeout.current);
        }

        socket_io.current = io(`ws://${WEBSOCKET_URL}`);

        socket_io.current.on('connect', () => {
            setIsConnected(true);
            setSocket(socket_io.current);
            reconnectionDelay.current = RECONNECT_DELAY_MS;
            socket_io.current.emit(socketEvents.joinRoomRequest, project_id);
        });

        socket_io.current.on(socketEvents.logsBuild, (data: any) => {
            setBuildStatus('build');
            console.log(data);
            setBuildProcess(prev => ({
                ...prev,
                build: {
                    ...prev.build,
                    logs: [...prev.build.logs, { message: data }]
                }
            }))
        });

        socket_io.current.on(socketEvents.logsRun, (data: any) => {
            setBuildStatus('run');

            setContainerOutputs(prev => ([...prev, { message: data }]))

            if (isComplete && buildStatus === 'run'){
                setBuildStatus('complete');
                setBuildProcess(prev => ({
                    ...prev,
                    complete: {
                        ...prev.complete,
                        logs: [...prev.complete.logs, { message: data }]
                    }
                }))
            }else if (!isComplete){
                setBuildProcess(prev => ({
                    ...prev,
                    container_outputs: {
                        ...prev.container_outputs,
                        logs: [...prev.container_outputs.logs, { message: data }]
                    }
                }))
            }else {
                setBuildProcess(prev => ({
                    ...prev,
                    container_outputs: {
                        ...prev.container_outputs,
                        logs: [...prev.container_outputs.logs, { message: data }]
                    }
                }))
            }
        });

        socket_io.current.on(socketEvents.deployComplete, (data: boolean) => {
            setIsComplete(data);
        })

        socket_io.current.on(socketEvents.deployStatus, (data: string) => {

        })

        socket_io.current.on(socketEvents.deploySuccess, (data: any)=> {
            setBuildStatus(data);
        });

        socket_io.current.on(socketEvents.allContainer, (data: any) => {
            console.log(data);
            setContainers(data);
            setFetchContainerLoaded(true);
            setIsRunning(false);
        })

        socket_io.current.on(socketEvents.url, ({port, hostname}) => {
            setDeployedUrl({ port, hostname })
        })

        socket_io.current.on(socketEvents.cLIPush, (data: any) => {
            console.log('cli pushed data', data);
        })

        socket_io.current.on('disconnect', (event) => {
            console.log('connection closed', event.reason);
            setIsConnected(false);
            setSocket(null);
            socket_io.current.disconnect();
            const delay = Math.min(reconnectionDelay.current, 30000);
            console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);

            reconnectionTimeout.current = setTimeout(() => {
                reconnectionDelay.current *= 2;
                connect();
            }, delay)
        });

        socket_io.current.on('error', (error) => {
            console.warn('connection error:', error);
            socket_io.current.disconnect();
        });
    }, [])

    useEffect(() => {
        connect();

        return () => {
            if (reconnectionTimeout.current){
                clearTimeout(reconnectionTimeout.current);
            }
            if (socket_io.current){
                socket_io.current.disconnect();
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
            containers,
            setBuildMessages,
            fetchContainerLoaded,
            setFetchContainerLoaded,
            buildProcess,
            buildStatus,
            setBuildProcess,
            isComplete,
            setIsComplete,
            deployedUrl,
            containerOutputs,
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