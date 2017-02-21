## 注意

### 发布之前的操作顺序

1. `npm version [patch|minor|major]`; // 修改版本号
2. `npm run build` // 打包出 build 目录，同步到 cdn
3. `npm publish` // 同步到 npm

PS: 由于 version 模块的存在，请务必先修改版本号。
PPS: 如果只是修改小版本(patch)， 在 mac 环境下可以直接运行 `make` 

### 使用建议

使用 mirroz 时建议配置 babel-plugin-import 插件。