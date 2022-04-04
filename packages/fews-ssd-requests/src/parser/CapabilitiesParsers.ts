import ResponseParser from "../parser/ResponseParser";
import {Capabilities} from "@/data";

export default class CapabilitiesParsers implements ResponseParser<Capabilities> {
    private excludedGroups: string[];

    constructor(excludedGroups: string[]) {
        this.excludedGroups = excludedGroups;
    }

    async parse(response: any): Promise<Capabilities> {
        const capabilities: Capabilities = await response.json();
        const filteredDisplayGroups = capabilities.displayGroups.filter(
            (g) => { return !this.excludedGroups.includes(g.name) }
        )
        capabilities.displayGroups = filteredDisplayGroups;
        return capabilities;
    }
}