const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]+$/;

export function isBase58(text: string): boolean {
    return BASE58_REGEX.test(text);
}

export function encodeToURI(text: string): string {
    return text.replace(/\+/g, '%2B').replace(/\//g, '%2F').replace(/=/g, '%3D');
}

export function encodeToCssId(text: string): string {
    return text.replace(/\W/g, '_');
}