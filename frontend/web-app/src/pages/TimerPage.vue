<script setup>
import PageSectionHeader from '../components/PageSectionHeader.vue'

defineProps({
  notificationPermission: {
    type: String,
    required: true,
  },
  notificationSupported: {
    type: Boolean,
    required: true,
  },
  protectionTimerActive: {
    type: Boolean,
    required: true,
  },
  timerCompleted: {
    type: Boolean,
    required: true,
  },
  timerDurationLabel: {
    type: String,
    required: true,
  },
  timerMinutesPart: {
    type: Number,
    required: true,
  },
  timerSecondsPart: {
    type: Number,
    required: true,
  },
  timerDurationSeconds: {
    type: Number,
    required: true,
  },
  timerDisplay: {
    type: String,
    required: true,
  },
  timerReminderMessage: {
    type: String,
    required: true,
  },
})

defineEmits([
  'clear',
  'dismiss-reminder',
  'enable-notifications',
  'reset',
  'start',
  'update:timer-duration',
  'update:timer-minutes',
  'update:timer-seconds',
])
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
        <p class="card-label">{{ timerDurationLabel }}</p>
        <h3>
          {{
            protectionTimerActive
              ? 'Protection active'
              : timerCompleted
                ? 'Reminder complete'
                : 'No active timer'
          }}
        </h3>
        <strong class="timer-value">{{ protectionTimerActive ? timerDisplay : '00:00:00' }}</strong>
        <p class="helper-text">
          {{
            protectionTimerActive
              ? 'Reset this after reapplying sunscreen.'
              : 'Set a countdown length and start the timer when sunscreen is applied.'
          }}
        </p>

        <div class="timer-duration-controls">
          <span class="sub-label">Reminder length</span>
          <div class="timer-duration-split">
            <label class="timer-duration-field" for="timer-minutes">
              <input
                id="timer-minutes"
                class="timer-duration-input"
                :value="timerMinutesPart"
                type="number"
                min="0"
                max="1440"
                step="1"
                @input="$emit('update:timer-minutes', $event.target.value)"
              />
              <span class="helper-text">minutes</span>
            </label>

            <label class="timer-duration-field" for="timer-seconds">
              <input
                id="timer-seconds"
                class="timer-duration-input"
                :value="timerSecondsPart"
                type="number"
                min="0"
                max="59"
                step="1"
                @input="$emit('update:timer-seconds', $event.target.value)"
              />
              <span class="helper-text">seconds</span>
            </label>
          </div>
        </div>

        <div v-if="timerReminderMessage" class="timer-reminder-banner">
          <strong>{{ timerReminderMessage }}</strong>
          <button class="ghost-button timer-reminder-dismiss" @click="$emit('dismiss-reminder')">
            Dismiss
          </button>
        </div>

        <div class="button-row">
          <button class="primary-button" @click="$emit('start', timerDurationSeconds)">
            Start protection timer
          </button>
          <button class="ghost-button" @click="$emit('reset')">Reset timer</button>
          <button class="ghost-button" @click="$emit('clear')">Clear</button>
        </div>
      </article>

      <article class="feature-card guidance-card">
        <p class="card-label">How it helps</p>
        <h3>Build a reapplication habit</h3>
        <ul class="guidance-list">
          <li>
            <strong>Duration:</strong> Set your reminder length using minutes and seconds for a precise countdown.
          </li>
          <li><strong>Set:</strong> Choose a reminder length that fits your plan outdoors.</li>
          <li><strong>Start:</strong> Begin a countdown after applying sunscreen.</li>
          <li><strong>Reset:</strong> Restart the timer each time you reapply.</li>
          <li><strong>Clear:</strong> Stop the countdown when you are no longer outdoors.</li>
          <li><strong>Reminder:</strong> A message appears on the page and can trigger a browser notification when the timer ends.</li>
        </ul>
        <div class="timer-notification-panel">
          <div>
            <span class="sub-label">Browser notifications</span>
            <p class="helper-text">
              {{
                !notificationSupported
                  ? 'This browser does not support notifications.'
                  : notificationPermission === 'granted'
                    ? 'Notifications are enabled for timer reminders.'
                    : notificationPermission === 'denied'
                      ? 'Notifications are blocked in this browser settings.'
                      : 'Enable notifications to receive a browser reminder when time is up.'
              }}
            </p>
          </div>
          <button
            v-if="notificationSupported && notificationPermission !== 'granted'"
            class="ghost-button"
            @click="$emit('enable-notifications')"
          >
            Enable notifications
          </button>
        </div>
        <p class="helper-text" style="margin-top: 14px;">
          2-hour reapplication is a common default recommended by
          <a
            href="https://www.cancer.org.au/cancer-information/causes-and-prevention/sun-safety/sunscreen/advice"
            target="_blank"
            rel="noopener noreferrer"
            style="color: inherit; text-decoration: underline;"
          >Cancer Council Australia guidelines</a>.
        </p>
      </article>
    </div>
  </section>
</template>
