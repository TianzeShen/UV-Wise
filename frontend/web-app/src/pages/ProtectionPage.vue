<script setup>
import PageSectionHeader from '../components/PageSectionHeader.vue'

defineProps({
  adviceLoading: {
    type: Boolean,
    required: true,
  },
  personalizedAdvice: {
    type: Object,
    required: true,
  },
  skinType: {
    type: Number,
    required: true,
  },
  skinTypes: {
    type: Array,
    required: true,
  },
  uvData: {
    type: Object,
    required: true,
  },
})

defineEmits(['update:skinType'])
</script>

<template>
  <section class="page-section">
    <PageSectionHeader
      eyebrow="Personalized guidance"
      title="Protection"
    />

    <div class="protection-picker">
      <p class="card-label">Choose the skin tone closest to yours</p>
      <div class="skin-grid skin-grid-inline">
        <button
          v-for="type in skinTypes"
          :key="type.value"
          class="skin-type-button skin-type-button-swatch"
          :class="{ selected: skinType === type.value }"
          :style="{
            '--skin-tone': type.tone,
            '--skin-accent': type.accent,
          }"
          :aria-label="`${type.label}: ${type.note}`"
          @click="$emit('update:skinType', type.value)"
        >
          <span class="skin-swatch" aria-hidden="true"></span>
        </button>
      </div>
    </div>

    <div class="dashboard-grid protection-grid">
      <article class="feature-card advice-card advice-card-wide">
        <div class="protection-summary-header">
          <div>
            <p class="card-label">Skin type</p>
            <h3>{{ skinTypes[skinType - 1].label }} - {{ personalizedAdvice.skin_type_desc }}</h3>
          </div>
        </div>

        <div class="advice-copy advice-layout-grid">
          <div class="advice-section-card advice-section-card-wide">
            <span class="sub-label">Risk assessment</span>
            <p>{{ personalizedAdvice.risk_assessment }}</p>
          </div>

          <div class="advice-section-card advice-section-card-wide">
            <span class="sub-label">Sunscreen dosage</span>
            <p v-html="personalizedAdvice.sunscreen_dosage"></p>
          </div>

          <div class="advice-section-card advice-section-card-wide">
            <span class="sub-label">Recommended clothing</span>
            <p>{{ personalizedAdvice.clothing }}</p>
          </div>

          <div class="advice-section-card advice-section-card-wide">
            <span class="sub-label">Current UV context</span>
            <p>Advice is paired with UV {{ uvData.uv_index }} and the current outdoor guidance.</p>
          </div>
        </div>
        <p class="helper-text protection-helper-text">
          {{ adviceLoading ? 'Refreshing personalized advice...' : 'Advice updates with your skin type and the current UV level.' }}
        </p>
      </article>
    </div>
  </section>
</template>
