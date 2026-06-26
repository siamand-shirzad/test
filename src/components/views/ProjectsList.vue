<script setup>
import { ref, onMounted } from 'vue'
import { useCrud } from '@/composables/useCrud'
import { useNavigation } from '@/composables/useNavigation'
import AppModal from '@/components/ui/AppModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import ProjectForm from '@/components/forms/ProjectForm.vue'

const { items: projects, loading, error, clearError, fetchAll, create, update, remove } = useCrud('projects')
const { openProject } = useNavigation()

const showForm = ref(false)
const editingItem = ref(null)
const deletingItem = ref(null)
const formLoading = ref(false)

onMounted(() => fetchAll())

function openCreate() {
  editingItem.value = null
  showForm.value = true
}

function openEdit(project) {
  editingItem.value = project
  showForm.value = true
}

async function handleSubmit(formData) {
  formLoading.value = true
  let result
  if (editingItem.value) {
    result = await update(editingItem.value.id, formData)
  } else {
    result = await create(formData)
  }
  formLoading.value = false
  if (result) {
    showForm.value = false
    await fetchAll()
  }
}

async function handleDelete() {
  formLoading.value = true
  const success = await remove(deletingItem.value.id)
  formLoading.value = false
  if (success) {
    deletingItem.value = null
    await fetchAll()
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
      <h1>Projects</h1>
      <button class="btn btn-primary" @click="openCreate">+ New Project</button>
    </div>

    <ErrorAlert :message="error" @dismiss="clearError" />

    <div v-if="loading && projects.length === 0" class="loading-text">Loading projects...</div>

    <div v-else-if="projects.length === 0" class="empty-state">
      <p>No projects yet</p>
      <button class="btn btn-primary" @click="openCreate">Create your first project</button>
    </div>

    <div v-else class="card-grid">
      <div v-for="project in projects" :key="project.id" class="card" @click="openProject(project)">
        <div class="card-body">
          <h3 class="card-title">{{ project.name }}</h3>
          <p v-if="project.description" class="card-desc">{{ project.description }}</p>
          <p class="card-meta">Created {{ formatDate(project.created_at) }}</p>
        </div>
        <div class="card-actions" @click.stop>
          <button class="btn-icon" title="Edit" @click="openEdit(project)">✏️</button>
          <button class="btn-icon" title="Delete" @click="deletingItem = project">🗑️</button>
        </div>
      </div>
    </div>

    <AppModal
      v-if="showForm"
      :title="editingItem ? 'Edit Project' : 'New Project'"
      @close="showForm = false"
    >
      <ProjectForm
        :initial="editingItem"
        :loading="formLoading"
        @submit="handleSubmit"
        @cancel="showForm = false"
      />
    </AppModal>

    <ConfirmDialog
      v-if="deletingItem"
      title="Delete Project"
      :message="`Delete '${deletingItem.name}'? This will also delete all suites, sub-suites, and test cases inside it.`"
      :loading="formLoading"
      @confirm="handleDelete"
      @cancel="deletingItem = null"
    />
  </div>
</template>
