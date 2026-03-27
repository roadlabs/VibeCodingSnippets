
import { create } from 'zustand'
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow'
import { NODE_TYPES } from '../types'

const initialNodes = [
  {
    id: 'root',
    type: NODE_TYPES.ROOT,
    position: { x: 250, y: 200 },
    data: { 
      title: '根节点',
      content: '# 技能名称\n\n- **技能 ID**: `skill-name`\n- **技能名称**: 技能显示名称\n- **作者**: Your Name\n- **描述**: 一句话描述这个技能做什么的',
      label: '根节点'
    },
  },
]

const initialEdges = []

const useSkillStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    })
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },

  onConnect: (connection) => {
    set({
      edges: addEdge({ ...connection, animated: true }, get().edges),
    })
  },

  setSelectedNode: (nodeId) => {
    set({ selectedNodeId: nodeId })
  },

  updateNodeData: (nodeId, newData) => {
    set({
      nodes: get().nodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      ),
    })
  },

  addChildNode: (parentId, nodeType) => {
    const parentNode = get().nodes.find(n => n.id === parentId)
    const increment = get().nodes.filter(n => n.type === nodeType).length + 1
    const nodeId = `${nodeType}-${increment}`
    
    let position
    if (parentNode) {
      // Place the new node to the right of the parent
      const offsetX = 300
      const offsetY = increment * 80 - ((get().nodes.filter(n => n.type === nodeType).length) * 40)
      position = { 
        x: parentNode.position.x + offsetX, 
        y: parentNode.position.y + offsetY 
      }
    } else {
      position = { x: 100, y: 100 }
    }

    // Default content based on node type
    const defaultContent = getDefaultContentForType(nodeType)
    
    const newNode = {
      id: nodeId,
      type: nodeType,
      position,
      data: {
        title: getDefaultTitleForType(nodeType, increment),
        content: defaultContent,
        label: getDefaultTitleForType(nodeType, increment),
      },
    }

    set({
      nodes: [...get().nodes, newNode],
    })

    if (parentId) {
      set({
        edges: [...get().edges, { 
          id: `${parentId}-${nodeId}`, 
          source: parentId, 
          target: nodeId, 
          animated: true 
        }],
      })
    }

    return nodeId
  },

  deleteSelectedNode: () => {
    const { selectedNodeId, nodes, edges } = get()
    if (!selectedNodeId || selectedNodeId === 'root') return // Don't allow deleting root

    set({
      nodes: nodes.filter(n => n.id !== selectedNodeId),
      edges: edges.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId),
      selectedNodeId: null,
    })
  },

  reset: () => {
    set({
      nodes: initialNodes,
      edges: initialEdges,
      selectedNodeId: null,
    })
  },

  loadFromJson: (data) => {
    set({
      nodes: data.nodes || initialNodes,
      edges: data.edges || initialEdges,
      selectedNodeId: null,
    })
  },
}))

function getDefaultTitleForType(type, increment) {
  switch (type) {
    case NODE_TYPES.ROOT:
      return '根节点'
    case NODE_TYPES.FEATURE:
      return '功能特性'
    case NODE_TYPES.USAGE:
      return '使用流程'
    case NODE_TYPES.COMMAND:
      return '命令说明'
    case NODE_TYPES.PARAMETER:
      return '参数定义'
    case NODE_TYPES.EXAMPLE:
      return '使用示例'
    case NODE_TYPES.NOTE:
      return '备注说明'
    default:
      return `${type} ${increment}`
  }
}

function getDefaultContentForType(type) {
  switch (type) {
    case NODE_TYPES.ROOT:
      return '# 技能名称\n\n- **技能 ID**: `skill-name`\n- **技能名称**: 技能显示名称\n- **作者**: Your Name\n- **描述**: 一句话描述这个技能做什么的'
    case NODE_TYPES.FEATURE:
      return '## 功能特性\n\n- 功能一：简要描述这个功能能做什么\n- 功能二：简要描述这个功能能做什么\n- 功能三：简要描述这个功能能做什么'
    case NODE_TYPES.USAGE:
      return '## 使用流程\n\n1. 第一步：做什么\n2. 第二步：做什么\n3. 第三步：得到结果'
    case NODE_TYPES.COMMAND:
      return '## 命令说明\n\n### `/skill-name subcommand1`\n\n描述这个命令的功能和用法。\n\n### `/skill-name subcommand2`\n\n描述这个命令的功能和用法。'
    case NODE_TYPES.PARAMETER:
      return '## 参数定义\n\n| 参数名 | 类型 | 必填 | 说明 |\n|--------|------|------|------|\n| `param1` | string | 是 | 参数说明在这里\n| `param2` | number | 否 | 参数说明在这里'
    case NODE_TYPES.EXAMPLE:
      return '## 使用示例\n\n### 示例场景\n\n描述这个示例要展示什么场景。\n\n```\n# 输入命令\n/skill-name example-command\n```\n\n输出结果：\n```\n示例输出内容\n```'
    case NODE_TYPES.NOTE:
      return '## 备注说明\n\n- 注意事项一\n- 注意事项二\n- 已知问题'
    default:
      return 'Add your content here in Markdown format.'
  }
}

export default useSkillStore
