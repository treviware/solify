import {Connection, PublicKey} from '@solana/web3.js';
import {Account, AccountLayout, AccountState, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {Metadata, PROGRAM_ID} from '@metaplex-foundation/mpl-token-metadata';
import {WalletTokenMetadata} from 'stores/wallets';

export async function deriveMetadataAccountKey(account: PublicKey): Promise<PublicKey> {
    const result = await PublicKey.findProgramAddress(
        [Buffer.from('metadata'), PROGRAM_ID.toBuffer(), account.toBuffer()], PROGRAM_ID);

    return result[0];
}

export async function loadWalletTokens(connection: Connection, wallet: PublicKey): Promise<Account[]> {
    const tokens = await connection.getTokenAccountsByOwner(wallet, {
        programId: TOKEN_PROGRAM_ID,
    });

    return tokens.value.map(token => {
        const data = AccountLayout.decode(token.account.data);

        return {
            address: token.pubkey,
            mint: data.mint,
            owner: data.owner,
            amount: data.amount,
            delegate: data.delegateOption ? data.delegate : null,
            delegatedAmount: data.delegatedAmount,
            isInitialized: data.state !== AccountState.Uninitialized,
            isFrozen: data.state === AccountState.Frozen,
            isNative: !!data.isNativeOption,
            rentExemptReserve: data.isNativeOption ? data.isNative : null,
            closeAuthority: data.closeAuthorityOption ? data.closeAuthority : null,
        };
    });
}

export async function loadMetadataAccounts(connection: Connection,
                                           accounts: PublicKey[]): Promise<(WalletTokenMetadata | null)[]> {
    const metaAccounts = await connection.getMultipleAccountsInfo(accounts);

    let index = 0;
    return metaAccounts.map(account => {
        if (account == null) {
            return null;
        }

        try {
            const data = Metadata.fromAccountInfo(account);
            const pretty = data[0].pretty();
            pretty.data.name = pretty.data.name.replace(/\x00/g, '');
            pretty.data.symbol = pretty.data.symbol.replace(/\x00/g, '');
            pretty.data.uri = pretty.data.uri.replace(/\x00/g, '');

            return {
                address: accounts[index++],
                key: data[0].key,
                updateAuthority: data[0].updateAuthority,
                mint: data[0].mint,
                data: pretty.data,
                primarySaleHappened: pretty.primarySaleHappened,
                isMutable: pretty.isMutable,
                editionNonce: pretty.editionNonce,
                tokenStandard: pretty.tokenStandard,
                collection: pretty.collection,
                uses: pretty.uses,
            };
        } catch (_) {
            return null;
        }
    });
}