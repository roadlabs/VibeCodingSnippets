
import React, { useState, useEffect, useRef } from 'react'
import { Handle, Position } from 'reactflow'
import { clsx } from 'clsx'
import { NODE_COLORS, NODE_TYPES } from '../types'
import { 
  MoreVertical, 
  FileText, 
  Play, 
  BookOpen,
  Edit3,
  LayoutTemplate
} from 'lucide-react'

const iconMap = {
  [NODE_TYPES.ROOT]: <BookOpen size={16} />,
  [NODE_TYPES.MARKDOWN]: <FileText size={16} />,
  [NODE_TYPES.FEATURE]: <Play size={16} />,
  [NODE_TYPES.SECTION]: <LayoutTemplate size={16} />,
}

// Simple markdown parser for preview
const renderMarkdown = (text) => {
  if (!text) return ''
  // Very basic rendering for preview
  return text
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n/g, '<br />')
}

export default function CustomNode({ data, selected, type, id, data: { title, content = '', onUpdate }, updateNodeData }) {
  const color = NODE_COLORS[type] || '#666'
  const [isEditing, setIsEditing] = useState(false)
  const [localTitle, setLocalTitle] = useState(title || data.label || '')
  const [localContent, setLocalContent] = useState(content || data.content || '')
  const titleRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    setLocalTitle(title || data.label || '')
    setLocalContent(content || data.content || '')
  }, [title, content, data])

  useEffect(() => {
    if (isEditing && selected) {
      if (titleRef.current) {
        titleRef.current.focus()
      } else if (contentRef.current) {
        contentRef.current.focus()
      }
    }
  }, [isEditing, selected])

  const handleTitleChange = (e) => {
    setLocalTitle(e.target.value)
  }

  const handleContentChange = (e) => {
    setLocalContent(e.target.value)
  }

  const handleBlur = () => {
    data.title = localTitle
    data.content = localContent
    data.label = localTitle // For ReactFlow display
    setIsEditing(false)
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const getMinWidth = () => {
    switch (type) {
      case NODE_TYPES.ROOT: return '300px'
      case NODE_TYPES.DESCRIPTION: return '280px'
      case NODE_TYPES.EXAMPLE: return '280px'
      default: return '220px'
    }
  }

  const getMinHeight = () => {
    switch (type) {
      case NODE_TYPES.ROOT: return '180px'
      case NODE_TYPES.DESCRIPTION: return '150px'
      case NODE_TYPES.EXAMPLE: return '160px'
      default: return '120px'
    }
  }

  return (
    <div 
      className={clsx(
        'rounded-lg shadow-md border-2 bg-white transition-all relative',
        selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200',
      )}
      style={{ 
        borderTopColor: color, 
        borderTopWidth: 4,
        minWidth: getMinWidth(),
        minHeight: getMinHeight(),
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      
      {/* Editor Mode */}
      {isEditing && (
        <div className="p-3 space-y-2">
          <input
            ref={titleRef}
            type="text"
            value={localTitle}
            onChange={handleTitleChange}
            onBlur={handleBlur}
            placeholder="Node title..."
            className="w-full px-2 py-1 border-b border-blue-300 focus:outline-none focus:border-blue-500 font-semibold text-gray-800 bg-transparent"
          />
          <textarea
            ref={contentRef}
            value={localContent}
            onChange={handleContentChange}
            onBlur={handleBlur}
            placeholder="Write your content in Markdown..."
            className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm resize-none"
            style={{ minHeight: '100px' }}
          />
        </div>
      )}

      {/* Preview Mode */}
      {!isEditing && (
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
            <div className="p-1 rounded" style={{ backgroundColor: color + '20', color }}>
              {iconMap[type] || <MoreVertical size={16} />}
            </div>
            <div className="font-semibold text-sm text-gray-800 truncate flex-1">
              {localTitle || type}
            </div>
            <Edit3 size={14} className="text-gray-400 opacity-50" />
          </div>
          <div 
            className="text-sm text-gray-700 overflow-auto max-h-[300px] prose prose-sm"
            style={{ fontSize: '0.875rem', lineHeight: '1.4' }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(localContent) }}
          />
          {!localContent && (
            <div className="text-gray-400 text-xs italic mt-2">
              Double-click to edit Markdown content...
            </div>
          )}
        </div>
      )}

      <div className="absolute -top-2 -right-2">
        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded-full text-gray-600">
          {type}
        </span>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-gray-400" />
    </div>
  )
}
