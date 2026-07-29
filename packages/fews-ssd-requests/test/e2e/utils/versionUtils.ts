export function isBelowVersion(minVersion: string): boolean {
    const fewsVersion = import.meta.env.VITE_FEWS_VERSION ?? globalThis.process?.env?.FEWS_VERSION ?? "";
    return fewsVersion < minVersion;
}
