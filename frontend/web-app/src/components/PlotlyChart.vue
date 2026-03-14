<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  layout: {
    type: Object,
    required: true,
  },
  config: {
    type: Object,
    default: () => ({}),
  },
})

const chartEl = ref(null)
let plotlyLib = null

async function getPlotly() {
  if (!plotlyLib) {
    const module = await import('plotly.js-dist-min')
    plotlyLib = module.default
  }

  return plotlyLib
}

async function renderChart() {
  if (!chartEl.value) return
  const Plotly = await getPlotly()
  await Plotly.react(chartEl.value, props.data, props.layout, props.config)
}

onMounted(renderChart)

watch(
  () => [props.data, props.layout, props.config],
  () => {
    renderChart()
  },
  { deep: true },
)

onBeforeUnmount(() => {
  if (chartEl.value && plotlyLib) {
    plotlyLib.purge(chartEl.value)
  }
})
</script>

<template>
  <div ref="chartEl" class="plotly-chart"></div>
</template>
