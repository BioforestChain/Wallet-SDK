# Wallet-SDK (English)
For Chinese version please see [README-zh](README-zh.md).

## Overview
SDK for integrating BFMeta wallet capabilities into third-party apps: account management, signing, and chain RPC helpers.

## Installation
```bash
pnpm add @bfmeta/wallet-sdk
```

## Usage
- Initialize SDK with node endpoints and network params.
- Use provided methods to create/import accounts, sign transactions, and broadcast via chain RPC.
- Handle errors with provided typed results.

## Contribution
- SDK layer (MPL 2.0): keep TS strict; avoid `any`/`@ts-ignore`.
- Reuse shared utilities; document new APIs with JSDoc and examples.
- Add regression tests for new RPC surfaces or signing flows.
- Branches: `feature/<scope>` / `fix/<issue>`.
