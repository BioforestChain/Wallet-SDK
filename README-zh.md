# Wallet-SDK（中文）
英文版请参见 [README](README.md)。

## 简介
面向第三方应用的 BFMeta 钱包 SDK：账户管理、签名与链 RPC 辅助。

## 安装
```bash
pnpm add @bfmeta/wallet-sdk
```

## 使用
- 初始化时配置节点地址与网络参数。
- 通过 SDK 提供的接口创建/导入账户、签名交易，并通过链 RPC 广播。
- 使用类型化返回处理错误。

## 贡献
- SDK 层（MPL 2.0）：保持 TS 严格，避免 `any`/`@ts-ignore`。
- 复用公共工具，新增 API 需写 JSDoc 与示例。
- 对新增 RPC 或签名流程补回归测试。
- 分支：`feature/<scope>` / `fix/<issue>`。
