import { exec } from 'child_process'

const command = 'podman ps --all --format=json'

export async function GET(req, res){
    exec(command, async (error, stdout, stderr) => {
        if (error){
            console.error('exec error:', error)
            return []
        }
        try {
            // const parsedErr = JSON.parse(stderr);
            if (stderr){
                console.log(error);
                return [];
            }else if (stdout) {
                console.log('test err:', stdout)
                return Response.json(stdout)
            }
        }catch (e) {
            console.log(e)
            return []
        }
    })
}