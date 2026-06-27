<script setup>
import { onMounted, watch } from 'vue'
import { useCrud } from '@/composables/useCrud'
import { useNavigation } from '@/composables/useNavigation'

const { currentProject, navigateTo } = useNavigation()
const { items: suites, loading, error, fetchAll } = useCrud('suites', {
  columns: 'id,name,description,project_id',
  pageSize: 50
})

const loadProjectSuites = () => {
  if (currentProject.value?.id) {
    // فیلتر کردن سوئیت‌ها بر اساس project_id در Supabase
    fetchAll({ project_id: currentProject.value.id })
  }
}

onMounted(loadProjectSuites)
watch(currentProject, loadProjectSuites)

// شبیه‌سازی انتخاب و ورود به سطح تسک‌ها
const selectSuite = (suite) => {
  // شما می‌توانید ساب سوئیت یا مستقیم مدیریت تسک‌ها را لود کنید
  navigateTo('test-cases')
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Suites for {{ currentProject?.name || 'Project' }}</h1>
      <button class="btn btn-primary">+ Add Suite</button>
    </div>

    <div v-if="loading" style="color: var(--muted); padding: 10px 0;">Loading suites...</div>
    <div v-else-if="error" style="color: var(--red); padding: 10px 0;">{{ error }}</div>

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width: 40%;">Suite Name</th>
            <th style="width: 60%;">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="suite in suites" :key="suite.id" @click="selectSuite(suite)">
            <td style="font-weight: 600; color: var(--text);">📁 {{ suite.name }}</td>
            <td style="color: var(--muted);">{{ suite.description || '—' }}</td>
          </tr>
          <tr v-if="suites.length === 0">
            <td colspan="2" style="text-align: center; color: var(--muted); padding: 30px;">This project has no suites yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
