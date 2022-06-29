import SolanaWallets from 'solana-wallets-vue';
import {boot} from 'quasar/wrappers';
import 'solana-wallets-vue/styles.css';
import {PhantomWalletAdapter, SlopeWalletAdapter} from '@solana/wallet-adapter-wallets';
import {WalletStoreProps} from 'solana-wallets-vue/dist/createWalletStore';
import {WALLET_AUTO_CONNECT} from 'src/constants';

const walletOptions: WalletStoreProps = {
    wallets: [new SlopeWalletAdapter(), new PhantomWalletAdapter()],
    autoConnect: localStorage.getItem(WALLET_AUTO_CONNECT) === 'true',
};

export default boot(({app}) => {
    app.use(SolanaWallets, walletOptions);
});