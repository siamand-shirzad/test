<script setup>
import { ref, onMounted } from 'vue'
import { useCrud } from '@/composables/useCrud'

// List view only needs these columns — the heavy text fields (description, steps,
// expected_result, …) are lazy-loaded by fetchOne() when a row is selected.
const LIST_COLUMNS = 'id,title,priority,status'

const { items: testCases, loading, hasMore, fetchAll, loadMore, fetchOne } =
  useCrud('test_cases', { columns: LIST_COLUMNS, pageSize: 50 })

const selectedTestCase = ref(null)
const detailLoading = ref(false)
const activeFilters = ref({}) // در دنیای واقعی: { sub_suite_id }

onMounted(() => {
  fetchAll(activeFilters.value)
})

const selectTestCase = async (tc) => {
  // Show the slim row immediately, then load the full record for the detail panel.
  selectedTestCase.value = tc
  detailLoading.value = true
  const full = await fetchOne(tc.id)
  if (full) selectedTestCase.value = full
  detailLoading.value = false
}

// توابع کمکی برای رنگ‌بندی Badgeها کاملا منطبق بر فایل قالب شما
const getPriorityStyle = (prio) => {
  switch (prio?.toLowerCase()) {
    case 'high': return { color: 'var(--red)', background: 'var(--red-bg)' }
    case 'medium': return { color: 'var(--yellow)', background: 'var(--yellow-bg)' }
    default: return { color: 'var(--muted)', background: 'var(--surface2)' }
  }
}

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'passed': return { color: 'var(--green)', background: 'var(--green-bg)' }
    case 'failed': return { color: 'var(--red)', background: 'var(--red-bg)' }
    case 'blocked': return { color: 'var(--purple)', background: 'var(--purple-bg)' }
    default: return { color: 'var(--muted)', background: 'var(--surface2)' }
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 12px;">
    <div class="page-header">
      <h1 class="page-title">Test Cases</h1>
      <button class="btn btn-primary">+ New Case</button>
    </div>

    <div class="content-split">
      <div class="table-side table-wrap">
        <table v-if="!loading">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="tc in testCases" 
              :key="tc.id" 
              @click="selectTestCase(tc)"
              :style="selectedTestCase?.id === tc.id ? 'background: var(--surface2)' : ''"
            >
              <td style="font-weight: 600; color: var(--muted);">TC-{{ tc.id.slice(0,4) }}</td>
              <td style="font-weight: 500;">{{ tc.title }}</td>
              <td>
                <span class="badge" :style="getPriorityStyle(tc.priority)">{{ tc.priority }}</span>
              </td>
              <td>
                <span class="badge" :style="getStatusStyle(tc.status)">{{ tc.status || 'Not Run' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else style="padding: 20px; color: var(--muted);">Loading cases...</div>

        <div v-if="hasMore" style="padding: 8px 12px;">
          <button class="btn btn-secondary" :disabled="loading" @click="loadMore(activeFilters.value)">
            {{ loading ? 'Loading...' : 'Load more' }}
          </button>
        </div>
      </div>

      <div class="detail-panel" v-if="selectedTestCase">
        <div class="panel-header">
          <div style="font-size: 11px; font-weight: 600; color: var(--muted); margin-bottom: 4px;">
            TC-{{ selectedTestCase.id.slice(0, 8) }}
          </div>
          <h2 style="font-size: 15px; font-weight: 600;">{{ selectedTestCase.title }}</h2>
          <span v-if="detailLoading" style="font-size: 11px; color: var(--muted);">Loading detail…</span>
        </div>
        
        <div class="panel-body">
          <div>
            <div class="panel-section-title">Status & Metadata</div>
            <div style="display: flex; gap: 8px;">
              <span class="badge" :style="getStatusStyle(selectedTestCase.status)">{{ selectedTestCase.status || 'Not Run' }}</span>
              <span class="badge" :style="getPriorityStyle(selectedTestCase.priority)">{{ selectedTestCase.priority }}</span>
              <span class="badge" style="background: var(--blue-bg); color: var(--blue)">
                {{ selectedTestCase.automation_status ? 'Automated' : 'Manual' }}
              </span>
            </div>
          </div>

          <div>
            <div class="panel-section-title">Description</div>
            <div class="panel-block">{{ selectedTestCase.description || 'No description' }}</div>
          </div>

          <div>
            <div class="panel-section-title">Precondition</div>
            <div class="panel-block" style="font-family: monospace; font-size: 12px;">
              {{ selectedTestCase.precondition || '—' }}
            </div>
          </div>

          <div>
            <div class="panel-section-title">Steps</div>
            <div class="panel-block" style="white-space: pre-wrap;">{{ selectedTestCase.steps || 'No steps specified.' }}</div>
          </div>

          <div>
            <div class="panel-section-title">Expected Result</div>
            <div class="panel-block" style="border-left: 3px solid var(--green);">{{ selectedTestCase.expected_result || '—' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>