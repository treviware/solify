# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Note:** Version 0 of Semantic Versioning is handled differently from version 1 and above.
The minor version will be incremented upon a breaking change and the patch version will be incremented for features.

## [Unreleased]

## [0.2.0] - 2022-06-30

### Features

* general: Add wallet support for Phantom and Slope.
* general: Add settings view.
* general: Add wallet list menu-view.
* general: Add menu to address tag to copy the address or see it in Solscan or Solana Explorer.
* general: Add SOL to SPL picker.
* general: Add last selected tokens to SPL selector.
* general: Show NFT info in wallet list.
* general: Add recent tool list to the left and right menus. Add also the ability to pin some of them.
* general: Add view to select a tool.
* general: Make search bars get values from URI.
* general: Add social links.
* general: Add support link. Finally, this went to Discord.
* config: Add support for different vs currencies.
* config: Add support for different RPC endpoint.
* config: Add support for different commitment levels.
* tools: Add `Basis Points Tool` view to change between basis points of an SPL to its real value and viceversa.
* tools: Add `Rent Excemption Tool` view to get the amount to pay to be rent exempt for an account with the
  specified number of bytes.
* tools: Add `Airdrop Tool` view to airdrop some SOL in the networks that allow this action.
* tools: Add `Token Price Tool` view to get the price of a token in one of the comparing currencies or in another
  token.
* tools: Add `Keypair Generator Tool` view to generate new keypairs and change them between different encodings.
* tools: Add `Vanity Address Tool` view to generate keypairs whose base58 encoding follows some rules. Start
  with, end with or contain a certain string. Sensible or insensible case matching. Multiple rules at the same time.
* transactions: Link to solana explorer to simulate the transaction.
* settings: Add autoload setting for wallets.
* signing: Add multi-wallet local signatures.

### Fixes

* general: fix wallet list is always pinned.
