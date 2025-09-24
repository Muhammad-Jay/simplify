'use server'

import { spawn } from 'child_process';
import fs from 'fs'
import path from 'path'
import { runProject } from "@/lib/podman_actions/process/run";
import {sendMessage} from "@/lib/podman_actions/run_podman";

const platformName = 'simplify'

export async function buildImage(projectTmpDir: string, projectName: string, containerName: string, port: number){
    const runArgs = [
        'build',
        '-t',
        `${platformName}-${projectName}:latest`,
        `${path.join(projectTmpDir, projectName)}`
    ]

    console.log('building the podman container...')

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

            console.log('deleting temporary directory...');
            if (fs.existsSync(projectTmpDir)) {
                fs.rmSync(projectTmpDir, { recursive: true });
                console.log(`successfully delete ${projectTmpDir}`);
            }
            if(code === 0){
                console.log(`command successful \n code: ${code}`)
                sendMessage('Build successful.')
                runProject(projectName, containerName, projectTmpDir, port)
            }else {
                sendMessage('Build was unsuccessful.')
                console.error(`command unsuccessful \n code: ${code}`)
            }
        })
    }catch (e) {
        console.error(e)
    }
}