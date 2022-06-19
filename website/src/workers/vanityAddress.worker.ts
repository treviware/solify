import {VanityAddressMessage, VanityAddressRule} from 'src/types/tools/vanityAddress';
import {Keypair} from '@solana/web3.js';
import base58 from 'bs58';

self.onmessage = ({data}: { data: VanityAddressMessage }) => {
    if (data.message !== 'start') {
        return;
    }

    for (const rule of data.rules) {
        if (rule.insensitive) {
            (rule as any).lowercaseValue = rule.value.toLowerCase();
        }
    }

    while (true) {
        const keypair = Keypair.generate();
        const pubkey = keypair.publicKey.toBase58();
        const lowercasePubkey = pubkey.toLowerCase();

        for (let i = 0; i < data.rules.length; i++) {
            const rule = data.rules[i];

            if (evaluateRule(rule as any, pubkey, lowercasePubkey)) {
                self.postMessage({
                    message: 'result',
                    value: {
                        rule: i,
                        keypair: base58.encode(keypair.secretKey) as any,
                    },
                } as VanityAddressMessage);
            }
        }
    }
};

function evaluateRule(rule: VanityAddressRule & { lowercaseValue: string }, pubkey: string,
                      lowercasePubkey: string): boolean {
    switch (rule.type) {
        case 'startsWith':
            if (rule.insensitive) {
                if (rule.maxDifferentChars !== 0) {
                    const minChars = rule.value.length - rule.maxDifferentChars;
                    return countEqualChars(rule.lowercaseValue, lowercasePubkey) >= minChars;
                }

                return lowercasePubkey.startsWith(rule.lowercaseValue);
            } else {
                if (rule.maxDifferentChars !== 0) {
                    const minChars = rule.value.length - rule.maxDifferentChars;
                    return countEqualChars(rule.value, pubkey) >= minChars;
                }

                return pubkey.startsWith(rule.value);
            }
        case 'endsWith':
            if (rule.insensitive) {
                if (rule.maxDifferentChars !== 0) {
                    const minChars = rule.value.length - rule.maxDifferentChars;
                    return countEqualChars(rule.lowercaseValue,
                        lowercasePubkey.slice(lowercasePubkey.length - rule.lowercaseValue.length)) >= minChars;
                }

                return lowercasePubkey.endsWith(rule.lowercaseValue);
            } else {
                if (rule.maxDifferentChars !== 0) {
                    const minChars = rule.value.length - rule.maxDifferentChars;
                    return countEqualChars(rule.value, pubkey.slice(pubkey.length - rule.value.length)) >= minChars;
                }

                return pubkey.endsWith(rule.value);
            }
        case 'contains':
            if (rule.insensitive) {
                if (rule.maxDifferentChars !== 0) {
                    const minChars = rule.value.length - rule.maxDifferentChars;

                    for (let i = 0; i < lowercasePubkey.length - rule.lowercaseValue.length; i++) {
                        if (countEqualChars(rule.lowercaseValue,
                            lowercasePubkey.slice(i, i + rule.lowercaseValue.length)) >= minChars) {
                            return true;
                        }
                    }

                    return false;
                }

                return lowercasePubkey.indexOf(rule.lowercaseValue) !== -1;
            } else {
                if (rule.maxDifferentChars !== 0) {
                    const minChars = rule.value.length - rule.maxDifferentChars;

                    for (let i = 0; i < pubkey.length - rule.value.length; i++) {
                        if (countEqualChars(rule.value, pubkey.slice(i, i + rule.value.length)) >= minChars) {
                            return true;
                        }
                    }

                    return false;
                }

                return pubkey.indexOf(rule.value) !== -1;
            }
    }

    return false;
}

function countEqualChars(a: string, b: string): number {
    let count = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] === b[i]) {
            count++;
        }
    }

    return count;
}