<script setup>
defineProps({
  label: { type: String, required: true },
  variant: { type: String, default: 'default' },
})
</script>

<template>
  <span class="badge" :class="`badge-${variant}`">{{ label }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-default {
  background: var(--color-background-mute);
  color: var(--color-text);
}

.badge-success {
  background: #d4edda;
  color: #155724;
}

.badge-warning {
  background: #fff3cd;
  color: #856404;
}

.badge-danger {
  background: #f8d7da;
  color: #721c24;
}

.badge-info {
  background: #d1ecf1;
  color: #0c5460;
}

.badge-primary {
  background: #cce5ff;
  color: #004085;
}
</style>
