<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import PlotlyChart from '../components/PlotlyChart.vue'
import PageSectionHeader from '../components/PageSectionHeader.vue'

const props = defineProps({
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

const melanomaTakeaway =
  'Incidence peaks in the late 1980s to late 1990s, then trends downward across the 2000s and 2010s.'

const uvTakeaway =
  "Melbourne's yearly max UV remains consistently high, even when yearly averages look relatively stable."

const awarenessSources = [
  {
    label: 'Skin cancer incidence, mortality and risk of death for Age group and Location',
    url: 'https://www.canceraustralia.gov.au/cancer-types/melanoma-skin/melanoma-skin-statistics',
  },
  {
    label: 'UV index data (2016-2025), 8 capital cities in Australia',
    url: 'https://data.gov.au/data/organization/australian-radiation-protection-and-nuclear-safety-agency-arpansa',
  },
  {
    label: 'UV index and temperature API reference',
    url: 'https://openweathermap.org/api/one-call-3?collection=one_call_api_3.0',
  },
]

const behaviourHover = ref(null)
const showAllMyths = ref(false)
const viewportWidth = ref(typeof window === 'undefined' ? 1280 : window.innerWidth)

const isMobileChart = computed(() => viewportWidth.value <= 640)

function updateViewportWidth() {
  viewportWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateViewportWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportWidth)
})

const mythFactPairs = computed(() => [
  {
    myth: props.educationCard.myth,
    fact: props.educationCard.fact,
  },
  {
    myth: 'A cool or breezy day means UV risk is low.',
    fact: 'UV depends on solar radiation, not how warm the air feels on your skin.',
  },
  {
    myth: 'Darker skin does not need sun protection.',
    fact: 'Darker skin can still experience UV damage, eye harm, and increased long-term risk.',
  },
  {
    myth: 'If you are in the shade, sunscreen is unnecessary.',
    fact: 'Reflected UV and indirect exposure still reach skin, especially around midday.',
  },
])

const visibleMythFactPairs = computed(() =>
  showAllMyths.value ? mythFactPairs.value : mythFactPairs.value.slice(0, 2),
)

const hasMoreMyths = computed(() => mythFactPairs.value.length > 2)

const mobileMelanomaLabels = computed(() =>
  isMobileChart.value
    ? props.awarenessData.melanoma_trend.labels.filter((_, index) => index % 2 === 0)
    : props.awarenessData.melanoma_trend.labels,
)

const mobileMelanomaValues = computed(() =>
  isMobileChart.value
    ? props.awarenessData.melanoma_trend.data.filter((_, index) => index % 2 === 0)
    : props.awarenessData.melanoma_trend.data,
)

const melanomaPlotData = computed(() => [
  {
    x: mobileMelanomaLabels.value,
    y: mobileMelanomaValues.value,
    type: 'scatter',
    mode: 'lines+markers',
    line: {
      color: '#356fb6',
      width: isMobileChart.value ? 3 : 4,
    },
    marker: {
      color: '#356fb6',
      size: isMobileChart.value ? 6 : 8,
    },
    name: 'Cases',
    hovertemplate: 'Year: %{x}<br>Cases: %{y}<extra></extra>',
  },
])

const melanomaPlotLayout = computed(() => ({
  title: {
    text: isMobileChart.value ? '' : 'Melanoma Incidence Trend for Gen Z (15-24)',
    font: {
      size: isMobileChart.value ? 16 : 26,
      color: '#1a3350',
    },
  },
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(247,250,253,0.9)',
  margin: isMobileChart.value
    ? { l: 42, r: 10, t: 18, b: 40 }
    : { l: 70, r: 24, t: 88, b: 56 },
  xaxis: {
    title: { text: 'Year', font: { size: isMobileChart.value ? 11 : 14 } },
    tickfont: { size: isMobileChart.value ? 10 : 12 },
    nticks: isMobileChart.value ? 5 : undefined,
    showgrid: true,
    gridcolor: 'rgba(193, 214, 231, 0.45)',
    zeroline: false,
  },
  yaxis: {
    title: { text: 'Cases', font: { size: isMobileChart.value ? 11 : 14 } },
    tickfont: { size: isMobileChart.value ? 10 : 12 },
    showgrid: true,
    gridcolor: 'rgba(193, 214, 231, 0.45)',
    zeroline: false,
  },
  hovermode: 'x unified',
  showlegend: false,
}))

const uvPlotData = computed(() => {
  const labels = props.awarenessData.uv_history.labels
  const average = props.awarenessData.uv_history.average
  const maxValues = props.awarenessData.uv_history.max
  const minValues = props.awarenessData.uv_history.min
  const dailyDates = props.awarenessData.uv_history.daily_dates
  const dailyValues = props.awarenessData.uv_history.daily_values
  const maxDates = props.awarenessData.uv_history.max_dates
  const minDates = props.awarenessData.uv_history.min_dates

  const traces = [
    {
      x: labels.map((year) => `${year}-07-01`),
      y: average,
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        color: '#e8942a',
        width: isMobileChart.value ? 3 : 4,
      },
      marker: {
        color: '#e8942a',
        size: isMobileChart.value ? 6 : 8,
      },
      name: 'Yearly Average UV',
      hovertemplate: 'Year: %{x|%Y}<br>Yearly Avg UV: %{y:.2f}<extra></extra>',
    },
    {
      x: maxDates,
      y: maxValues,
      type: 'scatter',
      mode: isMobileChart.value ? 'markers' : 'markers+text',
      marker: {
        color: '#e2555a',
        size: isMobileChart.value ? 8 : 11,
      },
      text: isMobileChart.value ? [] : maxValues.map((value) => value.toFixed(2)),
      textposition: 'top center',
      textfont: {
        size: isMobileChart.value ? 10 : 12,
        color: '#1a3350',
      },
      name: 'Yearly Max UV',
      hovertemplate: 'Date: %{x|%b %Y}<br>Yearly Max UV: %{y:.2f}<extra></extra>',
    },
    {
      x: minDates,
      y: minValues,
      type: 'scatter',
      mode: isMobileChart.value ? 'markers' : 'markers+text',
      marker: {
        color: '#2e9d8f',
        size: isMobileChart.value ? 7 : 9,
      },
      text: isMobileChart.value ? [] : minValues.map((value) => value.toFixed(2)),
      textposition: 'bottom center',
      textfont: {
        size: isMobileChart.value ? 10 : 12,
        color: '#35506c',
      },
      name: 'Yearly Min UV',
      hovertemplate: 'Date: %{x|%b %Y}<br>Yearly Min UV: %{y:.2f}<extra></extra>',
    },
  ]

  if (!isMobileChart.value) {
    traces.unshift({
      x: dailyDates,
      y: dailyValues,
      type: 'scatter',
      mode: 'lines',
      line: {
        color: 'rgba(193, 220, 247, 0.7)',
        width: 1,
      },
      name: 'Daily UV Index',
      hovertemplate: 'Date: %{x}<br>Daily UV: %{y:.2f}<extra></extra>',
    })
  }

  return traces
})

const uvPlotLayout = computed(() => ({
  title: {
    text: isMobileChart.value ? '' : 'Melbourne Daily UV Index with Yearly Average, Max and Min (2007-2024)',
    font: {
      size: isMobileChart.value ? 16 : 24,
      color: '#1a3350',
    },
  },
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(247,250,253,0.9)',
  margin: isMobileChart.value
    ? { l: 44, r: 10, t: 18, b: 40 }
    : { l: 70, r: 24, t: 88, b: 56 },
  xaxis: {
    title: { text: 'Date', font: { size: isMobileChart.value ? 11 : 14 } },
    type: 'date',
    tickfont: { size: isMobileChart.value ? 9 : 12 },
    nticks: isMobileChart.value ? 4 : undefined,
    showgrid: true,
    gridcolor: 'rgba(193, 214, 231, 0.45)',
    zeroline: false,
  },
  yaxis: {
    title: { text: 'UV Index', font: { size: isMobileChart.value ? 11 : 14 } },
    tickfont: { size: isMobileChart.value ? 10 : 12 },
    showgrid: true,
    gridcolor: 'rgba(193, 214, 231, 0.45)',
    zeroline: false,
  },
  hovermode: 'x unified',
  legend: {
    orientation: isMobileChart.value ? 'v' : 'h',
    y: isMobileChart.value ? 0.99 : 1.12,
    x: isMobileChart.value ? 0.02 : 0.5,
    xanchor: isMobileChart.value ? 'left' : 'center',
    font: {
      size: isMobileChart.value ? 10 : 12,
    },
  },
}))

const plotlyConfig = {
  responsive: true,
  displayModeBar: false,
  displaylogo: false,
}

const protectionBars = computed(() => {
  const values = props.awarenessData.protection_behaviours.percentages
  const labels = props.awarenessData.protection_behaviours.labels
  const max = Math.max(...values)
  const colors = ['#fff1af', '#ffd978', '#ffb746', '#ff861a', '#df5c00', '#a93f00']

  return labels.map((label, index) => ({
    label,
    value: values[index],
    color: colors[index],
    width: `${(values[index] / max) * 100}%`,
    description: `${values[index]}% of surveyed Gen Z participants reported this behaviour.`,
  }))
})

function showBehaviourDetails(bar) {
  behaviourHover.value = bar
}

function hideBehaviourDetails() {
  behaviourHover.value = null
}

function toggleMythExpansion() {
  showAllMyths.value = !showAllMyths.value
}
</script>

<template>
  <section class="page-section">
    <PageSectionHeader eyebrow="Learn and explore" title="Awareness" />

    <div class="dashboard-grid awareness-grid rich-awareness-grid stacked-awareness-grid">
      <article class="feature-card chart-card awareness-full-chart">
        <p class="card-label">Melanoma incidence</p>
        <h3>Interactive incidence chart</h3>
        <p class="chart-takeaway">{{ melanomaTakeaway }}</p>
        <PlotlyChart
          class="awareness-plotly"
          :data="melanomaPlotData"
          :layout="melanomaPlotLayout"
          :config="plotlyConfig"
        />
        <p class="chart-source">
          Source:
          <a
            href="https://www.canceraustralia.gov.au/cancer-types/melanoma-skin/melanoma-skin-statistics"
            target="_blank"
            rel="noreferrer"
          >
            Cancer Australia melanoma statistics
          </a>
        </p>
      </article>

      <article class="feature-card chart-card awareness-full-chart">
        <p class="card-label">Melbourne UV history</p>
        <h3>Interactive UV history chart</h3>
        <p class="chart-takeaway">{{ uvTakeaway }}</p>
        <PlotlyChart
          class="awareness-plotly"
          :data="uvPlotData"
          :layout="uvPlotLayout"
          :config="plotlyConfig"
        />
        <p class="chart-source">
          Sources:
          <a
            href="https://data.gov.au/data/organization/australian-radiation-protection-and-nuclear-safety-agency-arpansa"
            target="_blank"
            rel="noreferrer"
          >
            ARPANSA UV index data
          </a>
          and
          <a
            href="https://openweathermap.org/api/one-call-3?collection=one_call_api_3.0"
            target="_blank"
            rel="noreferrer"
          >
            OpenWeather One Call API
          </a>
        </p>
      </article>

      <article class="feature-card chart-card awareness-full-chart behaviour-card">
        <p class="card-label">Sun protection behaviours</p>
        <h3>Sun protection behaviours among Gen Z (15-24)</h3>
        <p class="chart-takeaway">
          Shade is the most common protection habit, while clothing coverage is used less
          frequently than sunscreen or sunglasses.
        </p>
        <p class="chart-axis-title chart-inline-axis-title">Percentage (%)</p>

        <div class="behaviour-bars">
          <div
            v-for="bar in protectionBars"
            :key="bar.label"
            class="behaviour-row"
            @mouseenter="showBehaviourDetails(bar)"
            @mouseleave="hideBehaviourDetails"
            @focusin="showBehaviourDetails(bar)"
            @focusout="hideBehaviourDetails"
          >
            <span class="behaviour-label">{{ bar.label }}</span>
            <div
              class="behaviour-track"
              tabindex="0"
              :aria-label="`${bar.label}: ${bar.value}%`"
            >
              <div class="behaviour-fill" :style="{ width: bar.width, background: bar.color }"></div>
              <span class="behaviour-value">{{ bar.value }}%</span>
            </div>
          </div>
        </div>

        <div class="behaviour-hover-panel" :class="{ active: behaviourHover }">
          <template v-if="behaviourHover">
            <p class="card-label">Hovered behaviour</p>
            <strong>{{ behaviourHover.label }}</strong>
            <p>{{ behaviourHover.description }}</p>
          </template>
          <template v-else>
            <p class="card-label">Hovered behaviour</p>
            <strong>Move over a bar</strong>
            <p>Hover or focus a behaviour row to see the exact percentage and what it means.</p>
          </template>
        </div>
      </article>

      <article class="feature-card myth-card awareness-wide-card">
        <p class="card-label">Myth vs Fact</p>
        <h3>Clear up common UV misconceptions</h3>
        <div class="myth-fact-pair-grid">
          <div
            v-for="(pair, index) in visibleMythFactPairs"
            :key="`${pair.myth}-${index}`"
            class="myth-fact-pair-row"
          >
            <div class="myth-card-panel myth-panel">
              <span class="myth-fact-tag">Common myth</span>
              <h3>Myth</h3>
              <p>{{ pair.myth }}</p>
            </div>
            <div class="myth-card-panel fact-panel">
              <span class="myth-fact-tag">What science says</span>
              <h3>Fact</h3>
              <p>{{ pair.fact }}</p>
            </div>
          </div>
        </div>
        <button
          v-if="hasMoreMyths"
          type="button"
          class="ghost-button myth-toggle-button"
          @click="toggleMythExpansion"
        >
          {{ showAllMyths ? 'Show fewer myth and fact cards' : 'Show more myth and fact cards' }}
        </button>
        <p class="helper-text">
          {{ awarenessLoading ? 'Refreshing awareness content...' : 'Short, shareable facts for everyday sun safety.' }}
        </p>
      </article>

      <article class="feature-card metric-card awareness-metric-card">
        <p class="card-label">Latest Gen Z figure</p>
        <strong class="metric-value">{{ awarenessSummary.latestCancer }}</strong>
        <p class="helper-text">Most recent melanoma count in the current trend dataset.</p>
      </article>

      <article class="feature-card metric-card awareness-metric-card">
        <p class="card-label">Peak UV year</p>
        <strong class="metric-value">{{ awarenessSummary.hottestMonth }}</strong>
        <p class="helper-text">Highest yearly max UV in the Melbourne series.</p>
      </article>

      <article class="feature-card metric-card awareness-metric-card">
        <p class="card-label">Most common behaviour</p>
        <strong class="metric-value">{{ awarenessSummary.topBehaviour }}</strong>
        <p class="helper-text">The most reported sun-safe action in this Gen Z sample.</p>
      </article>

      <article class="feature-card awareness-wide-card source-card">
        <p class="card-label">Data sources</p>
        <h3>Where this awareness data comes from</h3>
        <ul class="source-list">
          <li v-for="source in awarenessSources" :key="source.url">
            <a :href="source.url" target="_blank" rel="noreferrer">{{ source.label }}</a>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
