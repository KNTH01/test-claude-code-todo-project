<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-900">
    <!-- Header -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <router-link to="/" class="btn btn-ghost btn-circle">
              <span class="text-xl">←</span>
            </router-link>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Statistics</h1>
              <p class="text-gray-600 dark:text-gray-300">Your productivity insights</p>
            </div>
          </div>
          
          <div class="text-4xl">📊</div>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-300">Total Tasks</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
            </div>
            <div class="text-3xl">📝</div>
          </div>
        </div>

        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-300">Completed</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.completed }}</p>
            </div>
            <div class="text-3xl">✅</div>
          </div>
        </div>

        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-300">Pending</p>
              <p class="text-2xl font-bold text-blue-600">{{ stats.pending }}</p>
            </div>
            <div class="text-3xl">⏳</div>
          </div>
        </div>

        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-300">Overdue</p>
              <p class="text-2xl font-bold text-red-600">{{ stats.overdue }}</p>
            </div>
            <div class="text-3xl">⚠️</div>
          </div>
        </div>
      </div>

      <!-- Progress Chart -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Completion Progress</h2>
        
        <div class="space-y-4">
          <!-- Overall Progress -->
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600 dark:text-gray-300">Overall Completion</span>
              <span class="font-medium">{{ stats.completionRate }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4">
              <div 
                class="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
                :style="{ width: `${stats.completionRate}%` }"
              ></div>
            </div>
          </div>

          <!-- Priority Breakdown -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div v-for="priority in priorityStats" :key="priority.name" class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="flex items-center space-x-1">
                  <span>{{ priority.icon }}</span>
                  <span class="text-gray-600 dark:text-gray-300">{{ priority.name }}</span>
                </span>
                <span class="font-medium">{{ priority.completed }}/{{ priority.total }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-1000 ease-out"
                  :class="priority.colorClass"
                  :style="{ width: `${priority.percentage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Category Breakdown</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="category in categoryStats" :key="category.id" class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="flex items-center space-x-2">
                <span class="text-lg">{{ category.icon }}</span>
                <span class="text-gray-900 dark:text-white">{{ category.name }}</span>
              </span>
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {{ category.completed }}/{{ category.total }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-1000 ease-out"
                :class="`bg-${category.color}`"
                :style="{ width: `${category.percentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Achievements</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="achievement in achievements" 
            :key="achievement.id"
            class="p-4 rounded-lg border-2 transition-all duration-300"
            :class="achievement.unlocked ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700 opacity-50'"
          >
            <div class="text-center">
              <div class="text-3xl mb-2">{{ achievement.icon }}</div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ achievement.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ achievement.description }}</p>
              <div v-if="achievement.progress !== undefined" class="mt-2">
                <div class="text-xs text-gray-500 mb-1">{{ achievement.progress }}/{{ achievement.target }}</div>
                <div class="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    class="bg-yellow-400 h-1 rounded-full transition-all duration-500"
                    :style="{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTodos } from '@/composables/useTodos'

const { allTodos, categories, stats } = useTodos()

const priorityStats = computed(() => {
  const priorities = ['high', 'medium', 'low'] as const
  return priorities.map(priority => {
    const todos = allTodos.value.filter(todo => todo.priority === priority)
    const completed = todos.filter(todo => todo.completed).length
    const total = todos.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return {
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      icon: priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢',
      completed,
      total,
      percentage,
      colorClass: priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
    }
  })
})

const categoryStats = computed(() => {
  const uncategorized = allTodos.value.filter(todo => !todo.category)
  const uncategorizedCompleted = uncategorized.filter(todo => todo.completed).length
  
  const categoryData = categories.value.map(category => {
    const todos = allTodos.value.filter(todo => todo.category === category.id)
    const completed = todos.filter(todo => todo.completed).length
    const total = todos.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      completed,
      total,
      percentage,
    }
  }).filter(cat => cat.total > 0)

  // Add uncategorized if there are any
  if (uncategorized.length > 0) {
    categoryData.push({
      id: 'uncategorized',
      name: 'Uncategorized',
      icon: '📋',
      color: 'gray-500',
      completed: uncategorizedCompleted,
      total: uncategorized.length,
      percentage: Math.round((uncategorizedCompleted / uncategorized.length) * 100),
    })
  }

  return categoryData
})

const achievements = computed(() => {
  const totalTodos = stats.value.total
  const completedTodos = stats.value.completed
  const completionRate = stats.value.completionRate

  return [
    {
      id: 'first-todo',
      title: 'Getting Started',
      description: 'Create your first todo',
      icon: '🎯',
      unlocked: totalTodos >= 1,
      progress: Math.min(totalTodos, 1),
      target: 1,
    },
    {
      id: 'task-master',
      title: 'Task Master',
      description: 'Complete 10 todos',
      icon: '🏆',
      unlocked: completedTodos >= 10,
      progress: Math.min(completedTodos, 10),
      target: 10,
    },
    {
      id: 'productivity-guru',
      title: 'Productivity Guru',
      description: 'Complete 50 todos',
      icon: '🚀',
      unlocked: completedTodos >= 50,
      progress: Math.min(completedTodos, 50),
      target: 50,
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Achieve 100% completion rate',
      icon: '💎',
      unlocked: completionRate === 100 && totalTodos > 0,
      progress: completionRate,
      target: 100,
    },
    {
      id: 'organized',
      title: 'Well Organized',
      description: 'Use all priority levels',
      icon: '📊',
      unlocked: priorityStats.value.every(p => p.total > 0),
    },
    {
      id: 'multi-tasker',
      title: 'Multi-tasker',
      description: 'Have todos in 3+ categories',
      icon: '🎭',
      unlocked: categoryStats.value.length >= 3,
      progress: Math.min(categoryStats.value.length, 3),
      target: 3,
    },
  ]
})
</script>