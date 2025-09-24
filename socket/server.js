import { createServer } from 'http';
import { parse } from 'url'
import next from 'next';
import Websocket, { WebSocketServer } from 'ws';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    })

    const wss = new WebSocketServer({ server })

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

    server.listen(port, (err) => {
        if(err) throw err;
        console.log(`server ready on http://${hostname}:${port}`)
    })
})

