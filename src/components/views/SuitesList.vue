<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCrud } from '@/composables/useCrud'
import { useNavigation } from '@/composables/useNavigation'
import AppModal from '@/components/ui/AppModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import SuiteForm from '@/components/forms/SuiteForm.vue'

const { items: suites, loading, error, clearError, fetchAll, create, update, remove } = useCrud('suites')
const { selectedProject, openSuite } = useNavigation()

const showForm = ref(false)
const editingItem = ref(null)
const deletingItem = ref(null)
const formLoading = ref(false)

onMounted(() => loadSuites())

watch(selectedProject, () => loadSuites())

function loadSuites() {
  if (selectedProject.value) {
    fetchAll({ project_id: selectedProject.value.id })
  }
}

function openCreate() {
  editingItem.value = null
  showForm.value = true
}

function openEdit(suite) {
  editingItem.value = suite
  showForm.value = true
}

async function handleSubmit(formData) {
  formLoading.value = true
  let result
  if (editingItem.value) {
    result = await update(editingItem.value.id, formData)
  } else {
    result = await create({ ...formData, project_id: selectedProject.value.id })
  }
  formLoading.value = false
  if (result) {
    showForm.value = false
    loadSuites()
  }
}

async function handleDelete() {
  formLoading.value = true
  const success = await remove(deletingItem.value.id)
  formLoading.value = false
  if (success) {
    deletingItem.value = null
    loadSuites()
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString()
}
</script>

<template>
  <div>
    <div class="view-header">
      <h1>Suites</h1>
      <button class="btn btn-primary" @click="openCreate">+ New Suite</button>
    </div>

    <ErrorAlert :message="error" @dismiss="clearError" />

    <div v-if="loading && suites.length === 0" class="loading-text">Loading suites...</div>

    <div v-else-if="suites.length === 0" class="empty-state">
      <p>No suites yet</p>
      <button class="btn btn-primary" @click="openCreate">Create your first suite</button>
    </div>

    <div v-else class="card-grid">
      <div v-for="suite in suites" :key="suite.id" class="card" @click="openSuite(suite)">
        <div class="card-body">
          <h3 class="card-title">{{ suite.name }}</h3>
          <p v-if="suite.description" class="card-desc">{{ suite.description }}</p>
          <p class="card-meta">Created {{ formatDate(suite.created_at) }}</p>
        </div>
        <div class="card-actions" @click.stop>
          <button class="btn-icon" title="Edit" @click="openEdit(suite)">✏️</button>
          <button class="btn-icon" title="Delete" @click="deletingItem = suite">🗑️</button>
        </div>
      </div>
    </div>

    <AppModal
      v-if="showForm"
      :title="editingItem ? 'Edit Suite' : 'New Suite'"
      @close="showForm = false"
    >
      <SuiteForm
        :initial="editingItem"
        :loading="formLoading"
        @submit="handleSubmit"
        @cancel="showForm = false"
      />
    </AppModal>

    <ConfirmDialog
      v-if="deletingItem"
      title="Delete Suite"
      :message="`Delete '${deletingItem.name}'? This will also delete all sub-suites and test cases inside it.`"
      :loading="formLoading"
      @confirm="handleDelete"
      @cancel="deletingItem = null"
    />
  </div>
</template>
