<script setup>
defineProps({
  activePage: {
    type: String,
    required: true,
  },
  pages: {
    type: Array,
    required: true,
  },
})

defineEmits(['update:activePage'])
</script>

<template>
  <nav class="page-nav" aria-label="Primary">
    <button
      v-for="page in pages"
      :key="page.id"
      class="nav-pill"
      :class="{ active: activePage === page.id }"
      @click="$emit('update:activePage', page.id)"
    >
      {{ page.label }}
    </button>
  </nav>
</template>
