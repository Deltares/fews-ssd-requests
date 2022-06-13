import {JsonParser} from "../parser/JsonParser.js";
import {Capabilities} from "../data/capabilities/Capabilities.js";

export class CapabilitiesParsers implements JsonParser<Capabilities> {
    private excludedGroups: string[];

    constructor(excludedGroups: string[]) {
        this.excludedGroups = excludedGroups;
    }

    async parse(response: any): Promise<Capabilities> {
        const capabilities = await response.json();
        const displayGroups = capabilities.displayGroups;
        const filteredDisplayGroups = [];
        for (const displayGroup of displayGroups) {
            const exclude: boolean = this.excludedGroups.find(name => name === displayGroup.name) !== undefined;
            if (exclude) continue;
            filteredDisplayGroups.push(displayGroup);
        }
        capabilities.displayGroups = filteredDisplayGroups;
        return capabilities;
    }
}
