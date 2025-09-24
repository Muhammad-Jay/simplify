'use server'

import {exec, spawn} from 'child_process';
import {promisify} from 'util'
import {disconnect, sendMessage} from "@/lib/podman_actions/run_podman";

const platformName = 'simplify'
const process = promisify(exec);

export async function runProject(projectName: string, containerName: string, projectTmpDir: string, port: number){
    const runArgs = [
        'run',
        '--name',
        `${projectName}`,
        '--restart=unless-stopped',
        '-p',
        `${port}:8000`,
        `${platformName}-${projectName}:latest`
    ]

    console.log('running the podman container...')

    try {
        const buildProcess = spawn('podman', runArgs, {
            shell: false
        })

        buildProcess.stdout.on('data', (data) => {
            sendMessage(data.toString().trim())
            console.log(`container output: \n ${data}`);
        })
        buildProcess.stderr.on('data', (data) => {
            sendMessage(data.toString().trim())
            console.error(`container error: \n ${data}`);
        })
        buildProcess.on('close', (code) => {
            disconnect();
            console.log('deleting temporary directory...');
            // if (fs.existsSync(projectTmpDir)) {
            //     fs.rmSync(projectTmpDir, { recursive: true });
            //     console.log(`successfully delete ${projectTmpDir}`);
            // }
            if(code === 0){
                sendMessage('container running successfully.')
                console.log(`command successful \n code: ${code}`)
            }else {
                sendMessage('the process was unsuccessful.')
                console.error(`command unsuccessful \n code: ${code}`)
            }
        })
    }catch (e) {
        console.error(e)
    }
}

export async function run(projectName: string){
    const command = `podman run --name ${projectName} --restart=unless-stopped -p 8080:8000 ${platformName}-${projectName}:latest`

    const { stdout, stderr } = await process(command);
    if (stderr){
        sendMessage(stderr.toString())
        console.log('Exec error:', stderr);
        return ''
    }
    sendMessage(stdout.toString());
    return stdout.toString()
}