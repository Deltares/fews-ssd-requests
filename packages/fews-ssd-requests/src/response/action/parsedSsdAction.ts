import { SsdActionResult } from "./ssdActionResponse.js";

export interface SelectTopologyNodeByIdAction {
  type: "SELECT_TOPOLOGY_NODE_BY_ID";
  nodeId: string;
}

export type ParsedSsdAction = SelectTopologyNodeByIdAction;

/**
 * Parse a raw SSD action result into a strongly typed action used by Web OC consumers.
 */
export function parseSsdActionResult(
  rawAction: SsdActionResult
): ParsedSsdAction | undefined {
  if (rawAction.type !== "SELECT_TOPOLOGY_NODE_BY_ID") {
    return undefined;
  }

  const nodeId = rawAction.requests?.[0]?.request;
  if (nodeId == null || nodeId === "") {
    return undefined;
  }

  return {
    type: "SELECT_TOPOLOGY_NODE_BY_ID",
    nodeId,
  };
}
