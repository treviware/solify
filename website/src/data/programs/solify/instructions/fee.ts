import {PublicKey, SystemProgram} from '@solana/web3.js';
import {
    defaultInstantiateSolanaInstruction, defineInstruction, ProgramIxnData,
} from 'src/types/programs/instructionDefinition';
import {Mutable} from 'src/types/general';
import {isPubkey} from 'src/types/filters';
import {FEE_AMOUNT_PER_TRANSACTION, FEE_WALLET} from 'src/constants';
import {useWallet} from 'solana-wallets-vue';

const ACCOUNTS = [{
    id: 'source',
    name: 'Fee payer account',
    description: 'The account that will pay the fee',
    signer: true,
    mutable: true,
    data: {
        type: 'address',
    },
}, {
    id: 'destination',
    name: 'Fee account',
    description: 'The account that will receive the fee',
    signer: false,
    mutable: true,
    data: {
        type: 'address',
        defaultValue: FEE_WALLET,
    },
}] as const;

const ARGUMENTS = [{
    id: 'lamports',
    name: 'Fee amount',
    description: 'The amount of lamports to charge as fee',
    readonly: true,
    data: {
        type: 'bps',
        defaultValue: FEE_AMOUNT_PER_TRANSACTION,
        tokenAddress: PublicKey.default,
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SolifyProgramFeeIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SOLIFY_PROGRAM_FEE_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'Solify Fee',
    description: 'Sends a fee to Solify to help it to maintain and improve its services. This fee is just 2x the network fee and you can remove this instruction if you want.',
    accounts: ACCOUNTS as AccountsType,
    arguments: ARGUMENTS as ArgumentsType,

    // ------------------------------------------------------------------------
    // ACTIONS ----------------------------------------------------------------
    // ------------------------------------------------------------------------
    instantiate(ixnDefinition) {
        const wallet = useWallet();
        const data = defaultInstantiateSolanaInstruction(ixnDefinition);
        data.source = wallet.publicKey.value ?? PublicKey.default;

        return data;
    },
    build(ixnDefinition, data) {
        return SystemProgram.transfer({
            fromPubkey: isPubkey(data.source) ? data.source : data.source.publicKey,
            toPubkey: isPubkey(data.destination) ? data.destination : data.destination.publicKey,
            lamports: Number(data.lamports),
        });
    },
});