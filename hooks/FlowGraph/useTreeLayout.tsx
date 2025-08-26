// import { useCallback } from 'react'
// import { Node, Edge } from '@xyflow/react'
//
// import * as d3 from 'd3-hierarchy';
//
// type TreeNode = {
//     id: string,
//     children?: TreeNode[]
// }
//
// export function useTreeLayout(
//     nodes: Node[],
//     edges: Edge[],
//     setNodes: any
// ){
//     const applyTreeLayout = useCallback(() => {
//         if (nodes.length === 0 ) return;
//
//         const nodeMap = new Map(nodes.map((n) => [n.id, {...n, children: []}]));
//
//         const root: TreeNode[] = []
//         edges.forEach((edge) => {
//             const parent = nodeMap.get(edge.source)
//             const child = nodeMap.get(edge.target)
//
//             if (parent && child){
//                 (parent.children ||=[]).push(child);
//             }
//         })
//
//         const target = new Set(edges.map((e) => e.target))
//         const rootNodes = nodes.filter((n) => !target.has(n.id))
//
//         const virtualRoot: TreeNode = {
//             id: 'virtual-root',
//             children: rootNodes.map((r) => nodeMap.get(r.id)).filter(Boolean) as TreeNode[]
//         };
//
//         const roott = d3.hierarchy(virtualRoot);
//         const layout = d3.tree<TreeNode>().nodeSize([150, 100]);
//         const treeData = layout(roott)
//
//         const position = new Map()
//         treeData.descendants().forEach((d) => {
//             if (d.data.id !== 'virtual-root'){
//                 position.set(d.data.id, { x: d.x, y: d.y })
//             }
//         })
//
//         setNodes((prev) => prev.map((node) => {
//             const pos = position.get(node.id)
//             if (pos) return node;
//             return {
//                 ...node,
//                 position: {
//                     x: pos.x,
//                     y: pos.y
//                 },
//                 positionAbsolute: undefined
//             }
//         }))
//
//     }, [nodes, edges, setNodes])
//
//     return applyTreeLayout;
// }
