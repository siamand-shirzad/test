<script setup>
import { onMounted } from 'vue'
import { useCrud } from '@/composables/useCrud'
import { useNavigation } from '@/composables/useNavigation'

const { items: projects, loading, error, fetchAll } = useCrud('projects')
const { openProject } = useNavigation()

onMounted(() => {
  fetchAll()
})
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Projects</h1>
      <button class="btn btn-primary">+ Create Project</button>
    </div>

    <div v-if="loading" style="color: var(--muted); padding: 10px 0;">Loading dashboard projects...</div>
    <div v-else-if="error" style="color: var(--red); padding: 10px 0;">{{ error }}</div>

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width: 30%;">Project Name</th>
            <th style="width: 50%;">Description</th>
            <th style="width: 20%;">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id" @click="openProject(project)">
            <td style="font-weight: 600; color: var(--blue);">{{ project.name }}</td>
            <td style="color: var(--muted);">{{ project.description || 'No description provided' }}</td>
            <td style="color: var(--muted);">{{ project.created_at ? new Date(project.created_at).toLocaleDateString() : '—' }}</td>
          </tr>
          <tr v-if="projects.length === 0">
            <td colspan="3" style="text-align: center; color: var(--muted); padding: 30px;">No projects found. Create one to get started!</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>