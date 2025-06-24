// ws-server.ts
import { WebSocketServer } from "ws";
import { createServer } from "http";
import {GenAiResponse} from "@/lib/AI/generativeAI";

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("🔗 Client connected");

    ws.on("message", async (message: string) => {
        console.log("📩 Received:", message.toString());
        const response = await GenAiResponse([])

        if (response){
            ws.send(response);
            console.log(response)
        }
    });

    ws.on("close", () => {
        console.log("❌ Client disconnected");
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`✅ WebSocket server running at ws://localhost:${PORT}`);
});
