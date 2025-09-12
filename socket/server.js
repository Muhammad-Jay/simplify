import { createServer } from 'http';
import { parse } from 'url'
import next from 'next';
import Websocket from 'ws';

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

    const wss = new Websocket.Server({server})

    wss.on("connection",(ws) => {
        ws.emit('success')

        ws.on("message", (data) => {
            const parseData = JSON.parse(data)
        })
    })

    server.listen(port, (err) => {
        if(err) throw err;
        console.log(`server ready on http://${hostname}:${port}`)
    })
})

