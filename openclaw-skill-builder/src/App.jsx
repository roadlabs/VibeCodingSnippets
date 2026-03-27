import React, { useState, useCallback, useEffect } from 'react'
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
import { Menu, X } from 'lucide-react'

const nodeTypes = {
  [NODE_TYPES.ROOT]: CustomNode,
  [NODE_TYPES.FEATURE]: CustomNode,
  [NODE_TYPES.USAGE]: CustomNode,
  [NODE_TYPES.COMMAND]: CustomNode,
  [NODE_TYPES.PARAMETER]: CustomNode,
  [NODE_TYPES.EXAMPLE]: CustomNode,
  [NODE_TYPES.NOTE]: CustomNode,
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

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setPanelOpen(false)
    setSidebarOpen(false)
  }, [setSelectedNode])

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node.id)
    if (isMobile) {
      setPanelOpen(true)
    }
  }, [setSelectedNode, isMobile])

  const handleNodeAdded = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  return (
    <div className="flex w-full h-full relative overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-3 left-3 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
        style={{ top: '12px', left: '12px', zIndex: 9999 }}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Panel Toggle Button */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className="fixed top-3 right-3 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
        style={{ top: '12px', right: '12px', zIndex: 9999 }}
      >
        <span className="text-lg">📝</span>
      </button>

      {/* Sidebar */}
      <div 
        className={`
          fixed md:relative h-full z-40 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ width: '300px', maxWidth: '90vw', left: 0 }}
      >
        <Sidebar onNodeAdded={handleNodeAdded} />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main ReactFlow Canvas */}
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
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          minZoom={0.1}
          maxZoom={2}
        >
          <Background />
          <Controls position="bottom-right" />
          {!isMobile && (
            <MiniMap 
              nodeColor={(node) => {
                const colors = {
                  root: '#4CAF50',
                  feature: '#2196F3',
                  usage: '#9C27B0',
                  command: '#FF9800',
                  parameter: '#F44336',
                  example: '#00BCD4',
                  note: '#607D8B',
                }
                return colors[node.type] || '#aaa'
              }}
              style={{ bottom: 80 }}
            />
          )}
        </ReactFlow>
      </div>

      {/* Properties Panel - Desktop: hidden on very small screens */}
      <div 
        className={`
          fixed md:relative h-full z-40 transition-transform duration-300 ease-in-out
          ${panelOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          hidden md:block
        `}
        style={{ width: '300px', maxWidth: '90vw', right: 0 }}
      >
        <PropertiesPanel />
      </div>

      {/* Overlay for mobile panel */}
      {panelOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setPanelOpen(false)}
        />
      )}
    </div>
  )
}
