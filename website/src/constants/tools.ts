import { DrawerToolButton, RightDrawerState } from 'src/types/drawer';
import WalletsPage from 'pages/tools/WalletsPage.vue';
import BasisPointsPage from 'pages/tools/BasisPointsPage.vue';
import RentExemptionPage from 'pages/tools/RentExemptionPage.vue';
import AirdropPage from 'pages/tools/AirdropPage.vue';
import TokenPricePage from 'pages/tools/TokenPricePage.vue';
import KeypairGeneratorPage from 'pages/tools/KeypairGeneratorPage.vue';
import KeypairFormatterPage from 'pages/tools/KeypairFormatterPage.vue';
import VanityAddressPage from 'pages/tools/VanityAddressPage.vue';
import SignMessagePage from 'pages/tools/SignMessagePage.vue';
import VerifySignaturePage from 'pages/tools/VerifySignaturePage.vue';
import CloseEmptyAccountsPage from 'pages/tools/CloseEmptyAccountsPage.vue';
import SendColdWalletPage from 'pages/tools/SendColdWalletPage.vue';
import { ToolCategory } from 'src/types/tools';

export const TOOL_BUTTONS_BY_CATEGORY: ToolCategory[] = [{
  name: 'Solana Tools',
  description: 'Tools to help you manage your accounts.',
  buttons: [{
    icon: 'fa-solid fa-wallet',
    name: 'Wallet List',
    description: 'The list of all connected wallets',
    rightDrawerOption: RightDrawerState.Wallets,
    component: WalletsPage
  }, {
    icon: 'fa-solid fa-hand-holding-dollar',
    name: 'Rent Exemption',
    description: 'Get the rent you must pay for an account with a given size to be rent exempt',
    rightDrawerOption: RightDrawerState.Rent,
    component: RentExemptionPage
  }, {
    icon: 'fa-solid fa-parachute-box',
    name: 'Airdrop',
    description: 'A tool to airdrop some SOL to a given address',
    rightDrawerOption: RightDrawerState.Airdrop,
    component: AirdropPage
  }, {
    icon: 'fa-solid fa-key',
    name: 'Keypair Generator',
    description: 'Generate new keypairs and change them between different encodings',
    rightDrawerOption: RightDrawerState.KeypairGenerator,
    component: KeypairGeneratorPage
  }, {
    icon: 'fa-solid fa-key',
    name: 'Keypair Formatter',
    description: 'Changes the encoding format of a keypair between base58 and byte array encodings',
    rightDrawerOption: RightDrawerState.KeypairFormatter,
    component: KeypairFormatterPage
  }, {
    icon: 'fa-solid fa-shield-heart',
    name: 'Vanity Address',
    description: 'Find a Solana address that match some rules',
    rightDrawerOption: RightDrawerState.VanityAddress,
    component: VanityAddressPage
  }, {
    icon: 'fa-solid fa-signature',
    name: 'Sign Message',
    description: 'Signs a custom message and returns the signature',
    rightDrawerOption: RightDrawerState.SignMessage,
    component: SignMessagePage
  }, {
    icon: 'fa-solid fa-signature',
    name: 'Verify Signature',
    description: 'Verifies whether a signature belongs to a wallet or not',
    rightDrawerOption: RightDrawerState.VerifySignature,
    component: VerifySignaturePage
  }, {
    icon: 'fa-solid fa-box-archive',
    name: 'Send to Cold Wallet',
    description: 'Sends all SPL tokens and SOL from one wallet to another',
    rightDrawerOption: RightDrawerState.SendColdWallet,
    component: SendColdWalletPage
  }]
}, {
  name: 'SPL Token Tools',
  description: 'Tools to manage your SPL tokens.',
  buttons: [{
    icon: 'fa-solid fa-right-left',
    name: 'Basis Points',
    description: 'Change between basis points and real value',
    rightDrawerOption: RightDrawerState.Bps,
    component: BasisPointsPage
  }, {
    icon: 'fa-solid fa-rectangle-xmark',
    name: 'Close Empty Accounts',
    description: 'Closes empty token accounts to recover the rent',
    rightDrawerOption: RightDrawerState.CloseEmptyAccounts,
    component: CloseEmptyAccountsPage
  }]
}, {
  name: 'Currencies',
  description: 'Tools to get and compare token values in different currencies.',
  buttons: [{
    icon: 'fa-solid fa-magnifying-glass-dollar',
    name: 'Token Price',
    description: 'Get the current price of a token in a supported currency or any other token.',
    rightDrawerOption: RightDrawerState.TokenPrice,
    component: TokenPricePage
  }]
}];

export const TOOL_BUTTONS = TOOL_BUTTONS_BY_CATEGORY.reduce((acc, category) => acc.concat(category.buttons),
  [] as DrawerToolButton[]);