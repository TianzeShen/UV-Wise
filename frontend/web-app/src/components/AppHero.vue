<script setup>
defineProps({
  locationStatus: {
    type: String,
    required: true,
  },
})

defineEmits(['refresh'])
</script>

<template>
  <header class="hero-panel">
    <div class="hero-copy">
      <p class="eyebrow">UV Wise</p>
      <h1>Plan your day outdoors with clearer UV guidance.</h1>
      <p class="hero-text">
        Check the current UV risk, understand what it means, and get simple protection advice
        tailored to your day.
      </p>
    </div>

    <div class="hero-actions">
      <div class="status-card">
        <span class="status-label">Location status</span>
        <strong>Ready for today's UV check</strong>
        <p>{{ locationStatus }}</p>
      </div>

      <div class="toggle-card">
        <span>What you'll get</span>
        <span class="toggle-hint">
          Live UV risk, simple protection advice, and practical planning support before you head outdoors.
        </span>
      </div>

      <button class="ghost-button" @click="$emit('refresh')">Update my location</button>
    </div>
  </header>
</template>
