'use server'
import { exec } from 'child_process'
import { promisify } from 'util'

const command = 'podman ps --all --format=json'

const wss = new WebSocket('ws://localhost:8080')

const process = promisify(exec);
export async function getAllContainers(){
    const { stdout, stderr } = await process(command);
    if (stderr){
        console.log('Exec error:', stderr);
        return []
    }
    const data = stdout.toString();
    console.log(data);
    return data || []
}