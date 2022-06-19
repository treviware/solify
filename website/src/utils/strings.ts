const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]+$/;

export function isBase58(text: string): boolean {
    return BASE58_REGEX.test(text);
}