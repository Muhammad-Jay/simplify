// import { Octokit } from "octokit"
//
// const octokit = new Octokit({
//     auth: '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'
// });
//
// export async function get(){
//     try {
//         const result = await octokit.request(`GET /repos/{owner}/{repo}/trees/{tree_sha}?recursive=1`, {
//             owner: "Muhammad-Jay",
//             repo: "Project_Next_Simplify-AI",
//             tree_sha: 'main',
//             per_page: 2,
//             headers: {
//                 'X-GitHub-Api-Version': '2022-11-28',
//                 'Accept': 'application/vnd.github.v3.raw'
//             }
//         });
//
//         if (!result) {
//             console.log('no tree repo found.')
//             return;
//         }
//
//         const treeData = await result.json()
//         const files = await treeData.tree.filter((tree) => tree.type === 'blob')
//
//         const fileContentPromises = files.map(async (file) => {
//             const contentResponse = await octokit.request(`GET /repos/{owner}/{repo}/contents/{path}`, {
//                 owner: "Muhammad-Jay",
//                 repo: "Project_Next_Simplify-AI",
//                 path: file.path,
//                 per_page: 2,
//                 headers: {
//                     'X-GitHub-Api-Version': '2022-11-28',
//                     'Accept': 'application/vnd.github.v3.raw'
//                 }
//             });
//
//             const contentData = await contentResponse.json()
//             const decodedContent = Buffer.from(contentData.content, 'base64').toString('utf-8')
//
//             return { path: `/${file.path}`, content: decodedContent };
//         });
//
//         const fileContent = await Promise.all(fileContentPromises);
//         console.log(fileContent);
//         return fileContent
//     } catch (error) {
//         console.log(error)
//         return null;
//     }
// }
//
