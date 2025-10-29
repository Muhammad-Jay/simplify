'use client'
import { useCallback, useState, useMemo, useRef, useEffect, createContext, useContext } from 'react'
import {db} from "@/lib/dexie/index.dexie";
// @ts-ignore
import {io} from 'socket.io-client';
import { useParams } from 'next/navigation'
import {socketEvents} from "@/lib/socket/events";

// --- Type Definitions ---

const WEBSOCKET_URL = 'localhost:8000';
const RECONNECT_DELAY_MS = 1000
const author_id = 'jsync4172004@gmail.com'

/** Defines the structure for generic socket messages. */
type BuildMessagesType = {
    type: string,
    message: any
}

/** Defines the structure for a single log line in the build process. */
type LogEntry = {
    message: any;
}

/** Defines the structure for a build process log category (e.g., build, run, complete). */
interface BuildProcessCategory {
    logs: LogEntry[];
    isOpen: boolean;
}

/** Defines the structure for the comprehensive build process state. */
interface BuildProcessState {
    complete: BuildProcessCategory;
    build: BuildProcessCategory;
    container_outputs: BuildProcessCategory;
}

/** Defines the overall shape of the context state. */
interface SocketContextType {
    isConnected: boolean;
    error: boolean;
    message: any;
    socket: any | null;
    buildMessages: BuildMessagesType[];
    containers: any[];
    setBuildMessages: React.Dispatch<React.SetStateAction<BuildMessagesType[]>>;
    fetchContainerLoaded: boolean;
    setFetchContainerLoaded: React.Dispatch<React.SetStateAction<boolean>>;
    buildProcess: BuildProcessState;
    buildStatus: 'build' | 'run' | 'complete' | '';
    setBuildProcess: React.Dispatch<React.SetStateAction<BuildProcessState>>;
    isComplete: boolean;
    setIsComplete: React.Dispatch<React.SetStateAction<boolean>>;
    deployedUrl: { port?: number, hostname?: string };
    containerOutputs: any[];
    updateProjectFlow: (data: any[]) => Promise<void>;
    pushedFiles: any[];
    setPushedProjectId: React.Dispatch<React.SetStateAction<string>>;
    pushedProjectId: string;
}

// --- Context Definition ---

const SocketContext = createContext<SocketContextType | undefined>(undefined)

// --- Provider Component ---

export function SocketProvider({
                                   children,
                               }: {
    children: React.ReactNode;
}){
    const { project_id } = useParams()

    // --- Refs for mutable and persistent data ---
    const socket_io = useRef<any>(null);
    const reconnectionTimeout = useRef<NodeJS.Timeout | null>(null);
    const reconnectionDelay = useRef<number>(RECONNECT_DELAY_MS);
    const pushedFilesRef = useRef<any[]>([]); // Mutable array for file pushes

    // --- State Management ---
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false)
    const [buildMessages, setBuildMessages] = useState<BuildMessagesType[]>([])
    const [socket, setSocket] = useState<any>(null)
    const [isRunning, setIsRunning] = useState<boolean>(true)
    const [pushedFiles, setPushedFiles] = useState<any[]>([])
    const [fetchContainerLoaded, setFetchContainerLoaded] = useState<boolean>(false);
    const [message, setMessage] = useState<any>('')
    const [containers, setContainers] = useState<any[]>([])
    const [isComplete, setIsComplete] = useState<boolean>(true);
    const [deployedUrl, setDeployedUrl] = useState<{ port?: number, hostname?: string }>({});
    const [pushedProjectId, setPushedProjectId] = useState<string>('')
    const [buildProcess, setBuildProcess] = useState<BuildProcessState>({
        complete: { logs: [], isOpen: false },
        build: { logs: [], isOpen: false },
        container_outputs: { logs: [], isOpen: false },
    })
    const [containerOutputs, setContainerOutputs] = useState<any>([])
    const [buildStatus, setBuildStatus] = useState<'build' | 'run' | 'complete' | ''>('');


    /**
     * Updates project files in IndexedDB (Dexie) after a successful CLI push.
     * @param data Array of file objects pushed by the CLI.
     */
    const updateProjectFlow = useCallback(async (data: any[]) => {
        if (!data || !pushedProjectId) {
            console.warn('Missing properties projectId or data for updateProjectFlow.')
            return;
        }

        for (const object of data) {
            await db.files.put({
                id: object.fullPath,
                path: object.fullPath,
                code: object.content || "",
                type: object.type === 'file' ? 'codeEditor' : 'folderNode',
                name: object.name,
                project_id: pushedProjectId,
                author_id,
                created_At: Date.now(),
                updated_At: Date.now()
            })
        }
    }, [pushedProjectId])

    /** Manages the WebSocket connection and event listeners. */
    const connect = useCallback(() => {
        if (reconnectionTimeout.current){
            clearTimeout(reconnectionTimeout.current);
        }

        socket_io.current = io(`ws://${WEBSOCKET_URL}`, {
            transports: ['websocket']
        });

        // --- Connection Events ---

        socket_io.current.on('connect', () => {
            setIsConnected(true);
            setSocket(socket_io.current);
            reconnectionDelay.current = RECONNECT_DELAY_MS;
            socket_io.current.emit(socketEvents.joinRoomRequest, project_id);
        });

        socket_io.current.on('disconnect', (reason: string) => {
            console.log('Connection closed:', reason);
            setIsConnected(false);
            setSocket(null);

            const delay = Math.min(reconnectionDelay.current, 30000);
            console.log(`Attempting to reconnect in ${delay / 1000} seconds...`);

            reconnectionTimeout.current = setTimeout(() => {
                reconnectionDelay.current *= 2;
                connect();
            }, delay)
        });

        socket_io.current.on('error', (err: any) => {
            console.warn('Connection error:', err);
            socket_io.current.disconnect();
        });

        // --- Logging and Status Events ---

        socket_io.current.on(socketEvents.logsBuild, (data: any) => {
            setBuildStatus('build');
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

            setBuildProcess(prev => {
                // If deployment is marked complete and we are still in 'run' status,
                // log to the 'complete' section, otherwise log to 'container_outputs'.
                if (isComplete && buildStatus === 'run'){
                    return {
                        ...prev,
                        complete: {
                            ...prev.complete,
                            logs: [...prev.complete.logs, { message: data }]
                        }
                    }
                }
                return {
                    ...prev,
                    container_outputs: {
                        ...prev.container_outputs,
                        logs: [...prev.container_outputs.logs, { message: data }]
                    }
                }
            });
        });

        socket_io.current.on(socketEvents.deployComplete, (data: boolean) => {
            setIsComplete(data);
            if (data) {
                setBuildStatus('complete');
            }
        })

        socket_io.current.on(socketEvents.deploySuccess, (data: string)=> {
            setBuildStatus(data as 'build' | 'run' | 'complete');
        });

        socket_io.current.on(socketEvents.allContainer, (data: any) => {
            setContainers(data);
            setFetchContainerLoaded(true);
            setIsRunning(false);
        })

        socket_io.current.on(socketEvents.url, ({port, hostname}: { port: number, hostname: string }) => {
            setDeployedUrl({ port, hostname })
        })

        // --- File Push Events ---

        socket_io.current.on(socketEvents.startPush, () => {
            // Clear mutable ref and state for a new push
            pushedFilesRef.current = [];
            setPushedFiles([]);
            setPushedProjectId('');
        })

        socket_io.current.on(socketEvents.projectCliPush, (data: any) => {
            pushedFilesRef.current.push(data)
        })

        socket_io.current.on(socketEvents.pushComplete, async (data: { id: string }) => {
            setPushedProjectId(data.id);
            // Update the React state with the contents of the ref
            setPushedFiles(pushedFilesRef.current);
        })
    }, [project_id])


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

    // --- Memoized Context Value ---

    const contextValue: SocketContextType = useMemo(() => ({
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
        updateProjectFlow,
        pushedFiles,
        setPushedProjectId,
        pushedProjectId,
    }), [
        isConnected, error, message, socket, buildMessages, containers, fetchContainerLoaded,
        buildProcess, buildStatus, isComplete, deployedUrl, containerOutputs, updateProjectFlow,
        pushedFiles, pushedProjectId,
    ]);

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    )

}

/**
 * Custom hook to consume the socket context state.
 * @returns The socket context value.
 */
export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useSocket() must be wrapped within the SocketProvider')
    }
    return context
};
