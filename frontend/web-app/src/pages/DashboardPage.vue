<script setup>
defineProps({
  clothingItems: {
    type: Array,
    required: true,
  },
  dashboardHighlights: {
    type: Array,
    required: true,
  },
  isResolvingLocation: {
    type: Boolean,
    required: true,
  },
  locationQuery: {
    type: String,
    required: true,
  },
  locationSearchStatus: {
    type: String,
    required: true,
  },
  userLocation: {
    type: Object,
    required: true,
  },
  uvCategory: {
    type: String,
    required: true,
  },
  uvData: {
    type: Object,
    required: true,
  },
  uvLoading: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['search-location', 'update:locationQuery'])
</script>

<template>
  <section class="dashboard-home">
    <div class="landing-hero" :style="{ '--uv-accent': uvData.color_code }">
      <div class="landing-copy">
        <p class="landing-kicker">UV Wise</p>
        <h1>Plan outdoor time with clearer UV guidance.</h1>
        <p class="landing-text">
          Search any location, understand the current UV risk instantly, and turn science-backed
          advice into simple actions before you head outside.
        </p>

        <div class="landing-search">
          <input
            class="landing-search-input"
            :value="locationQuery"
            type="text"
            placeholder="Search a city, suburb, or postcode"
            @input="$emit('update:locationQuery', $event.target.value)"
            @keyup.enter="$emit('search-location')"
          />
          <button class="landing-search-button" @click="$emit('search-location')">
            {{ isResolvingLocation ? 'Searching...' : 'Check UV' }}
          </button>
        </div>

        <p v-if="locationSearchStatus" class="landing-status">{{ locationSearchStatus }}</p>
      </div>
    </div>

    <div class="dashboard-grid landing-grid">
      <article class="feature-card landing-summary-card landing-card-wide">
        <p class="card-label">Current location</p>
        <h2>{{ userLocation.name }}</h2>
        <p class="meta">{{ userLocation.lat }}, {{ userLocation.lon }}</p>
        <div class="landing-uv-readout">
          <div>
            <span class="card-label">UV Index</span>
            <strong class="landing-uv-number">{{ uvData.uv_index }}</strong>
          </div>
          <div>
            <span class="card-label">Risk</span>
            <strong class="landing-uv-category">{{ uvCategory }}</strong>
          </div>
        </div>
        <p class="landing-alert">{{ uvData.alert_message }}</p>
        <p class="helper-text">{{ uvLoading ? 'Refreshing UV forecast...' : 'Latest UV guidance loaded.' }}</p>
      </article>

      <article
        v-for="highlight in dashboardHighlights"
        :key="highlight.label"
        class="feature-card metric-card landing-metric-card"
      >
        <p class="card-label">{{ highlight.label }}</p>
        <strong class="metric-value">{{ highlight.value }}</strong>
        <p class="helper-text">{{ highlight.helper }}</p>
      </article>

      <article class="feature-card icon-card">
        <p class="card-label">Recommended wear</p>
        <h3>{{ uvData.protection_guidance.clothing }}</h3>
        <p class="helper-text">Pair sunscreen with protective clothing for better coverage during high UV periods.</p>
      </article>

    </div>
  </section>
</template>
