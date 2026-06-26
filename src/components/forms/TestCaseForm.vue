<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  initial: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const priorityOptions = ['low', 'medium', 'high', 'critical']
const statusOptions = ['draft', 'active', 'deprecated', 'archived']

const form = ref({
  title: '',
  description: '',
  precondition: '',
  steps: '',
  expected_result: '',
  priority: 'medium',
  status: 'draft',
  automation_status: false,
})

watchEffect(() => {
  if (props.initial) {
    form.value.title = props.initial.title || ''
    form.value.description = props.initial.description || ''
    form.value.precondition = props.initial.precondition || ''
    form.value.steps = props.initial.steps || ''
    form.value.expected_result = props.initial.expected_result || ''
    form.value.priority = props.initial.priority || 'medium'
    form.value.status = props.initial.status || 'draft'
    form.value.automation_status = props.initial.automation_status || false
  }
})

function handleSubmit() {
  if (!form.value.title.trim()) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="crud-form">
    <div class="form-group">
      <label for="title">Title *</label>
      <input id="title" v-model="form.title" type="text" required placeholder="Test case title" />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="priority">Priority</label>
        <select id="priority" v-model="form.priority">
          <option v-for="opt in priorityOptions" :key="opt" :value="opt">
            {{ opt.charAt(0).toUpperCase() + opt.slice(1) }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="form.status">
          <option v-for="opt in statusOptions" :key="opt" :value="opt">
            {{ opt.charAt(0).toUpperCase() + opt.slice(1) }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.automation_status" />
          Automated
        </label>
      </div>
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea id="description" v-model="form.description" rows="2" placeholder="What does this test verify?" />
    </div>

    <div class="form-group">
      <label for="precondition">Precondition</label>
      <textarea id="precondition" v-model="form.precondition" rows="2" placeholder="Required state before execution" />
    </div>

    <div class="form-group">
      <label for="steps">Steps</label>
      <textarea id="steps" v-model="form.steps" rows="4" placeholder="1. Do this&#10;2. Then that&#10;3. ..." />
    </div>

    <div class="form-group">
      <label for="expected_result">Expected Result</label>
      <textarea id="expected_result" v-model="form.expected_result" rows="2" placeholder="What should happen?" />
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="emit('cancel')" :disabled="loading">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary" :disabled="loading || !form.title.trim()">
        {{ loading ? 'Saving...' : (initial ? 'Update' : 'Create') }}
      </button>
    </div>
  </form>
</template>
