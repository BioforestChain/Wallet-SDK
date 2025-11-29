# Wallet-SDK（中文）
英文版请参见 [README](README.md)。

## 简介
BFMeta 钱包 SDK 的 monorepo：为第三方应用提供账户全生命周期、签名、链 RPC 辅助，以及可选的 UI 适配层。

## 架构
- 工作区 `packages/`：`core`（核心逻辑与类型）、`sdk`（公开 API）、`wallet`（UI 适配）、`typings`（共享类型）、`test`（回归/集成测试）。
- 工具链：`lerna.json`、`pnpm-workspace.yaml`、`tsconfig.build.json`；`scripts/` 中有构建辅助脚本。

## 快速开始
```bash
pnpm install
pnpm build   # 构建全部包
pnpm test    # 运行测试（如已配置）
```
使用流程：初始化 SDK（配置节点、网络参数）→ 创建/导入账户 → 签名交易 → 通过链 RPC 广播；通过类型化返回处理错误。

## 贡献规范
- SDK 层（MPL 2.0）：TS 严格，避免 `any`/`@ts-ignore`。
- 类型放 `typings`，公共逻辑放 `core`，`sdk` 尽量保持精简并写明 JSDoc + 示例。
- 新增 RPC/签名流程需在 `packages/test` 补回归用例。
- 分支：`feature/<scope>`、`fix/<issue>`；提交用简短动词短语。
