import {Keypair} from '@solana/web3.js';
import {isBase58} from 'src/utils/strings';

export interface VanityAddressRule {
    type: 'startsWith' | 'endsWith' | 'contains';
    value: string;
    maxDifferentChars: number;
    insensitive: boolean;
}

export interface VanityAddressResult {
    rule: number;
    keypair: Keypair;
}

export type VanityAddressMessage =
    VanityAddressStartMessage
    | VanityAddressResultMessage;

export interface VanityAddressStartMessage {
    message: 'start';
    rules: VanityAddressRule[];
}

export interface VanityAddressResultMessage {
    message: 'result';
    value: VanityAddressResult;
}

export function encodeVanityAddressRules(rules: VanityAddressRule[]): string {
    const result: string[] = [];

    for (const rule of rules) {
        const encoding = `${rule.insensitive ? 'i' : 'x'}${rule.maxDifferentChars}:${rule.value}`;

        switch (rule.type) {
            case 'startsWith':
                result.push(`s${encoding}`);
                break;
            case 'endsWith':
                result.push(`e${encoding}`);
                break;
            case 'contains':
                result.push(`c${encoding}`);
                break;

        }
    }

    return result.join(',');
}

export function decodeVanityAddressRules(rulesStr: string): VanityAddressRule[] {
    const rulesStrList = rulesStr.split(',');
    const results: VanityAddressRule[] = [];

    for (const ruleStr of rulesStrList) {
        const [type, value] = ruleStr.split(':');
        const result: VanityAddressRule = {
            type: 'startsWith',
            value,
            insensitive: true,
            maxDifferentChars: 0,
        };

        switch (type[0]) {
            case 's':
                result.type = 'startsWith';
                break;
            case 'e':
                result.type = 'endsWith';
                break;
            case 'c':
                result.type = 'contains';
                break;
            default:
                throw new Error(`Invalid vanity address type: ${type[0]} of rule ${ruleStr}`);
        }

        switch (type[1]) {
            case 'i':
                result.insensitive = true;
                break;
            case 'x':
                result.insensitive = false;
                break;
            default:
                throw new Error(`Invalid vanity address insensitive flag: ${type[1]} of rule ${ruleStr}`);
        }

        const maxDifferentCharsStr = type.substring(2);
        const maxDifferentChars = parseInt(maxDifferentCharsStr);
        if (isNaN(maxDifferentChars)) {
            throw new Error(`Invalid vanity address max different chars: ${maxDifferentCharsStr} of rule ${ruleStr}`);
        }

        result.maxDifferentChars = maxDifferentChars;

        if (result.value !== '' && !isBase58(result.value)) {
            throw new Error(`Invalid vanity address value: ${value} of rule ${ruleStr}`);
        }

        results.push(result);
    }

    return results;
}