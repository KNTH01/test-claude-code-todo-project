<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900">
    <!-- Header -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="text-3xl">✨</div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Creative Todos</h1>
              <p class="text-gray-600 dark:text-gray-300">Organize your life with style</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Stats Summary -->
            <div class="hidden sm:flex items-center space-x-4 text-sm">
              <div class="bg-primary/10 px-3 py-1 rounded-full">
                <span class="text-primary font-medium">{{ stats.completed }}/{{ stats.total }}</span>
              </div>
              <div class="text-gray-600 dark:text-gray-300">
                {{ stats.completionRate }}% complete
              </div>
            </div>
            
            <!-- Theme Toggle -->
            <button 
              @click="toggleTheme" 
              class="btn btn-ghost btn-circle"
              :class="isDark ? 'text-yellow-500' : 'text-gray-600'"
            >
              <span class="text-xl">{{ isDark ? '☀️' : '🌙' }}</span>
            </button>
            
            <!-- Stats Link -->
            <router-link to="/stats" class="btn btn-ghost btn-sm">
              📊 Stats
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Add Todo Form -->
        <div class="md:col-span-2">
          <TodoForm @add="handleAddTodo" />
        </div>
        
        <!-- Quick Stats Card -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Today's Progress</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-300">Completed</span>
              <span class="font-bold text-green-600">{{ stats.completed }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-300">Remaining</span>
              <span class="font-bold text-blue-600">{{ stats.pending }}</span>
            </div>
            <div class="flex justify-between items-center" v-if="stats.overdue > 0">
              <span class="text-sm text-gray-600 dark:text-gray-300">Overdue</span>
              <span class="font-bold text-red-600">{{ stats.overdue }}</span>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="mt-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-300">Progress</span>
              <span class="font-medium">{{ stats.completionRate }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${stats.completionRate}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <TodoFilters 
          v-model:filter="filter" 
          v-model:sort="sortBy"
          :categories="categories"
        />
      </div>

      <!-- Todo List -->
      <div class="space-y-4">
        <div v-if="todos.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🎯</div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No todos yet!</h3>
          <p class="text-gray-600 dark:text-gray-300">Add your first todo above to get started.</p>
        </div>
        
        <TransitionGroup name="todo" tag="div" class="space-y-4">
          <TodoItem
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            :categories="categories"
            @toggle="handleToggleTodo"
            @update="handleUpdateTodo"
            @delete="handleDeleteTodo"
          />
        </TransitionGroup>
      </div>

      <!-- Floating Action Button for Mobile -->
      <div class="fixed bottom-6 right-6 md:hidden">
        <button 
          @click="showMobileForm = !showMobileForm"
          class="btn btn-primary btn-circle btn-lg shadow-lg"
        >
          <span class="text-xl">{{ showMobileForm ? '✕' : '➕' }}</span>
        </button>
      </div>

      <!-- Mobile Add Form Modal -->
      <div 
        v-if="showMobileForm" 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
        @click="showMobileForm = false"
      >
        <div 
          class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl p-6"
          @click.stop
        >
          <TodoForm @add="handleAddTodo" @cancel="showMobileForm = false" />
        </div>
      </div>
    </main>

    <!-- Confetti -->
    <div 
      v-if="showConfetti" 
      class="fixed inset-0 pointer-events-none z-40"
    >
      <div class="confetti"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodos } from '@/composables/useTodos'
import TodoForm from '@/components/todo/TodoForm.vue'
import TodoItem from '@/components/todo/TodoItem.vue'
import TodoFilters from '@/components/todo/TodoFilters.vue'
import type { Todo } from '@/types/todo'

const {
  todos,
  categories,
  filter,
  sortBy,
  stats,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} = useTodos()

const showMobileForm = ref(false)
const showConfetti = ref(false)
const isDark = ref(false)

// Theme management
const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Initialize theme
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

// Todo handlers
const handleAddTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
  addTodo(todoData)
  showMobileForm.value = false
}

const handleToggleTodo = (id: string) => {
  const todo = toggleTodo(id)
  if (todo?.completed) {
    triggerConfetti()
  }
}

const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
  updateTodo(id, updates)
}

const handleDeleteTodo = (id: string) => {
  deleteTodo(id)
}

// Confetti animation
const triggerConfetti = () => {
  showConfetti.value = true
  setTimeout(() => {
    showConfetti.value = false
  }, 3000)
}
</script>

<style scoped>
.todo-enter-active,
.todo-leave-active {
  transition: all 0.3s ease;
}

.todo-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.todo-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.confetti {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
  animation: confetti-fall 3s ease-out forwards;
}

.confetti::before,
.confetti::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: inherit;
  border-radius: 50%;
}

.confetti::before {
  animation: confetti-spin 3s linear infinite;
}

.confetti::after {
  animation: confetti-spin 3s linear infinite reverse;
}

@keyframes confetti-fall {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, 300px) scale(1);
    opacity: 0;
  }
}

@keyframes confetti-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>