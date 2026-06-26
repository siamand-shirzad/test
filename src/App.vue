<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabase'

const projects = ref([])
const loading = ref(false)
const error = ref(null)

async function getProjects() {
  loading.value = true
  error.value = null

  const { data, error: supabaseError } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      description,
      created_at
    `)

  if (supabaseError) {
    error.value = supabaseError.message
  } else {
    projects.value = data
    console.log(data)
  }

  loading.value = false
}

onMounted(getProjects)
</script>

<template>
  <div class="container">
    <h1>Projects</h1>

    <p v-if="loading">Loading...</p>

    <p v-else-if="error">{{ error }}</p>

    <p v-else-if="projects.length === 0">
      No projects found.
    </p>

    <ul v-else>
      <li
        v-for="project in projects"
        :key="project.id"
      >
        <h3>{{ project.name }}</h3>
        <p>{{ project.description }}</p>
      </li>
    </ul>
  </div>
</template>