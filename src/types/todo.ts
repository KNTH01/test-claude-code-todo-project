export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category?: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface TodoCategory {
  id: string
  name: string
  color: string
  icon?: string
}

export interface TodoStats {
  total: number
  completed: number
  pending: number
  overdue: number
  completionRate: number
}

export type TodoFilter = {
  category?: string
  priority?: Todo['priority']
  completed?: boolean
  search?: string
  overdue?: boolean
}

export type TodoSort = 'createdAt' | 'dueDate' | 'priority' | 'title'