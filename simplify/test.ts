'use server'
import fs from 'fs';
import path from 'path';
// import {pushFiles} from "../lib/action.js";
import {db} from "@/lib/dexie/index.dexie";

const currentDir = process.cwd()
const mockId = 'c15acf41-1bd7-4899-be74-7f70551e644cc';
const author_id = 'jsync4172004@gmail.com'

const isDirectory = (directory: string) => {
    try{
        return fs.statSync(directory).isDirectory()
    }catch (e) {
        return false;
    }
}

const isFile = (file: string) => {
    try{
        return fs.statSync(file).isFile()
    }catch (e) {
        return false;
    }
}

const getIgnoredFile = () => {
    try{
        return fs.readFileSync('.simplify_ignore')
    }catch (e) {
        return false
    }
}

const getIgnorePaths = () => {
    const ign = getIgnoredFile()
    if(ign){
        return fs.readFileSync('.simplify_ignore', 'utf8').split('\n').map(l => l.trim()).filter(li => !li.startsWith('#')).filter(Boolean);
    }else return [];
}

const ignoredPath = (filePath: string) => {
    const list = getIgnorePaths()
    return list.includes(filePath);
}

export async function readDir(){
    let filePath = []
    let tree = []
    const currentDirName = path.basename(currentDir);
    // const configFile = getConfigFile(currentDir)
    //
    // if(!configFile){
    //     console.error('Error: unable to proceed with the push command, \n cannot find the simplify.config.json file. \n please run the init command')
    //     return;
    // }

    const fullDirContent = fs.readdirSync(currentDir);
   // console.log(fullDirContent)
    for (const fpath of fullDirContent){
        const fullPath = path.join(currentDir, fpath)
        const pathSeparator = path.sep + currentDirName + path.sep
        const formatedPath = fullPath.split(pathSeparator).pop();
       // console.log(fullPath)
        if(isDirectory(fullPath) && fpath !== 'node_modules' && !ignoredPath(fpath)){
            filePath = filePath.concat(readDir())
            tree.push({
                type: 'folder',
                name: fpath,
                fullPath: `${currentDirName}/${formatedPath}`,
            })
        }else if(isFile(fullPath) && fpath !== 'node_modules' && !ignoredPath(fpath)){
            filePath.push(fullPath)
            const content = fs.readFileSync(fullPath, 'utf8')
            tree.push({
                type: 'file',
                name: fpath,
                content,
                fullPath: `${currentDirName}/${formatedPath}`
            })
        }
    }
    // console.log(filePath)
    const project = {
        projectName: currentDirName,
        fileTree: tree,
    }

    tree.map(async (p) => {
        await db.files.put({
            id: p.fullPath,
            path: p.fullPath,
            code: p.content,
            type: p.type === 'file' ? 'codeEditor' : 'folderNode',
            name: p.name,
            project_id: mockId,
            author_id,
            created_At: Date.now(),
            updated_At: Date.now()
        })
    })
    //console.log(tree)
    return filePath;
}