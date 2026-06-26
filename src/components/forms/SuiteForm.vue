<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  initial: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  name: '',
  description: '',
})

watchEffect(() => {
  if (props.initial) {
    form.value.name = props.initial.name || ''
    form.value.description = props.initial.description || ''
  }
})

function handleSubmit() {
  if (!form.value.name.trim()) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="crud-form">
    <div class="form-group">
      <label for="name">Name *</label>
      <input id="name" v-model="form.name" type="text" required placeholder="Suite name" />
    </div>
    <div class="form-group">
      <label for="description">Description</label>
      <textarea id="description" v-model="form.description" rows="3" placeholder="Optional description" />
    </div>
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="emit('cancel')" :disabled="loading">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary" :disabled="loading || !form.name.trim()">
        {{ loading ? 'Saving...' : (initial ? 'Update' : 'Create') }}
      </button>
    </div>
  </form>
</template>
