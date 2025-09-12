'use server'

import { spawn } from 'child_process';
import fs from 'fs'
import path from 'path'
import { WebSocket } from 'ws'

const platformName = 'simplify'

const wss = new WebSocket('ws://localhost:8080')

function sendMessage(data: any){
    // wss.on('open', (ws) => {
        wss.send(JSON.stringify({type: 'build', message: data}))
    // })
}

export async function runContainer(projectTmpDir: string, projectName: string, containerName: string){
    // wss.onopen = async () => {
        await stopContainer(projectName, containerName, projectTmpDir);
    // }
}

async function stopContainer(projectName: string, containerName: string, projectTmpDir: string){
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
            // sendMessage("container stopped")
        })
        stop.stderr.on('data', (data) => {
            console.error(`container stop error: \n ${data}`);
            // sendMessage("container does not exist.")
        })
        stop.on('close', (code) => {
            if(code === 0){
                console.log(`container stopped successful \n code: ${code}`)
                // sendMessage(`container stopped successful`)
                rmContainer(projectName, containerName, projectTmpDir);
            }else {
                console.error(`container stopped unsuccessful \n code: ${code}`)
                // sendMessage(`container stopped unsuccessful.`)
                buildImage(projectTmpDir, projectName, containerName)
            }
        })
    }catch (e) {
        console.log('stop error: \n', e)
    }
}

async function rmContainer(projectName: string, containerName: string, projectTmpDir: string){
    const rmArgs = [
        'rm',
        `${projectName}`
    ]

    try {
        const rm = spawn('podman', rmArgs, {
            shell: false
        })

        rm.stdout.on('data', (data) => {
            // sendMessage("container removed")
            console.log(`container rm output: \n ${data}`);
        })
        rm.stderr.on('data', (data) => {
            // sendMessage("cannot remove container as it does not exist")
            console.error(`container rm error: \n ${data}`);
        })
        rm.on('close', (code) => {
            if(code === 0){
                console.log(`container remove successful \n code: ${code}`)
                buildImage(projectTmpDir, projectName, containerName)
            }else {
                console.error(`container remove unsuccessful \n code: ${code}`)
            }
        })
    }catch (e) {
        console.log('rm error: \n', e)
    }
}

async function buildImage(projectTmpDir: string, projectName: string, containerName: string){
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
            console.log(`container output: \n ${data}`);
        })
        buildProcess.stderr.on('data', (data) => {
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
                run(projectName, containerName, projectTmpDir)
            }else {
                console.error(`command unsuccessful \n code: ${code}`)
            }
        })
    }catch (e) {
        console.error(e)
    }
}


async function run(projectName: string, containerName: string, projectTmpDir: string){
    const runArgs = [
        'run',
        '--name',
        `${projectName}`,
        '--restart=unless-stopped',
        '-p',
        '8080:8000',
        `${platformName}-${projectName}:latest`
    ]

    console.log('running the podman container...')

    try {
        const buildProcess = spawn('podman', runArgs, {
            shell: false
        })

        buildProcess.stdout.on('data', (data) => {
            console.log(`container output: \n ${data}`);
        })
        buildProcess.stderr.on('data', (data) => {
            console.error(`container error: \n ${data}`);
        })
        buildProcess.on('close', (code) => {

            console.log('deleting temporary directory...');
            // if (fs.existsSync(projectTmpDir)) {
            //     fs.rmSync(projectTmpDir, { recursive: true });
            //     console.log(`successfully delete ${projectTmpDir}`);
            // }
            if(code === 0){
                console.log(`command successful \n code: ${code}`)
            }else {
                console.error(`command unsuccessful \n code: ${code}`)
            }
        })
    }catch (e) {
        console.error(e)
    }
}