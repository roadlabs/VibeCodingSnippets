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
  Settings,
  Code,
  Edit3,
  Star
} from 'lucide-react'
import useSkillStore from '../store/useSkillStore'
import generateSkillFiles from '../utils/generate'

const nodeTypeInfo = {
  [NODE_TYPES.ROOT]: { 
    label: '根节点', 
    emoji: '📖',
    icon: <BookOpen size={18} />, 
    description: '技能元信息' 
  },
  [NODE_TYPES.FEATURE]: { 
    label: '功能特性', 
    emoji: '⭐',
    icon: <Star size={18} />, 
    description: '列出功能特性' 
  },
  [NODE_TYPES.USAGE]: { 
    label: '使用流程', 
    emoji: '▶️',
    icon: <Play size={18} />, 
    description: '步骤化使用流程' 
  },
  [NODE_TYPES.COMMAND]: { 
    label: '命令说明', 
    emoji: '⌨️',
    icon: <Terminal size={18} />, 
    description: '命令文档说明' 
  },
  [NODE_TYPES.PARAMETER]: { 
    label: '参数定义', 
    emoji: '⚙️',
    icon: <Settings size={18} />, 
    description: '参数表格说明' 
  },
  [NODE_TYPES.EXAMPLE]: { 
    label: '使用示例', 
    emoji: '💻',
    icon: <Code size={18} />, 
    description: '使用示例展示' 
  },
  [NODE_TYPES.NOTE]: { 
    label: '备注说明', 
    emoji: '📝',
    icon: <Edit3 size={18} />, 
    description: '备注和注意事项' 
  },
}

export default function Sidebar({ onNodeAdded } = {}) {
  const { selectedNodeId, addChildNode, deleteSelectedNode, nodes, edges, reset } = useSkillStore()
  const fileInputRef = useRef(null)

  const handleAddNode = (type) => {
    if (selectedNodeId) {
      addChildNode(selectedNodeId, type)
    } else {
      addChildNode(null, type)
    }
    // Callback for mobile to close sidebar
    if (onNodeAdded) {
      onNodeAdded()
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
    <div className="w-full md:w-64 bg-gray-50 border-r h-full flex flex-col overflow-y-auto">
      <div className="p-3 md:p-4 border-b bg-white shrink-0">
        <h1 className="font-bold text-base md:text-lg text-gray-800">OpenClaw Skill Builder</h1>
        <p className="text-xs text-gray-500 mt-1 hidden md:block">可视化技能编辑器</p>
      </div>

      <div className="p-3 md:p-4 border-b bg-white shrink-0">
        <h2 className="font-semibold text-sm text-gray-700 mb-3">添加节点</h2>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          {Object.entries(nodeTypeInfo).map(([type, info]) => (
            <button
              key={type}
              onClick={() => handleAddNode(type)}
              className="w-full flex items-center gap-2 px-2 md:px-3 py-2 rounded hover:bg-gray-100 transition-colors border border-gray-200 group text-left"
            >
              <div 
                className="p-1 rounded shrink-0" 
                style={{ backgroundColor: NODE_COLORS[type] + '20', color: NODE_COLORS[type] }}
              >
                {info.icon}
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
                  {info.label}
                </div>
              </div>
              <Plus size={12} className="opacity-50 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 md:p-4 border-b bg-white shrink-0">
        <h2 className="font-semibold text-sm text-gray-700 mb-3">操作</h2>
        <div className="space-y-2">
          <button
            onClick={deleteSelectedNode}
            disabled={!selectedNodeId || selectedNodeId === 'root'}
            className="w-full flex items-center gap-2 px-3 py-2 rounded border border-red-200 hover:bg-red-50 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Trash2 size={16} />
            <span>删除选中</span>
          </button>
          <button
            onClick={reset}
            className="w-full flex items-center gap-2 px-3 py-2 rounded border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm"
          >
            <RefreshCw size={16} />
            <span>重置画布</span>
          </button>
        </div>
      </div>

      <div className="p-3 md:p-4 border-b bg-white shrink-0">
        <h2 className="font-semibold text-sm text-gray-700 mb-3">项目</h2>
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
            className="w-full flex items-center gap-2 px-3 py-2 rounded border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm"
          >
            <FileText size={16} />
            <span>导入项目</span>
          </button>
          <button
            onClick={handleExportJson}
            className="w-full flex items-center gap-2 px-3 py-2 rounded border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm"
          >
            <Download size={16} />
            <span>导出项目</span>
          </button>
        </div>
      </div>

      {/* Remote Deployment Configuration */}
      <div className="p-3 md:p-4 border-t bg-blue-50 shrink-0">
        <h2 className="font-semibold text-sm text-gray-700 mb-3">远程部署</h2>
        <div className="space-y-2 text-sm">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">部署地址</label>
            <input 
              type="text" 
              defaultValue={localStorage.getItem('ocsb_deploy_url') || ''}
              onChange={(e) => localStorage.setItem('ocsb_deploy_url', e.target.value)}
              placeholder="部署API地址"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">测试地址</label>
            <input 
              type="text" 
              defaultValue={localStorage.getItem('ocsb_test_url') || ''}
              onChange={(e) => localStorage.setItem('ocsb_test_url', e.target.value)}
              placeholder="测试API地址"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">访问 Token</label>
            <input 
              type="password" 
              defaultValue={localStorage.getItem('ocsb_access_token') || ''}
              onChange={(e) => localStorage.setItem('ocsb_access_token', e.target.value)}
              placeholder="Token"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="p-3 md:p-4 border-t bg-green-50 shrink-0">
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={async () => {
              try {
                const deployUrl = localStorage.getItem('ocsb_deploy_url');
                const token = localStorage.getItem('ocsb_access_token');
                if (!deployUrl) {
                  alert('请先填写部署地址');
                  return;
                }
                if (!token) {
                  alert('请先填写访问 Token');
                  return;
                }
                const { nodes, edges } = useSkillStore.getState();
                const { skillName, files } = generateSkillFiles.all(nodes, edges);
                const response = await fetch(deployUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ skillName, files })
                });
                const result = await response.json();
                if (response.ok) {
                  alert(`部署成功！\n\n技能: ${skillName}`);
                } else {
                  alert(`部署失败: ${result.message || response.statusText}`);
                }
              } catch (error) {
                alert('部署错误: ' + error.message);
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
          >
            <span>🚀</span>
            <span>远程部署</span>
          </button>
          <button
            onClick={async () => {
              try {
                const testUrl = localStorage.getItem('ocsb_test_url');
                const { nodes, edges } = useSkillStore.getState();
                const { skillName, files } = generateSkillFiles.all(nodes, edges);
                if (!testUrl) {
                  let output = `技能: ${skillName}\n\n`;
                  Object.entries(files).forEach(([filename, content]) => {
                    output += `=== ${filename} ===\n${content}\n\n`;
                  });
                  alert(output);
                  return;
                }
                const token = localStorage.getItem('ocsb_access_token');
                if (!token) {
                  alert('请先填写访问 Token');
                  return;
                }
                const response = await fetch(testUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ skillName, files })
                });
                const result = await response.json();
                if (response.ok) {
                  alert(`测试成功！\n\n技能: ${skillName}`);
                } else {
                  alert(`测试失败: ${result.message || response.statusText}`);
                }
              } catch (error) {
                const { nodes, edges } = useSkillStore.getState();
                let output = `技能测试\n\n`;
                const { files } = generateSkillFiles.all(nodes, edges);
                Object.entries(files).forEach(([filename, content]) => {
                  output += `=== ${filename} ===\n${content}\n\n`;
                });
                alert(output);
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <span>🧪</span>
            <span>测试生成</span>
          </button>
          <button
            onClick={handleDownloadZip}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
          >
            <Download size={16} />
            <span>下载 ZIP</span>
          </button>
        </div>
      </div>

      <div className="p-3 border-t bg-white mt-auto shrink-0">
        <p className="text-xs text-gray-400 text-center hidden md:block">
          Built with React + ReactFlow
        </p>
      </div>
    </div>
  )
}
