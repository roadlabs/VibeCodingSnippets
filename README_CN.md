# OpenClaw Skill Builder

> 一个基于思维导图的可视化 OpenClaw AgentSkills 开发工具

## 📖 目录

- [项目简介](#项目简介)
- [核心特性](#核心特性)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [使用指南](#使用指南)
- [技术架构](#技术架构)
- [开发文档](#开发文档)
- [常见问题](#常见问题)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 项目简介

OpenClaw Skill Builder 是一个专为 OpenClaw AgentSkills 设计的可视化技能开发工具。通过直观的思维导图界面，开发者可以轻松创建、组织和管理复杂的 AI 技能文档，每个节点都是独立的 Markdown 编辑器，支持实时预览和一键打包。

**核心理念**：通过图形化的方式简化技能开发流程，让技能创建变得直观、高效且易于维护。

---

## 核心特性

### 🎯 核心功能

| 功能 | 描述 |
|------|------|
| **思维导图式编辑** | 拖拽节点，直观组织技能结构，所见即所得 |
| **节点即编辑器** | 每个节点都是独立的 Markdown 编辑器，支持实时预览 |
| **多种节点类型** | Root（根节点）、Feature（功能）、Parameter（参数）、Example（示例）、Tool（工具）、Description（描述） |
| **树形层级结构** | 通过连线表达父子关系，清晰组织技能文档 |
| **自动打包生成** | 一键导出符合 OpenClaw 规范的完整技能文件包 |
| **项目保存/加载** | 支持 JSON 格式的项目文件导入导出 |

### 🎨 节点类型与用途

| 节点类型 | 用途 | 颜色标识 |
|---------|------|----------|
| **Root Skill** | 技能根节点，定义整体技能文档 | 🔵 蓝色 |
| **Feature** | 功能特性，一个技能可以有多个功能 | 🟢 绿色 |
| **Parameter** | 参数定义 | 🟠 橙色 |
| **Example** | 使用示例代码/演示 | 🟣 紫色 |
| **Tool** | 外部工具调用定义 | 🔴 红色 |
| **Description** | 附加描述文本 | ⚪ 灰色 |

---

## 快速开始

### 环境要求

- **Node.js**: >= 16.x
- **npm**: >= 8.x 或 **yarn**: >= 1.x
- **现代浏览器**: Chrome/Edge/Firefox 最新版本

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/your-org/openclaw-skill-builder.git
cd openclaw-skill-builder

# 2. 安装依赖
npm install
# 或
yarn install

# 3. 启动开发服务器
npm run dev
# 或
yarn dev
```

浏览器会自动打开 `http://localhost:3000`

### 构建生产版本

```bash
# 构建项目
npm run build
# 或
yarn build

# 构建产物位于 dist/ 目录，可直接部署到静态网站
```

---

## 项目结构

```
openclaw-skill-builder/
├── index.html                 # HTML 入口文件
├── package.json              # 项目依赖配置
├── vite.config.js           # Vite 构建配置
├── tailwind.config.js       # Tailwind CSS 配置
├── postcss.config.js        # PostCSS 配置
├── README.md                # 项目说明文档（本文档）
├── README_CN.md             # 中文项目说明文档
│
├── src/                     # 源代码目录
│   ├── main.jsx             # React 应用入口
│   ├── App.jsx              # 主应用组件
│   ├── index.css            # 全局样式文件
│   │
│   ├── components/          # 组件目录
│   │   ├── CustomNode.jsx   # 自定义节点组件（Markdown 编辑器）
│   │   ├── Sidebar.jsx      # 左侧边栏（添加节点、项目导出等）
│   │   └── PropertiesPanel.jsx # 右侧属性面板（统计信息、删除操作等）
│   │
│   ├── store/               # 状态管理
│   │   └── useSkillStore.js # Zustand 状态管理逻辑
│   │
│   ├── types/               # 类型定义
│   │   └── index.js         # 节点类型定义和颜色配置
│   │
│   └── utils/               # 工具函数
│       └── generate.js      # ZIP 文件生成和代码打包工具
│
└── dist/                    # 构建输出目录
    ├── index.html
    ├── assets/
    │   └── *.js
    └── ...
```

---

## 使用指南

### 基础操作流程

1. **初始化项目**
   - 页面启动时已自动创建一个根节点（Root Skill）
   - 双击节点可编辑标题和 Markdown 内容

2. **添加节点**
   - 点击左侧边栏选择要添加的节点类型
   - 新节点会自动添加到当前选中节点下

3. **编辑内容**
   - 双击任意节点进入编辑模式
   - 在顶部输入框编辑节点标题
   - 在主体区域编辑 Markdown 内容（支持实时预览）
   - 点击空白处或其他节点自动保存并退出编辑

4. **组织结构**
   - 拖拽节点调整位置
   - 从节点边缘的手柄拖拽创建连线，建立父子关系
   - 支持多选、复制、粘贴等操作

5. **保存进度**
   - 点击左侧边栏的"导出项目"按钮下载 JSON 文件
   - 下次可通过"导入项目"加载之前的工作

6. **导出技能包**
   - 完成技能设计后，点击"导出 ZIP"按钮
   - 自动生成包含完整技能结构的 ZIP 文件
   - 下载后可直接在 OpenClaw 中使用

### 导出文件格式

生成的 ZIP 包含以下结构：

```
your-skill-name/
├── SKILL.md           # 自动聚合所有节点内容生成的技能文档
├── package.json       # 从根节点自动生成的包信息
└── index.js           # 技能入口骨架代码（自动路由分支）
```

### 在 OpenClaw 中使用

```bash
# 1. 解压下载的 ZIP 文件
unzip your-skill-name.zip

# 2. 复制到 OpenClaw 技能目录
cp -r your-skill-name ~/.openclaw/skills/

# 3. 重启 OpenClaw 即可使用新技能
```

### 高级技巧

#### 技能组织最佳实践

1. **根节点（Root Skill）**
   - 描述技能的整体目标和适用场景
   - 包含技能触发条件和使用限制

2. **功能节点（Feature）**
   - 每个功能节点代表技能的一个核心能力
   - 建议一个技能包含 3-7 个主要功能

3. **参数节点（Parameter）**
   - 定义功能所需的输入参数
   - 包含参数类型、默认值、验证规则

4. **示例节点（Example）**
   - 提供具体的使用示例和代码片段
   - 帮助用户快速理解功能用法

5. **工具节点（Tool）**
   - 定义需要调用的外部工具或 API
   - 说明工具的功能、参数和返回值

6. **描述节点（Description）**
   - 提供补充说明、注意事项、错误处理等
   - 增强文档的完整性和可读性

---

## 技术架构

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 18.2+ | 前端框架 |
| **ReactFlow** | 11.10+ | 流程图/思维导图渲染和拖拽 |
| **Zustand** | 4.5+ | 轻量级状态管理 |
| **Tailwind CSS** | 3.4+ | Utility-first CSS 框架 |
| **Vite** | 5.0+ | 快速构建工具 |
| **JSZip** | 3.10+ | ZIP 文件生成和下载 |
| **Lucide React** | 0.323+ | 图标库 |

### 架构设计

#### 组件架构

```
App (主应用)
├── Sidebar (左侧工具栏)
│   ├── 添加节点按钮组
│   ├── 项目导出/导入
│   └── ZIP 导出按钮
├── Flow (流程图画布)
│   └── CustomNode (自定义节点)
│       ├── 节点标题
│       ├── Markdown 编辑器
│       └── 连接手柄
└── PropertiesPanel (右侧属性面板)
    ├── 节点统计
    └── 删除操作
```

#### 状态管理（Zustand）

```javascript
// useSkillStore.js
{
  nodes: [],           // 节点数组
  edges: [],           // 连线数组
  selectedNode: null,  // 当前选中的节点
  // ... 其他状态和方法
}
```

#### 数据流

```
用户操作 → Zustand Store → 组件重渲染 → ReactFlow 更新
                                        ↓
                              文档内容聚合
                                        ↓
                              ZIP 文件生成
                                        ↓
                              文件下载
```

---

## 开发文档

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（热重载）
npm run dev

# 代码检查
npm run lint

# 类型检查（如果使用 TypeScript）
npm run type-check
```

### 添加新节点类型

1. 在 `src/types/index.js` 中定义新节点类型：
```javascript
export const NODE_TYPES = {
  // ... 现有类型
  NEW_TYPE: {
    label: '新类型',
    color: '#XXXXXX',
    description: '新节点类型的描述'
  }
};
```

2. 在 `src/components/Sidebar.jsx` 中添加对应的按钮。

### 自定义 Markdown 编辑器

默认编辑器支持基础 Markdown 语法。如需扩展功能，修改 `src/components/CustomNode.jsx` 中的编辑器部分。

### 修改导出格式

导出逻辑在 `src/utils/generate.js` 中。根据需要修改：
- 文件结构
- 内容聚合规则
- ZIP 打包配置

---

## 常见问题

### Q: 如何处理大型技能项目？

A: 对于复杂技能，建议：
1. 使用多个 Feature 节点分层组织
2. 善用 Description 节点补充细节
3. 定期保存项目进度（导出 JSON）
4. 使用版本号管理不同版本的技能

### Q: 支持哪些 Markdown 语法？

A: 支持标准 Markdown 语法：
- 标题（# ## ###）
- 列表（有序、无序）
- 代码块（```）
- 链接和图片
- 表格
- 粗体、斜体等

### Q: 导出的 ZIP 文件在哪里？

A: ZIP 文件会自动下载到浏览器的默认下载目录。

### Q: 如何回退到之前的版本？

A: 导出的 JSON 文件包含完整的节点和连线信息，可随时导入恢复到之前的状态。

### Q: 支持协作编辑吗？

A: 当前版本不支持实时协作，但可以通过导出/导入 JSON 文件实现版本共享和协作。

---

## 贡献指南

我们欢迎任何形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 遵循 ESLint 配置
- 使用有意义的变量和函数名
- 添加必要的注释
- 保持代码简洁清晰

### 问题反馈

如遇到问题或有改进建议，请在 Issues 中详细描述。

---

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 联系方式

- 项目主页: https://github.com/your-org/openclaw-skill-builder
- 问题反馈: https://github.com/your-org/openclaw-skill-builder/issues
- 邮箱: support@example.com

---

## 致谢

感谢以下开源项目的支持：
- [React](https://reactjs.org/)
- [ReactFlow](https://reactflow.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

**最后更新**: 2026-03-29
**文档版本**: 1.0.0
