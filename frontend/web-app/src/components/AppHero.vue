<script setup>
defineProps({
  apiBaseUrl: {
    type: String,
    required: true,
  },
  locationStatus: {
    type: String,
    required: true,
  },
  useMockData: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['refresh', 'update:apiBaseUrl', 'update:useMockData'])

function handleApiBaseUrl(event) {
  emit('update:apiBaseUrl', event.target.value)
}

function handleUseMockData(event) {
  emit('update:useMockData', event.target.checked ? false : true)
}
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
        <span class="status-label">Connection</span>
        <strong>{{ useMockData ? 'Preview data' : 'Live updates' }}</strong>
        <p>{{ locationStatus }}</p>
      </div>

      <label class="toggle-card">
        <span>Use live updates</span>
        <input :checked="!useMockData" type="checkbox" @change="handleUseMockData" />
        <span class="toggle-hint">Turn this on when real-time service data is available.</span>
      </label>

      <label class="input-card">
        <span>Backend base URL</span>
        <input
          :value="apiBaseUrl"
          type="text"
          placeholder="http://localhost:8000"
          @input="handleApiBaseUrl"
        />
      </label>

      <button class="ghost-button" @click="$emit('refresh')">Refresh location and data</button>
    </div>
  </header>
</template>
