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
      badge="Personalized advice"
    />

    <div class="dashboard-grid protection-grid">
      <article class="feature-card selector-card">
        <p class="card-label">Skin type selection</p>
        <h3>Choose Fitzpatrick skin type</h3>
        <div class="skin-grid">
          <button
            v-for="type in skinTypes"
            :key="type.value"
            class="skin-type-button"
            :class="{ selected: skinType === type.value }"
            @click="$emit('update:skinType', type.value)"
          >
            <strong>{{ type.label }}</strong>
            <span>{{ type.note }}</span>
          </button>
        </div>
        <p class="helper-text">Your selection is saved on this device for quicker access next time.</p>
      </article>

      <article class="feature-card advice-card">
        <p class="card-label">Current advice</p>
        <h3>{{ personalizedAdvice.skin_type_desc }}</h3>
        <div class="advice-copy">
          <div>
            <span class="sub-label">Risk assessment</span>
            <p>{{ personalizedAdvice.risk_assessment }}</p>
          </div>
          <div>
            <span class="sub-label">Protection tips</span>
            <p>{{ personalizedAdvice.personalized_tips }}</p>
          </div>
          <div>
            <span class="sub-label">Current UV context</span>
            <p>Advice is paired with UV {{ uvData.uv_index }} and the current outdoor guidance.</p>
          </div>
        </div>
        <p class="helper-text">{{ adviceLoading ? 'Refreshing personalized advice...' : 'Advice updates with your skin type and the current UV level.' }}</p>
      </article>
    </div>
  </section>
</template>
