<script setup>
import { ref } from 'vue'

const props = defineProps({
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
  locationSuggestions: {
    type: Array,
    default: () => [],
  },
  searchHistory: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'search-location',
  'update:locationQuery',
  'fetch-suggestions',
  'select-location',
  'use-current-location',
])

const showDropdown = ref(false)
const debounceTimeout = ref(null)
const resultsSection = ref(null)

function handleInput(event) {
  const value = event.target.value
  emit('update:locationQuery', value)

  if (debounceTimeout.value) clearTimeout(debounceTimeout.value)
  debounceTimeout.value = setTimeout(() => {
    emit('fetch-suggestions', value)
    showDropdown.value = true
  }, 300)
}

function handleFocus() {
  showDropdown.value = true
}

function handleBlur() {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

function selectItem(item) {
  emit('select-location', item)
  showDropdown.value = false
}

function scrollToResults() {
  resultsSection.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function handleSearch() {
  emit('search-location')
  scrollToResults()
}
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

        <div class="landing-search-wrapper">
          <div class="landing-search landing-search-compact">
            <button
              class="location-icon-button"
              title="Use current location"
              @click="$emit('use-current-location')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
              </svg>
            </button>
            <input
              class="landing-search-input"
              :value="locationQuery"
              type="text"
              placeholder="Search a city, suburb, or postcode"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
              @keyup.enter="$emit('search-location')"
            />
            <button class="landing-search-button" @click="handleSearch">
              {{ isResolvingLocation ? 'Searching...' : 'Check UV' }}
            </button>
          </div>

          <div
            v-if="showDropdown && (locationSuggestions.length > 0 || (!locationQuery && searchHistory.length > 0))"
            class="search-dropdown"
          >
            <ul v-if="locationQuery && locationSuggestions.length > 0" class="dropdown-list">
              <li
                v-for="item in locationSuggestions"
                :key="item.lat + '-' + item.lon"
                class="dropdown-item"
                @click="selectItem(item)"
              >
                <strong>{{ item.shortName || item.name.split(',')[0] }}</strong>
                <span class="dropdown-meta">{{ item.name }}</span>
              </li>
            </ul>
            <ul
              v-else-if="!locationQuery && searchHistory.length > 0"
              class="dropdown-list history-list"
            >
              <li class="dropdown-header">Recent Searches</li>
              <li
                v-for="(item, index) in searchHistory"
                :key="index"
                class="dropdown-item"
                @click="selectItem(item)"
              >
                <span class="history-icon">🕒</span>
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div ref="resultsSection" class="dashboard-grid landing-grid">
      <article class="feature-card landing-summary-card landing-card-wide">
        <p class="card-label">Current location</p>
        <h2>{{ userLocation.name }}</h2>
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
        <div class="icon-row">
          <div v-for="item in clothingItems" :key="item.label" class="icon-pill">
            <span class="icon-symbol" :aria-label="item.label" role="img">
              <svg
                v-if="item.icon === 'hat'"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M8 10.5a4 4 0 1 1 8 0v1.2c1.9.3 3.9.9 5 1.8-2 1.7-5.8 2.8-9 2.8s-7-1.1-9-2.8c1.1-.9 3.1-1.5 5-1.8v-1.2Z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 13.5c2.2 1 5.7 1.5 9 1.5s6.8-.5 9-1.5"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <path
                  d="M2 15.8c2.8 1.4 6.4 2.2 10 2.2s7.2-.8 10-2.2"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>

              <svg
                v-else-if="item.icon === 'glasses'"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3 10.5h18"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <path
                  d="M4.5 10.5 6 16a2 2 0 0 0 1.9 1.5h2.2A2 2 0 0 0 12 15.5v-1a2 2 0 0 0-2-2H6.7a2 2 0 0 0-2.2 1.9Z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linejoin="round"
                />
                <path
                  d="m19.5 10.5-1.5 5.5a2 2 0 0 1-1.9 1.5h-2.2A2 2 0 0 1 12 15.5v-1a2 2 0 0 1 2-2h3.3a2 2 0 0 1 2.2 1.9Z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linejoin="round"
                />
              </svg>

              <svg
                v-else
                viewBox="-236 28 256 256"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M-190.2 277.7V125.9c0-4 3.3-6.7 6.7-6.7 4 0 6.7 2.7 6.7 6.7v151.7h137.7V125.9c0-4 3.3-6.7 6.7-6.7 4 0 6.7 3.3 6.7 6.7v151.7H17V115.2c.7-40.1-23.4-71.5-62.2-71.5L-108 97.2l-62.8-53.5c-38.1 0-62.2 31.4-62.2 70.9v163.1h42.8Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span>{{ item.label }}</span>
          </div>
        </div>
        <p class="helper-text">Pair sunscreen with protective clothing for better coverage during high UV periods.</p>
      </article>

    </div>
  </section>
</template>
