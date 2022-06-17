import BN from 'bn.js';

export function formatBasisPoints(basisPoints: BN, decimals: number): string {
    try {
        let amount = basisPoints.toString();

        if (amount.length > decimals) {
            amount = amount.slice(0, amount.length - decimals) + '.' + amount.slice(amount.length - decimals);
        } else {
            amount = '0.' + '0'.repeat(decimals - amount.length) + amount;
        }

        while (amount.endsWith('0')) {
            amount = amount.slice(0, amount.length - 1);
        }

        if (amount.endsWith('.')) {
            amount = amount.slice(0, amount.length - 1);
        }

        amount.trimRight();

        return amount;
    } catch (e) {
        return '0';
    }
}