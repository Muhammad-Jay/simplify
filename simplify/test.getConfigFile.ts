// 'use server'
// import fs from 'fs';
// import path from 'path';
// import process from 'process'
//
// export async function getConfigFile(dir: string){
//     const file_name = 'simplify.config.json'
//     const currentDirPath = dir;
//     const currentDirName = path.basename(currentDirPath);
//     const fullPath = path.join(currentDirPath, file_name)
//
//     try{
//         return fs.readFileSync(fullPath);
//     }catch (e) {
//         return null
//     }
//
// }