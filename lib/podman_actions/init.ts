'use server'

import path from 'path'
import fs from 'fs'
import os from 'os'
import {runContainer} from "@/lib/podman_actions/run_podman";
import {containerFileWithWS, simpleContainerFile} from "@/lib/podman_actions/constants";

const fileName = 'Dockerfile'
const DIR_PATH = path.join(os.tmpdir(),'Simplify/users/projects')

export type TreeType = {
    type: "file" | "folder",
    name: string,
    content?: string,
    fullPath: string
}

export type InitializeBuildProcessType = {
    projectId: string,
    tree: TreeType[],
    projectName: string,
    containerName: string,
    port: number
}

function createTmpDir(dir: string){
    try{
        if (!fs.existsSync(dir)){
            // Create temporary directory in default operating system tmp directory
            fs.mkdirSync(dir, { recursive: true });
            console.log('temporary directory created')
        }
    }catch (e) {
        console.log(e)
    }
}


export async function initializeBuildProcess({projectId, containerName, projectName, tree, port}: InitializeBuildProcessType){
    if (!projectId || !tree) return;

    console.clear();

    const projectTmpDir = path.join(DIR_PATH, projectId);
    const formatedTree = [...tree, {
        type: 'file',
        content: containerFileWithWS,
        name: fileName,
        fullPath: `${projectName}/${fileName}`
    }]

    try {
        createTmpDir(projectTmpDir)
            console.log(projectTmpDir)
            // Write files and folders to temporary directory
            formatedTree.map(dir => {
                const fullPath = path.join(projectTmpDir, dir.fullPath)
                if(dir.type === 'file'){
                    try {
                        const parentDir = path.dirname(fullPath)
                        console.log({fullPath, parentDir})
                        fs.mkdirSync(parentDir, {recursive: true});
                        fs.writeFileSync(fullPath, dir.content, 'utf8');
                    }catch (e) {
                        console.log(e)
                        console.log(fullPath)
                    }
                }else if(dir.type === 'folder'){
                    try {
                        fs.mkdirSync(fullPath, {recursive: true});
                    }catch (e) {
                        console.log(e)
                    }
                }
            })

        // Run podman build command
        await runContainer(projectTmpDir, projectName, containerName, port)

    }catch (e) {
        console.error('Build Error', e)
    }
}