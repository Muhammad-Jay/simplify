// 'use client'
// import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react'
//
// const useSocket = () => {
//     const [isConnected, setIsConnected] = useState(false);
//     const [error, setError] = useState(false);
//     const [socket, setSocket] = useState<any>(null)
//     const [message, setMessage] = useState<any>('')
//
//     useEffect(() => {
//         const wss = new WebSocket('ws://localhost:8080')
//
//         wss.onopen = () => {
//             wss.send(JSON.stringify({message: "i'm successfully connected on client side."}))
//             setIsConnected(true);
//             setSocket(wss);
//         }
//
//         wss.onmessage = (data) => {
//             setMessage(data.data);
//             console.log(data.data)
//         }
//
//         wss.onclose = () => {
//             console.log('socket disconnected.')
//             setIsConnected(false);
//             setSocket(null)
//         }
//
//         wss.onerror = (err) => {
//             setError(true);
//             setSocket(true);
//         }
//
//         // return () => wss.close()
//     }, [])
//
//     return {
//         isConnected,
//         error,
//         message,
//         socket
//     }
// }
// export default useSocket
