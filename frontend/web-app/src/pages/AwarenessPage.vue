<script setup>
import PageSectionHeader from '../components/PageSectionHeader.vue'

defineProps({
  awarenessData: {
    type: Object,
    required: true,
  },
  awarenessLoading: {
    type: Boolean,
    required: true,
  },
  awarenessSummary: {
    type: Object,
    required: true,
  },
  educationCard: {
    type: Object,
    required: true,
  },
})

function computeChartHeight(value, max) {
  return `${Math.max(18, Math.round((value / max) * 100))}%`
}
</script>

<template>
  <section class="page-section">
    <PageSectionHeader
      eyebrow="Learn and explore"
      title="Awareness"
      badge="Insights"
    />

    <div class="dashboard-grid awareness-grid">
      <article class="feature-card chart-card">
        <p class="card-label">Skin cancer statistics</p>
        <h3>Australia trend snapshot</h3>
        <div class="mini-chart">
          <div
            v-for="(value, index) in awarenessData.cancer_statistics.data"
            :key="awarenessData.cancer_statistics.labels[index]"
            class="chart-column"
          >
            <div
              class="chart-bar coral"
              :style="{ height: computeChartHeight(value, Math.max(...awarenessData.cancer_statistics.data)) }"
            ></div>
            <span class="chart-value">{{ value }}</span>
            <span class="chart-label">{{ awarenessData.cancer_statistics.labels[index] }}</span>
          </div>
        </div>
      </article>

      <article class="feature-card chart-card">
        <p class="card-label">Heat trend</p>
        <h3>Monthly average temperature</h3>
        <div class="mini-chart">
          <div
            v-for="(value, index) in awarenessData.heat_trends.avg_temp"
            :key="awarenessData.heat_trends.labels[index]"
            class="chart-column"
          >
            <div
              class="chart-bar gold"
              :style="{ height: computeChartHeight(value, Math.max(...awarenessData.heat_trends.avg_temp)) }"
            ></div>
            <span class="chart-value">{{ value }}&deg;</span>
            <span class="chart-label">{{ awarenessData.heat_trends.labels[index] }}</span>
          </div>
        </div>
      </article>

      <article class="feature-card myth-card">
        <p class="card-label">Myth vs Fact</p>
        <div class="myth-fact-grid">
          <div>
            <h3>Myth</h3>
            <p>{{ educationCard.myth }}</p>
          </div>
          <div>
            <h3>Fact</h3>
            <p>{{ educationCard.fact }}</p>
          </div>
        </div>
        <p class="helper-text">{{ awarenessLoading ? 'Refreshing awareness content...' : 'Short, shareable facts for everyday sun safety.' }}</p>
      </article>

      <article class="feature-card metric-card">
        <p class="card-label">Key takeaway</p>
        <strong class="metric-value">{{ awarenessSummary.latestCancer }}</strong>
        <p class="helper-text">Latest skin cancer statistic in the current dataset.</p>
      </article>

      <article class="feature-card metric-card">
        <p class="card-label">Warmest month</p>
        <strong class="metric-value">{{ awarenessSummary.hottestMonth }}</strong>
        <p class="helper-text">Helpful context when comparing seasonal exposure patterns.</p>
      </article>
    </div>
  </section>
</template>
