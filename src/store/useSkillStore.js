
import { create } from 'zustand'
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow'
import { NODE_TYPES } from '../types'

const initialNodes = [
  {
    id: 'root',
    type: NODE_TYPES.ROOT,
    position: { x: 250, y: 200 },
    data: { 
      title: 'My New Skill',
      content: '# My New Skill\n\nThis is my awesome OpenClaw AgentSkill.\n\nDescribe what this skill does here using **Markdown**.',
      label: 'My New Skill'
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
      return 'My Skill'
    case NODE_TYPES.FEATURE:
      return `Feature ${increment}`
    case NODE_TYPES.SECTION:
      return `Section ${increment}`
    case NODE_TYPES.MARKDOWN:
      return `Notes ${increment}`
    default:
      return `${type} ${increment}`
  }
}

function getDefaultContentForType(type) {
  switch (type) {
    case NODE_TYPES.ROOT:
      return '# My Skill\n\nBrief description of what this skill does.\n\n**Skill Name:** `my-skill`  \n**Author:** Your Name\n\n## Overview\n\nWrite your skill description here using Markdown.'
    case NODE_TYPES.FEATURE:
      return '## Feature: Feature Name\n\n**Description:**  \nDescribe what this feature does in detail.\n\n**Usage:**\n```\n/skill-name command\n```'
    case NODE_TYPES.SECTION:
      return '## Section Title\n\nThis section groups related content together.\n\nAdd multiple related nodes as children to this section.'
    case NODE_TYPES.MARKDOWN:
      return 'Add any free-form content here using **Markdown** format.\n\n- You can use bullet lists\n- **bold text**, *italic*\n- `inline code`\n- [links](https://example.com)'
    default:
      return 'Add your content here in Markdown format.'
  }
}

export default useSkillStore
