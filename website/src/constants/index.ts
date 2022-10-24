import {PublicKey} from '@solana/web3.js';
import BN from 'bn.js';

export const MAX_SPL_DECIMALS = 64;
export const MAX_LAST_SPL_TOKENS = 9;

export const DRAWER_SETTINGS_KEY = 'drawer';
export const NETWORK_SETTINGS_KEY = 'network';
export const EXTRA_NETWORKS_SETTINGS_KEY = 'extraNetworks';
export const COMMITMENT_SETTINGS_KEY = 'commitment';
export const VS_CURRENCY_SETTINGS_KEY = 'vsCurrency';
export const PINNED_TOOLS_KEY = 'pinned';
export const WALLET_AUTO_CONNECT = 'walletAutoConnect';
export const PREFERRED_EXPLORER = 'preferredExplorer';

export const LEFT_MENU_WIDTH = 200;
export const RIGHT_DRAWER_WIDTH = 660;
export const MIN_CONTENT_SIZE = 800;

export const MAX_RECENT_TOOLS = 4;
export const MAX_PINNED_TOOLS = MAX_RECENT_TOOLS - 1;

export const TOOL_DATA_URI_PREFIX = 't:';

export const MAX_VANITY_ADDRESS_WORKERS = 2;
export const MAX_VANITY_ADDRESS_RESULTS = 100;

export const FEE_WALLET = new PublicKey('J9jmbBNteRipLSvPUixb391ao6z21uAVYHfpfn6BiFjm');
export const TIP_AMOUNT_PER_TRANSACTION = new BN(10_000);

export const SOLIFY_PROGRAM_ADDRESS = new PublicKey('SLFYqc5myLPN9XwXcM2tbGiNdop22HDhak3tbmN1P4J');