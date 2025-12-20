import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MoreVertical,
  Plus,
  Clock,
  Calendar,
  User,
  Tag,
  MessageSquare,
  AlertCircle,
  ChevronDown,
  Edit2,
  Trash2,
  GripVertical
} from 'lucide-react'

export interface KanbanTask {
  id: string
  title: string
  description?: string
  projectId: string
  projectName: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  dueDate?: string
  assignee?: string
  tags?: string[]
  commentsCount?: number
  createdAt: string
}

export interface KanbanColumn {
  id: string
  title: string
  color: string
  tasks: KanbanTask[]
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onTaskMove: (taskId: string, fromColumn: string, toColumn: string) => void
  onTaskClick: (task: KanbanTask) => void
  onAddTask: (columnId: string) => void
  onDeleteTask: (taskId: string, columnId: string) => void
  darkMode?: boolean
}

const PRIORITY_CONFIG = {
  low: { label: 'Laag', color: 'bg-gray-100 text-gray-600' },
  normal: { label: 'Normaal', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'Hoog', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700' }
}

function TaskCard({ 
  task, 
  onClick,
  onDelete,
  darkMode = false
}: { 
  task: KanbanTask
  onClick: () => void
  onDelete: () => void
  darkMode?: boolean
}) {
  const [showMenu, setShowMenu] = useState(false)
  const priorityConfig = PRIORITY_CONFIG[task.priority]

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-gray-200'} rounded-xl p-4 shadow-sm border hover:shadow-md transition-all group relative select-none`}
      onClick={onClick}
    >
      {/* Drag Handle */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>

      {/* Menu */}
      <div className="absolute right-2 top-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
        >
          <MoreVertical className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
        </button>
        
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`absolute right-0 mt-1 w-40 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border py-1 z-10`}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => {
                  onClick()
                  setShowMenu(false)
                }}
              >
                <Edit2 className="w-4 h-4" />
                Bewerken
              </button>
              <button 
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 ${darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50'}`}
                onClick={() => {
                  onDelete()
                  setShowMenu(false)
                }}
              >
                <Trash2 className="w-4 h-4" />
                Verwijderen
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Project Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-medium ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-400 bg-gray-50'} px-2 py-0.5 rounded`}>
          {task.projectName}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${priorityConfig.color}`}>
          {priorityConfig.label}
        </span>
      </div>

      {/* Title */}
      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2 pr-6`}>{task.title}</h4>

      {/* Description */}
      {task.description && (
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3 line-clamp-2`}>{task.description}</p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag) => (
            <span 
              key={tag}
              className={`inline-flex items-center gap-1 px-2 py-0.5 ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-700'} text-xs rounded-lg`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={`flex items-center justify-between pt-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-50'}`}>
        <div className={`flex items-center gap-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
              {isOverdue && <AlertCircle className="w-3 h-3" />}
            </div>
          )}
          {task.commentsCount !== undefined && task.commentsCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {task.commentsCount}
            </div>
          )}
        </div>

        {task.assignee && (
          <div className={`w-6 h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center`} title={task.assignee}>
            <User className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function KanbanBoard({
  columns,
  onTaskMove,
  onTaskClick,
  onAddTask,
  onDeleteTask,
  darkMode = false
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<{ task: KanbanTask; fromColumn: string } | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(new Set(columns.map(c => c.id)))

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: KanbanTask, columnId: string) => {
    // Set drag data for HTML5 drag and drop
    e.dataTransfer.setData('text/plain', JSON.stringify({ taskId: task.id, fromColumn: columnId }))
    e.dataTransfer.effectAllowed = 'move'
    
    // Store in state as backup
    setDraggedTask({ task, fromColumn: columnId })
    
    // Add visual feedback
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '0.5'
    }
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Reset visual feedback
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '1'
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only reset if we're actually leaving the column (not entering a child)
    const relatedTarget = e.relatedTarget as HTMLElement
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toColumnId: string) => {
    e.preventDefault()
    setDragOverColumn(null)
    
    // Try to get data from dataTransfer first
    try {
      const data = e.dataTransfer.getData('text/plain')
      if (data) {
        const { taskId, fromColumn } = JSON.parse(data)
        if (fromColumn !== toColumnId) {
          onTaskMove(taskId, fromColumn, toColumnId)
        }
        setDraggedTask(null)
        return
      }
    } catch {
      // Fall back to state
    }
    
    // Fallback to state-based approach
    if (draggedTask && draggedTask.fromColumn !== toColumnId) {
      onTaskMove(draggedTask.task.id, draggedTask.fromColumn, toColumnId)
    }
    setDraggedTask(null)
  }

  const toggleColumn = (columnId: string) => {
    const newExpanded = new Set(expandedColumns)
    if (newExpanded.has(columnId)) {
      newExpanded.delete(columnId)
    } else {
      newExpanded.add(columnId)
    }
    setExpandedColumns(newExpanded)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const isExpanded = expandedColumns.has(column.id)
        
        return (
          <div
            key={column.id}
            className={`flex-shrink-0 ${isExpanded ? 'w-80' : 'w-12'} transition-all duration-300`}
          >
            {/* Collapsed Column */}
            {!isExpanded ? (
              <button
                onClick={() => toggleColumn(column.id)}
                className={`h-full min-h-[400px] w-12 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl flex flex-col items-center py-4 transition`}
              >
                <div 
                  className="w-3 h-3 rounded-full mb-3" 
                  style={{ backgroundColor: column.color }}
                />
                <span 
                  className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium text-sm`}
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  {column.title} ({column.tasks.length})
                </span>
              </button>
            ) : (
              /* Expanded Column */
              <div
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-xl p-3 h-full min-h-[400px] transition-all duration-200 ${
                  dragOverColumn === column.id 
                    ? 'ring-2 ring-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
                    : ''
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{column.title}</h3>
                    <span className={`px-2 py-0.5 ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'} text-xs font-medium rounded-full`}>
                      {column.tasks.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onAddTask(column.id)}
                      className={`p-1.5 ${darkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'} rounded-lg transition`}
                      title="Taak toevoegen"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleColumn(column.id)}
                      className={`p-1.5 ${darkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'} rounded-lg transition`}
                      title="Kolom inklappen"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                  <AnimatePresence>
                    {column.tasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task, column.id)}
                        onDragEnd={handleDragEnd}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <TaskCard
                          task={task}
                          onClick={() => onTaskClick(task)}
                          onDelete={() => onDeleteTask(task.id, column.id)}
                          darkMode={darkMode}
                        />
                      </div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Empty State */}
                {column.tasks.length === 0 && (
                  <div className={`py-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Geen taken</p>
                    <button
                      onClick={() => onAddTask(column.id)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Taak toevoegen
                    </button>
                  </div>
                )}

                {/* Add Task Button */}
                {column.tasks.length > 0 && (
                  <button
                    onClick={() => onAddTask(column.id)}
                    className={`w-full mt-3 py-2 border-2 border-dashed ${darkMode ? 'border-gray-700 text-gray-500 hover:text-gray-400 hover:border-gray-600' : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'} rounded-xl transition flex items-center justify-center gap-2 text-sm`}
                  >
                    <Plus className="w-4 h-4" />
                    Taak toevoegen
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Helper function to generate default columns
export function getDefaultColumns(tasks: KanbanTask[] = []): KanbanColumn[] {
  return [
    {
      id: 'backlog',
      title: 'Backlog',
      color: '#9CA3AF',
      tasks: tasks.filter(t => t.projectId === 'backlog')
    },
    {
      id: 'todo',
      title: 'Te Doen',
      color: '#3B82F6',
      tasks: tasks.filter(t => t.projectId === 'todo')
    },
    {
      id: 'in_progress',
      title: 'Bezig',
      color: '#F59E0B',
      tasks: tasks.filter(t => t.projectId === 'in_progress')
    },
    {
      id: 'review',
      title: 'Review',
      color: '#8B5CF6',
      tasks: tasks.filter(t => t.projectId === 'review')
    },
    {
      id: 'done',
      title: 'Afgerond',
      color: '#10B981',
      tasks: tasks.filter(t => t.projectId === 'done')
    }
  ]
}
