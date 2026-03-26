# Vibe Coding Snippets

这里存放一些有趣的编程小工具和代码片段。

## OpenClaw Skill Builder

基于思维导图的可视化 OpenClaw AgentSkills 开发工具，每个节点都是带标题的 Markdown 编辑器。

### 在线访问 (IPFS via PinMe)

- **完整构建版本**: https://pinme.eth.limo/#/preview/U2FsdGVkX1_4CnKFaUxx0RKAzAinaQSRXJHcd1wIzirhWFvrExqHcK9UGfQKz7jfLAeqNZnJEd85LvTpOgdOYy6rQFsO0A9XKYbqq9a9R7VE1frt9TI7dVawtDLZgY_wicVGh7AlqckaRQR-TDtlfQ
- **纯原生单文件版本 (pure.html)**: 上述链接 + `/pure.html`
- **独立单文件版本 (standalone.html)**: 上述链接 + `/standalone.html`

### 功能特点

- 🧠 **思维导图式编辑** - 直观拖拽组织技能结构
- ✏️ **每个节点都是独立的带标题 Markdown 编辑器**
- 📦 **一键导出** - 自动生成符合 OpenClaw 规范的 SKILL.md 和技能包
- 🎨 **不同节点类型用颜色区分** - Root/Feature/Parameter/Example/Tool/Description
- 🌐 **纯静态** - 无需后端，直接浏览器打开使用

### 版本说明

- `index.html` - Vite 构建的完整 React 版本
- `pure.html` - 纯 HTML + 原生 JavaScript 零框架版本（推荐直接打开）
- `standalone.html` - CDN 加载 React 的单文件版本

### 本地使用

直接下载 `pure.html`，双击即可在浏览器中打开使用，无需任何环境依赖。

