'use server'

import {exec, spawn} from 'child_process';
import {promisify} from 'util'
import {sendMessage} from "@/lib/podman_actions/run_podman";
import {buildImage} from "@/lib/podman_actions/process/build";
import {rmContainer} from "@/lib/podman_actions/process/remove";

const process = promisify(exec);

export async function stopContainer(projectName: string, containerName: string, projectTmpDir: string, port: number){
    const stopArgs = [
        'stop',
        `${projectName}`
    ]

    try {
        const stop = spawn('podman', stopArgs, {
            shell: false
        })

        stop.stdout.on('data', (data) => {
            console.log(`container stop output: \n ${data}`);
            sendMessage("container stopped")
        })
        stop.stderr.on('data', (data) => {
            console.error(`container stop error: \n ${data}`);
            sendMessage("container does not exist.")
        })
        stop.on('close', (code) => {
            if(code === 0){
                console.log(`container stopped successful \n code: ${code}`)
                sendMessage(`container stopped successful`)
                rmContainer(projectName, containerName, projectTmpDir, port);
            }else {
                console.error(`container stopped unsuccessful \n code: ${code}`)
                sendMessage(`container stopped unsuccessful.`)
                buildImage(projectTmpDir, projectName, containerName, port)
            }
        })
    }catch (e) {
        console.log('stop error: \n', e)
    }
}

export async function stop(projectName: string){
    const command = `podman stop ${projectName}`

    const { stdout, stderr } = await process(command);
    if (stderr){
        console.log('Exec error:', stderr);
        return ''
    }
    return stdout.toString()
}