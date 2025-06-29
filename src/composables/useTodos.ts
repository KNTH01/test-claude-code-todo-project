import { ref, computed, watch } from 'vue'
import type { Todo, TodoCategory, TodoFilter, TodoSort, TodoStats } from '@/types/todo'

const STORAGE_KEY = 'creative-todo-app'
const CATEGORIES_KEY = 'creative-todo-categories'

export function useTodos() {
  const todos = ref<Todo[]>([])
  const categories = ref<TodoCategory[]>([
    { id: '1', name: 'Personal', color: 'primary', icon: '👤' },
    { id: '2', name: 'Work', color: 'secondary', icon: '💼' },
    { id: '3', name: 'Shopping', color: 'accent', icon: '🛒' },
    { id: '4', name: 'Health', color: 'success', icon: '🏥' },
  ])
  
  const filter = ref<TodoFilter>({})
  const sortBy = ref<TodoSort>('createdAt')

  // Load from localStorage
  const loadTodos = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        todos.value = parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }))
      }

      const storedCategories = localStorage.getItem(CATEGORIES_KEY)
      if (storedCategories) {
        categories.value = JSON.parse(storedCategories)
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error)
    }
  }

  // Save to localStorage
  const saveTodos = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories.value))
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error)
    }
  }

  // Watch for changes and save
  watch(todos, saveTodos, { deep: true })
  watch(categories, saveTodos, { deep: true })

  // Create new todo
  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    todos.value.push(newTodo)
    return newTodo
  }

  // Update existing todo
  const updateTodo = (id: string, updates: Partial<Todo>) => {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos.value[index] = {
        ...todos.value[index],
        ...updates,
        updatedAt: new Date(),
      }
      return todos.value[index]
    }
    return null
  }

  // Delete todo
  const deleteTodo = (id: string) => {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index !== -1) {
      const deleted = todos.value.splice(index, 1)[0]
      return deleted
    }
    return null
  }

  // Toggle completion
  const toggleTodo = (id: string) => {
    return updateTodo(id, { completed: !todos.value.find(t => t.id === id)?.completed })
  }

  // Filtered and sorted todos
  const filteredTodos = computed(() => {
    let result = [...todos.value]

    // Apply filters
    if (filter.value.category) {
      result = result.filter(todo => todo.category === filter.value.category)
    }
    if (filter.value.priority) {
      result = result.filter(todo => todo.priority === filter.value.priority)
    }
    if (filter.value.completed !== undefined) {
      result = result.filter(todo => todo.completed === filter.value.completed)
    }
    if (filter.value.search) {
      const search = filter.value.search.toLowerCase()
      result = result.filter(todo => 
        todo.title.toLowerCase().includes(search) ||
        todo.description?.toLowerCase().includes(search)
      )
    }
    if (filter.value.overdue) {
      const now = new Date()
      result = result.filter(todo => 
        todo.dueDate && todo.dueDate < now && !todo.completed
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy.value) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.getTime() - b.dueDate.getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'createdAt':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

    return result
  })

  // Statistics
  const stats = computed<TodoStats>(() => {
    const total = todos.value.length
    const completed = todos.value.filter(todo => todo.completed).length
    const pending = total - completed
    const now = new Date()
    const overdue = todos.value.filter(todo => 
      todo.dueDate && todo.dueDate < now && !todo.completed
    ).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
    }
  })

  // Add category
  const addCategory = (categoryData: Omit<TodoCategory, 'id'>) => {
    const newCategory: TodoCategory = {
      ...categoryData,
      id: crypto.randomUUID(),
    }
    categories.value.push(newCategory)
    return newCategory
  }

  // Delete category
  const deleteCategory = (id: string) => {
    const index = categories.value.findIndex(cat => cat.id === id)
    if (index !== -1) {
      // Remove category from todos
      todos.value.forEach(todo => {
        if (todo.category === id) {
          updateTodo(todo.id, { category: undefined })
        }
      })
      return categories.value.splice(index, 1)[0]
    }
    return null
  }

  // Initialize
  loadTodos()

  return {
    todos: filteredTodos,
    allTodos: todos,
    categories,
    filter,
    sortBy,
    stats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    addCategory,
    deleteCategory,
    loadTodos,
    saveTodos,
  }
}