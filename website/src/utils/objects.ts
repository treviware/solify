export function reverseEnum(obj: Record<string, string>): Record<string, string> {
    const result: Record<string, string> = {};

    for (const key in obj) {
        result[obj[key]] = key;
    }

    return result;
}