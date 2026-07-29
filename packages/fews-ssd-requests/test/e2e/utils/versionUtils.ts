export function isBelowVersion(minVersion: string): boolean {
    return (process.env.FEWS_VERSION ?? "") < minVersion;
}
