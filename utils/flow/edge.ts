import path from 'path'
import {mockFilesDataTypes} from "@/constants";
import {nanoid} from 'nanoid'
import {MarkerType} from 'reactflow'


export function generateEdges(nodes: mockFilesDataTypes[]){
    const edges = []
    const nodeMap = new Map();

    for (const node of nodes){
        nodeMap.set(node.fullPath, node.fullPath);
    }

    for (const node of nodes){
        if (node.fullPath.length === 0 || node.fullPath.indexOf(path.sep) === -1){
            continue;
        }
        const parentPath = path.dirname(node.fullPath);
        const parentId = nodeMap.get(parentPath);

        if (parentId){
            const newEdge = {
                id: nanoid(),
                source: parentId,
                target: node.fullPath,
                type: 'customEdge',
                style: {
                    stroke: '#ffffff',
                    opacity: 1,
                    strokeWidth: 3
                },
                data: {
                    parentName: parentId,
                    isVisible: false,
                    childName: node.name,
                    className: parentId,
                    label: `${parentId} >>> ${node.name}`
                }
            }
            edges.push(newEdge);
        }
    }
    return edges;
}