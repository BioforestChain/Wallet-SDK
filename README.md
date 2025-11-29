# Wallet-SDK (English)
For Chinese version please see [README-zh](README-zh.md).

## Overview
Monorepo SDK to embed BFMeta wallet capabilities in third‑party apps: account lifecycle, signing, RPC helpers, and UI glue.

## Architecture
- Workspaces `packages/`:
  - `core`: core logic and types
  - `sdk`: public SDK surface
  - `wallet`: optional UI glue/adapters
  - `typings`: shared TS definitions
  - `test`: integration/regression harness
- Tooling: `lerna.json`, `pnpm-workspace.yaml`, `tsconfig.build.json`; scripts in `scripts/`.

## Getting Started
```bash
pnpm install
pnpm build        # build all packages
pnpm test         # run tests (if configured)
```
Usage pattern:
- Initialize SDK with node endpoints + network params.
- Use SDK to create/import accounts, sign transactions, and broadcast via chain RPC.
- Handle typed results/errors; extend `core` utilities for custom flows.

## Contribution Guide
- SDK layer（MPL 2.0）: keep TS strict; avoid `any`/`@ts-ignore`.
- Reuse `core` utilities; place types in `typings`; keep `sdk` API surface small and documented (JSDoc + examples).
- Add regression tests in `packages/test` for new RPC/signing flows before release.
- Branches: `feature/<scope>` / `fix/<issue>`; concise commits.
