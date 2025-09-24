'use server'

import { spawn } from 'child_process';
import {buildImage} from "@/lib/podman_actions/process/build";
import {sendMessage} from "@/lib/podman_actions/run_podman";

const platformName = 'simplify'

export async function rmContainer(projectName: string, containerName: string, projectTmpDir: string, port: number){
    const rmArgs = [
        'rm',
        `${projectName}`
    ]

    try {
        const rm = spawn('podman', rmArgs, {
            shell: false
        })

        rm.stdout.on('data', (data) => {
            sendMessage(data.toString().trim())
            console.log(`container rm output: \n ${data}`);
        })
        rm.stderr.on('data', (data) => {
            sendMessage(data.toString().trim())
            console.error(`container rm error: \n ${data}`);
        })
        rm.on('close', (code) => {
            if(code === 0){
                console.log(`container remove successful \n code: ${code}`)
                buildImage(projectTmpDir, projectName, containerName, port)
            }else {
                console.error(`container remove unsuccessful \n code: ${code}`)
            }
        })
    }catch (e) {
        console.log('rm error: \n', e)
    }
}