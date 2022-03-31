import JsonParser from "../parser/JsonParser";
import {Capabilities} from "@/data";

export default class CapabilitiesParsers implements JsonParser<Capabilities> {
    private excludedGroups: string[];

    constructor(excludedGroups: string[]) {
        this.excludedGroups = excludedGroups;
    }

    parse(response: any): Capabilities {
        const capabilities = response;
        const displayGroups = response.displayGroups;
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
