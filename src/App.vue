<script setup>
import { computed } from 'vue'
import { useNavigation } from '@/composables/useNavigation'
import AppBreadcrumbs from '@/components/ui/AppBreadcrumbs.vue'
import ProjectsList from '@/components/views/ProjectsList.vue'
import SuitesList from '@/components/views/SuitesList.vue'
import TestCasesList from '@/components/views/testCasesList.vue'

const { currentView, currentProject, currentSuite, navigateTo } = useNavigation()

// مسیریابی داینامیک کامپوننت‌ها
const activeComponent = computed(() => {
  switch (currentView.value) {
    case 'projects': return ProjectsList
    case 'suites': return SuitesList
    case 'test-cases': return TestCasesList
    default: return ProjectsList
  }
})
</script>

<template>
  <div class="app-container">
    <header class="topbar">
      <div class="topbar-logo" @click="navigateTo('projects')" style="cursor: pointer;">
        🧪 <span>TestSpace</span>
      </div>
      <nav class="topbar-nav">
        <a :class="{ active: currentView === 'projects' }" @click="navigateTo('projects')">Projects</a>
      </nav>
      <div class="topbar-right">
        <div class="avatar">QA</div>
      </div>
    </header>

    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-section">Workspace</div>
        <div class="sidebar-item" :class="{ active: currentView === 'projects' }" @click="navigateTo('projects')">
          <span class="dot" style="background: var(--blue)"></span> All Projects
        </div>

        <template v-if="currentProject">
          <div class="sidebar-section">Active Project</div>
          <div class="sidebar-item active" @click="navigateTo('suites')">
            <span class="dot" style="background: var(--purple)"></span> {{ currentProject.name }}
          </div>
        </template>

        <template v-if="currentSuite">
          <div class="sidebar-section">Active Suite</div>
          <div class="sidebar-item active">
            <span class="dot" style="background: var(--orange)"></span> {{ currentSuite.name }}
          </div>
        </template>
      </aside>

      <main class="main">
        <AppBreadcrumbs />
        <component :is="activeComponent" />
      </main>
    </div>
  </div>
</template>