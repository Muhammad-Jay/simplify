import {TreeType} from "@/lib/podman_actions/init";
import {socketEvents} from "@/lib/socket/events";

type DeployRequestDataType = {
    projectId: string;
    projectName: string;
    tree: TreeType[]
}

export const onDeployRequest = (data: DeployRequestDataType, socket: any) => {
    socket.emit(socketEvents.deployRequest, data);
}