<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-gray-900 dark:text-white">Filters & Search</h3>
    
    <!-- Search -->
    <div class="form-control">
      <div class="relative">
        <input
          :value="filter.search || ''"
          @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search todos..."
          class="input input-bordered w-full pr-10 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span class="text-gray-400">🔍</span>
        </div>
      </div>
    </div>

    <!-- Filter Row -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <!-- Category Filter -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Category</span>
        </label>
        <select
          :value="filter.category || ''"
          @change="updateFilter('category', ($event.target as HTMLSelectElement).value)"
          class="select select-bordered select-sm bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.icon }} {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Priority Filter -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Priority</span>
        </label>
        <select
          :value="filter.priority || ''"
          @change="updateFilter('priority', ($event.target as HTMLSelectElement).value)"
          class="select select-bordered select-sm bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
        >
          <option value="">All Priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>

      <!-- Status Filter -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Status</span>
        </label>
        <select
          :value="filter.completed !== undefined ? filter.completed.toString() : ''"
          @change="updateCompletedFilter(($event.target as HTMLSelectElement).value)"
          class="select select-bordered select-sm bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
        >
          <option value="">All Tasks</option>
          <option value="false">📝 Pending</option>
          <option value="true">✅ Completed</option>
        </select>
      </div>

      <!-- Sort By -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Sort By</span>
        </label>
        <select
          :value="sort"
          @change="$emit('update:sort', ($event.target as HTMLSelectElement).value)"
          class="select select-bordered select-sm bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
        >
          <option value="createdAt">📅 Date Created</option>
          <option value="dueDate">⏰ Due Date</option>
          <option value="priority">🎯 Priority</option>
          <option value="title">📝 Title</option>
        </select>
      </div>
    </div>

    <!-- Quick Filter Chips -->
    <div class="flex flex-wrap gap-2">
      <button
        @click="updateFilter('overdue', !filter.overdue)"
        class="btn btn-sm"
        :class="filter.overdue ? 'btn-error' : 'btn-ghost'"
      >
        ⚠️ Overdue Only
      </button>
      
      <button
        @click="clearAllFilters"
        class="btn btn-ghost btn-sm"
        v-if="hasActiveFilters"
      >
        🗑️ Clear Filters
      </button>
    </div>

    <!-- Active Filters Summary -->
    <div v-if="hasActiveFilters" class="text-sm text-gray-600 dark:text-gray-300">
      <span class="font-medium">Active filters:</span>
      <div class="flex flex-wrap gap-2 mt-1">
        <span v-if="filter.search" class="badge badge-primary badge-sm">
          Search: "{{ filter.search }}"
        </span>
        <span v-if="filter.category" class="badge badge-secondary badge-sm">
          Category: {{ getCategoryName(filter.category) }}
        </span>
        <span v-if="filter.priority" class="badge badge-accent badge-sm">
          Priority: {{ filter.priority }}
        </span>
        <span v-if="filter.completed !== undefined" class="badge badge-info badge-sm">
          Status: {{ filter.completed ? 'Completed' : 'Pending' }}
        </span>
        <span v-if="filter.overdue" class="badge badge-error badge-sm">
          Overdue Only
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TodoFilter, TodoSort, TodoCategory } from '@/types/todo'

interface Props {
  filter: TodoFilter
  sort: TodoSort
  categories: TodoCategory[]
}

interface Emits {
  (e: 'update:filter', filter: TodoFilter): void
  (e: 'update:sort', sort: TodoSort): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const hasActiveFilters = computed(() => {
  return !!(
    props.filter.search ||
    props.filter.category ||
    props.filter.priority ||
    props.filter.completed !== undefined ||
    props.filter.overdue
  )
})

const updateFilter = (key: keyof TodoFilter, value: any) => {
  const newFilter = { ...props.filter }
  if (value === '' || value === null || value === undefined) {
    delete newFilter[key]
  } else {
    newFilter[key] = value
  }
  emit('update:filter', newFilter)
}

const updateCompletedFilter = (value: string) => {
  if (value === '') {
    updateFilter('completed', undefined)
  } else {
    updateFilter('completed', value === 'true')
  }
}

const clearAllFilters = () => {
  emit('update:filter', {})
}

const getCategoryName = (categoryId: string) => {
  const category = props.categories.find(cat => cat.id === categoryId)
  return category ? `${category.icon} ${category.name}` : 'Unknown'
}
</script>