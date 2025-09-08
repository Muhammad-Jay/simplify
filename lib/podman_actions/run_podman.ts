'use server'

import { spawn } from 'child_process';
import fs from 'fs'
import path from 'path'

export async function runContainer(projectTmpDir: string, running: boolean){
    const args = [
        'build',
        '-t',
        'simplify_test',
        //'.'
       `${path.join(projectTmpDir, 'my-next-app')}`
    ]

    console.log('running the podman container...')

    try {
        const buildProcess = spawn('podman', args, {
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
                // fs.rmSync(projectTmpDir, { recursive: true });
                console.log(`successfully delete ${projectTmpDir}`);
            }
            running = false
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