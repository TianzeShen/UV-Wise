<script setup>
defineProps({
  badge: {
    type: String,
    default: '',
  },
  badgeColor: {
    type: String,
    default: '',
  },
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="section-heading">
    <div>
      <p class="eyebrow">{{ eyebrow }}</p>
      <h2>{{ title }}</h2>
    </div>
    <span
      v-if="badge"
      class="badge"
      :class="{ neutral: !badgeColor }"
      :style="badgeColor ? { backgroundColor: badgeColor } : undefined"
    >
      {{ badge }}
    </span>
  </div>
</template>
