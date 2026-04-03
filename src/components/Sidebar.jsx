
import React, { useRef } from 'react'
import { NODE_TYPES, NODE_COLORS } from '../types'
import { 
  Plus, 
  Trash2,
  Download, 
  FileText, 
  RefreshCw, 
  Play, 
  BookOpen, 
  Terminal,
  LayoutTemplate 
} from 'lucide-react'
import useSkillStore from '../store/useSkillStore'
import generateSkillFiles from '../utils/generate'

const nodeTypeInfo = {
  [NODE_TYPES.ROOT]: { label: 'Root Skill', icon: <BookOpen size={18} />, description: 'Main skill node' },
  [NODE_TYPES.FEATURE]: { label: 'Feature', icon: <Play size={18} />, description: 'Feature/functionality' },
  [NODE_TYPES.SECTION]: { label: 'Section', icon: <LayoutTemplate size={18} />, description: 'Section grouping' },
  [NODE_TYPES.MARKDOWN]: { label: 'Markdown', icon: <FileText size={18} />, description: 'Free-form content' },
}

export default function Sidebar() {
  const { selectedNodeId, addChildNode, deleteSelectedNode, nodes, edges, reset } = useSkillStore()
  const fileInputRef = useRef(null)

  const handleAddNode = (type) => {
    if (selectedNodeId) {
      addChildNode(selectedNodeId, type)
    } else {
      addChildNode(null, type)
    }
  }

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'skill-editor-save.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadZip = async () => {
    try {
      const { skillName, files } = generateSkillFiles.all(nodes, edges)
      const zip = new (await import('jszip')).default()
      
      Object.entries(files).forEach(([filename, content]) => {
        zip.file(filename, content)
      })

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${skillName || 'openclaw-skill'}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to generate zip:', error)
      alert('Error generating zip: ' + error.message)
    }
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (data.nodes && data.edges) {
          useSkillStore.getState().loadFromJson(data)
        } else {
          alert('Invalid save file')
        }
      } catch (error) {
        alert('Failed to parse JSON: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="w-64 bg-gray-50 border-r h-full flex flex-col">
      <div className="p-4 border-b bg-white">
        <h1 className="font-bold text-lg text-gray-800">OpenClaw Skill Builder</h1>
        <p className="text-xs text-gray-500 mt-1">Mindmap with Markdown nodes</p>
      </div>

      <div className="p-4 border-b bg-white">
        <h2 className="font-semibold text-sm text-gray-700 mb-3">Add Node</h2>
        <div className="space-y-2">
          {Object.entries(nodeTypeInfo).map(([type, info]) => (
            <button
              key={type}
              onClick={() => handleAddNode(type)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 transition-colors border border-gray-200 group"
            >
              <div 
                className="p-1.5 rounded" 
                style={{ backgroundColor: NODE_COLORS[type] + '20', color: NODE_COLORS[type] }}
              >
                {info.icon}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {info.label}
                </div>
                <div className="text-xs text-gray-500">{info.description}</div>
              </div>
              <Plus size={14} className="ml-auto opacity-50" />
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-b bg-white">
        <h2 className="font-semibold text-sm text-gray-700 mb-3">Actions</h2>
        <div className="space-y-2">
          <button
            onClick={deleteSelectedNode}
            disabled={!selectedNodeId || selectedNodeId === 'root'}
            className="w-full flex items-center gap-2 px-3 py-2 rounded border border-red-200 hover:bg-red-50 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            <span className="text-sm">Delete Selected</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-b bg-white">
        <h2 className="font-semibold text-sm text-gray-700 mb-3">Project</h2>
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded border border-gray-200 hover:bg-gray-50 text-gray-600"
          >
            <FileText size={16} />
            <span className="text-sm">Import Save</span>
          </button>
          <button
            onClick={handleExportJson}
            className="w-full flex items-center gap-2 px-3 py-2 rounded border border-gray-200 hover:bg-gray-50 text-gray-600"
          >
            <Download size={16} />
            <span className="text-sm">Export Save</span>
          </button>
          <button
            onClick={reset}
            className="w-full flex items-center gap-2 px-3 py-2 rounded border border-gray-200 hover:bg-gray-50 text-gray-600"
          >
            <RefreshCw size={16} />
            <span className="text-sm">Reset Canvas</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 text-xs text-gray-500">
        <p className="mb-2"><strong className="text-gray-600">How it works:</strong></p>
        <ul className="list-disc ml-3 space-y-1">
          <li><strong>Every node is a title + Markdown editor</strong></li>
          <li>Double-click any node to edit inline</li>
          <li>Click node to view properties in right panel</li>
          <li>Drag from handles to connect nodes</li>
          <li>Drag nodes to rearrange the mindmap</li>
          <li>All content is written to SKILL.md</li>
        </ul>
      </div>

      <div className="p-4 border-t bg-green-50">
        <button
          onClick={handleDownloadZip}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          <Download size={20} />
          Export Skill ZIP
        </button>
        <p className="text-xs text-green-700 mt-2 text-center">
          Generates SKILL.md + full directory structure
        </p>
      </div>

      <div className="p-3 border-t bg-white">
        <p className="text-xs text-gray-400 text-center">
          Built with React + ReactFlow • OpenClaw
        </p>
      </div>
    </div>
  )
}
