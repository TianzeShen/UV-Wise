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
  uvCategory: {
    type: String,
    required: true,
  },
  uvValue: {
    type: [Number, String],
    required: true,
  },
  uvColor: {
    type: String,
    required: true,
  },
})

defineEmits(['update:activePage'])
</script>

<template>
  <nav class="page-nav" aria-label="Primary">
    <div class="page-nav-brand">UV Wise</div>

    <div class="page-nav-links">
      <button
        v-for="page in pages"
        :key="page.id"
        class="nav-pill"
        :class="{ active: activePage === page.id }"
        @click="$emit('update:activePage', page.id)"
      >
        {{ page.label }}
      </button>
    </div>

    <div class="page-nav-status">
      <span class="nav-uv-badge" :style="{ backgroundColor: uvColor }">
        UV {{ uvValue }} | {{ uvCategory }}
      </span>
    </div>
  </nav>
</template>
