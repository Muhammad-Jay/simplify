'use server'
import { exec } from 'child_process'
import { promisify } from 'util'

const command = 'podman ps --all --format=json'

const process = promisify(exec);
export async function getAllContainers(){
    const { stdout, stderr } = await process(command);
    if (stderr){
        console.log('Exec error:', stderr);
        return []
    }

    const data = stdout.toString();
    return data || []
}