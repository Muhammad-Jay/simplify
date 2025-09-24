'use server'

import {stopContainer} from "@/lib/podman_actions/process/stop";
import io from 'socket.io-client'

const platformName = 'simplify'

const socket_client = io('ws://localhost:8000');

export async function sendMessage(data: any){
        socket_client.emit('build_logs_client', { type: 'build', message: data })
}

export async function disconnect(){

}

export async function runContainer(projectTmpDir: string, projectName: string, containerName: string, port: number){
        await stopContainer(projectName, containerName, projectTmpDir, port);
}




