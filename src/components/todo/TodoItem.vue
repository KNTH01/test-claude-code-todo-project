<template>
  <div
    class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
    :class="{
      'opacity-75': todo.completed,
      'border-l-4 border-l-red-500': priority === 'high',
      'border-l-4 border-l-yellow-500': priority === 'medium',
      'border-l-4 border-l-green-500': priority === 'low',
    }"
  >
    <div class="p-6">
      <div class="flex items-start space-x-4">
        <!-- Completion Checkbox -->
        <label class="cursor-pointer">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="$emit('toggle', todo.id)"
            class="checkbox checkbox-primary"
          />
        </label>

        <!-- Todo Content -->
        <div class="flex-1 min-w-0">
          <!-- Title and Category -->
          <div class="flex items-center justify-between mb-2">
            <h3
              class="text-lg font-medium transition-all duration-300"
              :class="{
                'line-through text-gray-500 dark:text-gray-400': todo.completed,
                'text-gray-900 dark:text-white': !todo.completed,
              }"
            >
              {{ todo.title }}
            </h3>
            
            <!-- Priority Badge -->
            <div class="flex items-center space-x-2">
              <span
                v-if="priority"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="priorityClasses"
              >
                {{ priorityIcons[priority] }} {{ priority.charAt(0).toUpperCase() + priority.slice(1) }}
              </span>
              
              <!-- Category Badge -->
              <span
                v-if="categoryInfo"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="`bg-${categoryInfo.color}/10 text-${categoryInfo.color}`"
              >
                {{ categoryInfo.icon }} {{ categoryInfo.name }}
              </span>
            </div>
          </div>

          <!-- Description (if exists) -->
          <p
            v-if="todo.description"
            class="text-gray-600 dark:text-gray-300 mb-3"
            :class="{ 'line-through': todo.completed }"
          >
            {{ todo.description }}
          </p>

          <!-- Meta Information -->
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center space-x-4">
              <!-- Due Date -->
              <span v-if="todo.dueDate" class="flex items-center space-x-1">
                <span>📅</span>
                <span
                  :class="{
                    'text-red-600 font-medium': isOverdue && !todo.completed,
                    'text-green-600': isDueToday && !todo.completed,
                  }"
                >
                  {{ formatDate(todo.dueDate) }}
                </span>
              </span>
              
              <!-- Creation Date -->
              <span class="flex items-center space-x-1">
                <span>🕒</span>
                <span>{{ formatDate(todo.createdAt) }}</span>
              </span>
            </div>

            <!-- Overdue Indicator -->
            <div v-if="isOverdue && !todo.completed" class="flex items-center space-x-1 text-red-600">
              <span>⚠️</span>
              <span class="font-medium">Overdue</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-2">
          <!-- Edit Button -->
          <button
            @click="toggleEdit"
            class="btn btn-ghost btn-sm btn-circle"
            :class="{ 'btn-active': isEditing }"
          >
            <span class="text-sm">✏️</span>
          </button>
          
          <!-- Delete Button -->
          <button
            @click="handleDelete"
            class="btn btn-ghost btn-sm btn-circle hover:btn-error"
          >
            <span class="text-sm">🗑️</span>
          </button>
        </div>
      </div>

      <!-- Edit Form (when editing) -->
      <Transition name="fade">
        <div v-if="isEditing" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <TodoEditForm
            :todo="todo"
            :categories="categories"
            @save="handleSave"
            @cancel="isEditing = false"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Todo, TodoCategory } from '@/types/todo'
import TodoEditForm from './TodoEditForm.vue'

interface Props {
  todo: Todo
  categories: TodoCategory[]
}

interface Emits {
  (e: 'toggle', id: string): void
  (e: 'update', id: string, updates: Partial<Todo>): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEditing = ref(false)

const priority = computed(() => props.todo.priority)

const priorityIcons = {
  low: '🟢',
  medium: '🟡',
  high: '🔴',
}

const priorityClasses = computed(() => {
  switch (priority.value) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
})

const categoryInfo = computed(() => {
  if (!props.todo.category) return null
  return props.categories.find(cat => cat.id === props.todo.category)
})

const isOverdue = computed(() => {
  if (!props.todo.dueDate || props.todo.completed) return false
  return props.todo.dueDate < new Date()
})

const isDueToday = computed(() => {
  if (!props.todo.dueDate) return false
  const today = new Date()
  const dueDate = props.todo.dueDate
  return (
    dueDate.getDate() === today.getDate() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getFullYear() === today.getFullYear()
  )
})

const formatDate = (date: Date) => {
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays === -1) {
    return 'Tomorrow'
  } else if (diffDays > 0 && diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 0 && diffDays > -7) {
    return `In ${Math.abs(diffDays)} days`
  } else {
    return date.toLocaleDateString()
  }
}

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

const handleSave = (updates: Partial<Todo>) => {
  emit('update', props.todo.id, updates)
  isEditing.value = false
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this todo?')) {
    emit('delete', props.todo.id)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>