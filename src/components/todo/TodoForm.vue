<template>
  <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Todo</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Title Input -->
      <div class="form-control">
        <input
          v-model="form.title"
          type="text"
          placeholder="What needs to be done?"
          class="input input-bordered w-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
          :class="{ 'input-error': errors.title }"
          required
        />
        <label v-if="errors.title" class="label">
          <span class="label-text-alt text-error">{{ errors.title }}</span>
        </label>
      </div>

      <!-- Description (Optional) -->
      <div class="form-control">
        <textarea
          v-model="form.description"
          placeholder="Add a description (optional)"
          class="textarea textarea-bordered bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
          rows="2"
        ></textarea>
      </div>

      <!-- Row with Priority, Category, and Due Date -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Priority -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Priority</span>
          </label>
          <select
            v-model="form.priority"
            class="select select-bordered bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <!-- Category -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Category</span>
          </label>
          <select
            v-model="form.category"
            class="select select-bordered bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
          >
            <option value="">No category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.icon }} {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Due Date -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Due Date</span>
          </label>
          <input
            v-model="form.dueDate"
            type="date"
            class="input input-bordered bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
            :min="today"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end space-x-2">
        <button
          v-if="showCancel"
          type="button"
          @click="$emit('cancel')"
          class="btn btn-ghost"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!form.title.trim()"
        >
          <span class="mr-2">✨</span>
          Add Todo
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Todo, TodoCategory } from '@/types/todo'

interface Props {
  categories?: TodoCategory[]
  showCancel?: boolean
}

interface Emits {
  (e: 'add', todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  showCancel: false,
})

const emit = defineEmits<Emits>()

const form = ref({
  title: '',
  description: '',
  priority: 'medium' as Todo['priority'],
  category: '',
  dueDate: '',
  completed: false,
})

const errors = ref({
  title: '',
})

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const handleSubmit = () => {
  // Reset errors
  errors.value.title = ''

  // Validate
  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
    return
  }

  // Prepare todo data
  const todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> = {
    title: form.value.title.trim(),
    description: form.value.description.trim() || undefined,
    priority: form.value.priority,
    category: form.value.category || undefined,
    dueDate: form.value.dueDate ? new Date(form.value.dueDate) : undefined,
    completed: false,
  }

  // Emit add event
  emit('add', todoData)

  // Reset form
  form.value = {
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    dueDate: '',
    completed: false,
  }
}
</script>