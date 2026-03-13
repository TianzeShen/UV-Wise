<script setup>
import PageSectionHeader from '../components/PageSectionHeader.vue'

defineProps({
  clothingItems: {
    type: Array,
    required: true,
  },
  dashboardHighlights: {
    type: Array,
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

function iconLetter(icon) {
  if (icon === 'hat') return 'H'
  if (icon === 'glasses') return 'S'
  return 'L'
}
</script>

<template>
  <section class="page-section">
    <PageSectionHeader
      eyebrow="Today's outlook"
      title="Sun Safety Dashboard"
      :badge="uvCategory"
      :badge-color="uvData.color_code"
    />

    <div class="dashboard-grid">
      <article class="feature-card uv-card" :style="{ '--uv-accent': uvData.color_code }">
        <p class="card-label">Current location</p>
        <h3>{{ userLocation.name }}</h3>
        <p class="meta">{{ userLocation.lat }}, {{ userLocation.lon }}</p>
        <div class="uv-number-row">
          <div>
            <p class="card-label">UV Index</p>
            <strong class="uv-number">{{ uvData.uv_index }}</strong>
          </div>
          <div>
            <p class="card-label">Status</p>
            <strong class="uv-level">{{ uvCategory }}</strong>
          </div>
        </div>
        <p class="alert-box">{{ uvData.alert_message }}</p>
        <p class="helper-text">{{ uvLoading ? 'Refreshing UV forecast...' : 'Latest UV guidance loaded.' }}</p>
      </article>

      <article
        v-for="highlight in dashboardHighlights"
        :key="highlight.label"
        class="feature-card metric-card"
      >
        <p class="card-label">{{ highlight.label }}</p>
        <strong class="metric-value">{{ highlight.value }}</strong>
        <p class="helper-text">{{ highlight.helper }}</p>
      </article>

      <article class="feature-card guidance-card">
        <div class="section-heading compact">
          <div>
            <p class="card-label">Protection guidance</p>
            <h3>What to do next</h3>
          </div>
        </div>
        <ul class="guidance-list">
          <li><strong>Dosage:</strong> {{ uvData.protection_guidance.sunscreen_dosage }}</li>
          <li><strong>Clothing:</strong> {{ uvData.protection_guidance.clothing }}</li>
          <li><strong>Action:</strong> {{ uvData.protection_guidance.action }}</li>
        </ul>
      </article>

      <article class="feature-card icon-card">
        <p class="card-label">Clothing recommendation</p>
        <h3>Visual icons</h3>
        <div class="icon-row">
          <div v-for="item in clothingItems" :key="item.label" class="icon-pill">
            <span class="icon-symbol">{{ iconLetter(item.icon) }}</span>
            <span>{{ item.label }}</span>
          </div>
        </div>
        <p class="helper-text">A quick visual checklist before you head outside.</p>
      </article>
    </div>
  </section>
</template>
