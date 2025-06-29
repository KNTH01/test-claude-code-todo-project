<template>
  <form @submit.prevent="handleSave" class="space-y-4">
    <!-- Title -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Title</span>
      </label>
      <input
        v-model="form.title"
        type="text"
        class="input input-bordered input-sm bg-white/80 dark:bg-gray-700/80"
        required
      />
    </div>

    <!-- Description -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Description</span>
      </label>
      <textarea
        v-model="form.description"
        class="textarea textarea-bordered textarea-sm bg-white/80 dark:bg-gray-700/80"
        rows="2"
      ></textarea>
    </div>

    <!-- Priority, Category, Due Date -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Priority</span>
        </label>
        <select
          v-model="form.priority"
          class="select select-bordered select-sm bg-white/80 dark:bg-gray-700/80"
        >
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Category</span>
        </label>
        <select
          v-model="form.category"
          class="select select-bordered select-sm bg-white/80 dark:bg-gray-700/80"
        >
          <option value="">No category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.icon }} {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Due Date</span>
        </label>
        <input
          v-model="form.dueDate"
          type="date"
          class="input input-bordered input-sm bg-white/80 dark:bg-gray-700/80"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-2">
      <button
        type="button"
        @click="$emit('cancel')"
        class="btn btn-ghost btn-sm"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn-primary btn-sm"
        :disabled="!form.title.trim()"
      >
        Save Changes
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Todo, TodoCategory } from '@/types/todo'

interface Props {
  todo: Todo
  categories: TodoCategory[]
}

interface Emits {
  (e: 'save', updates: Partial<Todo>): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref({
  title: '',
  description: '',
  priority: 'medium' as Todo['priority'],
  category: '',
  dueDate: '',
})

onMounted(() => {
  form.value = {
    title: props.todo.title,
    description: props.todo.description || '',
    priority: props.todo.priority,
    category: props.todo.category || '',
    dueDate: props.todo.dueDate ? props.todo.dueDate.toISOString().split('T')[0] : '',
  }
})

const handleSave = () => {
  const updates: Partial<Todo> = {
    title: form.value.title.trim(),
    description: form.value.description.trim() || undefined,
    priority: form.value.priority,
    category: form.value.category || undefined,
    dueDate: form.value.dueDate ? new Date(form.value.dueDate) : undefined,
  }

  emit('save', updates)
}
</script>