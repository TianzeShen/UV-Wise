<script setup>
import PageSectionHeader from '../components/PageSectionHeader.vue'

defineProps({
  protectionTimerActive: {
    type: Boolean,
    required: true,
  },
  timerDisplay: {
    type: String,
    required: true,
  },
})

defineEmits(['clear', 'reset', 'start'])
</script>

<template>
  <section class="page-section">
    <PageSectionHeader
      eyebrow="Daily routine"
      title="Protection Timer"
      badge="Stay protected"
    />

    <div class="dashboard-grid timer-grid">
      <article class="feature-card timer-card">
        <p class="card-label">2-hour sunscreen reminder</p>
        <h3>{{ protectionTimerActive ? 'Protection active' : 'No active timer' }}</h3>
        <strong class="timer-value">{{ protectionTimerActive ? timerDisplay : '00:00:00' }}</strong>
        <p class="helper-text">
          {{ protectionTimerActive ? 'Reset this after reapplying sunscreen.' : 'Start the timer when sunscreen is applied.' }}
        </p>
        <div class="button-row">
          <button class="primary-button" @click="$emit('start')">Start protection timer</button>
          <button class="ghost-button" @click="$emit('reset')">Reset timer</button>
          <button class="ghost-button" @click="$emit('clear')">Clear</button>
        </div>
      </article>

      <article class="feature-card guidance-card">
        <p class="card-label">How it helps</p>
        <h3>Build a reapplication habit</h3>
        <ul class="guidance-list">
          <li><strong>Start:</strong> Begin a 2-hour countdown after applying sunscreen.</li>
          <li><strong>Reset:</strong> Restart the timer each time you reapply.</li>
          <li><strong>Clear:</strong> Stop the countdown when you are no longer outdoors.</li>
        </ul>
      </article>
    </div>
  </section>
</template>
