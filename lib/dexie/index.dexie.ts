import Dexie, { Table } from 'dexie'

export interface WorkSpaceProjectInterface {
    id: string;
    name: string;
    ports: any[],
    project_id: string | any;
    author_id: string;
    created_At?: string | number;
    updated_At: string | number;
}

export interface FileInterface {
    id: string;
    path: string;
    code: string;
    type: string;
    name: string;
    project_id: string | any;
    author_id: string;
    created_At?: string | number;
    updated_At: string | number;
}

export interface RecentActiveNodes {
    pathName: string;
    project_id: string | any;
    author_id: string;
    name: string;
    created_At?: string | number;
    updated_At: string | number;
}

export interface Nodes {
    id: string;
    node: any;
    project_id: string | any;
    author_id: string;
    created_At?: string | number;
    updated_At: string | number;
}

export interface Edges {
    id: string;
    edge: any;
    project_id: string | any;
    author_id: string;
    created_At?: string | number;
    updated_At: string | number;
}

export interface WorkFlow {
    id: string;
    author_id: string;
    name: string;
    created_At?: string | number;
    updated_At: string | number;
}

const DN_NAME = 'Simplify'

export class FlowDB extends Dexie {
    files!: Table<FileInterface>;
    recentActiveNodes: Table<RecentActiveNodes>;
    nodes: Table<Nodes>;
    edges: Table<Edges>;
    userEdges: Table<Edges>;
    workSpaceProjects: Table<WorkSpaceProjectInterface>;
    workFlows: Table<WorkFlow>;

    constructor() {
        super(DN_NAME);
        this.version(1).stores({
            files: '&id, path, code, type, name, project_id, author_id, created_At, updated_At',
        });

        this.version(2).stores({
            recentActiveNodes: '&pathName, name, project_id, author_id, created_At, updated_At'
        });

        this.version(3).stores({
            nodes: '&id, node, project_id, author_id, created_At, updated_At'
        });

        this.version(4).stores({
            edges: '&id, edge, project_id, author_id, created_At, updated_At'
        });

        this.version(5).stores({
            userEdges: '&id, edge, project_id, author_id, created_At, updated_At'
        });

        this.version(5).stores({
            workSpaceProjects: '&id, name, ports, project_id, author_id, created_At, updated_At'
        });

        this.version(5).stores({
            workFlows: '&id, name, author_id, created_At, updated_At'
        });
    }
}

export const db = new FlowDB()
