import {PublicKey, SystemProgram} from '@solana/web3.js';
import {
    defaultInstantiateSolanaInstruction, defineInstruction, ProgramIxnData,
} from 'src/types/programs/instructionDefinition';
import {Mutable} from 'src/types/general';
import {isPubkey} from 'src/types/filters';
import {FEE_WALLET, TIP_AMOUNT_PER_TRANSACTION} from 'src/constants';
import {useWallet} from 'src/lib/WalletAdapter';

const ACCOUNTS = [{
    id: 'source',
    name: 'Tip payer account',
    description: 'The account that will pay the tip',
    signer: true,
    mutable: true,
    data: {
        type: 'address',
    },
}, {
    id: 'destination',
    name: 'Tip account',
    description: 'The account that will receive the tip',
    signer: false,
    mutable: true,
    readonly: true,
    data: {
        type: 'address',
        defaultValue: FEE_WALLET,
    },
}] as const;

const ARGUMENTS = [{
    id: 'lamports',
    name: 'Tip amount',
    description: 'The amount of lamports to send as tip',
    readonly: true,
    data: {
        type: 'bps',
        defaultValue: TIP_AMOUNT_PER_TRANSACTION,
        tokenAddress: PublicKey.default,
    },
}] as const;

type AccountsType = Mutable<typeof ACCOUNTS>;
type ArgumentsType = Mutable<typeof ARGUMENTS>;

export type SolifyProgramTipIxnArgs = ProgramIxnData<AccountsType, ArgumentsType>
export const SOLIFY_PROGRAM_TIP_INSTRUCTION = defineInstruction<AccountsType, ArgumentsType>({
    name: 'Solify tip',
    description: 'Sends a tip to Solify in order to maintain and improve its services. This tip is just 2x the network tip. This action is optional, so you can remove this instruction if you want',
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