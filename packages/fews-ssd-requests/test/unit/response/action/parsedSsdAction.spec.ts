import { describe, expect, it } from "vitest";
import { parseSsdActionResult } from "../../../../src/response/action/parsedSsdAction";
import type { SsdActionResult } from "../../../../src/response/action/ssdActionResponse";

describe("parseSsdActionResult", () => {
  it("maps select topology node action to typed action", () => {
    const rawAction = {
      type: "SELECT_TOPOLOGY_NODE_BY_ID",
      requests: [
        {
          request: "test-node",
        },
      ],
    } satisfies SsdActionResult;

    expect(parseSsdActionResult(rawAction)).toEqual({
      type: "SELECT_TOPOLOGY_NODE_BY_ID",
      nodeId: "test-node",
    });
  });

  it("returns undefined for unsupported action type", () => {
    const rawAction = {
      type: "WEBOC_DASHBOARD",
      requests: [{ request: "dashboard-id" }],
    } satisfies SsdActionResult;

    expect(parseSsdActionResult(rawAction)).toBeUndefined();
  });

  it("returns undefined when node id is missing", () => {
    const rawAction = {
      type: "SELECT_TOPOLOGY_NODE_BY_ID",
      requests: [],
    } satisfies SsdActionResult;

    expect(parseSsdActionResult(rawAction)).toBeUndefined();
  });
});
