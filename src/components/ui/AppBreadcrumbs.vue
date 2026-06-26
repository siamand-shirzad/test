<script setup>
defineProps({
  crumbs: { type: Array, default: () => [] },
})

const emit = defineEmits(['navigate'])
</script>

<template>
  <nav class="breadcrumbs">
    <template v-for="(crumb, index) in crumbs" :key="index">
      <span v-if="index > 0" class="separator">/</span>
      <button
        v-if="index < crumbs.length - 1"
        class="crumb-link"
        @click="emit('navigate', crumb.view)"
      >
        {{ crumb.label }}
      </button>
      <span v-else class="crumb-current">{{ crumb.label }}</span>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.separator {
  color: var(--color-border-hover);
}

.crumb-link {
  background: none;
  border: none;
  color: hsla(160, 100%, 37%, 1);
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}

.crumb-link:hover {
  text-decoration: underline;
}

.crumb-current {
  color: var(--color-text);
  font-weight: 600;
}
</style>
