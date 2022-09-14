import {boot} from 'quasar/wrappers';
import {PhantomWalletAdapter, SlopeWalletAdapter} from '@solana/wallet-adapter-wallets';
import {WALLET_AUTO_CONNECT} from 'src/constants';
import {SolanaWalletVuePlugin, WalletStoreProps} from 'src/lib/WalletAdapter';

const walletOptions: WalletStoreProps = {
    wallets: [new SlopeWalletAdapter(), new PhantomWalletAdapter()],
    autoConnect: localStorage.getItem(WALLET_AUTO_CONNECT) === 'true',
};

export default boot(({app}) => {
    app.use(SolanaWalletVuePlugin, walletOptions);
});