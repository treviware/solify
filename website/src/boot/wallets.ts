import SolanaWallets from 'solana-wallets-vue';
import {boot} from 'quasar/wrappers';
import 'solana-wallets-vue/styles.css';
import {PhantomWalletAdapter, SlopeWalletAdapter} from '@solana/wallet-adapter-wallets';
import {WalletStoreProps} from 'solana-wallets-vue/dist/createWalletStore';

const walletOptions: WalletStoreProps = {
    wallets: [new PhantomWalletAdapter(), new SlopeWalletAdapter()],
    autoConnect: true,
};

export default boot(({app}) => {
    app.use(SolanaWallets, walletOptions);
});