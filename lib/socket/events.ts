import {SocketEventsTypes} from "@/types/socket.events";

export const socketEvents: SocketEventsTypes = {
    deployRequest: 'deploy:request',
    deployStatus: 'deploy:status',
    deploySuccess: 'deploy:success',
    deployError: 'deploy:error',
    deployStop: 'deploy:stop',
    deployComplete: 'deploy:complete',

    containerOutput: 'containerOutput',
    startContainerOutput: 'startContainerOutput',

    cLIPush: 'cli:push',
    projectCliPush: 'projectCli:push',
    pushComplete: 'push:complete',
    startPush: 'start:push',

    logsStop: 'logs:stop',
    logsRemove: 'logs:remove',

    logsBuild: 'logs:build',
    logsRun: 'logs:run',

    allContainer: 'container:all',
    container: 'container:single',

    url: 'url',

    joinRoomRequest: 'join_room_request',
}