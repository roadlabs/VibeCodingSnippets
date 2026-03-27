
# OpenClaw Skill Builder

一个基于思维导图的可视化 OpenClaw AgentSkills 开发工具，**每个节点都是一个独立的 Markdown 编辑器**。

## ✨ 核心特性

- 🧠 **思维导图式编辑**：拖拽节点，直观组织技能结构
- ✏️ **每个节点都是独立的 Markdown 编辑器** - 双击编辑，实时预览
- 🎨 **多种节点类型**：根节点、功能、参数、示例、工具、描述，每种都有颜色区分
- 🔗 **树形层级结构**：通过连线表达父子关系，清晰组织技能文档
- 💾 **保存/加载**：支持导出项目 JSON 文件，随时继续编辑
- 📦 **一键导出**：自动生成符合 OpenClaw 规范的完整技能文件包
- 📥 **ZIP 下载**：直接下载打包好的技能，解压后即可使用

## 🎯 与常规思维导图的区别

常规思维导图工具只关注结构表达，而 **OpenClaw Skill Builder** 专门为技能开发设计：

- ✅ **每个节点自带标题 + Markdown 内容编辑区**，无需跳转到侧边栏
- ✅ **所有内容直接在节点中编辑**，结构和内容一体化
- ✅ **自动聚合所有节点内容** 生成符合 OpenClaw 规范的 SKILL.md
- ✅ **自动生成技能入口骨架代码**，直接就能运行

## 🟢 节点类型

| 节点类型 | 用途 | 颜色 |
|---------|------|------|
| Root Skill | 技能根节点，定义整体技能文档 | 🔵 蓝色 |
| Feature | 功能特性，一个技能可以有多个功能 | 🟢 绿色 |
| Parameter | 参数定义 | 🟡 橙色 |
| Example | 使用示例代码/演示 | 🟣 紫色 |
| Tool | 外部工具调用定义 | 🔴 红色 |
| Description | 附加描述文本 | ⚪ 灰色 |

## 🚀 快速开始

### 启动开发服务器

```bash
cd openclaw-skill-builder
npm install
npm run dev
```

浏览器会自动打开 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录，可以直接部署到静态网站。

## 📖 使用方法

1. **开始创建**：页面已经初始化一个根节点
2. **添加节点**：选择一个节点（点击），在左侧边栏点击要添加的节点类型
3. **编辑内容**：**双击任意节点**进入编辑模式，编辑标题和 Markdown 内容
4. **组织结构**：拖拽节点调整位置，从节点边缘手柄拖拽连接节点
5. **保存进度**：在左侧可以导出项目 JSON 文件，以后可以导入继续编辑
6. **导出技能**：点击左下角绿色按钮下载 ZIP，得到完整的技能包

## 📦 输出格式

导出的 ZIP 包含完整的 OpenClaw 技能目录结构：

```
your-skill-name/
├── SKILL.md      # 自动聚合所有节点内容生成的技能文档
├── package.json  # 包信息（从根节点自动生成）
├── index.js      # 技能入口骨架代码（按功能自动生成路由分支）
└── README.md     # 项目说明文件
```

解压后直接放到 OpenClaw 的 `skills/` 目录即可使用：

```bash
unzip your-skill-name.zip
mv your-skill-name ~/.openclaw/workspace/skills/
```

然后重启 OpenClaw 就能使用新技能了。

## 🛠 技术栈

- **React 18** - 前端框架
- **ReactFlow** - 流程图/思维导图渲染和拖拽
- **Zustand** - 轻量级状态管理
- **Tailwind CSS** - Utility-first CSS 框架
- **Vite** - 快速打包工具
- **JSZip** - 生成 ZIP 下载

## 📁 项目结构

```
openclaw-skill-builder/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── src/
    ├── main.jsx                 # 应用入口
    ├── App.jsx                  # 主应用布局
    ├── index.css                # 全局样式
    ├── components/
    │   ├── CustomNode.jsx       # 自定义节点（自带 Markdown 编辑）
    │   ├── Sidebar.jsx          # 左侧边栏（添加节点、导出）
    │   └── PropertiesPanel.jsx  # 右侧信息面板（统计、删除）
    ├── store/
    │   └── useSkillStore.js     # Zustand 状态管理
    ├── types/
    │   └── index.js             # 节点类型定义和颜色配置
    └── utils/
        └── generate.js          # ZIP 和代码生成工具
```

## 💡 使用提示

- **双击任意节点**即可进入编辑模式
- **点击空白处**或点击其他节点会自动保存内容并退出编辑
- 每个功能节点会在生成的 `index.js` 中自动创建路由分支
- SKILL.md 会自动按层级聚合所有节点的 Markdown 内容
- 生成的骨架代码可以直接运行，你只需要填充具体业务逻辑
- 可以随时导出 JSON 保存你的进度，下次导入继续编辑

## 📝 示例工作流

1. 创建根节点，填写技能名称和总体描述
2. 选择根节点，添加几个 Feature 节点作为主要功能
3. 每个 Feature 节点下添加 Parameter 子节点说明参数
4. 添加 Example 节点提供使用示例代码
5. 添加 Description 节点补充说明
6. 点击导出 ZIP，得到完整技能包
7. 解压到 skills 目录，填充 index.js 逻辑，完成！

## License

MIT
