<script setup>
  import { ref, onMounted } from 'vue'
  import { supabase } from './lib/supabase'
  
  const scenarios = ref([])

  async function getScenarios() {
    const { data } = await supabase.from('scenarios').select()
    scenarios.value = data
  }

  onMounted(() => {
    getScenarios()
  })

</script>

<template>
  <ul>
    <li v-for="item in scenarios" :key="item.id">{{ item }}</li>
  </ul>
</template>