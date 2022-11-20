import { Connection, PublicKey } from '@solana/web3.js';
import { Account, TOKEN_PROGRAM_ID, unpackAccount } from '@solana/spl-token';
import { Metadata, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { WalletTokenMetadata } from 'stores/tools/walletList';

export async function deriveMetadataAccountKey(account: PublicKey): Promise<PublicKey> {
  const result = await PublicKey.findProgramAddress(
    [Buffer.from('metadata'), PROGRAM_ID.toBuffer(), account.toBuffer()], PROGRAM_ID);

  return result[0];
}

export async function loadWalletTokens(connection: Connection, wallet: PublicKey): Promise<Account[]> {
  const tokens = await connection.getTokenAccountsByOwner(wallet, {
    programId: TOKEN_PROGRAM_ID
  });

  return tokens.value.map(token => unpackAccount(token.pubkey, token.account));
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
        uses: pretty.uses
      };
    } catch (_) {
      return null;
    }
  });
}