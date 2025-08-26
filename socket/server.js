import { createServer } from 'http';
import { parse } from 'url'
import next from 'next';
import { Server } from 'socket.io';

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

    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('message_from_client', (message) => {
            console.log(message);
            socket.emit('message_from_server', `server received: ${message}`);
        })

        socket.on('disconnect', () => {
            console.log('connection disconnected')
        });
    });

    server.listen(port, (err) => {
        if(err) throw err;
        console.log(`server ready on http://${hostname}:${port}`)
    })
})

