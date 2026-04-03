
import React, { useCallback, useMemo } from 'react'
import ReactFlow, {
  Controls,
  Background,
  MiniMap
} from 'reactflow'
import 'reactflow/dist/style.css'

import CustomNode from './components/CustomNode'
import Sidebar from './components/Sidebar'
import PropertiesPanel from './components/PropertiesPanel'
import useSkillStore from './store/useSkillStore'
import { NODE_TYPES } from './types'

const nodeTypes = {
  [NODE_TYPES.ROOT]: CustomNode,
  [NODE_TYPES.FEATURE]: CustomNode,
  [NODE_TYPES.SECTION]: CustomNode,
  [NODE_TYPES.MARKDOWN]: CustomNode,
}

export default function App() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
  } = useSkillStore()

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node.id)
  }, [setSelectedNode])

  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={onPaneClick}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const colors = {
                root: '#3b82f6',
                feature: '#10b981',
                parameter: '#f59e0b',
                example: '#8b5cf6',
                tool: '#ef4444',
                description: '#6b7280',
              }
              return colors[node.type] || '#aaa'
            }}
          />
        </ReactFlow>
      </div>
      <PropertiesPanel />
    </div>
  )
}
