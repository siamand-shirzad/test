<script setup>
defineProps({
  message: { type: String, default: '' },
})

const emit = defineEmits(['dismiss'])
</script>

<template>
  <div v-if="message" class="error-alert">
    <span>{{ message }}</span>
    <button class="dismiss" @click="emit('dismiss')">&times;</button>
  </div>
</template>

<style scoped>
.error-alert {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.dismiss {
  background: none;
  border: none;
  color: #721c24;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0 0.25rem;
  line-height: 1;
}
</style>
