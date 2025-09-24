import { Server } from 'socket.io'

const port = 8000;

const io = new Server()

console.log('Socket server is running. Ready to broadcast messages.')

io.on("connection",(socket) => {
    console.log('A client connection was made.')
    socket.send(JSON.stringify({ type: 'build', message: "thanks for connecting." }))

    socket.on("message", (data) => {
        console.log("socket server output: \n",data)
    })
})

io.on('close', () => {
    console.log('A client disconnected.');
})

io.on('error', (error) => {
    console.error('Socket error:', error);
})

io.listen(port);

