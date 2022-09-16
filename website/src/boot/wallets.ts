import {boot} from 'quasar/wrappers';
import {
    BraveWalletAdapter,
    CoinbaseWalletAdapter,
    ExodusWalletAdapter,
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SafePalWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TrustWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {WALLET_AUTO_CONNECT} from 'src/constants';
import {SolanaWalletVuePlugin, WalletStoreProps} from 'src/lib/WalletAdapter';

const walletOptions: WalletStoreProps = {
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new BraveWalletAdapter(),
        new CoinbaseWalletAdapter(), new ExodusWalletAdapter(), new LedgerWalletAdapter(), new SafePalWalletAdapter(),
        new TrustWalletAdapter(), new SlopeWalletAdapter()],
    autoConnect: localStorage.getItem(WALLET_AUTO_CONNECT) === 'true',
};

export default boot(({app}) => {
    app.use(SolanaWalletVuePlugin, walletOptions);
});