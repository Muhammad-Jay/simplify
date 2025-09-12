import { createServer } from 'http';
import WebSocket, {WebSocketServer} from 'ws';

const hostname = '0.0.0.0';
const port = 8000;

const wss = new WebSocket.Server({port})

console.log('Websocket server is running. Ready to broadcast messages.')

wss.on("connection",(ws) => {
    console.log('A client connection was made.')

    ws.on("message", (data) => {

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                ws.send(data)
                console.log('sending message to clients.')
            }
        })
    })
})

wss.on('close', () => {
    console.log('A client disconnected.');
})

wss.on('error', (error) => {
    console.error('Websocket error:', error);
})