export type SocketEventsTypes = {
    deployRequest: 'deploy:request',
    deployStatus: 'deploy:status',
    deploySuccess: 'deploy:success',
    deployError: 'deploy:error',
    deployStop: 'deploy:stop',
    deployComplete: 'deploy:complete',

    containerOutput: 'containerOutput',
    startContainerOutput: 'startContainerOutput',

    logsStop: 'logs:stop',
    logsRemove: 'logs:remove',

    cLIPush: 'cli:push',

    logsBuild: 'logs:build',
    logsRun: 'logs:run',

    allContainer: 'container:all',
    container: 'container:single',

    url: 'url',

    joinRoomRequest: 'join_room_request',
}