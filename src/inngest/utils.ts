import { Connections, Node } from "@/generated/prisma";
import toposort from "toposort";

export const topologicalSort = (
    nodes: Node[],
    connections: Connections[],
): Node[] => {
    if (nodes.length === 0) return [];

    const nodeIds = nodes.map(n => n.id);
    const edges: [string, string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId
    ]);

    const sortedNodeIds = toposort.array(nodeIds, edges);
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
}