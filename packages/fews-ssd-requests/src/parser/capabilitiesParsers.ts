import { ResponseParser } from "./responseParser";
import {SsdGetCapabilitiesResponse} from "@/response";


export class CapabilitiesParsers implements ResponseParser<SsdGetCapabilitiesResponse> {
    private excludedGroups: string[];

    constructor(excludedGroups: string[]) {
        this.excludedGroups = excludedGroups;
    }

    async parse(response: any): Promise<SsdGetCapabilitiesResponse> {
        const capabilities: SsdGetCapabilitiesResponse = await response.json();
        const filteredDisplayGroups = capabilities.displayGroups.filter(
            (g) => { return !this.excludedGroups.includes(g.name) }
        )
        capabilities.displayGroups = filteredDisplayGroups;
        return capabilities;
    }
}
