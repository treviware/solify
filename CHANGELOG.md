# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Note:** Version 0 of Semantic Versioning is handled differently from version 1 and above.
The minor version will be incremented upon a breaking change and the patch version will be incremented for features.

## [TODO]

### Features

* modes: Add PRO mode to allow users to use advanced features.
* modes: Add BUSINESS mode to allow users use advanced features but only the business paying for it.
* general: Add tabs to transaction, so we can add tabs when people select something.
* transactions: Link to solana explorer to simulate the transaction.
* signing: Add multi-wallet local signatures.
* signing: Add remote multi-wallet signatures. Everyone needs to be PRO or just one using BUSINESS.
* signing: Add remote message signature to easily login into third-party apps. In this case the client app pays for n
  logins / month.
* utilities: Add `SPL Utility` view to create/mint/burn SPL tokens.
* utilities: Add `NFT Utility` view to create/mint/burn NFTs.
* utilities: Add `PDA Utility` view to generate PDAs.
* utilities: Add `Token Price Utility` view to get the token price.
* utilities: Add `Keypair Utility` view to generate new keypairs and change between keypair's representation.
* utilities: Add `Airdrop Utility` view to airdrop some SOL in the networks that allow this action.

### Fixes

* icons: Fix favicon background for ipad.

## [Unreleased]

### Features

* general: Add wallet support for Phantom and Slope.
* general: Add settings view.
* general: Add wallet list menu-view.
* general: Add menu to address tag to copy the address or see it in Solscan or Solana Explorer.
* general: Add SOL to SPL picker.
* general: Add last selected tokens to SPL selector.
* general: Show NFT info in wallet list.
* general: Add recent utility list to the left and right menus. Add also the ability to pin some of them.
* general: Add view to select a utility.
* config: Add support for different vs currencies.
* config: Add support for different RPC endpoint.
* config: Add support for different commitment levels.
* utilities: Add `Basis Points Utility` view to change between basis points of an SPL to its real value and viceversa.
* utilities: Add `Rent Excemption Utility` view to get the amount to pay to be rent exempt for an account with the
  specified number of bytes.
