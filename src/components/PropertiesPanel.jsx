
import React, { useEffect, useState } from 'react'
import useSkillStore from '../store/useSkillStore'
import { Settings } from 'lucide-react'
import { NODE_TYPES } from '../types'

export default function PropertiesPanel() {
  const { selectedNodeId, nodes, updateNodeData } = useSkillStore()
  const selectedNode = nodes.find(n => n.id === selectedNodeId)
  const [localData, setLocalData] = useState({})

  useEffect(() => {
    if (selectedNode) {
      setLocalData(selectedNode.data)
    } else {
      setLocalData({})
    }
  }, [selectedNode])

  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (selectedNodeId && localData) {
      // Update label based on title for better display
      const updatedData = {
        ...localData,
        label: localData.title || localData.label
      }
      updateNodeData(selectedNodeId, updatedData)
    }
  }

  if (!selectedNode) {
    return (
      <div className="w-72 border-l bg-gray-50 h-full flex items-center justify-center text-gray-500 p-4 text-center">
        <div>
          <Settings size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Select a node to edit properties</p>
          <p className="text-xs mt-2">Double-click any node to edit its Markdown content directly</p>
        </div>
      </div>
    )
  }

  const type = selectedNode.type

  return (
    <div className="w-72 border-l bg-white h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Properties</h2>
        <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
          {selectedNode.id} ({type})
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* All nodes have title and content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Node Title
          </label>
          <input
            type="text"
            value={localData.title || localData.label || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={handleSave}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter node title..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Displayed as the node header in the mindmap
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Markdown Content
          </label>
          <textarea
            value={localData.content || ''}
            onChange={(e) => handleChange('content', e.target.value)}
            onBlur={handleSave}
            rows={12}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
            placeholder="Write your Markdown content here..."
          />
          <p className="text-xs text-gray-500 mt-1">
            You can also double-click the node on the canvas to edit inline
          </p>
        </div>

        {/* Root node specific fields */}
        {type === NODE_TYPES.ROOT && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Name (for export)
            </label>
            <input
              type="text"
              value={localData.skillName || localData.name || ''}
              onChange={(e) => handleChange('skillName', e.target.value)}
              onBlur={handleSave}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="my-awesome-skill"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used as the directory name when exported
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Every node is a Markdown editor with title. Double-click to edit inline.
        </p>
      </div>
    </div>
  )
}
